export interface ProjectItem {
  title: string;
  description: string;
  tech: string[];
  imageUrl: string;
  liveUrl: string;
}

export const projects: ProjectItem[] = [
  {
    title: "Design System Studio",
    description: "A polished design system library with dark mode support, animations, and reusable UI patterns.",
    tech: ["React", "TypeScript", "Tailwind", "Framer Motion"],
    imageUrl: "https://res.cloudinary.com/demo/image/upload/w_720,h_480,c_fill/sample.jpg",
    liveUrl: "https://example.com/design-system"
  },
  {
    title: "Ecommerce Showcase",
    description: "Responsive storefront demo with product filtering, checkout workflows, and cloud media assets.",
    tech: ["React Router", "Firebase", "Cloudinary"],
    imageUrl: "https://res.cloudinary.com/demo/image/upload/w_720,h_480,c_fill/ecommerce.jpg",
    liveUrl: "https://example.com/ecommerce-showcase"
  }
];
