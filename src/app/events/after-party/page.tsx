// Create this folder path: /src/app/events/after-party
// Create this file: /src/app/events/after-party/page.tsx

import Image from "next/image";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function AfterPartyPage() {
  return (
    <main className="bg-[#C6BACE] min-h-screen">
      
      {/* 1. Hero Section */}
      <section className="relative min-h-[85vh] flex items-center justify-center text-center px-6 py-20 overflow-hidden">
        
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          {/* Replace with your actual AfterParty.jpg later */}
          <Image
            src="/after-party background.jpg"
            alt="After-party Background"
            fill 
            className="object-cover"
            priority 
          />
          {/* Gradient Overlay - Critical for text readability */}
          <div className="absolute inset-0 bg-linear-to-b from-black/70 via-black/50 to-[#C6BACE]"></div>
        </div>
        
        {/* Hero Content */}
        <div className="relative z-10 max-w-5xl mx-auto animate-fade-in-up pt-24">
            
            {/* Back Button */}
            <Link
              href="/#services-preview"
              className="inline-flex items-center text-white/90 hover:text-brand-gold transition-colors mb-8 font-medium backdrop-blur-md bg-black/30 px-5 py-2 rounded-full border border-white/20"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Events
            </Link>

          <h1 className="text-5xl sm:text-7xl md:text-9xl font-extrabold tracking-tighter mb-6 drop-shadow-2xl text-white">
            THE <span className="text-brand-gold">AFTER-PARTY</span>
          </h1>

          <p className="text-2xl sm:text-4xl text-gray-100 mb-10 italic font-light tracking-wide drop-shadow-lg">
            "Where the Night Comes Alive"
          </p>

          <p className="text-lg sm:text-xl text-gray-200 mb-12 max-w-2xl mx-auto leading-relaxed font-medium drop-shadow-md">
            When the main event ends, the real celebration begins. We create high-energy, exclusive environments to keep the momentum going until dawn.
          </p>

          <Link 
            href="/book-event" 
            className="inline-block bg-[#4B3C55] text-white font-bold py-4 px-12 rounded-full text-xl shadow-xl hover:bg-[#4B3C55]/90 hover:scale-105 transition-all duration-300 border border-white/20 backdrop-blur-sm"
          >
            Plan The After-Party
          </Link>
        </div>
      </section>

      {/* 2. Intro/About Section */}
      <section className="py-24 relative z-10">
        <div className="container mx-auto px-6 max-w-6xl grid md:grid-cols-2 gap-16 items-center">
          
          {/* Text Content */}
          <div className="text-left text-[#4B3C55] order-2 md:order-1">
            <div className="inline-block px-4 py-1.5 mb-6 text-xs font-bold tracking-widest text-brand-gold uppercase bg-white/60 rounded-full shadow-sm">
              Late Night Luxe
            </div>

            <h2 className="text-4xl sm:text-6xl font-bold mb-8 text-[#4B3C55] tracking-tight">
              Keep the Vibe <span className="text-brand-gold">Flowing</span>
            </h2>

            <p className="text-xl mb-6 leading-relaxed font-medium">
              The formal ceremonies are done, the ties are loosened, and the heels are off. It's time to let loose. Our after-parties are designed for pure enjoyment and uninhibited fun.
            </p>

            <p className="mb-10 leading-relaxed text-[#4B3C55]/80 text-lg">
              Whether it's a neon-lit dance floor, a cozy acoustic lounge, or a late-night snack bar, we curate the perfect atmosphere to wind down (or turn up) with your closest circle.
            </p>

            <Link 
              href="/gallery" 
              className="group inline-flex items-center text-[#4B3C55] font-bold hover:text-brand-gold transition-colors text-xl"
            >
              View Gallery 
              <span className="ml-2 transform group-hover:translate-x-2 transition-transform">→</span>
            </Link>
          </div>

          {/* Image */}
          <div className="relative group order-1 md:order-2">
            <div className="absolute -inset-4 bg-brand-gold/30 rounded-2xl blur-xl group-hover:bg-brand-gold/50 transition-all duration-500"></div>
            <Image 
              src="/after-party vibes.jpg"
              alt="After-party vibes" 
              width={600}
              height={600}
              className="relative rounded-2xl shadow-2xl w-full object-cover transform group-hover:-translate-y-2 transition-transform duration-500 border-4 border-white/30"
            />
          </div>

        </div>
      </section>


      {/* 3. Features Section */}
      <section className="py-24 relative overflow-hidden bg-white/20 backdrop-blur-sm border-y border-[#4B3C55]/10">
        
        {/* Decorative line */}
        <div className="absolute top-0 left-0 w-full h-px bg-linear-to-r from-transparent via-[#4B3C55]/30 to-transparent"></div>

        <div className="container mx-auto px-6 max-w-7xl text-center relative z-10">
          
          <h2 className="text-4xl sm:text-5xl font-bold mb-6 text-[#4B3C55]">
            The Late Night Edit
          </h2>

          <p className="text-xl text-[#4B3C55]/80 mb-20 max-w-2xl mx-auto">
            Everything you need to keep the party alive.
          </p>

          <div className="grid md:grid-cols-3 gap-10">
            
            {/* Feature 1 */}
            <div className="group bg-[#C6BACE] p-10 rounded-3xl shadow-xl border border-[#4B3C55]/10 hover:border-brand-gold/50 transition-all duration-300 hover:-translate-y-2">
              <div className="w-20 h-20 mx-auto mb-8 bg-white/40 rounded-full flex items-center justify-center group-hover:bg-white/60 transition-colors shadow-inner">
                <span className="text-4xl">🎧</span>
              </div>
              <h3 className="text-2xl font-bold mb-4 text-[#4B3C55]">
                Exclusive DJs
              </h3>
              <p className="text-[#4B3C55]/80 leading-relaxed text-lg">
                Curated playlists and top-tier DJs who know exactly how to read the room and keep everyone moving.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="group bg-[#C6BACE] p-10 rounded-3xl shadow-xl border border-[#4B3C55]/10 hover:border-brand-gold/50 transition-all duration-300 hover:-translate-y-2">
              <div className="w-20 h-20 mx-auto mb-8 bg-white/40 rounded-full flex items-center justify-center group-hover:bg-white/60 transition-colors shadow-inner">
                <span className="text-4xl">🍕</span>
              </div>
              <h3 className="text-2xl font-bold mb-4 text-[#4B3C55]">
                Midnight Snacks
              </h3>
              <p className="text-[#4B3C55]/80 leading-relaxed text-lg">
                Gourmet sliders, pizza stations, or street food carts to fuel the late-night cravings.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="group bg-[#C6BACE] p-10 rounded-3xl shadow-xl border border-[#4B3C55]/10 hover:border-brand-gold/50 transition-all duration-300 hover:-translate-y-2">
              <div className="w-20 h-20 mx-auto mb-8 bg-white/40 rounded-full flex items-center justify-center group-hover:bg-white/60 transition-colors shadow-inner">
                <span className="text-4xl">🍸</span>
              </div>
              <h3 className="text-2xl font-bold mb-4 text-[#4B3C55]">
                Craft Cocktails
              </h3>
              <p className="text-[#4B3C55]/80 leading-relaxed text-lg">
                Bespoke bar menus with signature shots and recovery mocktails for the morning after.
              </p>
            </div>

          </div>

          <div className="flex justify-center mt-20">
            <Link 
              href="/book-event"
              className="
                inline-block 
                bg-[#4B3C55] 
                text-white 
                font-bold 
                py-5 
                px-16 
                rounded-full 
                text-xl
                shadow-2xl 
                hover:shadow-brand-gold/40
                hover:bg-[#4B3C55]/90
                hover:scale-105
                transition-all 
                duration-300
                border border-white/10
              "
            >
              Book An After-Party
            </Link>
          </div>

        </div>
      </section>

    </main>
  );
}