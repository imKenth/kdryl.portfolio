export interface ProjectItem {
  title: string;
  description: string;
  tech: string[];
  imageUrls: string[];
  liveUrl: string;
}

export const projects: ProjectItem[] = [
  {
    title: "Design System Studio",
    description: "A polished design system library with dark mode support, animations, and reusable UI patterns.",
    tech: ["React", "TypeScript", "Tailwind", "Framer Motion"],
    imageUrls: [
      "https://res.cloudinary.com/demo/image/upload/w_720,h_480,c_fill/sample.jpg",
      "https://res.cloudinary.com/demo/image/upload/w_720,h_480,c_fill/landscape_nature_sunset_horizon_1730831.jpg",
      "https://res.cloudinary.com/demo/image/upload/w_720,h_480,c_fill/sample_animals.jpg"
    ],
    liveUrl: "https://example.com/design-system"
  },
  {
    title: "Ecommerce Showcase",
    description: "Responsive storefront demo with product filtering, checkout workflows, and cloud media assets.",
    tech: ["React Router", "Firebase", "Cloudinary"],
    imageUrls: [
      "https://res.cloudinary.com/demo/image/upload/w_720,h_480,c_fill/ecommerce.jpg",
      "https://res.cloudinary.com/demo/image/upload/w_720,h_480,c_fill/sample.jpg",
      "https://res.cloudinary.com/demo/image/upload/w_720,h_480,c_fill/couple_sunset_nature_evening_1074226.jpg"
    ],
    liveUrl: "https://example.com/ecommerce-showcase"
  }
];
