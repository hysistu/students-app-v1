import AllProducts from "@/components/landingPage/AllProducts";
import Hero from "@/components/landingPage/Hero";
import SiteFooter from "@/components/landingPage/SiteFooter";
import SiteHeader from "@/components/landingPage/SiteHeader";

export default function Home() {
  return (
    <div className="min-h-screen bg-[#f4f6fb] text-slate-900">
      <SiteHeader />
      <Hero />
      <AllProducts />
      <SiteFooter />
    </div>
  );
}
