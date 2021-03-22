/* eslint-disable jsx-a11y/click-events-have-key-events */
import React, { useRef, useState, useLayoutEffect, useCallback, useEffect } from 'react';
import styled from 'styled-components';
import useBoundingclientrect from '@rooks/use-boundingclientrect';
import { useSpring, animated } from 'react-spring';

const GalleryModal = styled(animated.div).attrs(props => ({
  style: props.style
}))`

`;

const GalleryItemComponent = styled(animated.div).attrs(props => ({
  style: props.style
}))`
  width: 33%;
  display: block;
  /* width: 100%; */
  padding: 6px;
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

const calc = (wx, wy, pos) => {
  const { width, height } = pos;
  const x =  wx - pos.x;
  const y = wy - pos.y;
  return [-(y - height / 2) / 20, (x - width / 2) / 20, 1.1];
};

const trans = (x, y, s) => `perspective(600px) rotateX(${x}deg) rotateY(${y}deg) scale(${s})`;

function Card(props) {
  const elRef = useRef(null);
  const pos = useBoundingclientrect(elRef) || {};
  const { children } = props;

  const [style, set] = useSpring(() => ({  xys: [0, 0, 1], zIndex: 1, config: { mass: 5, tension: 350, friction: 40 } }));
  return (
    <animated.div
      ref={elRef}
      onMouseMove={({ clientX: x, clientY: y }) => set({ xys: calc(x, y, pos), zIndex: 999 })}
      onMouseLeave={() => set({ xys: [0, 0, 1] })}
      style={{ transform: style.xys.interpolate(trans) }}
    >
      {children}
    </animated.div>
  );
}

export default Card;
