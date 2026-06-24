import "@/App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "sonner";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Home from "@/pages/Home";
import Shop from "@/pages/Shop";
import ProductDetail from "@/pages/ProductDetail";
import Contact from "@/pages/Contact";
import PaymentReturn from "@/pages/PaymentReturn";

function App() {
  return (
    <div className="App font-sans-body">
      <BrowserRouter>
        <Navbar />
        <main>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/shop" element={<Shop />} />
            <Route path="/shop/:id" element={<ProductDetail />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/payment/return" element={<PaymentReturn />} />
          </Routes>
        </main>
        <Footer />
        <Toaster
          position="bottom-right"
          toastOptions={{
            style: {
              background: "#2C2A28",
              color: "#F9F6F0",
              border: "1px solid #8C4A32",
              borderRadius: "2px",
              fontFamily: "Work Sans, sans-serif",
            },
          }}
        />
      </BrowserRouter>
    </div>
  );
}

export default App;
