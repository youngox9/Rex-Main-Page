<template>
<div>
   <router-view></router-view>
</div>
</template>

<script>
import homepage from "./containers/homepage";
export default {
  name: "app",
  components: {
    homepage
  }
};
</script>

