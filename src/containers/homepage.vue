<template>
    <div class="container" >
        <h2>Website Gallery</h2>
        <div class="content">
            <div class="row inline-btn">
              <div class="col">
                  <button class="btn" v-ripple="'rgba(255,255,255,0.3)'">官方網站</button>
              </div>
              <div class="col">
                  <button class="btn" v-ripple="'rgba(255,255,255,0.3)'">活動網站</button>
              </div>
              <div class="col">
                  <button class="btn" v-ripple="'rgba(255,255,255,0.3)'">依時間</button>
              </div>
            </div>
            <div class="packery-container" ref="container">
                <div class="packery-item" v-for="(item, index) in list" :key="index" @click="openModal(item)">
                  <modal :item="item" :close="close.bind(this)"></modal>
                </div> 
            </div>
        </div>
    </div>
</template>

<script>
import Vue from "vue";
import Packery from "packery";
import imagesloaded from "imagesloaded";
import modal from "../components/modal";

import Ripple from "vue-ripple-directive";

Vue.directive("ripple", Ripple);

export default {
  name: "homepage",
  components: {
    modal
  },
  data() {
    return {
      open: false,
      options: {
        itemSelector: ".packery-item",
        gutter: 10
      },
      list: []
    };
  },
  mounted() {
    this.container = this.$refs.container;
    fetch("data.json", { method: "get" })
      .then(response => response.json())
      .then(data => {
        this.list = data;
      });
  },
  updated() {
    this.init();
    this.updatePackery();
  },

  methods: {
    init() {
      this.packery = new Packery(this.container, this.options);
      imagesloaded(this.container, this.updatePackery);
      $(window).bind("resize", this.updatePackery);
    },
    close(e) {
      this.open = false;
    },
    openModal(item) {
      this.open = true;
      this.list.forEach(el => {
        el.active = false;
      });
      item.active = true;
      this.$forceUpdate();
    },
    updatePackery() {
      this.packery.layout();
    }
  }
};
</script>

<style scoped lang="scss">
h2 {
  font-size: 4em;
  color: white;
  text-align: center;
  margin: 2% 0;
}
.inline-btn {
  margin-bottom: 4%;
  .col {
    .btn {
      font-size: 1.2em;
      width: 100%;
      border: 1px solid white;
      width: 100%;
      border: none;
      box-shadow: none;
      padding: 2%;
      background-color: transparent;
      border-radius: 2em;
      color: white;
      border: 1px solid white;
    }
  }
}
.packery-item {
  width: calc(33.3333% - 10px);
  @media screen and(max-width: 768px) {
    width: 100%;
  }
}
</style>
