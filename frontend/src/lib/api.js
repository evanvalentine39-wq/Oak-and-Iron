import emailjs from "@emailjs/browser";
import { products } from "../data/products";

export const fetchProducts = async () => {
  return products;
};

export const fetchProduct = async (id) => {
  return products.find((p) => p.id === id);
};

export const submitContact = async (payload) => {
  await emailjs.send(
    "service_cozj86k",
    "template_vc7t94b",
    {
      name: payload.name,
      email: payload.email,
      subject: payload.subject,
      message: payload.message,
    },
    "hZGUIJIUFQ8wX9Og3"
  );

  return {
    success: true,
    message: "Your message has been sent successfully!",
  };
};
