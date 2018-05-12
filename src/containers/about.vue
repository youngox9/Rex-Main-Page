<template>
  <div>
    <div class="container" >
        <h2>About..</h2>
        <div class="content profile">
          <div class="row">
            <div class="col-12 col-md-4">
              <div class="pic" v-card>
                <img src="img/pic.jpg">
               </div>
            </div>
             <div class="col">
                <h2>about REX</h2>
                <p>退伍後2015年開始玩前端到現在，大約三年資歷。
                  <br/>喜歡玩各種特效/ 動態/ 框架。
                  <br/>製作過許多大大小小的活動網站/官方網站，
                  <br/>有些活動結束了or版權問題沒辦法看到，不過至少有一些圖片資料留下來。
                  <br/>專案依客戶需求選擇框架，所以可能有些用這個，有些用那個寫。
                  <br/>近期在玩Vue & React Native & pixi.js
                  <br/><br/>
                  興趣是健身、電影(尤其MARVEL)、打LOL、玩SWITCH
                </p>
            </div>
          </div>
        </div>
    </div>
  </div>
</template>

<script>
import Vue from "vue";
import VanillaTilt from "vanilla-tilt";

Vue.directive("card", {
  inserted: function(el) {
    VanillaTilt.init(el, {
      speed: 600,
      glare: true,
      "max-glare": 0.6
    });
  }
});
export default {
  name: "about",
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
h2 {
  font-size: 4em;
  color: white;
  text-align: center;
  margin: 2% 0;
}
.profile {
  margin: 0 auto;
  max-width: 768px;
  .pic {
    width: 100%;
    border-radius: 100%;
    overflow: hidden;
    img {
      width: 100%;
    }
  }
  p {
    line-height: 2;
  }
  .row {
    align-items: center;
  }
}
</style>
