import "@/App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "sonner";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ScrollToTop from "@/components/ScrollToTop";
import Home from "@/pages/Home";
import Shop from "@/pages/Shop";
import ProductDetail from "@/pages/ProductDetail";
import Contact from "@/pages/Contact";

const TOAST_OPTIONS = {
  style: {
    background: "#2C2A28",
    color: "#F9F6F0",
    border: "1px solid #8C4A32",
    borderRadius: "2px",
    fontFamily: "Work Sans, sans-serif",
  },
};

function App() {
  return (
    <div className="App font-sans-body">
      <BrowserRouter>
        <Navbar />
        <main>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/portfolio" element={<Shop />} />
            <Route path="/portfolio/:id" element={<ProductDetail />} />
            <Route path="/contact" element={<Contact />} />
          </Routes>
        </main>
        <Footer />
        <Toaster
          position="bottom-right"
          toastOptions={TOAST_OPTIONS}
        />
      </BrowserRouter>
    </div>
  );
}

export default App;
