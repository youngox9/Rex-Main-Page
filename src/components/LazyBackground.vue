<template>
  <div class="modal-container" :class="{active:imageLoaded}">

    <div class="modal-fake"></div>
    <div class="modal" :class="{active:open}" ref="modal">
      <div class="modal-blur"  @click="onOpen()"></div>
      <div class="close" @click="onClose"></div>
      <div class="blur-bk" :style="{background:`rgba(255,255,255,1) url(${item.bg}) center/cover no-repeat`}"></div>
      <p class="sub-tit">{{item.tit}}</p>
      <div class="modal-wrap">
        <div class="row row-no-gutter">
          <div class="col col-pic">
            <div class="modal-cover" @click="onOpen()" :class="{loaded}" >
              <div class="modal-carousel" @click="onOpen()">
                <carousel-loop :active="open">
                  <div class="modal-pic" v-for="(p, index) in item.pic" :key="index" :style="{backgroundImage:getPicBk(p)}"></div>
                </carousel-loop>
              </div> 
            </div>
          </div>
          <div class="col col-content"  ref="content">
              <div class="modal-content" :class="{active:complete}">
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
import Ripple from "vue-ripple-directive";

Vue.directive("ripple", Ripple);
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
      complete: false,
      imageLoaded: true
    };
  },
  created() {},
  mounted() {
    const _self = this;
    this.$modal = this.$refs.modal;
    this.$content = this.$refs.content;
    window.addEventListener("resize", this.onResize);
    this.loadImage();
  },
  updated() {
    this.loadImage();
  },
  components: {
    CarouselLoop
  },
  methods: {
    loadImage() {
      const _self = this;
      const pms = this.item.pic.map(pic => {
        return new Promise((resolve, reject) => {
          const image = new Image();
          image.src = pic;
          image.onload = () => {
            resolve(true);
          };
        });
      });
      Promise.all(pms).then(values => {
        _self.imageLoaded = true;
      });
    },
    getPicBk(pic) {
      return `url(${pic})`;
    },
    getBefore() {
      const $modal = this.$modal.parentNode;
      this.before = {
        position: "fixed",
        left: $modal.getBoundingClientRect().x || $($modal).offset().left,
        top: $modal.getBoundingClientRect().y || $($modal).offset().top,
        height: $modal.getBoundingClientRect().height || $($modal).height(),
        width: $modal.getBoundingClientRect().width || $($modal).width()
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
      if (this.open) {
        this.open = false;
        const $parent = this.$modal.parentNode;
        this.complete = false;
        $("html,body").css("overflow", "");
        TweenMax.to(this.$modal, 0.3, {
          css: this.before,
          ease: "cubic-bezier(0.4, 0.0, 0.2, 1)",
          onComplete() {
            _self.$modal.setAttribute("style", "");
          }
        });
      }
    },
    onOpen() {
      const _self = this;
      if (!this.open) {
        this.open = true;
        if ("gtag" in window) {
          const event_category = "modal";
          const event_label = this.item.uid;
          gtag("event", "click", {
            event_category,
            event_label
          });
        }
        $("html,body").css("overflow", "hidden");
        TweenMax.fromTo(
          this.$modal,
          0.6,
          {
            css: this.getBefore()
          },
          {
            css: this.getAfter(),
            ease: "cubic-bezier(0.4, 0.0, 0.2, 1)",
            onComplete: () => {
              _self.complete = true;
            }
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
.modal-container {
  &:after {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    height: 100%;
    width: 100%;
    z-index: 100;
    transition: 0.3s ease all;
    background: black url("../../img/loading.svg")center/64px no-repeat;
  }
  &.active {
    &:after {
      opacity: 0;
      visibility: hidden;
    }
    .modal {
      animation: fadeInUp 1.2s 0s 1 both;
    }
  }
  .modal-blur {
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
    cursor: pointer;
  }
}
.modal-fake {
  width: 100%;
  position: relative;
  display: block;
  padding-bottom: $height;
}
.modal {
  transition: 0.3s ease padding, 0.3s ease backgroundColor;
  z-index: 100;
  overflow: hidden;
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
  width: 100%;
  border-radius: 12px;
  color: #5f5f5f;
  @media all and(max-width:768px) {
    transition: 1.2s ease padding;
  }
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

  &:not(.active):hover {
    .sub-tit {
      opacity: 1;
      visibility: visible;
      transform: translate(0, 0%);
    }
    .modal-blur {
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
    transition: 0.6s 0s ease all;
    transform: scale(1.2);
  }
  &.active {
    z-index: 999;
    background-color: white;
    overflow-y: auto;
    padding: 2%;
    border-radius: 0px;
    @media all and(max-width:768px) {
      padding-top: 64px;
    }
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
        }
      }
      .col-pic {
        .modal-cover {
          background-size: cover !important;
          // height: auto !important;
          padding-bottom: 50%;
          position: relative;
        }
        .modal-carousel {
          pointer-events: inherit;
          .modal-pic {
            background: url("") center/contain no-repeat;
          }
          .flickity-button,
          .flickity-page-dots {
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
    .row {
      align-items: center;
      align-content: center;
    }
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
        display: block;
        width: 100%;
        transition: 0.3s ease all;
        padding-bottom: $height;
        cursor: pointer;
      }
      .modal-carousel {
        position: absolute;
        top: 0%;
        left: 0;
        height: 100%;
        width: 100%;
        pointer-events: none;
        .modal-pic {
          background: url("") center/cover no-repeat;
        }
        .carousel-cell {
          margin-right: 64px;
        }
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
        .flickity-page-dots {
          display: none;
          position: absolute;
          bottom: 6px;
          left: 50%;
          transform: translate(-50%, 0);
          .dot {
            background-color: black;
            width: 8px;
            height: 8px;
            margin: 0 2px;
            vertical-align: middle;
            transition: 0.3s ease all;
            &.is-selected {
              width: 10px;
              height: 10px;
              background-color: white;
            }
          }
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
        display: none;
        transition: 0.6s ease all;
        text-align: center;
        &.active {
          h4,
          p {
            &:after {
              pointer-events: none;
              transform: scaleX(0);
            }
          }
          h4 {
            &:before {
              transform: scaleX(1);
            }
          }
        }
        h4 {
          position: relative;
          font-size: 2em;
          text-align: center;
          font-weight: lighter;

          // letter-spacing: 0.12em;
          display: inline-block;
          padding: 0 6% 2% 6%;
          margin-bottom: 6%;
          &:before {
            content: "";
            position: absolute;
            display: block;
            height: 2px;
            width: 100%;
            bottom: 0;
            left: 0;
            background-color: #5f5f5f;
            transition: 1.2s 0.12s ease-in-out all;
            transform: scale(0);
          }
        }
        p {
          position: relative;
          line-height: 1.5;
          font-size: 1.2em;
          text-align: left;
        }
        h4,
        p {
          &:after {
            content: "";
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            z-index: 2;
            background-color: white;
            transition: 0.6s ease all;
            transform-origin: right;
          }
        }
      }
    }
  }
  .close {
    display: none;
    width: 64px;
    height: 64px;
    position: fixed;
    right: 16px;
    top: 6px;
    z-index: 12;
    cursor: pointer;
    background: url("../../img/close.png") center/contain no-repeat;
    transition: 0.6s ease all;
    &:hover {
      opacity: 0.6;
      transform: scale(1.08);
    }
  }
}
</style>
