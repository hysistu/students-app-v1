import type { Metadata } from "next";
import ContactForm from "@/components/contact/ContactForm";
import SiteFooter from "@/components/landingPage/SiteFooter";
import SiteHeader from "@/components/landingPage/SiteHeader";

export const metadata: Metadata = {
  title: "Contact · TechLab",
  description: "Send a message to TechLab",
};

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-[#f4f6fb] text-slate-900">
      <SiteHeader />
      <main className="mx-auto grid max-w-6xl gap-10 px-4 py-12 sm:px-6 lg:grid-cols-[0.9fr_1.1fr] lg:items-start lg:py-16">
        <div>
          <p className="text-sm font-semibold uppercase tracking-wide text-blue-600">
            Contact
          </p>
          <h1 className="mt-2 text-4xl font-bold tracking-tight text-slate-950">
            Send a message
          </h1>
          <p className="mt-4 max-w-md text-slate-600">
            Write to TechLab about the shop, a course, or your account. Use an
            email you check, so a reply can reach you.
          </p>
        </div>
        <ContactForm />
      </main>
      <SiteFooter />
    </div>
  );
}
