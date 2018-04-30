<template>
    <div class="container">
        <div class="content">
            <div class="packery-container" ref="container">
                <div class="packery-item" v-for="(item, index) in list" :key="index" @click="openModal(item)" :closeevent="closeModal(item)">
                   <modal :item="item" :active="item.active"></modal>
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
      options: {
        itemSelector: ".packery-item",
        gutter: 10
      },
      list: [
        {
          pic: "http://pipsum.com/435x310.jpg",
          tit: "網站",
          des: "內文"
        },
        {
          pic: "http://pipsum.com/435x311.jpg",
          tit: "網站",
          des: "內文"
        },
        {
          pic: "http://pipsum.com/435x312.jpg",
          tit: "網站",
          des: "內文"
        },
        {
          pic: "http://pipsum.com/435x314.jpg",
          tit: "網站",
          des: "內文"
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
    closeModal(item) {
      // item.active = false;
      console.log(item);
    },
    openModal(item) {
      this.list.forEach(el => {
        el.active = false;
      });
      item.active = true;
    },
    updatePackery() {
      this.packery.layout();
    }
  }
};
</script>

<style scoped lang="scss">
.packery-item {
  width: calc(33.3333% - 10px);
  @media screen and(max-width: 768px) {
    width: 100%;
  }
}
</style>
