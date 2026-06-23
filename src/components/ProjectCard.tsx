import { motion } from "framer-motion";
import { optimizeCloudinaryUrl } from "../utils/cloudinary";
import ImageCarousel from "./ImageCarousel";

interface ProjectCardProps {
  title: string;
  description: string;
  tech: string[];
  imageUrls: string[];
  liveUrl?: string;
}

export default function ProjectCard({ title, description, tech, imageUrls, liveUrl }: ProjectCardProps) {
  const optimizedImages = imageUrls?.length
    ? imageUrls.map((url) => optimizeCloudinaryUrl(url, 720, 480))
    : [];

  return (
    <motion.article
      whileHover={{ y: -6 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className="group rounded-3xl border border-slate-800 bg-slate-900/80 p-6 shadow-soft"
    >
      <ImageCarousel images={optimizedImages} title={title} />
      <div className="mt-6 space-y-3">
        <div className="flex items-center justify-between gap-4">
          <h3 className="text-xl font-semibold text-white">{title}</h3>
          {liveUrl ? (
            <a
              href={liveUrl}
              target="_blank"
              rel="noreferrer"
              className="text-sm text-brand-300 hover:underline"
            >
              Live
            </a>
          ) : null}
        </div>
        <p className="text-slate-400">{description}</p>
        <div className="flex flex-wrap gap-2 pt-2">
          {tech.map((item) => (
            <span key={item} className="rounded-full bg-slate-800 px-3 py-1 text-xs text-slate-300">
              {item}
            </span>
          ))}
        </div>
      </div>
    </motion.article>
  );
}
