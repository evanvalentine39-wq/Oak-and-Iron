import { useEffect, useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { Menu, X } from "lucide-react";

const links = [
  { to: "/", label: "Home", testid: "nav-home" },
  { to: "/portfolio", label: "Portfolio", testid: "nav-shop" },
  { to: "/contact", label: "Contact", testid: "nav-contact" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setOpen(false);
  }, [location.pathname]);

  return (
    <header
      data-testid="site-navbar"
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? "backdrop-blur-xl bg-[#F9F6F0]/85 border-b border-[#E3DACD]"
          : "bg-transparent border-b border-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 sm:px-12 flex items-center justify-between h-20">
        <Link
          to="/"
          data-testid="nav-logo"
          className="flex items-baseline gap-2 group"
        >
          <span className={`font-serif-display text-2xl tracking-tight transition-colors duration-300 ${scrolled ? "text-[#2C2A28] group-hover:text-[#8C4A32]" : "text-[#F9F6F0] group-hover:text-[#C8A07A]"}`}>
            Oak <span className="italic text-[#8C4A32]">&amp;</span> Iron
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-10">
          {links.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              end={l.to === "/"}
              data-testid={l.testid}
              className={({ isActive }) =>
                `nav-link label-eyebrow transition-colors ${scrolled ? "text-[#2C2A28] hover:text-[#8C4A32]" : "text-[#F9F6F0] hover:text-[#C8A07A]"} ${
                  isActive ? "active" : ""
                }`
              }
            >
              {l.label}
            </NavLink>
          ))}
        </nav>

        <Link
          to="/contact"
          data-testid="nav-commission-cta"
          className="hidden md:inline-flex items-center px-6 py-2.5 bg-[#2C2A28] text-[#F9F6F0] label-eyebrow hover:bg-[#8C4A32] transition-colors duration-300"
        >
          Commission a Piece
        </Link>

        <button
          data-testid="nav-mobile-toggle"
          onClick={() => setOpen((v) => !v)}
          className="md:hidden p-2 text-[#2C2A28]"
          aria-label="Toggle menu"
        >
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {open && (
        <div
          data-testid="nav-mobile-panel"
          className="md:hidden bg-[#F9F6F0] border-t border-[#E3DACD] px-6 py-6 flex flex-col gap-5"
        >
          {links.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              end={l.to === "/"}
              data-testid={`${l.testid}-mobile`}
              className="label-eyebrow text-[#2C2A28]"
            >
              {l.label}
            </NavLink>
          ))}
          <Link
            to="/contact"
            data-testid="nav-commission-cta-mobile"
            className="inline-flex items-center justify-center px-6 py-3 bg-[#2C2A28] text-[#F9F6F0] label-eyebrow"
          >
            Commission a Piece
          </Link>
        </div>
      )}
    </header>
  );
}
