<template>
    <div class="container" >
        <div class="content">
            <div class="packery-container" ref="container">
                <div class="packery-item" v-for="(item, index) in list" :key="index" @click="openModal(item)" >
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
      list: [
        {
          bg: "img/web01a.jpg",
          pic: "img/web01.jpg",
          tit: "戴思恩",
          des:
            "網站連結網站連結網站連結網站連結網站連結網站連結網站連結網站連結網站連結網站連結網站連結"
        },
        {
          bg: "img/web02a.jpg",
          pic: "img/web02.jpg",
          tit: "亞瑟士",
          des:
            "網站連結網站連結網站連結網站連結網站連結網站連結網站連結網站連結網站連結網站連結網站連結"
        },
        {
          bg: "img/web03a.jpg",
          pic: "img/web03.jpg",
          tit: "KOTEX靠得住",
          des:
            "網站連結網站連結網站連結網站連結網站連結網站連結網站連結網站連結網站連結網站連結網站連結"
        },
        {
          bg: "img/web04a.jpg",
          pic: "img/web04.jpg",
          tit: "中鋼運通",
          des:
            "網站連結網站連結網站連結網站連結網站連結網站連結網站連結網站連結網站連結網站連結網站連結"
        },
        {
          bg: "img/web05a.jpg",
          pic: "img/web05.jpg",
          tit: "鋼之探偵",
          des:
            "網站連結網站連結網站連結網站連結網站連結網站連結網站連結網站連結網站連結網站連結網站連結"
        },
        {
          bg: "img/web06a.jpg",
          pic: "img/web06.jpg",
          tit: "E-MOVING",
          des:
            "網站連結網站連結網站連結網站連結網站連結網站連結網站連結網站連結網站連結網站連結網站連結"
        },
        {
          bg: "img/web07a.jpg",
          pic: "img/web07.jpg",
          tit: "DA",
          des:
            "網站連結網站連結網站連結網站連結網站連結網站連結網站連結網站連結網站連結網站連結網站連結"
        }
      ]
    };
  },
  mounted() {
    this.container = this.$refs.container;
    this.packery = new Packery(this.container, this.options);
    imagesloaded(this.container, this.updatePackery);
  },
  updated() {},

  methods: {
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
.packery-item {
  width: calc(33.3333% - 10px);
  @media screen and(max-width: 768px) {
    width: 100%;
  }
}
</style>
