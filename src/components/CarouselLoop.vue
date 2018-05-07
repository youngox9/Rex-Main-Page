<script>
import $ from "jquery";
import Vue from "vue";
import Flickity from "vue-flickity";

export default {
  props: ["index", "onchange", "active"],
  components: {
    Flickity
  },
  render: function(createElement) {
    const carousel = createElement(
      "flickity",
      {
        ref: "flickity",

        props: {
          options: this.flickityOptions
        }
      },
      [
        this.children.map((slot, i) => {
          return createElement(
            "div",
            {
              class: "carousel-cell",
              scopedSlots: {
                active: this.activeIndex === i,
                default: props => {
                  if (slot.componentOptions) {
                    slot.componentOptions.propsData["active"] =
                      this.activeIndex === i;
                  }
                  return slot;
                }
              }
            },
            [slot]
          );
        })
      ]
    );

    return carousel;
  },
  data() {
    return {
      flickityOptions: {
        wrapAround: true,
        initialIndex: 0,
        fullscreen: true,
        autoPlay: 3000,
        on: {
          change: this.onSlideChange
        }
      }
    };
  },
  created() {
    if (this.$slots.default) {
      this.children = this.$slots.default.filter(s => s.tag);
    } else {
      this.children = [];
    }
  },
  mounted() {
    this.flickity = this.$refs.flickity.$flickity;
    this.flickity.stopPlayer();
  },
  methods: {
    onSlideChange(index) {
      if (typeof this.onchange === "function") {
        this.onchange(index);
      }
    }
  },
  watch: {
    index(val, oldval) {
      this.flickity.select(val);
    },
    active(val, oldval) {
      if (val) {
        this.flickity.playPlayer();
      } else {
        this.flickity.stopPlayer();
      }
    }
  }
};
</script>


