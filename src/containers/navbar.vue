<template>
    <div class="navbar" :class="{active:open}">
      <div class="navbar-blur" @click="toggle()"></div>
      <div class="toggle" @click="toggle()">
        <hamburger
            :stroke='2'
            :gap='5'
            :color='getColor()'
            :open='open'>
        </hamburger>
      </div>
      <ul class="nav">
        <li><router-link to="/about">About</router-link></li>
        <li><router-link to="/">Website</router-link></li>
        <!-- <li><router-link to="/banner">Banner</router-link></li>
        <li><router-link to="/character">Character</router-link></li> -->
      </ul>
    </div>
</template>

<script>
import Vue from "vue";
import VueHamburger from "vue-hamburger";
import "vue-hamburger/index.css";

Vue.component("hamburger", VueHamburger);

export default {
  props: ["open", "openevent"],
  name: "navbar",
  components: {},
  data() {
    return {};
  },
  mounted() {},
  updated() {},
  computed: {},
  methods: {
    getColor() {
      if (this.open) {
        return "#000000";
      } else {
        return "#FFFFFF";
        // return "#000000";
      }
    },
    toggle() {
      this.openevent();
    }
  }
};
</script>

<style lang="scss">
$navWidth: 200px;
.view {
  // overflow: hidden;
  z-index: 3;
  position: relative;
  backface-visibility: hidden;
  // transform: translate(0, 0);
  @media all and(max-width: 768px) {
    padding-top: 64px;
  }
  > .container {
    transition: 0.3s ease all;
  }
  &.active {
    > .container {
      transform: translate($navWidth, 0);
      .content {
        filter: blur(4px);
      }
    }
  }
}
.navbar {
  position: fixed;
  z-index: 998;
  &.active {
    .nav {
      transform: translate(0%, 0);
      li {
        @for $i from 1 through 10 {
          &:nth-child(#{$i}) {
            animation: fadeInLeft 0.3s $i * 0.12s 1 both;
          }
        }
      }
    }
    .navbar-blur {
      opacity: 1;
      visibility: visible;
      cursor: pointer;
    }
  }
  .toggle {
    position: fixed;
    top: 6px;
    left: 6px;
    z-index: 999;
  }
  .navbar-blur {
    opacity: 0;
    visibility: hidden;
    position: fixed;
    width: 100%;
    height: 100%;
    top: 0px;
    left: 0px;
    z-index: 1;
    background-color: rgba(0, 0, 0, 0.56);
    transition: 0.3s ease all;
  }
  .nav {
    position: fixed;
    width: $navWidth;
    height: 100%;
    top: 0;
    z-index: 2;
    background-color: white;
    list-style: none;
    transition: 0.3s ease all;
    transform: translate(-100%, 0);
    padding: 12px;
    padding-top: 64px;
    li {
      position: relative;
      text-align: center;
      font-size: 1em;
      font-weight: bolder;

      font-weight: lighter;
      margin-bottom: 12px;
      transition: 0.3s ease all;

      a {
        display: block;
        padding: 12px;
        color: black;
        text-decoration: none !important;
        cursor: pointer;
        transition: 0.3s ease all;
        &.router-link-exact-active {
          background-color: black;
          color: white;
          box-shadow: 4px 4px 8px #000;
          transform: translate(-6px, 0);
        }
      }
      &:after {
        content: "";
        display: block;
        width: 100%;
        bottom: 0;
        left: 50%;
        height: 1px;
        background-color: black;
        transform: translate(-50%, 0) scale(0);
        transition: 0.3s ease all;
        position: absolute;
      }

      &:hover {
        &:after {
          transform: translate(-50%, 0) scale(1);
        }
      }
    }
  }
}
</style>
