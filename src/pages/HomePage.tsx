import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { collection, onSnapshot, orderBy, query, limit } from "firebase/firestore";
import { useEffect, useState } from "react";
import { db } from "../lib/firebase";
import ProjectCard from "../components/ProjectCard";
import HeroSection from "../components/HeroSection";
import { ProjectItem, projects as sampleProjects } from "../data/projects";

export default function HomePage() {
  const [featuredProjects, setFeaturedProjects] = useState<ProjectItem[]>(sampleProjects);

  useEffect(() => {
    if (!db) {
      return;
    }

    const featuredQuery = query(
      collection(db, "projects"),
      orderBy("createdAt", "desc"),
      limit(3)
    );

    const unsubscribe = onSnapshot(featuredQuery, (snapshot: any) => {
      const docs = snapshot.docs.map((doc: any) => {
        const data = doc.data() as ProjectItem & { imageUrl?: string };
        return {
          ...data,
          imageUrls: data.imageUrls || (data.imageUrl ? [data.imageUrl] : []),
        } as ProjectItem;
      });
      if (docs.length > 0) {
        setFeaturedProjects(docs);
      }
    });

    return unsubscribe;
  }, []);

  return (
    <section className="space-y-16">
      <HeroSection />

      <div className="grid gap-10 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
        <motion.div
          initial={{ opacity: 0, x: -24 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7 }}
          className="space-y-6"
        >
          <span className="inline-flex rounded-full bg-brand-500/15 px-4 py-1 text-sm font-medium text-brand-200">
            Full-stack developer & UI enthusiast
          </span>
          <h1 className="text-4xl font-semibold tracking-tight text-white sm:text-5xl">
            Building modern digital experiences with speed and clarity.
          </h1>
          <p className="max-w-2xl text-slate-400 sm:text-lg">
            I create responsive web apps, interactive portfolios, and scalable component systems using modern frontend tooling.
          </p>
          <div className="flex flex-wrap gap-4">
            <Link to="/projects" className="inline-flex items-center justify-center rounded-full bg-brand-500 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-brand-500/20 hover:bg-brand-400">
              View Projects
            </Link>
            <Link to="/contact" className="inline-flex items-center justify-center rounded-full border border-slate-700 bg-slate-900 px-6 py-3 text-sm font-semibold text-slate-200 hover:bg-slate-800">
              Contact Me
            </Link>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 24 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7 }}
          className="rounded-[2rem] border border-slate-800 bg-slate-900/80 p-8 shadow-soft"
        >
          <div className="space-y-5">
            <div className="rounded-3xl bg-slate-950 p-6">
              <p className="text-sm uppercase tracking-[0.24em] text-slate-500">Current focus</p>
              <h2 className="mt-3 text-2xl font-semibold text-white">Crafting scalable interfaces</h2>
              <p className="mt-2 text-slate-400">Designing accessible, animated, and SEO-friendly experiences with reusable components and fast performance.</p>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-3xl bg-slate-950 p-5">
                <p className="text-sm text-slate-400">Frameworks</p>
                <p className="mt-2 text-lg font-semibold text-white">React + Vite</p>
              </div>
              <div className="rounded-3xl bg-slate-950 p-5">
                <p className="text-sm text-slate-400">Tools</p>
                <p className="mt-2 text-lg font-semibold text-white">Tailwind + Framer Motion</p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      <div className="space-y-8">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-sm uppercase tracking-[0.24em] text-slate-500">Featured projects</p>
            <h2 className="mt-2 text-3xl font-semibold text-white">Selected work</h2>
          </div>
          <Link to="/projects" className="text-sm font-semibold text-brand-400 hover:text-brand-300">
            Explore all projects
          </Link>
        </div>
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {featuredProjects.map((project) => (
            <ProjectCard key={project.title} {...project} />
          ))}
        </div>
      </div>
    </section>
  );
}
