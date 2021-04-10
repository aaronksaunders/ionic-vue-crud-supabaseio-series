import { ref } from "vue";
import SUPABASE_CLIENT from "./config";
import { v4 as uuidv4 } from "uuid";

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

    // if there is a session at startup, load the data
    if (session.value) {
      await loadProducts();
    }

    SUPABASE_CLIENT.auth.onAuthStateChange(async (_event, _session) => {
      session.value = _session;

      // if there is a session at startup, because of
      // a state change, then load the data
      if (_session) {
        await loadProducts();
      }
    });
  };
  /**
   * save data to the products table
   */
  const saveProducts = async (formData) => {
    try {
      // 1) save image
      const { file, ...productData } = formData;
      const imagePath = `products/${uuidv4()}-${file.name}`;

      const { error: sError } = await SUPABASE_CLIENT.storage
        .from("product-bucket")
        .upload(imagePath, file);
      if (sError) throw sError;

      // 2) save to database with image ref
      const { data: dbData, error: dbError } = await SUPABASE_CLIENT.from(
        "products"
      ).insert([{ ...productData, image: imagePath }]);
      if (dbError) throw dbError;

      return { success: true, data: dbData };
    } catch (e) {
      console.log(e);
      return { success: false, error: e };
    }
  };

  /**
   * remove product from the product table
   *
   * @param {*} productId
   */
  const removeProduct = async (product) => {
    try {
      // delete from database
      const { error: prodError } = await SUPABASE_CLIENT.from("products")
        .delete()
        .eq("id", product.id);
      if (prodError) throw prodError;

      // deleting from storage
      if (product?.image) {
        const { error: storageError } = await SUPABASE_CLIENT.storage
          .from("product-bucket")
          .remove([product.image]);

        if (storageError) throw storageError;
      }
    } catch (e) {
      console.log(e);
      throw Error(e);
    }
  };

  /**
   * load all of the products in the product table
   */
  const loadProducts = async () => {
    // private function
    const load = async () => {
      let { data, error } = await SUPABASE_CLIENT.from("products").select(`
    *,
    product_variants (
      *
    )
  `);
      productList.value = data;
      displayError.value = error;

      return { data, error };
    };

    // subscribe
    SUPABASE_CLIENT.from("products")
      .on("*", async (payload) => {
        console.log("Change received!", payload);
        await load();
      })
      .subscribe();

    await load();
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

    // clean up
    SUPABASE_CLIENT.getSubscriptions().map((s) => {
      SUPABASE_CLIENT.removeSubscription(s);
    });
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
