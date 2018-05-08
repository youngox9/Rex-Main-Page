<template>
  <div>
    <navbar :open="open" :openevent="toggleNav"/>
    <transition name="router-anim" enter-active-class="animated fadeInLeft" leave-active-class="animated fadeOutLeft">
        <router-view class="view" :class="{active:open}"/>
    </transition>
  </div>
</template>

<script>
import navbar from "./containers/navbar";
import homepage from "./containers/navbar";

export default {
  name: "app",
  data() {
    return {
      open: false
    };
  },
  components: {
    homepage,
    navbar
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


