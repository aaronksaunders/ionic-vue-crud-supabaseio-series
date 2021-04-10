<template>
  <div></div>
</template>

<script>
import { watch } from "@vue/runtime-core";
export default {
  name: "ImageView",
  props: {
    image: String
  },
  setup(props) {
    watch(props.image, (cur, prev) => {
      console.log(cur, prev);
      if (cur !== prev) {
      }
    });
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
