import Image from "next/image";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function ShadiPage() {
  return (
    <main className="bg-[#C6BACE] min-h-screen">
      <section className="relative min-h-[85vh] flex items-center justify-center text-center px-6 py-20 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image
            src="/shaadi background.jpg"
            alt="Shaadi Background"
            fill 
            className="object-cover"
            priority 
          />
          <div className="absolute inset-0 bg-linear-to-b from-black/60 via-black/40 to-[#C6BACE]"></div>
        </div>
        
        <div className="relative z-10 max-w-5xl mx-auto animate-fade-in-up pt-24">
          <Link
            href="/#services-preview"
            className="inline-flex items-center text-white/90 hover:text-brand-gold transition-colors mb-8 font-medium backdrop-blur-md bg-black/30 px-5 py-2 rounded-full border border-white/20"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Events
          </Link>

          <h1 className="text-5xl sm:text-7xl md:text-9xl font-extrabold tracking-tighter mb-6 drop-shadow-2xl text-white">
            THE <span className="text-brand-gold">SHAADI</span>
          </h1>

          <p className="text-2xl sm:text-4xl text-gray-100 mb-10 italic font-light tracking-wide drop-shadow-lg">
            "The Grand Union & Celebration"
          </p>

          <p className="text-lg sm:text-xl text-gray-200 mb-12 max-w-2xl mx-auto leading-relaxed font-medium drop-shadow-md">
            The pinnacle of your celebrations! We create magnificent wedding ceremonies combining traditions, elegance, and unforgettable moments.
          </p>

          <Link 
            href="/book-event" 
            className="inline-block bg-[#4B3C55] text-white font-bold py-4 px-12 rounded-full text-xl shadow-xl hover:bg-[#4B3C55]/90 hover:scale-105 transition-all duration-300 border border-white/20 backdrop-blur-sm"
          >
            Plan Your Shaadi
          </Link>
        </div>
      </section>

      {/* 2. Intro/About Section */}
      <section className="py-24 relative z-10">
        <div className="container mx-auto px-6 max-w-6xl grid md:grid-cols-2 gap-16 items-center">
          {/* Text Content */}
          <div className="text-left text-[#4B3C55] order-2 md:order-1">
            <div className="inline-block px-4 py-1.5 mb-6 text-xs font-bold tracking-widest text-brand-gold uppercase bg-white/60 rounded-full shadow-sm">
              The Grand Union
            </div>
            <h2 className="text-4xl sm:text-6xl font-bold mb-8 text-[#4B3C55] tracking-tight">
              Forever <span className="text-brand-gold">Begins</span>
            </h2>
            <p className="text-xl mb-6 leading-relaxed font-medium">
              Your shaadi is the grandest celebration of your love story. It's where two souls unite, two families merge, and countless memories are created in a single magical day.
            </p>
            <p className="mb-10 leading-relaxed text-[#4B3C55]/80 text-lg">
              We bring your vision to life with meticulous planning, stunning decor, flawless execution, and impeccable service. From the sacred mandap to the glittering reception, every moment is crafted to perfection.
            </p>
            <Link href="/gallery" className="group inline-flex items-center text-[#4B3C55] font-bold hover:text-brand-gold transition-colors text-xl">
              View Gallery <span className="ml-2 transform group-hover:translate-x-2 transition-transform">→</span>
            </Link>
          </div>
          {/* Image */}
          <div className="relative group order-1 md:order-2">
            <div className="absolute -inset-4 bg-brand-gold/30 rounded-2xl blur-xl group-hover:bg-brand-gold/50 transition-all duration-500"></div>
            <Image src="/shaadi featured.jpg" alt="Wedding Celebration" width={600} height={600} className="relative rounded-2xl shadow-2xl w-full object-cover transform group-hover:-translate-y-2 transition-transform duration-500 border-4 border-white/30" />
          </div>
        </div>
      </section>

      {/* 3. Features Section */}
      <section className="py-24 relative z-10">
        <div className="container mx-auto px-6 max-w-6xl">
          <h2 className="text-4xl sm:text-5xl font-bold mb-12 text-center text-[#4B3C55]">
            Wedding <span className="text-brand-gold">Highlights</span>
          </h2>

          <div className="grid md:grid-cols-3 gap-10">
            <div className="group bg-[#C6BACE] p-10 rounded-3xl shadow-xl border border-[#4B3C55]/10 hover:border-brand-gold/50 transition-all duration-300 hover:-translate-y-2">
              <div className="w-20 h-20 mx-auto mb-8 bg-white/40 rounded-full flex items-center justify-center group-hover:bg-white/60 transition-colors shadow-inner">
                <span className="text-4xl">💒</span>
              </div>
              <h3 className="text-2xl font-bold mb-4 text-[#4B3C55]">Ceremony Setup</h3>
              <p className="text-[#4B3C55]/80 leading-relaxed text-lg">
                Exquisite mandap design, floral arrangements, and sacred ceremony space setup.
              </p>
            </div>

            <div className="group bg-[#C6BACE] p-10 rounded-3xl shadow-xl border border-[#4B3C55]/10 hover:border-brand-gold/50 transition-all duration-300 hover:-translate-y-2">
              <div className="w-20 h-20 mx-auto mb-8 bg-white/40 rounded-full flex items-center justify-center group-hover:bg-white/60 transition-colors shadow-inner">
                <span className="text-4xl">🎊</span>
              </div>
              <h3 className="text-2xl font-bold mb-4 text-[#4B3C55]">Reception & Catering</h3>
              <p className="text-[#4B3C55]/80 leading-relaxed text-lg">
                Gourmet cuisine, stylish reception decor, and impeccable service for all guests.
              </p>
            </div>

            <div className="group bg-[#C6BACE] p-10 rounded-3xl shadow-xl border border-[#4B3C55]/10 hover:border-brand-gold/50 transition-all duration-300 hover:-translate-y-2">
              <div className="w-20 h-20 mx-auto mb-8 bg-white/40 rounded-full flex items-center justify-center group-hover:bg-white/60 transition-colors shadow-inner">
                <span className="text-4xl">📸</span>
              </div>
              <h3 className="text-2xl font-bold mb-4 text-[#4B3C55]">Memories & Media</h3>
              <p className="text-[#4B3C55]/80 leading-relaxed text-lg">
                Professional photography, videography, and curated moments for your lifetime memories.
              </p>
            </div>
          </div>

          <div className="flex justify-center mt-20">
            <Link 
              href="/book-event"
              className="inline-block bg-[#4B3C55] text-white font-bold py-5 px-16 rounded-full text-xl shadow-2xl hover:shadow-brand-gold/40 hover:bg-[#4B3C55]/90 hover:scale-105 transition-all duration-300 border border-white/10"
            >
              Book Your Shaadi
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
