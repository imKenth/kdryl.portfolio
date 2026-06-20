import { AnimatePresence, motion } from "framer-motion";
import { Routes, Route } from "react-router-dom";
import Seo from "./components/Seo";
import LoadingScreen from "./components/LoadingScreen";
import Layout from "./components/Layout";
import HomePage from "./pages/HomePage";
import ProjectsPage from "./pages/ProjectsPage";
import AboutPage from "./pages/AboutPage";
import ContactPage from "./pages/ContactPage";
import ManageProjectsPage from "./pages/ManageProjectsPage";
import { useEffect, useState } from "react";

const loaderVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
  exit: { opacity: 0 }
};

function App() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timeout = window.setTimeout(() => {
      setLoading(false);
    }, 1200);
    return () => window.clearTimeout(timeout);
  }, []);

  return (
    <>
      <Seo title="My Portfolio" description="A modern developer portfolio with React, Vite, Tailwind CSS, Firebase, and Cloudinary." />
      <Layout>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/projects" element={<ProjectsPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/manage" element={<ManageProjectsPage />} />
          <Route path="*" element={<HomePage />} />
        </Routes>
      </Layout>

      {loading && (
        <div className="fixed inset-0 z-50 bg-slate-950/95 flex items-center justify-center">
          <LoadingScreen />
        </div>
      )}
    </>
  );
}

export default App;
