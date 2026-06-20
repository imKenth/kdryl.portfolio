import { collection, onSnapshot, orderBy, query } from "firebase/firestore";
import { useEffect, useState } from "react";
import { db } from "../lib/firebase";
import ProjectCard from "../components/ProjectCard";
import ProjectForm, { ProjectFormValues } from "../components/ProjectForm";

interface FirestoreProject extends ProjectFormValues {
  id: string;
}

export default function ManageProjectsPage() {
  const [projects, setProjects] = useState<FirestoreProject[]>([]);
  const [selectedProject, setSelectedProject] = useState<FirestoreProject | null>(null);

  useEffect(() => {
    if (!db) {
      console.warn("Firebase DB not initialized");
      return;
    }

    const projectQuery = query(collection(db, "projects"), orderBy("createdAt", "desc"));
    const unsubscribe = onSnapshot(
      projectQuery,
      (snapshot: any) => {
        const docs = snapshot.docs.map((doc: any) => {
          const data = doc.data() as ProjectFormValues;
          return {
            id: doc.id,
            title: data.title,
            description: data.description,
            tech: data.tech,
            imageUrl: data.imageUrl,
            liveUrl: data.liveUrl,
          };
        });
        setProjects(docs);
        console.log("Projects loaded:", docs.length);
      },
      (error: any) => {
        console.error("Firestore query error:", error);
      }
    );

    return unsubscribe;
  }, []);

  return (
    <section className="space-y-10">
      <div className="rounded-[2rem] border border-slate-800 bg-slate-950/80 p-8 shadow-soft">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.24em] text-slate-500">Project manager</p>
            <h1 className="text-4xl font-semibold text-white">Create and update portfolio projects</h1>
          </div>
        </div>
      </div>

      <div className="grid gap-10 xl:grid-cols-[1.2fr_0.8fr]">
        <ProjectForm
          initialValues={selectedProject ?? undefined}
          onSaved={() => setSelectedProject(null)}
        />

        <div className="space-y-6">
          <div className="rounded-3xl border border-slate-800 bg-slate-900/80 p-8 shadow-soft">
            <h2 className="text-2xl font-semibold text-white">Recent projects</h2>
            <p className="mt-2 text-slate-400">Edit any item by selecting it from the project list below.</p>
          </div>

          <div className="grid gap-6">
            {projects.length === 0 ? (
              <div className="rounded-3xl border border-slate-800 bg-slate-950/90 p-8 text-slate-400">
                No projects found. Add your first project using the form.
              </div>
            ) : (
              projects.map((project) => (
                <button
                  key={project.id}
                  type="button"
                  onClick={() => setSelectedProject(project)}
                  className="group w-full rounded-3xl border border-slate-800 bg-slate-950/90 p-6 text-left transition hover:border-brand-500"
                >
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <h3 className="text-lg font-semibold text-white">{project.title}</h3>
                      <p className="mt-1 text-sm text-slate-400">{project.tech.join(", ")}</p>
                    </div>
                    <span className="rounded-full bg-slate-800 px-3 py-1 text-xs uppercase tracking-[0.24em] text-slate-400">
                      Edit
                    </span>
                  </div>
                </button>
              ))
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
