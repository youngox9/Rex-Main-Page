<template>
  <div class="modal" :class="{active:open}" ref="modal">
    <div class="close" @click="onClose"></div>
    <div class="blur-bk" :style="{background:`url(${item.bg}) center/cover no-repeat`}"></div>
    <p class="sub-tit">{{item.tit}}</p>
    <div class="modal-wrap">
      <div class="row row-no-gutter">
        <div class="col col-pic">
          <div class="modal-cover" :style="picStyle"  @click="onOpen()"></div>
        </div>
        <div class="col col-content" ref="content">
            <div class="modal-content">
                <h4>{{item.tit}}</h4>
                <p>{{item.des}}</p>
            </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Vue from "vue";
import { TweenMax, Power2, TimelineLite } from "gsap";

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
      open: false,
      picStyle: {
        background: `url(${this.item.pic}) center/cover no-repeat`,
        height: Math.floor(Math.random() * 100) + 300 + "px"
      }
    };
  },
  mounted() {
    this.$modal = this.$refs.modal;
    this.$content = this.$refs.content;
    window.addEventListener("resize", this.onResize);
  },
  updated() {},
  components: {},
  methods: {
    onClose() {
      const _self = this;
      this.open = false;
      const $parent = this.$modal.parentNode;
      TweenMax.to(this.$modal, 0.6, {
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
        const $parent = this.$modal;
        this.before = {
          position: "fixed",
          left: $($parent).offset().left,
          top: $($parent).offset().top,
          height: $($parent).height(),
          width: $($parent).width()
        };
        this.after = {
          position: "fixed",
          left: 0,
          top: 0,
          height: window.innerHeight,
          width: window.innerWidth
        };
        TweenMax.fromTo(
          this.$modal,
          0.6,
          { css: this.before },
          { css: this.after, ease: "cubic-bezier(0.4, 0.0, 0.2, 1)" }
        );
      }
    },
    onResize() {
      this.onClose();
    }
  }
};
</script>

<style scoped lang="scss">
.modal {
  transition: 0.6s ease background-color;
  z-index: 100;
  overflow: hidden;
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
    z-index: 101;
    background-color: white;
    .blur-bk {
      opacity: 0.3;
    }
    .modal-wrap {
      .col-content {
        margin-left: 0%;
        .modal-content {
          display: block;
          padding: 6%;
        }
      }
      .col-pic {
        .modal-cover {
          background-size: auto 100% !important;
          // height: auto !important;
          padding-bottom: 50%;
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
        // height: random(300) + px;
        display: block;
        width: 100%;
        transition: 0.3s ease all;
      }
    }
    .col-content {
      z-index: 1;
      position: relative;
      transition: 0.6s ease margin-left;
      margin-left: -100%;
      .modal-content {
        display: none;
        transition: 0.6s ease all;
        text-align: center;
        h4 {
          font-size: 3em;
          text-align: center;
          font-weight: lighter;
          border-bottom: 2px solid #8b8b8b;
          color: #5f5f5f;
          letter-spacing: 0.12em;
          display: inline-block;
          padding: 0 6%;
          margin-bottom: 24px;
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
