import { motion } from "framer-motion";

export default function ContactPage() {
  return (
    <section className="space-y-10">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-3xl"
      >
        <p className="text-sm uppercase tracking-[0.24em] text-slate-500">Contact</p>
        <h1 className="text-4xl font-semibold text-white">Let&apos;s turn your next idea into a polished product.</h1>
        <p className="mt-4 text-slate-400 sm:text-lg">
          I'm available for freelance work, collaborations, and building thoughtful digital products. Reach out and let's talk.
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
        className="rounded-3xl border border-slate-800 bg-slate-900/80 p-8 shadow-soft"
      >
        <div className="space-y-6">
          <div>
            <h2 className="text-2xl font-semibold text-white">Get in touch</h2>
            <p className="mt-2 text-slate-400">Send an email or connect through any of the links below.</p>
          </div>
          <div className="space-y-4 text-slate-200">
            <p>
              <span className="font-semibold text-white">Email:</span> kenthdarylsv@example.com
            </p>
            <p>
              <span className="font-semibold text-white">Location:</span> Remote / Worldwide
            </p>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            {['LinkedIn', 'GitHub', 'Twitter', 'Dribbble'].map((item) => (
              <a
                key={item}
                href="#"
                className="rounded-2xl border border-slate-800 bg-slate-950 px-5 py-4 text-center text-sm font-medium text-slate-200 hover:border-brand-500 hover:text-brand-300"
              >
                {item}
              </a>
            ))}
          </div>
        </div>
      </motion.div>
    </section>
  );
}
