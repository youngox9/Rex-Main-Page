/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import React, { useRef, useState, useLayoutEffect, useCallback, useEffect } from 'react';
import styled from 'styled-components';
// import useBoundingclientrect from '@rooks/use-boundingclientrect';
import { useSpring, animated, config } from 'react-spring';
import usePortal from 'react-useportal';
import { Swiper, SwiperSlide } from 'swiper/react';

const GalleryModal = styled(animated.div).attrs(props => ({
  style: props.style
}))`
  position: fixed;
  /* z-index: 999; */
  overflow: hidden;
  overflow-y: auto;
  background-color: black;
  .modal-content {
    display: flex;
    flex-wrap: nowrap;
    height: 100%;
    width: 100%;
    .modal-content-col {
      display: flex;
      flex: 0 1 100%;
      /* background-color: red; */
      align-items: center;
      height: 100%;
      /* max-width: 50%; */
    }
  }
  .swiper-container {
    height: 100%;
    width: 100%;
    .swiper-slide {
      width: 100% !important;
    }
  }
  .des {
    padding: 6%;
    color: white;
    a {
      color: white;
    }
    h3 {
      font-size: 2.5rem;
    }
    p{
      font-size: 1rem;
    }
  }
  .pic {
    width: 100%;
    height: 100%;
  }
`;

function GalleryItem(props) {
  const [isShow, setIsShow] = useState(false);
  const [swiperEl, setSwiperEl] = useState(null);
  const { open, setOpen, referenceRef = null, data = {} } = props;

  const { Portal } = usePortal({
    bindTo: document.getElementById('portal')
  });

  useEffect(() => {
    if (open) { setIsShow(true); }
  }, [open]);

  function toggleOpen(e) {
    setOpen(!open);
  }

  const [modalAniStyle, setModalAni] = useSpring(() => {
    return { from: { left: 0, top: 0, width: 0, height: 0, zIndex: -1, opacity: 0 } };
  });

  const modalContentColStyle = useSpring({
    width: open ?  '50%' : '0%',
    minWidth: open ?  '50%' : '0%',
    flex: open ? '0 50%' : '0 0%',
    delay: open ? 150 : 0,
    onRest: () => {
      if (swiperEl?.update) {
        swiperEl.update(true);
      }
    },
    config: {
      ...config.wobbly,
      duration: 600
    }
  });

  // set(to);
  useEffect(() => {
    const { top = 0, left = 0, width = 0, height = 0 } = referenceRef?.getBoundingClientRect() || {};
    const referencePos = {
      top, left, width, height,
    };
    const fullPos = {
      width: window.innerWidth,
      height: window.innerHeight,
      top: 0,
      left: 0,
    };
    if (open) {
      setModalAni({
        from: { ...referencePos },
        to: async (next, cancel) => {
          await next({ immediate: true, ...referencePos, zIndex: 999, opacity: 1 });
          await next({ immediate: false, ...fullPos });
        },
        delay: 150,
        config: { ...config.default, duration: 300  }
      });
    } else {
      setModalAni({
        from: { ...referencePos },
        to: async (next, cancel) => {
          await next({ immediate: false, ...referencePos });
          await next({ immediate: true,
            zIndex: -1,
            opacity: 0,
            onRest: () => {
              console.log('done');
              setIsShow(false);
            }, });
        },
        config: { duration: 300 },

      });
    }
  }, [open]);

  const { bg, title = '', des = '', pic } = data;
  // console.log(data);
  return  (
    <Portal>

      <GalleryModal
        style={modalAniStyle}
        open={open}
      >
        <div className="modal-content" onClick={toggleOpen}>
          <div className="modal-content-col">
            {isShow && (
            <Swiper
              spaceBetween={0}
              slidesPerView={1}
              // onSlideChange={() => console.log('slide change')}
              onSwiper={(swiper) => setSwiperEl(swiper)}
            >
              <SwiperSlide>
                <div className="pic" style={{ background: `url(${bg}) center/cover no-repeat` }} />
              </SwiperSlide>
              <SwiperSlide>
                <div className="pic" style={{ background: `url(${bg}) center/cover no-repeat` }} />
              </SwiperSlide>
              {/* {
                pic.map(p => (
                  <SwiperSlide>
                    <div className="pic" style={{ background: `url(${p}}) center/cover no-repeat` }} />
                  </SwiperSlide>
                ))
              } */}
            </Swiper>
            )}
          </div>
          <animated.div className="modal-content-col" style={modalContentColStyle}>
            <div className="des">
              <h3>{title}</h3>
              <p dangerouslySetInnerHTML={{ __html: des }} />
            </div>
          </animated.div>
        </div>
      </GalleryModal>
    </Portal>
  );
}

export default GalleryItem;
