import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function NotFound() {
  return (
    <>
      <Header />
      <main className="min-h-[70vh] flex flex-col items-center justify-center px-5 text-center">
        <p className="overline">404</p>
        <h1 className="font-display text-5xl font-black text-white mt-3">Page not found</h1>
        <p className="text-white/60 mt-3">The page you&apos;re looking for isn&apos;t here.</p>
        <Link
          href="/"
          className="mt-8 inline-flex rounded-full px-6 py-3 bg-[#ff007f] text-white font-bold text-sm hover:bg-[#e60073] transition-colors"
        >
          Back to home
        </Link>
      </main>
      <Footer />
    </>
  );
}
