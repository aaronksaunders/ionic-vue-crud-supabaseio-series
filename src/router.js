import { createRouter, createWebHistory } from "@ionic/vue-router";
import Home from "@/views/Home.vue";
import AddProduct from "@/views/AddProduct.vue";
import UserLogin from "@/views/UserLogin.vue";
import UserCreate from "@/views/UserCreate.vue";
import ChangePassword from "@/views/ChangePassword.vue";

import dataService from "./dataService";

const routes = [
  {
    path: "/",
    redirect: "/home",
  },
  {
    path: "/home",
    name: "Home",
    component: Home,
    meta: { requiresAuth: true },
  },
  {
    path: "/add-product",
    name: "AddProduct",
    component: AddProduct,
    meta: { requiresAuth: true },
  },
  // this defines the authentication route of the application
  { path: "/login", component: UserLogin, meta: { requiresAuth: false } },
  {
    path: "/create-account",
    component: UserCreate,
    meta: { requiresAuth: false },
  },  {
    path: "/change-password",
    component: ChangePassword,
    meta: { requiresAuth: false },
  },
];
const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

router.beforeEach((to, from, next) => {
  const { hasUser } = dataService();
  console.log("beforeEach", hasUser());
  debugger;
  if (to.fullPath.indexOf("type=recovery") != -1) {
    next("/change-password");
  } else if (to.meta.requiresAuth && !hasUser()) {
    next("/login");
  } else {
    next();
  }
});
export default router;
