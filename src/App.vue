<template>
  <div>
    <loader-item src="./img/loader.png" :progress="progress"></loader-item>
    <navbar :open="open" :openevent="toggleNav"/>
    <transition name="router-anim" enter-active-class="animated fadeInLeft" leave-active-class="animated fadeOutUp">
        <router-view class="view" :class="{active:open}"></router-view>
    </transition>
  </div>
</template>

<script>
import navbar from "./containers/navbar";
import homepage from "./containers/navbar";
import LoaderItem from "./components/LoaderItem";

import imagesloaded from "imagesloaded";
window.fetch = require("isomorphic-fetch");
export default {
  name: "app",
  data() {
    return {
      open: false,
      progress: 0
    };
  },
  watch: {},
  components: {
    homepage,
    navbar,
    LoaderItem
  },
  mounted() {
    // const imgLoaded = imagesloaded(document.querySelector("body"));
    // imgLoaded.on("always", instance => {
    //   console.log(instance);
    // });
    setTimeout(() => {
      this.progress = 1;
    }, 1000);
  },
  methods: {
    toggleNav() {
      this.open = !this.open;
      if (this.open) {
        $("body,html").css("overflow", "hidden");
      } else {
        $("body,html").css("overflow", "initial");
      }
    }
  }
};
</script>

<style scoped lang="scss">
.animated {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}
</style>


