/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import React, { useRef, useContext, useState, useLayoutEffect, useCallback, useEffect } from 'react';
import styled from 'styled-components';
// import useBoundingclientrect from '@rooks/use-boundingclientrect';
import { useSpring, animated, config } from 'react-spring';
import usePortal from 'react-useportal';
import classNames from 'classnames';
import { set } from 'core-js/core/dict';
import Card from '~~components/Card';
import { Context } from '~~src/Store';
import GalleryModal from './GalleryModal';

const GalleryItemComponent = styled(animated.div).attrs(props => ({
  style: props.style
}))`
  width: 33%;
  display: block;
  /* width: 100%; */
  padding: 12px;
  /* perspective: 600px; */

  .gallery-item {
    cursor: pointer;
    overflow: hidden;
    position: relative;
    z-index: 2;
    &:hover {
      img {
        /* opacity: 0.6; */
        transform: scale(1.08)
      }
      .title {
        opacity: 1;
        visibility: visible;
      }
    }
    img {
      position: relative;
      width: 100%;
      transition: 0.3s ease all;
      z-index: 1;
    }

    .title {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      z-index: 2;
      color: white;
      font-size: 1.6em;
      white-space: nowrap;
      opacity: 0;
      visibility: hidden;
      transition: 0.3s ease all;
    }
  }
`;

function GalleryItem(props) {
  const [state, dispatch] = useContext(Context);
  const [elRef, setElRef] = useState(null);
  const [open, setOpen] = useState(false);
  const { obj = {} } = props;
  const { cover, bg, title = '' } = obj;

  useEffect(() => {
    dispatch({ type: 'GLOBAL_SET_MODAL_OPEN', modalOpen: open });
  }, [open]);

  function toggleOpen(e) {
    setOpen(!open);
  }

  const picPath = cover?.link || bg;

  return (
    <GalleryItemComponent ref={setElRef}>
      <Card>
        <div className="gallery-item" onClick={toggleOpen}>
          <img className="pic" src={picPath} alt="" />
          <p className="title">{title}</p>
        </div>
      </Card>

      <GalleryModal
        data={obj}
        referenceRef={elRef}
        open={open}
        setOpen={setOpen}
      />
    </GalleryItemComponent>
  );
}

export default GalleryItem;
