// Create this new file at: /src/app/gallery/galleryData.ts

export const categories = [
  "All",
  "Wedding",
  "Corporate",
  "Birthday",
  "Private Party",
  "Kitty Party",
  "Bachelorette",
  "Fresher",
  "Farewell",
  "After-party",
  "Engagement",
  "Mehendi",
  "Sangeet",
  "Haldi",
  "Reception"
];

// Helper to generate placeholder images
const generateImages = (category: string, count: number, startIndex: number) => {
  return Array.from({ length: count }).map((_, i) => ({
    id: startIndex + i,
    src: `https://placehold.co/600x${400 + (i % 3) * 50}/1E293B/D4AF37?text=${category}+${i + 1}`, // Varied heights for masonry feel
    category: category,
    alt: `${category} Event Photo ${i + 1}`,
  }));
};

// Generate 5 images for each category (except 'All')
export const galleryImages = [
  ...generateImages("Wedding", 5, 0),
  ...generateImages("Corporate", 5, 5),
  ...generateImages("Birthday", 5, 10),
  ...generateImages("Private Party", 5, 15),
  ...generateImages("Kitty Party", 5, 20),
  ...generateImages("Bachelorette", 5, 25),
  ...generateImages("Fresher", 5, 30),
  ...generateImages("Farewell", 5, 35),
  ...generateImages("After-party", 5, 40),
  ...generateImages("Engagement", 5, 45),
  ...generateImages("Mehendi", 5, 50),
  ...generateImages("Sangeet", 5, 55),
  ...generateImages("Haldi", 5, 60),
  ...generateImages("Reception", 5, 65),
];