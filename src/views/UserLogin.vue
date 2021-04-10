<template>
  <ion-page>
    <ion-content :fullscreen="true" class="ion-padding">
      <div class="ion-padding" style="padding-top:42px; padding-bottom:32px">
        <ion-img :src="logo"></ion-img>
      </div>
      <ion-item>
        <ion-label>Email</ion-label>
        <ion-input type="email" v-model="creds.email"></ion-input>
      </ion-item>
      <ion-item>
        <ion-label>Password</ion-label>
        <ion-input type="password" v-model="creds.password"></ion-input>
      </ion-item>
      <div class="ion-padding">
        <ion-button @click="doLogin" expand="block">LOGIN</ion-button>
        <ion-button
          @click="router.push('/create-account')"
          expand="block"
          fill="clear"
          >CREATE ACCOUNT</ion-button
        >
      </div>
    </ion-content>
    <ion-footer class="ion-text-center">
      <ion-button @click="doForgotPassword" fill="clear">
        FORGOT PASSWORD
      </ion-button>
    </ion-footer>
  </ion-page>
</template>

<script>
import {
  IonContent,
  IonPage,
  IonItem,
  IonLabel,
  IonInput,
  IonImg,
  IonButton,
  IonFooter
} from "@ionic/vue";

import { ref } from "vue";
import { useRouter } from "vue-router";
import dataService from "../dataService";
import logo from "@/assets/ionic-supabase-vue-logo.png";
export default {
  name: "Home",
  components: {
    IonContent,
    IonImg,
    IonPage,
    IonItem,
    IonLabel,
    IonInput,
    IonButton,
    IonFooter
  },
  setup() {
    const router = useRouter();
    const { login, forgotPassword } = dataService();

    const creds = ref({
      email: "",
      password: ""
    });

    const doLogin = async () => {
      try {
        const { email, password } = creds.value;
        const { user, error } = await login(email, password);
        if (user) router.replace("/home");
        if (error) throw error;
      } catch (e) {
        alert(e.message);
      }
    };

    const doForgotPassword = async () => {
      try {
        const { email } = creds.value;
        const { user, error } = await forgotPassword(email);
        if (user) alert("Check Email to Reset Password");
        if (error) throw error;
      } catch (e) {
        alert(e.message);
      }
    };

    return {
      doLogin,
      doForgotPassword,
      router,
      creds,
      logo
    };
  }
};
</script>

<style scoped>
/* remove the backgrounds on the input fields */
input:-webkit-autofill,
input:-webkit-autofill:hover,
input:-webkit-autofill:focus,
input:-webkit-autofill:active {
  transition: background-color 5000s ease-in-out 0s;
}
</style>