import { useEffect, useState } from "react";
import { addDoc, collection, doc, serverTimestamp, updateDoc } from "firebase/firestore";
import { db } from "../lib/firebase";
import { uploadImage } from "../utils/cloudinary";

export interface ProjectFormValues {
  id?: string;
  title: string;
  description: string;
  tech: string[];
  imageUrls: string[];
  liveUrl: string;
}

interface ProjectFormProps {
  initialValues?: ProjectFormValues;
  onSaved?: () => void;
}

export default function ProjectForm({ initialValues, onSaved }: ProjectFormProps) {
  const [title, setTitle] = useState(initialValues?.title || "");
  const [description, setDescription] = useState(initialValues?.description || "");
  const [tech, setTech] = useState(initialValues?.tech.join(", ") || "");
  const [imageUrls, setImageUrls] = useState<string[]>(initialValues?.imageUrls || []);
  const [liveUrl, setLiveUrl] = useState(initialValues?.liveUrl || "");
  const [files, setFiles] = useState<File[]>([]);
  const [previewUrls, setPreviewUrls] = useState<string[]>(initialValues?.imageUrls || []);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setTitle(initialValues?.title || "");
    setDescription(initialValues?.description || "");
    setTech(initialValues?.tech?.join(", ") || "");
    setImageUrls(initialValues?.imageUrls || []);
    setLiveUrl(initialValues?.liveUrl || "");
    setPreviewUrls(initialValues?.imageUrls || []);
  }, [initialValues]);

  useEffect(() => {
    const objectUrls = files.map((file) => URL.createObjectURL(file));
    setPreviewUrls((prev) => [...objectUrls, ...imageUrls]);

    return () => {
      objectUrls.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [files]);

  useEffect(() => {
    setPreviewUrls([...imageUrls]);
  }, [imageUrls]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = event.target.files;
    if (selectedFiles && selectedFiles.length > 0) {
      setFiles((prev) => [...prev, ...Array.from(selectedFiles)]);
      setError(null);
    }
  };

  const removeNewFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const removeUploadedImage = (index: number) => {
    setImageUrls((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSave = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);

    if (!title.trim() || !description.trim() || !tech.trim()) {
      setError("Title, description, and technologies are required.");
      return;
    }

    setSaving(true);

    try {
      if (!db) throw new Error("Firebase is not configured. Cannot save project.");

      const uploadedUrls: string[] = [];

      for (const file of files) {
        const url = await uploadImage(file, setUploadProgress);
        uploadedUrls.push(url);
      }

      const finalImageUrls = [...imageUrls, ...uploadedUrls];

      const projectData = {
        title: title.trim(),
        description: description.trim(),
        tech: tech.split(",").map((item) => item.trim()).filter(Boolean),
        imageUrls: finalImageUrls,
        liveUrl: liveUrl.trim(),
        updatedAt: serverTimestamp(),
      } as const;

      if (initialValues?.id) {
        const projectRef = doc(db, "projects", initialValues.id);
        await updateDoc(projectRef, projectData);
      } else {
        await addDoc(collection(db, "projects"), {
          ...projectData,
          createdAt: serverTimestamp(),
        });
      }

      setSaving(false);
      setUploadProgress(0);
      setFiles([]);
      onSaved?.();
    } catch (uploadError) {
      setError(
        uploadError instanceof Error
          ? uploadError.message
          : "Could not save the project."
      );
      setSaving(false);
    }
  };

  return (
    <form className="space-y-6 rounded-3xl border border-slate-800 bg-slate-900/75 p-8 shadow-soft" onSubmit={handleSave}>
      <h2 className="text-2xl font-semibold text-white">
        {initialValues?.id ? "Edit project" : "Add new project"}
      </h2>

      <div className="grid gap-4 sm:grid-cols-2">
        <label className="space-y-2 text-sm text-slate-200">
          <span>Project title</span>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-slate-100 outline-none focus:border-brand-500 focus:ring-brand-500/20"
            placeholder="Project name"
          />
        </label>

        <label className="space-y-2 text-sm text-slate-200">
          <span>Live URL</span>
          <input
            type="url"
            value={liveUrl}
            onChange={(e) => setLiveUrl(e.target.value)}
            className="w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-slate-100 outline-none focus:border-brand-500 focus:ring-brand-500/20"
            placeholder="https://example.com"
          />
        </label>
      </div>

      <label className="space-y-2 text-sm text-slate-200 block">
        <span>Project description</span>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={4}
          className="w-full rounded-3xl border border-slate-700 bg-slate-950 px-4 py-3 text-slate-100 outline-none focus:border-brand-500 focus:ring-brand-500/20"
          placeholder="What problem does this project solve?"
        />
      </label>

      <label className="space-y-2 text-sm text-slate-200 block">
        <span>Technologies</span>
        <input
          type="text"
          value={tech}
          onChange={(e) => setTech(e.target.value)}
          className="w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-slate-100 outline-none focus:border-brand-500 focus:ring-brand-500/20"
          placeholder="React, Tailwind, Firebase"
        />
      </label>

      <label className="space-y-2 text-sm text-slate-200 block">
        <span>Project images (you can select multiple)</span>
        <input
          type="file"
          accept="image/*"
          multiple
          onChange={handleFileChange}
          className="file:border-0 file:bg-brand-500 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-white"
        />
      </label>

      {previewUrls.length > 0 && (
        <div className="rounded-3xl border border-slate-800 bg-slate-950 p-4">
          <p className="mb-3 text-sm text-slate-400">Images ({previewUrls.length})</p>
          <div className="grid grid-cols-3 gap-3">
            {previewUrls.map((url, i) => (
              <div key={`${url}-${i}`} className="group relative">
                <img src={url} alt={`Preview ${i + 1}`} className="h-24 w-full rounded-2xl object-cover" />
                <button
                  type="button"
                  onClick={() => {
                    if (i < files.length) removeNewFile(i);
                    else removeUploadedImage(i - files.length);
                  }}
                  className="absolute right-1 top-1 rounded-full bg-black/60 p-1 text-white opacity-0 transition group-hover:opacity-100"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {uploadProgress > 0 && uploadProgress < 100 && (
        <div className="rounded-3xl bg-slate-950 p-3">
          <div className="mb-2 flex items-center justify-between text-sm text-slate-300">
            <span>Upload progress</span>
            <span>{uploadProgress}%</span>
          </div>
          <div className="h-2 overflow-hidden rounded-full bg-slate-800">
            <div className="h-full rounded-full bg-brand-500" style={{ width: `${uploadProgress}%` }} />
          </div>
        </div>
      )}

      {error && <p className="text-sm text-rose-400">{error}</p>}

      <button
        type="submit"
        disabled={saving}
        className="inline-flex items-center justify-center rounded-full bg-brand-500 px-6 py-3 text-sm font-semibold text-white transition hover:bg-brand-400 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {saving ? "Saving..." : "Save project"}
      </button>
    </form>
  );
}
