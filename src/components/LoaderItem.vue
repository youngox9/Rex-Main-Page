<template>
  <div class="loader" ref="container" :class="{active:ready}"></div>
</template>
<script>
import * as PIXI from "pixi.js";
import { TweenMax, Power2, TimelineLite } from "gsap";

export default {
  props: ["src", "progress"],
  data() {
    return {
      ready: false
    };
  },
  watch: {
    progress(val, oldval) {
      this.onProgress(val);
    }
  },
  created() {},
  mounted() {
    this.loader = new PIXI.loaders.Loader();
    this.loader.add("pic", this.src);
    this.loader.load((loader, resources) => {
      this.resources = resources;
      this.containerWidth = this.resources.pic.data.width;
      this.containerHeight = this.resources.pic.data.height;
      this.initStage();
    });
  },
  methods: {
    setSize(data) {
      let widthRatio = false;
      let heightRatio = false;
      const { obj, rotation } = data;
      const base = obj.texture.baseTexture;
      obj.anchor.set(0.5, 0.5);
      obj.scale.x = 1;
      obj.scale.y = 1;
      obj.rotation = rotation || 0;
      const anchor = 0.5;
      const cw = this.app.screen.width;
      const ch = this.app.screen.height;
      let width, height, x, y;
      if (data["x"]) {
        if (typeof data.x === "string") {
          x = cw * data.x / 100;
        } else {
          x = data.x;
        }
      }
      if (data["y"]) {
        if (typeof data.y === "string") {
          y = ch * parseInt(data.y) / 100;
        } else {
          y = data.y;
        }
      }
      if (data["width"]) {
        if (typeof data.width === "string") {
          widthRatio = true;
          width = parseInt(data.width) / 100;
        } else {
          widthRatio = false;
          width = data.width;
        }
      }
      if (data["height"]) {
        if (typeof data.height === "string") {
          heightRatio = true;
          height = parseInt(data.height) / 100;
        } else {
          heightRatio = false;
          height = data.width;
        }
      }
      const w = widthRatio ? cw * width : width;
      const h = heightRatio
        ? ch * height
        : w * (base.realHeight / base.realWidth);
      const xx = (x || 0) + w * anchor;
      const yy = (y || 0) + h * anchor;
      obj.width = w;
      obj.height = h;
      obj.x = xx;
      obj.y = yy;
    },
    getPosY(obj, y) {
      const anchor = 0.5;
      const ch = this.app.screen.height;
      const base = obj.texture.baseTexture;
      const h = base.realHeight;
      return ch * y + h * anchor;
    },
    getPosX(obj, x) {
      const anchor = 0.5;
      const cw = this.app.screen.width;
      const base = obj.texture.baseTexture;
      const w = base.realWidth;
      return cw * x + w * anchor;
    },
    initStage() {
      const { containerWidth, containerHeight } = this;
      const container = this.$refs.container;
      this.app = new PIXI.Application(containerWidth, containerHeight, {
        transparent: true
      });
      this.view = this.app.view;
      this.stage = this.app.stage;
      this.view.style.width = "100%";
      container.appendChild(this.view);
      this.renderImage();
    },
    renderImage() {
      const { pic, flash } = this.loader.resources;
      const { dur, rotate, width } = this;
      let img = new PIXI.Sprite(pic.texture);
      let progress = new PIXI.Sprite(pic.texture);
      img.zOrder = 1;

      this.graphics = new PIXI.Graphics();
      this.graphics.beginFill(0xff7232, 1);
      this.graphics.drawRect(
        -this.containerWidth,
        0,
        this.containerWidth,
        this.containerHeight
      );
      this.graphics.endFill();
      this.setSize({
        obj: img,
        width: "100%"
      });
      this.setSize({
        obj: progress,
        width: "100%"
      });
      // progress.mask = graphics;
      this.stage.addChild(img);
      this.stage.addChild(progress);
      this.stage.addChild(this.graphics);
      this.graphics.updateLocalBounds();
      this.graphics.updateTransform();
      this.graphics.mask = progress;
      // this.ready = true;
    },
    onProgress(value) {
      console.log(value);
      clearInterval(this.timer);
      this.timer = setInterval(() => {
        if (this.graphics) {
          clearInterval(this.timer);
          const p = this.containerWidth * value;
          TweenMax.to(this.graphics, 0.6, {
            x: p,
            onComplete: () => {
              if (value === 1) {
                this.ready = true;
              }
            }
          });
        }
      }, 1000);
    }
  }
};
</script>
<style  lang="scss">
.loader {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 9999;
  background-color: black;
  opacity: 1;
  visibility: visible;
  transition: 0.3s ease all;
  &.active {
    opacity: 0;
    visibility: hidden;
  }
  canvas {
    position: absolute;
    top: 50%;
    left: 50%;
    width: 120px !important;
    transform: translate(-50%, -50%);
  }
}
</style>