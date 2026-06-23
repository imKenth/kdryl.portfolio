const CLOUDINARY_CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
const CLOUDINARY_UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

export type UploadProgressHandler = (progress: number) => void;

if (!CLOUDINARY_CLOUD_NAME || !CLOUDINARY_UPLOAD_PRESET) {
  console.warn(
    "Cloudinary environment variables are missing. Set VITE_CLOUDINARY_CLOUD_NAME and VITE_CLOUDINARY_UPLOAD_PRESET."
  );
}

export async function uploadImage(
  file: File,
  onProgress?: UploadProgressHandler
): Promise<string> {
  if (!CLOUDINARY_CLOUD_NAME || !CLOUDINARY_UPLOAD_PRESET) {
    throw new Error("Cloudinary config is missing.");
  }

  const url = `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/auto/upload`;
  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", CLOUDINARY_UPLOAD_PRESET);

  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open("POST", url);

    xhr.upload.onprogress = (event) => {
      if (event.lengthComputable && onProgress) {
        onProgress(Math.round((event.loaded / event.total) * 100));
      }
    };

    xhr.onload = () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        try {
          const response = JSON.parse(xhr.responseText);
          resolve(response.secure_url);
        } catch (error) {
          reject(new Error("Unexpected Cloudinary response."));
        }
      } else {
        reject(new Error(`Cloudinary upload failed with status ${xhr.status}.`));
      }
    };

    xhr.onerror = () => {
      reject(new Error("Network error during Cloudinary upload."));
    };

    xhr.send(formData);
  });
}

export function optimizeCloudinaryUrl(
  imageUrl: string,
  width = 720,
  height = 480
): string {
  if (!imageUrl.includes("/upload/")) {
    return imageUrl;
  }

  const [prefix, suffix] = imageUrl.split("/upload/");
  const transformation = `upload/f_auto,q_auto,c_fill,w_${width},h_${height}`;
  return `${prefix}/${transformation}/${suffix}`;
}

export const defaultProfileImage =
  import.meta.env.VITE_CLOUDINARY_PROFILE_IMAGE ||
  "https://res.cloudinary.com/do0pueye3/image/upload/v1781929829/fe43e6b1-1cea-4adf-8c63-ac1015168edb_dlzrje.jpg";
