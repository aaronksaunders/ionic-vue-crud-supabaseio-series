<template>
  <ion-page>
    <ion-header :translucent="true">
      <ion-toolbar>
        <ion-title>CREATE ACCOUNT</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content :fullscreen="true" class="ion-padding">
      <ion-item>
        <ion-label>Email</ion-label>
        <ion-input type="email" v-model="creds.email"></ion-input>
      </ion-item>
      <ion-item>
        <ion-label>Password</ion-label>
        <ion-input type="password" v-model="creds.password"></ion-input>
      </ion-item>
      <div class="ion-padding">
        <ion-button @click="doCreateAccount" expand="block"
          >CREATE ACCOUNT</ion-button
        >
        <ion-button @click="router.back()" expand="block" fill="clear"
          >CANCEL</ion-button
        >
      </div>
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
  IonButton
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
    IonButton
  },
  setup() {
    const router = useRouter();
    const { createAccount } = dataService();

    const creds = ref({
      email: "",
      password: ""
    });

    const doCreateAccount = async () => {
      try {
        const { email, password } = creds.value;
        const { user, error } = await createAccount(email, password);
        if (user) router.replace("/home");
        if (error) throw error;
        alert("Check Your Email to Verify Your Account");
      } catch (e) {
        alert(e.message);
      }
    };

    return {
      doCreateAccount,
      router,
      creds
    };
  }
};
</script>

<style scoped>
</style>