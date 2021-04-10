<template>
  <img :src="imageUrl" width="250" />
</template>

<script>
import { ref } from "@vue/runtime-core";
import SUPABASE_CLIENT from "../config";
import missingImage from "@/assets/no_image_available.jpeg";
export default {
  name: "ImageView",
  props: {
    image: String
  },
  setup(props) {
    const imageUrl = ref();

    /**
     *
     */
    const downloadImage = async path => {
      if (!path) {
        imageUrl.value = missingImage;
        return;
      }

      try {
        const { data, error } = await SUPABASE_CLIENT.storage
          .from("product-bucket")
          .download(path);
        if (error) {
          throw error;
        }
        const url = URL.createObjectURL(data);
        imageUrl.value = url;
      } catch (error) {
        console.log("Error downloading image: ", error.message);
      }
    };

    downloadImage(props?.image);
    return {
      imageUrl
    };
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
