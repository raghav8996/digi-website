import "@/App.css";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import { useEffect } from "react";

import { AuthProvider } from "@/context/AuthContext";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import AnnouncementMarquee from "@/components/AnnouncementMarquee";
import FloatingWhatsApp from "@/components/FloatingWhatsApp";
import ProtectedRoute from "@/components/ProtectedRoute";

import Home from "@/pages/Home";
import Stores from "@/pages/Stores";
import About from "@/pages/About";
import Contact from "@/pages/Contact";
import AdminLogin from "@/pages/AdminLogin";
import AdminDashboard from "@/pages/AdminDashboard";

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

function PublicLayout({ children }) {
  return (
    <>
      <AnnouncementMarquee />
      <Header />
      <main>{children}</main>
      <Footer />
      <FloatingWhatsApp />
    </>
  );
}

function App() {
  return (
    <HelmetProvider>
      <AuthProvider>
        <div className="App">
          <BrowserRouter>
            <ScrollToTop />
            <Routes>
              <Route
                path="/"
                element={
                  <PublicLayout>
                    <Home />
                  </PublicLayout>
                }
              />
              <Route
                path="/stores"
                element={
                  <PublicLayout>
                    <Stores />
                  </PublicLayout>
                }
              />
              <Route
                path="/about"
                element={
                  <PublicLayout>
                    <About />
                  </PublicLayout>
                }
              />
              <Route
                path="/contact"
                element={
                  <PublicLayout>
                    <Contact />
                  </PublicLayout>
                }
              />
              <Route path="/admin/login" element={<AdminLogin />} />
              <Route
                path="/admin"
                element={
                  <ProtectedRoute>
                    <AdminDashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="*"
                element={
                  <PublicLayout>
                    <div className="min-h-[60vh] flex flex-col items-center justify-center px-5 text-center">
                      <p className="overline">404</p>
                      <h1 className="font-display text-5xl font-black text-white mt-3">
                        Page not found
                      </h1>
                      <p className="text-white/60 mt-3">The page you&apos;re looking for isn&apos;t here.</p>
                      <a
                        href="/"
                        className="mt-8 inline-flex rounded-full px-6 py-3 bg-[#ff007f] text-white font-bold text-sm hover:bg-[#e60073]"
                      >
                        Back to home
                      </a>
                    </div>
                  </PublicLayout>
                }
              />
            </Routes>
          </BrowserRouter>
        </div>
      </AuthProvider>
    </HelmetProvider>
  );
}

export default App;
