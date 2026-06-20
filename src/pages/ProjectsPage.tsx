import { motion } from "framer-motion";
import { collection, onSnapshot, orderBy, query } from "firebase/firestore";
import { useEffect, useState } from "react";
import { db } from "../lib/firebase";
import ProjectCard from "../components/ProjectCard";
import { ProjectItem } from "../data/projects";

export default function ProjectsPage() {
  const [projects, setProjects] = useState<ProjectItem[]>([]);
  const [isFirestoreAvailable, setIsFirestoreAvailable] = useState(true);

  useEffect(() => {
    if (!db) {
      setIsFirestoreAvailable(false);
      return;
    }

    const projectsQuery = query(collection(db, "projects"), orderBy("createdAt", "desc"));
    const unsubscribe = onSnapshot(projectsQuery, (snapshot: any) => {
      const items = snapshot.docs.map((doc: any) => ({
        ...(doc.data() as ProjectItem),
      }));
      setProjects(items);
    });

    return unsubscribe;
  }, []);

  return (
    <section className="space-y-10">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <p className="text-sm uppercase tracking-[0.24em] text-slate-500">My work</p>
        <h1 className="text-4xl font-semibold text-white">Projects that blend function and design.</h1>
        <p className="max-w-3xl text-slate-400 sm:text-lg">
          I build fast, maintainable applications with modern stacks, cloud-powered media, and polished UI experiences.
        </p>
      </motion.div>

      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {!isFirestoreAvailable ? (
          <div className="rounded-3xl border border-slate-800 bg-slate-950/90 p-8 text-slate-400">
            Firebase is not configured. Projects cannot be loaded from Firestore.
          </div>
        ) : projects.length === 0 ? (
          <div className="rounded-3xl border border-slate-800 bg-slate-950/90 p-8 text-slate-400">
            No projects found yet. Add one from the Manage page.
          </div>
        ) : (
          projects.map((project, index) => (
            <ProjectCard key={`${project.title}-${index}`} {...project} />
          ))
        )}
      </div>
    </section>
  );
}
