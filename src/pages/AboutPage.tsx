import { motion } from "framer-motion";

export default function AboutPage() {
  return (
    <section className="space-y-10">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-3xl"
      >
        <p className="text-sm uppercase tracking-[0.24em] text-slate-500">About me</p>
        <h1 className="text-4xl font-semibold text-white">Creating digital products with thoughtful experiences.</h1>
        <p className="mt-4 text-slate-400 sm:text-lg">
          I am a developer focused on building responsive applications with clean architecture, fast interactions, and polished design systems.
        </p>
      </motion.div>

      <div className="grid gap-8 lg:grid-cols-[0.9fr_0.7fr]">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="rounded-3xl border border-slate-800 bg-slate-900/80 p-8 shadow-soft"
        >
          <h2 className="text-2xl font-semibold text-white">What I do</h2>
          <ul className="mt-6 space-y-4 text-slate-400">
            <li>Designing accessible interfaces with Tailwind CSS and reusable React components.</li>
            <li>Building routing, state, and animation patterns for polished web experiences.</li>
            <li>Connecting cloud media, authentication, and backend services with Firebase.</li>
          </ul>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="rounded-3xl border border-slate-800 bg-slate-900/80 p-8 shadow-soft"
        >
          <h2 className="text-2xl font-semibold text-white">Tools & skills</h2>
          <div className="mt-6 grid gap-3 text-slate-300 sm:grid-cols-2">
            {['React', 'TypeScript', 'Tailwind', 'Firebase', 'Framer Motion', 'Cloudinary', 'Vite', 'SEO'].map((skill) => (
              <span key={skill} className="rounded-2xl bg-slate-950 px-4 py-3 text-sm">
                {skill}
              </span>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
