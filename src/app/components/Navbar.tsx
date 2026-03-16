// Overwrite this file at: /src/app/components/Navbar.tsx

"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation"; // Import usePathname and useRouter
import { useSession, signIn, signOut } from "next-auth/react";
import { Menu, X, ChevronDown, LogOut, User, LayoutDashboard, CalendarCheck, HelpCircle } from "lucide-react";

const eventLinks = [
  { href: "/events/birthday", label: "Birthday" },
  { href: "/events/corporate", label: "Corporate" },
  { href: "/events/kitty-party", label: "Kitty Party" },
  { href: "/events/bachelorette", label: "Bachelorette" },
  { href: "/events/fresher", label: "Fresher" },
  { href: "/events/farewell", label: "Farewell" },
  { href: "/events/after-party", label: "After-party" },
];

const weddingLinks = [
  { href: "/events/wedding/engagement", label: "Engagement" },
  { href: "/events/wedding/mehendi", label: "Mehendi" },
  { href: "/events/wedding/sangeet", label: "Sangeet" },
  { href: "/events/wedding/bangle-ceremony", label: "Bangle Ceremony" },
  { href: "/events/wedding/haldi", label: "Haldi" },
  { href: "/events/wedding/lagan-sagai", label: "Lagan Sagai" },
  { href: "/events/wedding/shaadi", label: "Shaadi" },
];

