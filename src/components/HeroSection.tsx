import { motion } from "framer-motion";
import { doc, onSnapshot } from "firebase/firestore";
import { useEffect, useMemo, useState } from "react";
import { db } from "../lib/firebase";
import { optimizeCloudinaryUrl } from "../utils/cloudinary";

const roles = ["Frontend Developer", "UI/UX Specialist", "React Enthusiast"];

export default function HeroSection() {
  const [profileSrc, setProfileSrc] = useState<string | null>(null);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [currentRoleIndex, setCurrentRoleIndex] = useState(0);
  const [displayText, setDisplayText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    if (!db) return;
    const unsub = onSnapshot(doc(db, "settings", "profile"), (snap: any) => {
      if (snap.exists() && snap.data().imageUrl) {
        setProfileSrc(snap.data().imageUrl);
      }
    });
    return unsub;
  }, []);

  const profileImageUrl = useMemo(
    () => (profileSrc ? optimizeCloudinaryUrl(profileSrc, 360, 360) : null),
    [profileSrc]
  );

  useEffect(() => {
    const currentRole = roles[currentRoleIndex];
    const timeout = window.setTimeout(() => {
      if (isDeleting) {
        setDisplayText(currentRole.slice(0, displayText.length - 1));
      } else {
        setDisplayText(currentRole.slice(0, displayText.length + 1));
      }

      if (!isDeleting && displayText === currentRole) {
        window.setTimeout(() => setIsDeleting(true), 900);
      } else if (isDeleting && displayText === "") {
        setIsDeleting(false);
        setCurrentRoleIndex((prev) => (prev + 1) % roles.length);
      }
    }, isDeleting ? 60 : 120);

    return () => window.clearTimeout(timeout);
  }, [currentRoleIndex, displayText, isDeleting]);

  return (
    <section className="relative overflow-hidden rounded-[2rem] border border-slate-800 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950/90 px-6 py-10 shadow-soft sm:px-10 lg:px-14 lg:py-14">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(59,130,246,0.25),_transparent_35%)] opacity-70" />
      <div className="relative mx-auto flex max-w-6xl flex-col items-center gap-10 text-center text-slate-100 md:flex-row md:items-center md:text-left">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: imageLoaded ? 1 : 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="relative z-10 flex-shrink-0"
        >
          <div className="relative rounded-full border-4 border-brand-500/20 bg-slate-950 p-1 shadow-[0_0_80px_rgba(59,130,246,0.12)]">
            {profileImageUrl && (
              <img
                src={profileImageUrl}
                alt="Profile"
                onLoad={() => setImageLoaded(true)}
                className="h-40 w-40 rounded-full object-cover shadow-2xl ring-4 ring-slate-950"
              />
            )}
            <div className="pointer-events-none absolute inset-0 rounded-full border border-brand-500/40 opacity-0 transition duration-500 group-hover:opacity-100" />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 36 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1, ease: "easeOut" }}
          className="relative z-10 max-w-2xl"
        >
          <p className="text-sm uppercase tracking-[0.28em] text-brand-300">Hi, I’m kdryl.dev</p>
          <h1 className="mt-4 text-4xl font-semibold text-white sm:text-5xl">
            Building polished products with speed, clarity, and thoughtful design.
          </h1>
          <p className="mt-5 text-slate-300 sm:text-lg">
            I design and build modern web applications using React, Vite, Tailwind, and Cloudinary-powered media.
          </p>
          <div className="mt-6 inline-flex items-center gap-3 rounded-full bg-slate-950/80 px-4 py-3 text-sm text-slate-200 shadow-lg shadow-slate-950/20">
            <span className="font-medium text-white">Role:</span>
            <span className="text-brand-300">{displayText}<span className="blinking-cursor">|</span></span>
          </div>
        </motion.div>
      </div>
      <style>
        {`.blinking-cursor { animation: blink 1s step-start infinite; } @keyframes blink { 50% { opacity: 0; } }`}
      </style>
    </section>
  );
}
