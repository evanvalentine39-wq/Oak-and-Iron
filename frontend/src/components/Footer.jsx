import { Link } from "react-router-dom";
import { Instagram, Mail, MapPin } from "lucide-react";

export default function Footer() {
  return (
    <footer
      data-testid="site-footer"
      className="bg-[#2C2A28] text-[#F9F6F0] mt-32"
    >
      <div className="max-w-7xl mx-auto px-6 sm:px-12 py-24">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12">
          <div className="md:col-span-7">
            <p className="label-eyebrow text-[#C8A07A] mb-6">Let&apos;s talk</p>
            <h2 className="font-serif-display text-4xl sm:text-5xl lg:text-6xl leading-[1.05] tracking-tight">
              Have a piece in mind?
              <br />
              <span className="italic text-[#C8A07A]">Tell me about it.</span>
            </h2>
            <Link
              to="/contact"
              data-testid="footer-contact-cta"
              className="inline-block mt-10 px-8 py-4 bg-[#F9F6F0] text-[#2C2A28] label-eyebrow hover:bg-[#C8A07A] hover:text-[#2C2A28] transition-colors duration-300"
            >
              Start a Conversation
            </Link>
          </div>

          <div className="md:col-span-5 grid grid-cols-2 gap-8">
            <div>
              <p className="label-eyebrow text-[#C8A07A] mb-4">Studio</p>
              <ul className="space-y-3 text-sm text-[#E3DACD]">
                <li>
                  <Link to="/" className="hover:text-[#F9F6F0]">
                    Home
                  </Link>
                </li>
                <li>
                  <Link to="/shop" className="hover:text-[#F9F6F0]">
                    Shop
                  </Link>
                </li>
                <li>
                  <Link to="/contact" className="hover:text-[#F9F6F0]">
                    Contact
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <p className="label-eyebrow text-[#C8A07A] mb-4">Find me</p>
              <ul className="space-y-3 text-sm text-[#E3DACD]">
                <li className="flex items-center gap-2">
                  <MapPin size={14} /> Hutto, TX
                </li>
                <li className="flex items-center gap-2">
                  <Mail size={14} /> hello@oakandiron.com
                </li>
                <li className="flex items-center gap-2">
                  <Instagram size={14} /> @oakandiron
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div className="border-t border-[#5C5852]/40 mt-20 pt-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <p className="text-xs text-[#C8A07A]">
            © {new Date().getFullYear()} Oak &amp; Iron. Made by hand in the
            Texas Hill Country.
          </p>
          <p className="text-xs text-[#5C5852]">
            Every piece is signed. Every cut, considered.
          </p>
        </div>
      </div>
    </footer>
  );
}
