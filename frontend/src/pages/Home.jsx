import { Link } from "react-router-dom";
import { ArrowRight, ArrowUpRight } from "lucide-react";

const HERO_IMG = "https://customer-assets.emergentagent.com/job_timber-works-9/artifacts/m8730dla_IMG_2813.jpg";
const WORKSHOP_IMG = "https://images.pexels.com/photos/14951839/pexels-photo-14951839.jpeg";

export default function Home() {
  return (
    <div data-testid="home-page">
      {/* Hero */}
      <section
        data-testid="hero-section"
        className="relative h-[92vh] min-h-[600px] w-full overflow-hidden"
      >
        <img
          src={HERO_IMG}
          alt="A handcrafted wooden harp on a workbench in Hutto, Texas"
          className="absolute inset-0 w-full h-full object-cover ken-burns"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#1a1816]/85 via-[#1a1816]/55 to-transparent" />
        <div className="relative z-10 max-w-7xl mx-auto px-6 sm:px-12 h-full flex flex-col justify-end pb-24">
          <div className="max-w-2xl fade-up">
            <p className="label-eyebrow text-[#C8A07A] mb-6">
              Hutto, TX — Est. 2025
            </p>
            <h1 className="font-serif-display text-5xl sm:text-6xl lg:text-7xl text-[#F9F6F0] leading-[0.95] tracking-tight">
              Built by hand.
              <br />
              <span className="italic text-[#C8A07A]">Built to last.</span>
            </h1>
            <p className="mt-8 text-lg text-[#E3DACD] max-w-xl leading-relaxed">
              Hand-built pieces using traditional joinery and American
              hardwoods. One bench. One pair of hands. One piece at a time.
            </p>
            <div className="mt-10 flex flex-wrap items-center gap-4">
              <Link
                to="/portfolio"
                data-testid="hero-shop-cta"
                className="inline-flex items-center gap-2 px-8 py-4 bg-[#F9F6F0] text-[#2C2A28] label-eyebrow hover:bg-[#C8A07A] transition-colors duration-300"
              >
                See the Work <ArrowRight size={16} />
              </Link>
              <Link
                to="/contact"
                data-testid="hero-contact-cta"
                className="inline-flex items-center gap-2 px-8 py-4 border border-[#F9F6F0]/70 text-[#F9F6F0] label-eyebrow hover:bg-[#F9F6F0] hover:text-[#2C2A28] transition-colors duration-300"
              >
                Contact Here <ArrowUpRight size={16} />
              </Link>
            </div>
          </div>
        </div>

        <div className="absolute bottom-6 right-6 sm:right-12 z-10 hidden sm:block">
          <p className="label-eyebrow text-[#C8A07A] writing-mode-vertical text-right">
            Scroll ↓
          </p>
        </div>
      </section>

      {/* Workshop banner removed */}
    </div>
  );
}
