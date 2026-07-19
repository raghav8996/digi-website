import Header from "@/components/Header";
import Footer from "@/components/Footer";
import FloatingWhatsApp from "@/components/FloatingWhatsApp";

export default function PublicLayout({ children }) {
  return (
    <>
      <Header />
      <main>{children}</main>
      <Footer />
      <FloatingWhatsApp />
    </>
  );
}
