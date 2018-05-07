<template>
  <div>
    <header :open="open"/>
    <transition name="router-anim" enter-active-class="animated fadeInDown" leave-active-class="animated fadeOutDown">
        <router-view/>
    </transition>
  </div>
</template>

<script>
import header from "./containers/header";
import homepage from "./containers/homepage";

export default {
  name: "app",
  data() {
    return {
      open: false
    };
  },
  components: {
    homepage
  }
};
</script>

