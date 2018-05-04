<template>
  <div>
    <div class="modal-fake"></div>
    <div class="modal" :class="{active:open}" ref="modal">
      <div class="close" @click="onClose"></div>
      <div class="blur-bk" :style="{background:`url(${item.bg}) center/cover no-repeat`}"></div>
      <p class="sub-tit">{{item.tit}}</p>
      <div class="modal-wrap">
        <div class="row row-no-gutter">
          <div class="col col-pic">
            <div class="modal-cover" :style="{background: getPicBk(item.pic[0])}"  @click="onOpen()" :class="{loaded}"></div>
            <div class="modal-carousel" @click="onOpen()">
              <carousel-loop>
                <div class="modal-pic" v-for="(p, index) in item.pic" :key="index" :style="{background:getPicBk(p)}"></div>
              </carousel-loop>
            </div>
          </div>
          <div class="col col-content" ref="content">
              <div class="modal-content">
                  <h4 v-html="item.tit"></h4>
                  <p v-html="item.des"></p>
              </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Vue from "vue";
import { TweenMax, Power2, TimelineLite } from "gsap";
import CarouselLoop from "./CarouselLoop";

export default {
  props: {
    item: {
      type: Object
    },
    active: {
      type: Boolean
    },
    close: {
      type: Function
      // default: () => {}
    }
  },
  watch: {},
  name: "modal",
  data() {
    return {
      loaded: false,
      open: false,
      picStyle: {
        background: "",
        height: 0
      },
      fakeStyle: { height: 0 }
    };
  },
  created() {},
  mounted() {
    const _self = this;
    this.$modal = this.$refs.modal;
    this.$content = this.$refs.content;
    window.addEventListener("resize", this.onResize);
    const image = new Image();
    image.src = this.item.pic;
    image.onload = () => {
      _self.loaded = true;
      this.getPicBk();
    };
  },
  updated() {},
  components: {
    CarouselLoop
  },
  methods: {
    getPicBk(pic) {
      return `url(${pic}) center/cover no-repeat`;
    },
    getBefore() {
      const $modal = this.$modal.parentNode;
      this.before = {
        position: "fixed",
        left: $modal.getBoundingClientRect().x,
        top: $modal.getBoundingClientRect().y,
        height: $modal.getBoundingClientRect().height,
        width: $modal.getBoundingClientRect().width
      };
      return this.before;
    },
    getAfter() {
      return (this.after = {
        position: "fixed",
        left: 0,
        top: 0,
        height: window.innerHeight,
        width: window.innerWidth
      });
    },
    onClose() {
      const _self = this;
      this.open = false;
      const $parent = this.$modal.parentNode;
      $("html,body").css("overflow", "initial");
      TweenMax.to(this.$modal, 0.3, {
        css: this.before,
        ease: "cubic-bezier(0.4, 0.0, 0.2, 1)",
        onComplete() {
          _self.$modal.style = "";
        }
      });
      this.close();
    },
    onOpen() {
      if (!this.open) {
        this.open = true;
        $("html,body").css("overflow", "hidden");
        TweenMax.fromTo(
          this.$modal,
          0.6,
          {
            css: this.getBefore()
          },
          {
            css: this.getAfter(),
            ease: "cubic-bezier(0.4, 0.0, 0.2, 1)"
          }
        );
      }
    },
    onResize() {
      this.onClose();
    }
  }
};
</script>

<style lang="scss">
$height: 300px;
.modal-fake {
  width: 100%;
  position: relative;
  display: block;
  padding-bottom: $height;
}
.modal {
  transition: 0.6s ease background-color, 0.6s ease padding;
  z-index: 100;
  overflow: hidden;
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
  width: 100%;
  cursor: pointer;

  .sub-tit {
    position: absolute;
    color: white;
    bottom: 0;
    left: 0;
    text-align: center;
    font-size: 1.2em;
    width: 100%;
    z-index: 11;
    opacity: 0;
    visibility: hidden;
    transition: 0.3s ease all;
    font-weight: bolder;
    transform: translate(0, 100%);
    letter-spacing: 0.22em;
  }
  &:before {
    content: "";
    pointer-events: none;
    visibility: hidden;
    opacity: 0;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    position: absolute;
    background-color: rgba(0, 0, 0, 0.86);
    z-index: 10;
    transition: 0.6s ease all;
  }
  &:not(.active):hover {
    .sub-tit {
      opacity: 1;
      visibility: visible;
      transform: translate(0, 0%);
    }
    &:before {
      visibility: visible;
      opacity: 1;
    }
    .modal-cover {
      transform: scale(1.2);
    }
  }
  .blur-bk {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    filter: blur(10px) brightness(1.1);
    opacity: 0;
    transition: 0.6s ease all;
  }
  &.active {
    z-index: 999;
    background-color: white;
    overflow-y: auto;
    padding: 2%;
    .blur-bk {
      opacity: 0.3;
    }
    .modal-wrap {
      .col-content {
        margin-left: 0%;
        transition: 0.6s 0.12s ease margin-left;
        .modal-content {
          visibility: visible;
          display: block;
          padding: 6%;
          h4 {
            &:after {
              transform: scale(1);
            }
          }
        }
      }
      .col-pic {
        .modal-cover {
          background-size: auto 100% !important;
          // height: auto !important;
          padding-bottom: 50%;
        }
        .modal-carousel {
          .flickity-button {
            display: block;
          }
        }
      }
    }
    .close {
      display: block;
    }
  }
  &:after {
    content: "";
    height: 100%;
    display: inline-block;
    vertical-align: middle;
  }
  .modal-wrap {
    display: inline-block;
    vertical-align: middle;
    width: 100%;
    .col-pic,
    .col-content {
      @media all and(max-width:768px) {
        -ms-flex: 0 0 100%;
        flex: 0 0 100%;
        max-width: 100%;
      }
    }
    .col-pic {
      z-index: 2;
      position: relative;
      .modal-cover {
        animation: fadeIn 0.6s 0s 1 both;
        display: block;
        width: 100%;
        transition: 0.3s ease all;
        padding-bottom: $height;
      }
      .modal-carousel {
        position: absolute;
        top: 0%;
        left: 0;
        height: 100%;
        width: 100%;
        .flickity-enabled,
        .flickity-viewport,
        .flickity-slider,
        .carousel-cell,
        .modal-pic {
          position: absolute;
          top: 0%;
          left: 0;
          height: 100% !important;
          width: 100%;
        }
        .flickity-button {
          display: none;
        }
      }
    }
    .col-content {
      z-index: 1;
      position: relative;
      transition: 0.6s 0s ease margin-left;
      margin-left: -100%;
      .modal-content {
        visibility: hidden;
        // display: none;
        transition: 0.6s ease all;
        text-align: center;
        h4 {
          position: relative;
          font-size: 3em;
          text-align: center;
          font-weight: lighter;
          color: #5f5f5f;
          // letter-spacing: 0.12em;
          display: inline-block;
          padding: 0 6%;
          margin-bottom: 6%;
          &:after {
            content: "";
            position: absolute;
            display: block;
            height: 2px;
            width: 100%;
            bottom: 0;
            left: 0;
            background-color: #8b8b8b;
            transition: 1.2s 0.12s ease-in-out all;
            transform: scale(0);
          }
        }
        p {
          line-height: 1.5;
          font-size: 1.2em;
          text-align: left;
        }
      }
    }
  }
  .close {
    display: none;
    width: 64px;
    height: 64px;
    position: absolute;
    right: 6px;
    top: 6px;
    z-index: 2;
    background: url("../../img/close.png") center/contain no-repeat;
  }
}
</style>
