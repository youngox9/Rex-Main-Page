<template>
    <div class="navbar" >
      <hamburger
          :stroke='2'
          :gap='5'
          color='#192a35'
          :open.sync='open'>
      </hamburger>
      <ul>
        <li></li>
      </ul>
    </div>
</template>

<script>
import Vue from "vue";
import VueHamburger from "vue-hamburger";
import "vue-hamburger/index.css";

Vue.component("hamburger", VueHamburger);

export default {
  name: "modal",
  components: {},
  data() {
    return {};
  },
  mounted() {},
  updated() {},
  computed: {},
  methods: {}
};
</script>

<style scoped lang="scss">

</style>
