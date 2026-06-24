import { doc, onSnapshot, setDoc } from "firebase/firestore";
import { useEffect, useState } from "react";
import { db } from "../lib/firebase";
import { optimizeCloudinaryUrl, uploadImage } from "../utils/cloudinary";

export default function ProfileImageUpload() {
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (!db) return;

    const unsub = onSnapshot(doc(db, "settings", "profile"), (snap: any) => {
      if (snap.exists()) {
        const data = snap.data();
        if (data.imageUrl) setImageUrl(data.imageUrl);
      }
    });

    return unsub;
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (selected) {
      setFile(selected);
      setPreview(URL.createObjectURL(selected));
      setError(null);
      setSuccess(false);
    }
  };

  const handleSave = async () => {
    if (!file) return;
    if (!db) {
      setError("Firebase is not configured.");
      return;
    }

    setSaving(true);
    setError(null);
    setSuccess(false);

    try {
      const url = await uploadImage(file, setUploadProgress);
      await setDoc(doc(db, "settings", "profile"), { imageUrl: url });
      setImageUrl(url);
      setFile(null);
      setPreview(null);
      setUploadProgress(0);
      setSuccess(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="rounded-3xl border border-slate-800 bg-slate-900/75 p-8 shadow-soft">
      <h2 className="text-2xl font-semibold text-white">Profile picture</h2>
      <p className="mt-2 text-sm text-slate-400">
        This image appears on the homepage hero section.
      </p>

      <div className="mt-6 flex items-center gap-6">
        {(preview || imageUrl) && (
          <img
            src={optimizeCloudinaryUrl(preview || imageUrl!, 160, 160)}
            alt="Profile"
            className="h-28 w-28 flex-shrink-0 rounded-full border-4 border-brand-500/20 bg-slate-950 object-cover shadow-soft"
          />
        )}

        <div className="space-y-3">
          <label className="inline-flex cursor-pointer items-center justify-center rounded-full border border-slate-700 bg-slate-950 px-5 py-2 text-sm font-medium text-slate-200 transition hover:bg-slate-800">
            Choose image
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
            />
          </label>

          {preview && (
            <button
              type="button"
              onClick={handleSave}
              disabled={saving}
              className="inline-flex items-center justify-center rounded-full bg-brand-500 px-5 py-2 text-sm font-semibold text-white transition hover:bg-brand-400 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {saving ? "Uploading..." : "Save picture"}
            </button>
          )}
        </div>
      </div>

      {uploadProgress > 0 && uploadProgress < 100 && (
        <div className="mt-4 rounded-2xl bg-slate-950 p-3">
          <div className="mb-1 flex items-center justify-between text-sm text-slate-300">
            <span>Upload progress</span>
            <span>{uploadProgress}%</span>
          </div>
          <div className="h-2 overflow-hidden rounded-full bg-slate-800">
            <div className="h-full rounded-full bg-brand-500" style={{ width: `${uploadProgress}%` }} />
          </div>
        </div>
      )}

      {error && <p className="mt-3 text-sm text-rose-400">{error}</p>}
      {success && <p className="mt-3 text-sm text-emerald-400">Profile picture updated!</p>}
    </div>
  );
}
