<template>
  <ion-page>
    <ion-header :translucent="true">
      <ion-toolbar>
        <ion-title>CHANGE PASSWORD</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content :fullscreen="true" class="ion-padding">
      <ion-item>
        <ion-label>Password</ion-label>
        <ion-input type="password" v-model="creds.password1"></ion-input>
      </ion-item>
      <ion-item>
        <ion-label>Re-Enter Password</ion-label>
        <ion-input type="password" v-model="creds.password2"></ion-input>
      </ion-item>
      <div class="ion-padding">
        <ion-button @click="doChangePassword" expand="block"
          >SAVE CHANGES</ion-button
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
    const { changePassword } = dataService();

    const creds = ref({
      password1: "",
      password2: ""
    });

    const doChangePassword = async () => {
      try {
        const { password1, password2 } = creds.value;
        if (password1 != password2) {
          alert("Passwords Don't Match");
          return;
        }
        const { user, error } = await changePassword(password1);
        if (user) router.replace("/home");
        if (error) throw error;
        alert("Password Changed");
      } catch (e) {
        alert(e.message);
      }
    };

    return {
      doChangePassword,
      router,
      creds
    };
  }
};
</script>

<style scoped>
</style>