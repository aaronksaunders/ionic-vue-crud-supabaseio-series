<template>
  <ion-page>
    <ion-header :translucent="true">
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-back-button defaultHref="home"></ion-back-button>
        </ion-buttons>
        <ion-title>ADD PRODUCT</ion-title>
        <ion-buttons slot="end">
          <ion-button @click="saveProductToDatabase">SAVE</ion-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>

    <ion-content :fullscreen="true" class="ion-padding">
      <ion-item>
        <ion-label>Name</ion-label>
        <ion-input type="text" v-model="formData.name"></ion-input>
      </ion-item>
      <ion-item>
        <ion-label>Description</ion-label>
        <ion-input type="text" v-model="formData.description"></ion-input>
      </ion-item>
      <ion-item>
        <ion-label>Price</ion-label>
        <ion-input type="number" v-model="formData.list_price"></ion-input>
      </ion-item>
      <ion-item>
        <ion-label>Sale Price</ion-label>
        <ion-input type="number" v-model="formData.sale_price"></ion-input>
      </ion-item>
      <ion-item>
        <ion-label>Category</ion-label>
        <ion-select v-model="formData.category">
          <ion-select-option value="Shirts">Shirts</ion-select-option>
          <ion-select-option value="Pants">Pants</ion-select-option>
          <ion-select-option value="Sweaters">Sweaters</ion-select-option>
        </ion-select>
      </ion-item>
      <ion-item>
        <ion-label position="stacked">Image</ion-label>
        <ion-input type="file" @change="handleFileChange"></ion-input>
      </ion-item>
    </ion-content>
  </ion-page>
</template>

<script>
import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  IonItem,
  IonLabel,
  IonInput,
  IonBackButton,
  IonButtons,
  IonButton,
  IonSelect,
  IonSelectOption,
} from "@ionic/vue";

import { ref } from "vue";
import { useRouter } from "vue-router";
import dataService from "../dataService";
export default {
  name: "Home",
  components: {
    IonContent,
    IonHeader,
    IonPage,
    IonTitle,
    IonToolbar,
    IonItem,
    IonLabel,
    IonInput,
    IonBackButton,
    IonButtons,
    IonButton,
    IonSelect,
    IonSelectOption,
  },
  setup() {
    const router = useRouter();
    const { saveProducts } = dataService();
    const selectedFile = ref(null);

    const formData = ref({
      name: "",
      description: "",
      list_price: 0,
      sale_price: 0,
      category: "Sweater",
    });

    /**
     *
     */
    const saveProductToDatabase = async () => {
      try {
        await saveProducts({
          ...formData.value,
          list_price: Number(formData.value.list_price * 100),
          sale_price: Number(formData.value.sale_price * 100),
          file : selectedFile.value
        });
        router.back();
      } catch (e) {
        alert(e.message);
      }
    };

    /**
     *
     */
    const handleFileChange = (event) => {
      selectedFile.value = event.target.files[0];
    };

    return {
      saveProductToDatabase,
      formData,
      handleFileChange,
    };
  },
};
</script>

<style scoped>
</style>