import { ref } from "vue";
import SUPABASE_CLIENT from "./config";

const productList = ref();
const displayError = ref();
const session = ref();

/**
 * THIS CONNECTS TO SUPABASE...
 */
const dataService = () => {
  /**
   * called when dataService is first loaded to initialize
   * the session, also sets a listener to update the session
   * based on changes in the auth state
   */
  const initialize = async () => {
    session.value = SUPABASE_CLIENT.auth.session();
    SUPABASE_CLIENT.auth.onAuthStateChange(async (_event, _session) => {
      console.log(_event, _session);
      session.value = _session;

      if (_event === "SIGNED_IN") {
        await loadProducts();
      }
    });
  };
  /**
   * save data to the products table
   */
  const saveProducts = async (formData) => {
    try {
      const { file, ...productData } = formData;

      // save the image
      debugger;
      const { data, error } = await SUPABASE_CLIENT.storage
        .from("product-bucket")
        .upload(`products/${file.name}`, file);
      if (error) {
        throw error;
      }

      console.log(data);

      // save the data
      productData["image"] = `products/${file.name}`;

      const { data: prodData, error: prodError } = await SUPABASE_CLIENT.from(
        "products"
      ).insert([productData]);
      console.log(prodData);
      console.log(prodError);
      debugger;
      return { success: true };
    } catch (e) {
      debugger;
      console.log(e);
      return { success: false, error: e };
    }
  };

  /**
   * remove product from the product table
   *
   * @param {*} productId
   */
  const removeProduct = async (productId, imagePath) => {
    debugger;

    // delete product
    const { error: pv_error } = await SUPABASE_CLIENT.from("product_variants")
      .delete()
      .eq("product_id", productId);
    console.log("pv_error", pv_error);

    const { error: prod_error } = await SUPABASE_CLIENT.from("products")
      .delete()
      .eq("id", productId);
    console.log("prod_error", prod_error);

    // delete the image
    if (imagePath) {
      await SUPABASE_CLIENT.storage.from("product-bucket").remove([imagePath]);
    }
  };

  /**
   * load all of the products in the product table
   */
  const loadProducts = async () => {
    const load = async () => {
      let { data, error } = await SUPABASE_CLIENT.from("products").select(`
      *,
      product_variants (
        *
      )
    `);

      const {
        data: prods,
        error: prodError,
      } = await SUPABASE_CLIENT.storage
        .from("product-bucket")
        .list("products");
      if (prodError) {
        console.log(prodError);
        throw error;
      }

      console.log(prods);

      productList.value = data;
      displayError.value = error;
      return { data, error };
    };

    const subscription = SUPABASE_CLIENT.from("products")
      .on("*", async (payload) => {
        console.log("Change received!", payload);
        await load();
      })
      .subscribe();

    await load();

    return { data: productList.value, error: displayError.value, subscription };
  };

  /**
   * load a specific product by id
   * @param {*} productId
   */
  const loadProductById = async (productId) => {
    let { data, error } = await SUPABASE_CLIENT.from("products")
      .select(`*, product_variants ( * ) `)
      .eq("id", productId);

    console.log(data, error);
    return { data, error };
  };

  /**
   *
   */
  const login = async (email, password) => {
    let { user, error } = await SUPABASE_CLIENT.auth.signIn({
      email,
      password,
    });

    console.log(error && error.message);
    return { user, error };
  };

  /**
   *
   */
  const logout = async () => {
    let { user, error } = await SUPABASE_CLIENT.auth.signOut();
    debugger;
    console.log(error && error.message);
    return { user, error };
  };

  /**
   *
   */
  const forgotPassword = async (email) => {
    let { user, error } = await SUPABASE_CLIENT.auth.api.resetPasswordForEmail(
      email
    );
    debugger;
    console.log(error && error.message);
    return { user, error };
  };

  const changePassword = async (password) => {
    const { user, error } = await SUPABASE_CLIENT.auth.update({
      password,
      data: {
        password_changed: new Date(),
      },
    });
    debugger;
    console.log(error && error.message);
    return { user, error };
  };
  /**
   *
   */
  const createAccount = async (email, password) => {
    let { user, error } = await SUPABASE_CLIENT.auth.signUp({
      email,
      password,
    });
    console.log(error && error.message);
    return { user, error };
  };

  return {
    // PROPERTIES
    displayError,
    productList,
    hasUser: () => {
      return session.value !== null;
    },

    // FUNCTIONS
    saveProducts,
    loadProducts,
    removeProduct,
    loadProductById,
    login,
    createAccount,
    logout,
    initialize,
    forgotPassword,
    changePassword,
  };
};
//
dataService().initialize();

// export the service
export default dataService;
