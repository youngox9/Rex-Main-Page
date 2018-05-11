<template>
  <div>
    <div class="container" >
        <h2>Website..</h2>
        <div class="content">
            <div class="row inline-btn">
              <div class="col-12 col-md-4">
                  <button class="btn" :class="{active: type === 0}" v-ripple="'rgba(255,255,255,0.3)'" @click="setType(0)">
                    ALL 
                  </button>
              </div>
              <div class="col-12 col-md-4">
                  <button class="btn" :class="{active: type === 1}" v-ripple="'rgba(255,255,255,0.3)'" @click="setType(1)">
                    官方網站
                  </button>
              </div>
              <div class="col-12 col-md-4">
                  <button class="btn" :class="{active: type === 2}" v-ripple="'rgba(255,255,255,0.3)'" @click="setType(2)">
                    活動網站
                  </button>
              </div>
            </div>
            <div class="search-container">
              <input type="text" v-model="search" placeholder="SEARCH"/>
            </div>
            <p class="sub-title">這些是我從以前到現在所負責的網站切版以及API串接，有些可能因版權或是年代久遠而無法放上，以下僅供展示使用。</p>
            <p class="text-left">total-count:{{data.length}}</p>
            <div class="packery-container" ref="container">
                <div class="packery-item" v-for="item in list" :key="item.uid">
                  <modal :item="item"></modal>
                </div> 
            </div>
            <button class="loadmore" @click="loadmore()" v-ripple="'rgba(255,255,255,0.3)'" v-if="hasMore">LOAD MORE</button>
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
      search: "",
      pageCount: 20,
      page: 0,
      type: 0,
      open: false,
      options: {
        itemSelector: ".packery-item",
        gutter: 10
      },
      data: []
    };
  },
  mounted() {
    this.container = this.$refs.container;
    fetch("data.json", { method: "get" })
      .then(response => response.json())
      .then(data => {
        this.data = data;
      });
  },
  updated() {
    this.init();
    this.updatePackery();
  },
  computed: {
    tempList() {
      return this.data
        .filter(d => {
          if (this.type === 0) return true;
          return d.type == this.type;
        })
        .filter(d => {
          return d.tit.indexOf(this.search) > -1;
        });
    },
    list() {
      const start = this.page * this.pageCount;
      const end = start + this.pageCount;
      return this.tempList.slice(0, end);
    },
    hasMore() {
      return this.list.length < this.tempList.length;
    }
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
    updatePackery() {
      this.packery.layout();
    },
    loadmore() {
      if (this.hasMore) {
        this.page++;
      }
    },
    filterList() {},
    setType(type) {
      this.page = 0;
      this.type = type;
    }
  }
};
</script>

<style scoped lang="scss">
.search-container {
  cursor: pointer;
  font-size: 1.2em;
  width: 100%;
  border: 1px solid white;
  width: 100%;
  border: none;
  box-shadow: none;
  background-color: transparent;
  border-radius: 2em;
  color: white;
  border: 1px solid white;
  margin-bottom: 4%;
  position: relative;
  transition: 0.3s ease all;
  padding: 6px 12px;
  input {
    border: none;
    box-shadow: none;
    width: 100%;
    height: 100%;
    line-height: 1.5;
    background-color: transparent;
    color: white;
  }
}
.sub-title {
  text-align: center;
  margin: 24px 0;
}
h2 {
  font-size: 4em;
  color: white;
  text-align: center;
  margin: 2% 0;
}
.inline-btn {
  .btn {
    cursor: pointer;
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
    margin-bottom: 4%;
    position: relative;
    transition: 0.3s ease all;
    &.active {
      border-color: white;
      background-color: white;
      color: black;
    }
    input[type="radio"] {
      width: 100%;
      height: 100%;
      top: 0;
      left: 0%;
      position: absolute;
    }
  }
}

.packery-container {
  .packery-item {
    width: calc(33.3333% - 10px);
    @media all and(max-width: 768px) {
      width: calc(100% - 10px);
    }
  }
}

.loadmore {
  font-size: 1.2em;
  width: 100%;
  border: 1px solid white;
  width: 100%;
  border: none;
  box-shadow: none;
  background-color: transparent;
  border-radius: 2em;
  color: white;
  border: 1px solid white;
  margin-top: 48px;
  transition: 0.3s ease all;
  font-weight: bolder;
  line-height: 1.5;
  cursor: pointer;
  &:hover {
    background: white;
    color: black;
  }
}
</style>
