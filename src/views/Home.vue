<template>
  <ion-page>
    <ion-header :translucent="true">
      <ion-toolbar>
        <ion-title>Supabase.io Products</ion-title>
        <ion-buttons slot="end">
          <ion-button @click="addProduct"
            ><ion-icon slot="icon-only" :icon="addCircleOutline"></ion-icon
          ></ion-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>

    <ion-content :fullscreen="true" class="ion-padding">
      <ion-list>
        <ion-item v-for="p in productList" :key="p.id">
          <ion-grid>
            <ion-row>
              <ion-col size="4">
                <ImageView :image="p.image" />
              </ion-col>
              <ion-col>
                <h2>
                  {{ p.name }} <span>${{ p.list_price / 100 }}</span> -
                  <span>${{ p.sale_price / 100 || 0 }}</span>
                </h2>
                <h4>{{ p.description }}</h4>
                <p>{{ p.category }}</p>
                <p>
                  <ion-button color="danger" @click="deleletProduct(p)"
                    >DELETE</ion-button
                  >
                </p>
              </ion-col>
            </ion-row>
          </ion-grid>
        </ion-item>
      </ion-list>
    </ion-content>
    <ion-footer class="ion-text-center">
      <ion-button @click="doLogout" fill="clear">
        <ion-icon :icon="logOutOutline"></ion-icon>
      </ion-button>
    </ion-footer>
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
  IonList,
  IonButtons,
  IonButton,
  IonFooter,
  IonIcon,
  IonRow,
  IonCol,
  IonGrid
} from "@ionic/vue";
import ImageView from "../components/ImageView.vue";
import { addCircleOutline, logOutOutline } from "ionicons/icons";
import { useRouter } from "vue-router";
import dataService from "../dataService";

export default {
  name: "Home",
  components: {
    ImageView,
    IonContent,
    IonHeader,
    IonPage,
    IonTitle,
    IonToolbar,
    IonItem,
    IonList,
    IonButtons,
    IonButton,
    IonFooter,
    IonIcon,
    IonRow,
    IonCol,
    IonGrid
  },
  ionViewDidEnter() {
    console.log("Home page did enter");
    // const { loadProducts, hasUser } = dataService();
    // hasUser && loadProducts();

  },
  setup() {
    const router = useRouter();
    const {
      displayError,
      productList,
      removeProduct,
      logout
    } = dataService();

    /**
     *  go to next page
     */
    const addProduct = () => {
      router.push("/add-product");
    };

    const deleletProduct = async product => {
      await removeProduct(product);
    };

    const doLogout = async () => {
      await logout();
      router.replace("/auth");
    };

    return {
      addProduct,
      productList,
      displayError,
      deleletProduct,
      doLogout,
      // icons
      addCircleOutline,
      logOutOutline
    };
  }
};
</script>

<style scoped>
</style>