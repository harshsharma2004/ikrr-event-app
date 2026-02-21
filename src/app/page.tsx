// Overwrite this file at /src/app/page.tsx
"use client";

import Image from "next/image";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { Upload, Trash2, X } from "lucide-react";

const ADMIN_EMAIL = process.env.NEXT_PUBLIC_ADMIN_EMAIL || "harsh.141615@gmail.com";

export default function HomePage() {
  const { data: session } = useSession();
  const router = useRouter();
  const [aboutImageUrl, setAboutImageUrl] = useState<string | null>(null);
  const [isLoadingAboutImage, setIsLoadingAboutImage] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");

  // Check if user is admin
  useEffect(() => {
    if (session?.user?.email === ADMIN_EMAIL) {
      setIsAdmin(true);
    }
  }, [session]);

  // Fetch the about section image
  useEffect(() => {
    const fetchAboutImage = async () => {
      try {
        setIsLoadingAboutImage(true);
        const response = await fetch("/api/about");
        const data = await response.json();
        setAboutImageUrl(data.imageUrl || null);
      } catch (error) {
        console.error("Error fetching about image:", error);
      } finally {
        setIsLoadingAboutImage(false);
      }
    };

    fetchAboutImage();
  }, []);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setUploadError("Please select a valid image file");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setUploadError("Image size must be less than 5MB");
      return;
    }

    setIsUploading(true);
    setUploadError("");

    try {
      const reader = new FileReader();
      reader.onload = async (event) => {
        const base64Image = event.target?.result as string;

        const response = await fetch("/api/about", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-admin-email": session?.user?.email || "",
          },
          body: JSON.stringify({ imageUrl: base64Image }),
        });

        if (!response.ok) {
          throw new Error("Failed to upload image");
        }

        const data = await response.json();
        setAboutImageUrl(data.imageUrl);
        setShowUploadModal(false);
      };
      reader.readAsDataURL(file);
    } catch (error) {
      setUploadError(
        error instanceof Error ? error.message : "Failed to upload image"
      );
    } finally {
      setIsUploading(false);
    }
  };

  const handleDeleteImage = async () => {
    if (!confirm("Are you sure you want to delete this image?")) return;

    try {
      const response = await fetch("/api/about", {
        method: "DELETE",
        headers: {
          "x-admin-email": session?.user?.email || "",
        },
      });

      if (!response.ok) {
        throw new Error("Failed to delete image");
      }

      setAboutImageUrl(null);
    } catch (error) {
      console.error("Error deleting image:", error);
      alert("Failed to delete image");
    }
  };

  const handleBookEvent = () => {
    if (!session) {
      // Redirect to login with callback to /book-event
      router.push("/api/auth/signin?callbackUrl=/book-event");
    } else {
      // Already logged in, go directly to book-event
      router.push("/book-event");
    }
  };

  return (
    <>
      {/* Hero Section */}
      <section id="home" className="relative min-h-screen flex items-center justify-center text-center px-6 py-20 overflow-hidden">
        
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <Image
            src="/Home.jpeg" 
            alt="Elegant event background"
            fill 
            className="object-cover"
            priority 
          />
          {/* Gradient Overlay - CRITICAL FOR NAV MERGE */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/50 to-brand-dark-blue"></div>
        </div>
        
        {/* Hero Content */}
        <div className="relative z-10 max-w-4xl mx-auto animate-fade-in-up pt-32">
          {/* Heading - White text to match transparent navbar */}
          <h1 className="text-5xl sm:text-6xl md:text-8xl font-bold tracking-tighter mb-6 drop-shadow-2xl text-white">
            IK <span className="text-brand-gold">REGAL REVELRY</span>
          </h1>

          {/* Tagline - Light gray for readability on dark image */}
          <p className="text-2xl sm:text-3xl text-gray-200 mb-8 italic font-light tracking-wide drop-shadow-md">
            "Your Story, Our Stage"
          </p>

          {/* Description - White/Gray */}
          <p className="text-lg sm:text-xl text-gray-100 mb-12 max-w-2xl mx-auto leading-relaxed font-medium drop-shadow-sm">
            Creating unforgettable moments, from heartfelt celebrations and dreamy weddings to seamless corporate events. Your vision, brought to life with artistry.
          </p>

          {/* UPDATED BUTTON: Matches Mobile Navbar styling (Dark Blue bg, White text) */}
          {/* Rounded-2xl makes it "rounder" than the standard image but not fully round */}
          <button 
            onClick={handleBookEvent}
            className="inline-block bg-brand-dark-blue text-white font-bold py-4 px-10 rounded-2xl text-lg shadow-md hover:bg-brand-dark-blue/90 transition-all duration-300 transform hover:scale-105 border border-white/10 backdrop-blur-sm cursor-pointer"
          >
            Book Your Event
          </button>
        </div>
      </section>

     {/* About Us Section */}
<section id="about" className="py-24 sm:py-32 bg-[#C6BACE] relative z-10">
  <div className="container mx-auto px-6 max-w-6xl grid md:grid-cols-2 gap-16 items-center">
    
    <div className="relative group">
      <div className="absolute -inset-4 bg-brand-gold/20 rounded-xl blur-lg group-hover:bg-brand-gold/40 transition-all duration-500"></div>
      
      {isLoadingAboutImage ? (
        <div className="relative rounded-lg shadow-2xl w-full bg-gray-200 h-96 flex items-center justify-center">
          <p className="text-[#4B3C55]">Loading...</p>
        </div>
      ) : aboutImageUrl ? (
        <img 
          src={aboutImageUrl}
          alt="Founders" 
          className="relative rounded-lg shadow-2xl w-full transform group-hover:-translate-y-2 transition-transform duration-500 object-cover"
        />
      ) : (
        <div className="relative rounded-lg shadow-2xl w-full bg-gray-300 h-96 flex flex-col items-center justify-center">
          <img 
            src="https://placehold.co/600x400/1E293B/D4AF37?text=Rajesh+Agnihotri+%26+Indu+Yadav" 
            alt="Founders Rajesh Agnihotri & Indu Yadav" 
            className="relative rounded-lg shadow-2xl w-full transform group-hover:-translate-y-2 transition-transform duration-500"
          />
        </div>
      )}

      {/* Admin Controls */}
      {isAdmin && (
        <div className="absolute bottom-4 right-4 flex gap-2">
          <button
            onClick={() => setShowUploadModal(true)}
            className="bg-brand-gold text-[#4B3C55] p-2 rounded-lg hover:bg-brand-gold/80 transition flex items-center gap-2 font-semibold shadow-lg"
            title="Upload or update image"
          >
            <Upload size={18} />
            <span className="hidden sm:inline">Update</span>
          </button>
          {aboutImageUrl && (
            <button
              onClick={handleDeleteImage}
              className="bg-red-500 text-white p-2 rounded-lg hover:bg-red-600 transition flex items-center gap-2 font-semibold shadow-lg"
              title="Delete image"
            >
              <Trash2 size={18} />
              <span className="hidden sm:inline">Delete</span>
            </button>
          )}
        </div>
      )}
    </div>

    <div className="text-left text-[#4B3C55]">
      <div className="inline-block px-3 py-1 mb-4 text-xs font-semibold tracking-wider text-brand-gold uppercase bg-brand-gold/10 rounded-full">
        Who We Are
      </div>

      <h2 className="text-4xl sm:text-5xl font-bold mb-8 text-[#4B3C55]">
        About <span className="text-brand-gold">IKRR</span>
      </h2>

      <p className="text-lg mb-6 leading-relaxed">
        Founded by 
        <span className="font-semibold text-brand-gold"> Rajesh Agnihotri </span>
        and 
        <span className="font-semibold text-brand-gold"> Indu Yadav </span>, 
        IK Regal Revelry is built on a passion for creating truly memorable experiences.
      </p>

      <p className="mb-8 leading-relaxed text-[#4B3C55]/80">
        With years of experience in planning and execution, our team is dedicated 
        to understanding your unique story and translating it into an event that 
        exceeds all expectations. From the grandest gesture to the smallest detail, 
        we are your partners in celebration.
      </p>

      <Link 
        href="/gallery" 
        className="group inline-flex items-center text-brand-gold font-semibold hover:text-[#4B3C55] transition-colors text-lg"
      >
        See Our Work 
        <span className="ml-2 transform group-hover:translate-x-2 transition-transform">→</span>
      </Link>
    </div>

  </div>
</section>


     {/* Services Section */}
<section id="services-preview" className="py-24 sm:py-32 relative overflow-hidden bg-[#C6BACE]">
  
  {/* Decorative line */}
  <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-brand-gold/40 to-transparent"></div>

  <div className="container mx-auto px-6 max-w-7xl text-center relative z-10">
    
    <h2 className="text-4xl sm:text-5xl font-bold mb-6 text-[#4B3C55]">
      Our Services
    </h2>

    <p className="text-xl text-[#4B3C55]/80 mb-20 max-w-2xl mx-auto">
      We plan and execute a wide range of events, each tailored to your specific needs.
    </p>

    <div className="grid md:grid-cols-3 gap-10">
      
      {/* Service Card 1 */}
      <div className="group bg-[#C6BACE] p-10 rounded-2xl shadow-xl border border-[#4B3C55]/15 hover:border-brand-gold/40 transition-all duration-300 hover:-translate-y-2">
        <div className="w-16 h-16 mx-auto mb-6 bg-brand-gold/10 rounded-full flex items-center justify-center group-hover:bg-brand-gold/20 transition-colors">
          <span className="text-3xl">💍</span>
        </div>
        <h3 className="text-2xl font-bold mb-4 text-[#4B3C55]">
          Wedding Events
        </h3>
        <p className="text-[#4B3C55]/80 leading-relaxed">
          From Engagement and Sangeet to the final Shaadi, we design your perfect multi-day celebration.
        </p>
      </div>

      {/* Service Card 2 */}
      <div className="group bg-[#C6BACE] p-10 rounded-2xl shadow-xl border border-[#4B3C55]/15 hover:border-brand-gold/40 transition-all duration-300 hover:-translate-y-2">
        <div className="w-16 h-16 mx-auto mb-6 bg-brand-gold/10 rounded-full flex items-center justify-center group-hover:bg-brand-gold/20 transition-colors">
          <span className="text-3xl">🤝</span>
        </div>
        <h3 className="text-2xl font-bold mb-4 text-[#4B3C55]">
          Corporate Events
        </h3>
        <p className="text-[#4B3C55]/80 leading-relaxed">
          Launch parties, conferences, and team-building retreats. We deliver professional and impactful gatherings.
        </p>
      </div>

      {/* Service Card 3 */}
      <div className="group bg-[#C6BACE] p-10 rounded-2xl shadow-xl border border-[#4B3C55]/15 hover:border-brand-gold/40 transition-all duration-300 hover:-translate-y-2">
        <div className="w-16 h-16 mx-auto mb-6 bg-brand-gold/10 rounded-full flex items-center justify-center group-hover:bg-brand-gold/20 transition-colors">
          <span className="text-3xl">🎉</span>
        </div>
        <h3 className="text-2xl font-bold mb-4 text-[#4B3C55]">
          Private Parties
        </h3>
        <p className="text-[#4B3C55]/80 leading-relaxed">
          Birthdays, Kitty Parties, Bachelorettes, and more. We make your special day truly unforgettable.
        </p>
      </div>

    </div>

   <div className="flex justify-center mt-12">
  <Link 
    href="/gallery"
    className="
      inline-block 
      bg-white/20 
      text-[#4B3C55] 
      font-semibold 
      py-3 
      px-10 
      rounded-full 
      shadow-md 
      border 
      border-white/30 
      backdrop-blur-md 
      hover:bg-white/30 
      transition-all 
      duration-300
    "
  >
    View Full Gallery
  </Link>
</div>




  </div>
</section>

      {/* Upload Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-2xl max-w-md w-full p-6 animate-fade-in-up">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-[#4B3C55]">Update Founder Image</h2>
              <button
                onClick={() => {
                  setShowUploadModal(false);
                  setUploadError("");
                }}
                className="text-gray-500 hover:text-gray-700"
              >
                <X size={24} />
              </button>
            </div>

            {uploadError && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                {uploadError}
              </div>
            )}

            <div className="space-y-4">
              <label className="block">
                <span className="text-[#4B3C55] font-semibold mb-2 block">
                  Select Image
                </span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  disabled={isUploading}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-gold disabled:opacity-50"
                />
                <p className="text-sm text-gray-500 mt-2">
                  Max file size: 5MB. Recommended: 600x400px
                </p>
              </label>

              <button
                onClick={() => {
                  setShowUploadModal(false);
                  setUploadError("");
                }}
                className="w-full bg-gray-300 text-[#4B3C55] font-semibold py-2 px-4 rounded-lg hover:bg-gray-400 transition disabled:opacity-50"
                disabled={isUploading}
              >
                {isUploading ? "Uploading..." : "Close"}
              </button>
            </div>
          </div>
        </div>
      )}

    </>
  );
}