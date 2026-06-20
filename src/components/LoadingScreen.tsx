import { motion } from "framer-motion";

export default function LoadingScreen() {
  return (
    <motion.div
      initial={{ scale: 0.96, opacity: 0.3 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="flex flex-col items-center gap-4 rounded-3xl border border-slate-800 bg-slate-900/90 px-10 py-12 shadow-soft"
    >
      <div className="h-20 w-20 rounded-full border-2 border-brand-500 border-t-transparent animate-spin" />
      <div className="text-center text-slate-200">
        <p className="text-xl font-semibold">Launching portfolio...</p>
        <p className="mt-2 text-sm text-slate-400">One moment while the experience loads.</p>
      </div>
    </motion.div>
  );
}