export default function Navbar() {
  const { data: session, status } = useSession();
  const pathname = usePathname(); // Get current path
  const router = useRouter();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isEventsOpen, setIsEventsOpen] = useState(false);
  const [isWeddingOpen, setIsWeddingOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // Check if we are on the gallery page
  const isGalleryPage = pathname === "/gallery";

  // Handle book event button click with login redirect
  const handleBookEvent = () => {
    if (!session) {
      // Redirect to login with callback to /book-event
      router.push("/api/auth/signin?callbackUrl=/book-event");
    } else {
      // Already logged in, go directly to book-event
      router.push("/book-event");
    }
    setIsMobileMenuOpen(false);
  };
  
  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest('[data-profile-menu]')) {
        setIsProfileOpen(false);
      }
      if (!target.closest('[data-events-menu]')) {
        setIsEventsOpen(false);
      }
      if (!target.closest('[data-wedding-menu]')) {
        setIsWeddingOpen(false);
      }
    };
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  const isAdmin = session?.user?.email === (process.env.NEXT_PUBLIC_ADMIN_EMAIL || "harsh.141615@gmail.com");

  // Force dark text/solid background if scrolled OR if on Gallery page
  const useSolidStyle = scrolled || isGalleryPage;

  const renderAuthButtons = () => {
    if (status === "loading") {
      return <div className="h-10 w-24 bg-white/20 rounded-lg animate-pulse"></div>;
    }

    if (session) {
      return (
        <div className="relative" data-profile-menu>
          <button 
            onClick={() => setIsProfileOpen(!isProfileOpen)}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-semibold transition-all duration-300 hover:scale-105 backdrop-blur-sm shadow-md border ${useSolidStyle ? 'text-brand-dark border-transparent hover:bg-brand-gold/20' : 'text-white border-white/30 hover:bg-white/20'}`}
          >
            <User className="w-5 h-5" />
            <span className="hidden md:inline tracking-wide">You</span>
            <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${isProfileOpen ? 'rotate-180' : ''}`} />
          </button>

          {isProfileOpen && (
            <div className="absolute right-0 top-full mt-2 w-60 bg-brand-dark-blue rounded-xl shadow-xl py-3 z-50 border border-gray-700/40 backdrop-blur-lg text-gray-200">
              <div className="px-4 py-2 border-b border-gray-700/60">
                <p className="text-xs text-brand-gold">Signed in as</p>
                <p className="font-medium truncate">{session.user?.email}</p>
              </div>
              {!isAdmin ? (
                <>
                  <Link href="/your-queries" onClick={() => setIsProfileOpen(false)} className="flex items-center space-x-3 px-4 py-2 hover:bg-gray-700/40 transition rounded-md">
                    <HelpCircle className="w-5 h-5 text-brand-gold" />
                    <span>Your Queries</span>
                  </Link>

                  <Link href="/your-bookings" onClick={() => setIsProfileOpen(false)} className="flex items-center space-x-3 px-4 py-2 hover:bg-gray-700/40 transition rounded-md">
                    <CalendarCheck className="w-5 h-5 text-brand-gold" />
                    <span>Your Bookings</span>
                  </Link>
                </>
              ) : (
                <>
                  <Link href="/queries" onClick={() => setIsProfileOpen(false)} className="flex items-center space-x-3 px-4 py-2 text-brand-gold hover:bg-gray-700/40 transition rounded-md font-semibold border-t border-gray-700/60">
                    <LayoutDashboard className="w-5 h-5" />
                    <span>Manage All Queries</span>
                  </Link>

                  <Link href="/bookings" onClick={() => setIsProfileOpen(false)} className="flex items-center space-x-3 px-4 py-2 text-brand-gold hover:bg-gray-700/40 transition rounded-md font-semibold">
                    <CalendarCheck className="w-5 h-5" />
                    <span>Manage All Bookings</span>
                  </Link>
                </>
              )}

              <button
                onClick={() => {
                  signOut();
                  setIsProfileOpen(false);
                }}
                className="w-full text-left flex items-center space-x-3 px-4 py-2 hover:bg-gray-700/40 border-t border-gray-700/60 transition rounded-b-lg"
              >
                <LogOut className="w-5 h-5 text-red-400" />
                <span>Log out</span>
              </button>
            </div>
          )}
        </div>
      );
    }

    return (
      <button
        onClick={() => signIn("google")}
        className={`font-semibold py-2 px-5 rounded-lg transition-all duration-300 hover:scale-105 shadow-md hover:shadow-lg backdrop-blur-sm ${useSolidStyle ? 'bg-brand-dark text-white hover:bg-brand-dark/90' : 'bg-white/20 text-white hover:bg-white/30 border border-white/30'}`}
      >
        Sign-In/Sign-Up
      </button>
    );
  };

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        useSolidStyle 
          ? "bg-[#C6BACE] backdrop-blur-xl border-b border-gray-800/10 shadow-md py-2" 
          : "bg-transparent py-4"
      }`}
    >
      <nav className="container mx-auto px-6 flex justify-between items-center relative">
        {/* Brand Logo */}
        <Link href="/" className="text-2xl font-extrabold tracking-wide transition group">
          <span className={useSolidStyle ? "text-[#4B3C55]" : "text-white"}>IK</span>
          <span className={useSolidStyle ? "text-[#4B3C55]" : "text-brand-gold"}>RR</span>
          <span className={`block text-[10px] font-light tracking-[0.3em] ${useSolidStyle ? "text-[#51435a]" : "text-gray-300"}`}>YOUR STORY OUR STAGE</span>
        </Link>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className={`md:hidden p-2 rounded-lg transition ${useSolidStyle ? 'text-[#4B3C55] hover:bg-gray-200' : 'text-white hover:bg-white/20'}`}
          aria-label="Toggle menu"
        >
          {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center space-x-8 font-medium text-[15px]">
          <Link href="/#home" className={`transition hover:text-brand-gold ${useSolidStyle ? 'text-[#4B3C55]' : 'text-gray-100'}`}>Home</Link>
          <Link href="/#about" className={`transition hover:text-brand-gold ${useSolidStyle ? 'text-[#4B3C55]' : 'text-gray-100'}`}>About</Link>

          {/* Events Dropdown */}
          <div className="relative" data-events-menu>
            <button 
              onClick={() => setIsEventsOpen(!isEventsOpen)}
              className={`flex items-center transition hover:text-brand-gold ${useSolidStyle ? 'text-[#4B3C55]' : 'text-gray-100'}`}
            >
              <span>Events</span>
              <ChevronDown className={`w-4 h-4 ml-1 transition-transform duration-300 ${isEventsOpen ? 'rotate-180' : ''}`} />
            </button>

            {isEventsOpen && (
              <div className="absolute left-0 top-full mt-4 w-max bg-brand-dark-blue rounded-xl shadow-2xl py-3 z-50 flex border border-gray-700/40 backdrop-blur-lg text-gray-200">
                {/* Main Events */}
                <div className="border-r border-gray-700/60">
                  {eventLinks.map((link) => (
                    <Link 
                      key={link.href} 
                      href={link.href} 
                      onClick={() => setIsEventsOpen(false)}
                      className="block px-6 py-2 hover:bg-gray-700/40 rounded-md transition hover:text-brand-gold"
                    >
                      {link.label}
                    </Link>
                  ))}
                </div>

                {/* Wedding sub-menu */}
                <div className="relative" data-wedding-menu>
                  <button 
                    onClick={() => setIsWeddingOpen(!isWeddingOpen)}
                    className="w-full flex justify-between items-center px-6 py-2 hover:bg-gray-700/40 rounded-md transition hover:text-brand-gold"
                  >
                    <span>Wedding</span>
                    <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${isWeddingOpen ? 'rotate-90' : '-rotate-90'}`} />
                  </button>

                  {isWeddingOpen && (
                    <div className="absolute left-full top-0 w-max bg-brand-dark-blue rounded-xl shadow-xl py-3 z-50 border border-gray-700/40 backdrop-blur-lg">
                      {weddingLinks.map((link) => (
                        <Link 
                          key={link.href} 
                          href={link.href} 
                          onClick={() => {
                            setIsWeddingOpen(false);
                            setIsEventsOpen(false);
                          }}
                          className="block px-6 py-2 hover:bg-gray-700/40 rounded-md transition hover:text-brand-gold"
                        >
                          {link.label}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          <Link href="/gallery" className={`transition hover:text-brand-gold ${useSolidStyle ? 'text-[#4B3C55]' : 'text-gray-100'}`}>Gallery</Link>
          <Link href="/#contact" className={`transition hover:text-brand-gold ${useSolidStyle ? 'text-[#4B3C55]' : 'text-gray-100'}`}>Contact</Link>

          {/* Auth / Profile actions (desktop) */}
          <div className={`flex items-center space-x-4 pl-4 ml-4 border-l ${useSolidStyle ? 'border-gray-400/30' : 'border-white/20'}`}>
              <button
              onClick={handleBookEvent}
              className={`font-semibold py-2 px-5 rounded-lg shadow-md hover:shadow-lg hover:scale-105 transition-all duration-300 cursor-pointer ${useSolidStyle ? 'bg-brand-dark text-white hover:bg-brand-dark/90' : 'bg-white/20 text-white hover:bg-white/30 border border-white/30'}`}
            >
              Book Your Event
            </button>
            {renderAuthButtons()}
          </div>
        </div>
      </nav>
      
      {/* Mobile Menu Panel */}
      {isMobileMenuOpen && (
        <div className="md:hidden px-6 pb-6 bg-[#C6BACE] backdrop-blur-xl border-t border-gray-800/10 absolute w-full left-0 shadow-xl top-full">
          <div className="flex flex-col gap-2 pt-4">
            <Link href="/#home" onClick={() => setIsMobileMenuOpen(false)} className="block text-[#4B3C55] py-1 hover:text-brand-gold">Home</Link>
            <Link href="/#about" onClick={() => setIsMobileMenuOpen(false)} className="block text-[#4B3C55] py-1 hover:text-brand-gold">About</Link>

            <div className="pt-2 border-t border-gray-700/20" data-events-menu>
              <button 
                onClick={() => setIsEventsOpen(!isEventsOpen)}
                className="mt-2 font-bold text-[#4B3C55] flex items-center space-x-2"
              >
                <span>Events</span>
                <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${isEventsOpen ? 'rotate-180' : ''}`} />
              </button>
              {isEventsOpen && (
                <div className="pl-2 space-y-1 mt-1">
                  {eventLinks.map((link) => (
                    <Link 
                      key={link.href} 
                      href={link.href} 
                      onClick={() => {
                        setIsMobileMenuOpen(false);
                        setIsEventsOpen(false);
                      }} 
                      className="block text-[#4B3C55] text-sm"
                    >
                      {link.label}
                    </Link>
                  ))}
                </div>
              )}

              <div data-wedding-menu>
                <button 
                  onClick={() => setIsWeddingOpen(!isWeddingOpen)}
                  className="mt-3 font-bold text-[#4B3C55] flex items-center space-x-2"
                >
                  <span>Wedding</span>
                  <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${isWeddingOpen ? 'rotate-180' : ''}`} />
                </button>
                {isWeddingOpen && (
                  <div className="pl-2 space-y-1 mt-1">
                    {weddingLinks.map((link) => (
                      <Link 
                        key={link.href} 
                        href={link.href} 
                        onClick={() => {
                          setIsMobileMenuOpen(false);
                          setIsWeddingOpen(false);
                        }} 
                        className="block text-[#4B3C55] text-sm"
                      >
                        {link.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <Link href="/gallery" onClick={() => setIsMobileMenuOpen(false)} className="block text-[#4B3C55] mt-2">Gallery</Link>
            <Link href="/#contact" onClick={() => setIsMobileMenuOpen(false)} className="block text-[#4B3C55]">Contact</Link>
            
            {session && (
              <>
                <div className="pt-2 border-t border-gray-700/20">
                  {session?.user && (
                    <>
                      <p className="text-xs text-brand-gold mb-2">Signed in as</p>
                      <p className="text-sm font-medium text-[#4B3C55] truncate mb-3">{session.user?.email}</p>
                    </>
                  )}
                  {!isAdmin ? (
                    <>
                      <Link href="/your-queries" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center space-x-2 text-[#4B3C55] py-2 hover:text-brand-gold">
                        <HelpCircle className="w-4 h-4" />
                        <span>Your Queries</span>
                      </Link>
                      <Link href="/your-bookings" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center space-x-2 text-[#4B3C55] py-2 hover:text-brand-gold">
                        <CalendarCheck className="w-4 h-4" />
                        <span>Your Bookings</span>
                      </Link>
                    </>
                  ) : (
                    <>
                      <Link href="/queries" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center space-x-2 text-brand-gold py-2 font-semibold hover:text-brand-gold/80">
                        <LayoutDashboard className="w-4 h-4" />
                        <span>Manage All Queries</span>
                      </Link>
                      <Link href="/bookings" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center space-x-2 text-brand-gold py-2 font-semibold hover:text-brand-gold/80">
                        <CalendarCheck className="w-4 h-4" />
                        <span>Manage All Bookings</span>
                      </Link>
                    </>
                  )}
                  <button
                    onClick={() => {
                      signOut();
                      setIsMobileMenuOpen(false);
                    }}
                    className="flex items-center space-x-2 text-red-500 py-2 mt-2 font-semibold hover:text-red-600 w-full"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Log out</span>
                  </button>
                </div>
              </>
            )}
          </div>

          <div className="flex flex-col gap-3 pt-4 mt-2 border-t border-gray-700/20">
            <button
              onClick={handleBookEvent}
              className="w-full text-center bg-brand-dark-blue text-white font-semibold py-2 px-5 rounded-lg shadow-md hover:bg-brand-dark-blue/90 transition cursor-pointer"
            >
              Book Your Event
            </button>
            <div className="flex justify-center">
              {!session && renderAuthButtons()}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}