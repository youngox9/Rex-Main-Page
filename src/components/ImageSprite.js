import React, { useState, useEffect, useRef } from 'react';

import { Stage, Sprite } from '@inlet/react-pixi';

import path from 'path';
import _ from 'lodash';

async function loadImage(src) {
  return new Promise((rsv) => {
    const img = new Image();
    img.src = src;
    img.onload = function () {
      rsv(img);
    };
  });
}

function ImageSprite(props) {
  const el = useRef(null);
  const [w, setW] = useState(0);
  const [h, setH] = useState(0);
  const { image, width = 0 } = props;

  const imagePath = path.resolve('../', image);
  const pw = _.get(el, ['current', 'parent', '_width']);
  const parent = _.get(el, ['current', 'parent']);
  async function handleLoadImage() {
    const img = await loadImage(imagePath);
    const { width: imgWidth, height: imgHeight } = img;
    const newW = pw * width;
    const newH = (newW * imgHeight / imgWidth);
    setW(newW);
    setH(newH);

    console.log(pw, newW, newH, parent);
  }

  useEffect(() => {
    handleLoadImage();
  }, [image, pw]);

  return (
    <Sprite {...props} ref={el} image={imagePath} width={w} height={h} />
  );
}

export default ImageSprite;
