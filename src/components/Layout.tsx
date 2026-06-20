import { motion } from "framer-motion";
import { Link, useLocation } from "react-router-dom";

const navItems = [
  { title: "Home", path: "/" },
  { title: "Projects", path: "/projects" },
  { title: "About", path: "/about" },
  { title: "Contact", path: "/contact" },
  { title: "Manage", path: "/manage" }
];

export default function Layout({ children }: { children: React.ReactNode }) {
  const location = useLocation();

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <header className="sticky top-0 z-30 border-b border-slate-800/70 bg-slate-950/95 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4 sm:px-8">
          <Link to="/" className="text-lg font-semibold tracking-wide text-white">
            KENTH DARYL S. VELASCO
          </Link>
          <nav className="flex items-center gap-4 text-sm text-slate-300">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`rounded-full px-4 py-2 transition hover:bg-slate-800 hover:text-white ${
                  location.pathname === item.path ? "bg-slate-800 text-white" : ""
                }`}
              >
                {item.title}
              </Link>
            ))}
          </nav>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-6 py-10 sm:px-8 lg:py-14">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="space-y-10"
        >
          {children}
        </motion.div>
      </main>

      <footer className="border-t border-slate-800/70 bg-slate-950/95 px-6 py-6 text-center text-sm text-slate-500 sm:px-8">
        Built with React, Vite, Tailwind, Firebase, and Framer Motion.
      </footer>
    </div>
  );
}
