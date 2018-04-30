<template>
  <div class="modal" :class="{active}" ref="modal">
    <div class="close" @click="closeModal()"></div>
    <div class="modal-cover" :style="`background:url(${item.pic}) center/cover no-repeat`"></div>
      <div class="modal-content">
        <h4>{{item.tit}}</h4>
        <p>{{item.des}}</p>
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
    closeevent: {
      type: Function,
      default: () => {}
    }
  },
  watch: {
    item: {
      handler(val, oldVal) {},
      deep: true
    },
    active: {
      handler(val, oldVal) {
        if (val) {
          this.onOpen();
        } else {
          this.onClose();
        }
      }
    }
  },
  name: "modal",
  data() {
    return {};
  },
  mounted() {
    this.$modal = this.$refs.modal;
    window.addEventListener("resize", this.onResize);
  },
  updated() {},
  components: {},
  methods: {
    closeModal() {
      // this.closeevent();
    },
    onClose() {
      TweenMax.to(this.$modal, 0.3, { css: this.before });
    },
    onOpen() {
      if (!this.before) {
        this.before = {
          position: "fixed",
          left: $(this.$modal).offset().left,
          top: $(this.$modal).offset().top,
          height: $(this.$modal).height(),
          width: $(this.$modal).width()
        };
      }
      this.after = {
        position: "fixed",
        left: 0,
        top: 0,
        height: window.innerHeight,
        width: window.innerWidth
      };
      TweenMax.fromTo(
        this.$modal,
        0.3,
        { css: this.before },
        { css: this.after }
      );
    },
    onResize() {
      if (this.active) {
        this.after = {
          position: "fixed",
          left: 0,
          top: 0,
          height: window.innerHeight,
          width: window.innerWidth
        };
        TweenMax.to(this.$modal, 0, { css: this.after });
      } else {
        TweenMax.to(this.$modal, 0, { css: this.before });
      }
    }
  }
};
</script>

<style scoped lang="scss">
.modal {
  // transition: 0.3s ease all;
  background-color: white;
  &.active {
    z-index: 999;
    .close {
      display: block;
    }
    .modal-content {
      display: block;
    }
    .modal-cover {
      height: 400px;
    }
  }
  .modal-cover {
    height: 300px;
    display: block;
    width: 100%;
    transition: 0.3s ease all;
  }
  .modal-content {
    display: none;
  }
  .close {
    display: none;
    width: 64px;
    height: 64px;
    position: absolute;
    right: 6px;
    top: 6px;
    z-index: 2;
    background-color: black;
  }
}
</style>
