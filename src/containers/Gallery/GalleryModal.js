/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import React, { useRef, useState, useLayoutEffect, useCallback, useEffect } from 'react';
import styled from 'styled-components';
// import useBoundingclientrect from '@rooks/use-boundingclientrect';
import { useSpring, animated, config, useTrail } from 'react-spring';
import usePortal from 'react-useportal';
import { Swiper, SwiperSlide } from 'swiper/react';
import classnames from 'classnames';

const GalleryModalContainer = styled(animated.div).attrs(props => ({
  style: props.style
}))`
  position: fixed;
  /* z-index: 999; */
  overflow: hidden;
  overflow-y: auto;
  background-color: #263238;

  &.done {
    .des {
      opacity: 1;
      transform: translate(0, 0%);
      filter: blur(0px);
    }
  }
  .modal-content {
    display: flex;
    flex-wrap: nowrap;
    height: 100%;
    width: 100%;
    .modal-content-col {
      display: flex;
      flex: 0 1 100%;
      align-items: center;
      height: 100%;
      overflow: hidden;
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
    opacity: 0;
    transition: 0.6s ease all;
    transform: translate(0, 20%);
    filter: blur(6px);
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

function GalleryModal(props) {
  const [isAniDone, setAniDone] = useState(false);
  const [isShow, setIsShow] = useState(false);
  const [swiperEl, setSwiperEl] = useState(null);
  const { open, setOpen, referenceRef = null, data = {} } = props;

  const { Portal } = usePortal({
    bindTo: document.getElementById('portal')
  });

  useEffect(() => {
    if (open) { setIsShow(true); } else { setAniDone(false); }
  }, [open]);

  function toggleOpen(e) {
    setOpen(!open);
  }

  const [modalAniStyle, setModalAni] = useSpring(() => {
    return { from: { left: 0, top: 0, width: 0, height: 0, zIndex: -1, opacity: 0 } };
  });

  const [modalContentAniStyle, setModalContentAniStyle] = useSpring(() => {
    return { from: { width: '0%', minWidth: '0%', flex: '0 0%'  },
      delay: 400,
    };
  });

  useEffect(() => {
    if (isAniDone && swiperEl?.update) {
      swiperEl.update();
    }
  }, [isAniDone]);

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
          await next({ immediate: false,
            ...fullPos,
          });
          setModalContentAniStyle({
            to: async (n) => {
              await n({ width: '50%', minWidth: '50%', flex: '0 50%' });
              setAniDone(true);
            },
            config: config.default
          });
        },
        config: {
          duration: 300
        }
      });
    } else {
      setModalAni({
        from: { ...referencePos },
        to: async (next, cancel) => {
          await next({ immediate: false, ...referencePos });
          await next({ immediate: true,
            zIndex: -1,
            opacity: 0,
          });
          setModalContentAniStyle({
            to: async (n) => {
              await n({ width: '0%', minWidth: '0%', flex: '0 0%' });
            },
            config: {
              ...config.default,
              duration: 1
            }
          });
          setIsShow(false);
        },
      });
    }
  }, [open]);

  const { cover, title = '', des = '', pic } = data;

  return  (
    <Portal>
      <GalleryModalContainer
        style={modalAniStyle}
        open={open}
        className={classnames({ done: isAniDone })}
      >
        <div className="modal-content" onClick={toggleOpen}>
          <div className="modal-content-col">
            {isShow && (
            <Swiper
              spaceBetween={0}
              slidesPerView={1}
              onSwiper={(swiper) => {  setSwiperEl(swiper); }}
            >
              <SwiperSlide>
                <div className="pic" style={{ background: `url(${cover.link}) center/cover no-repeat` }} />
              </SwiperSlide>
              {
                pic.map(picObj => {
                  const { id, link } = picObj;
                  console.log('picObj >>>>', picObj);
                  if (link) {
                    return (
                      <SwiperSlide key={id}>
                        <div className="pic" style={{ background: `url(${link}}) center/cover no-repeat` }} />
                      </SwiperSlide>
                    );
                  }
                  return null;
                })
              }
            </Swiper>
            )}
          </div>
          <animated.div className="modal-content-col" style={modalContentAniStyle}>
            <div className="des">
              <h3>{title}</h3>
              <p dangerouslySetInnerHTML={{ __html: des }} />
            </div>
          </animated.div>
        </div>
      </GalleryModalContainer>
    </Portal>
  );
}

export default GalleryModal;
