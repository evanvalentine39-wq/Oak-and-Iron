import { products } from "../data/products";

export const fetchProducts = async () => {
  return products;
};

export const fetchProduct = async (id) => {
  return products.find((p) => p.id === id);
};

export const submitContact = async (payload) => {
  console.log("Contact form payload:", payload);

  throw new Error(
    "Contact form is not configured yet. We'll connect it to EmailJS next."
  );
};
