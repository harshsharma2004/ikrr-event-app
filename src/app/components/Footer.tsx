// Overwrite this file at: /src/app/components/Footer.tsx
"use client";

import { useState, FormEvent } from 'react';
import { usePathname } from "next/navigation";
import { MapPin, Mail, Phone, Facebook, Instagram, Linkedin } from 'lucide-react';

export default function Footer() {
  const [formStatus, setFormStatus] = useState<string>('');
  const pathname = usePathname();
  const isGalleryPage = pathname === "/gallery";

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setFormStatus('Sending...');

    const formData = new FormData(event.currentTarget);
    const data = {
      name: formData.get('name'),
      email: formData.get('email'),
      phone: formData.get('phone'),
      message: formData.get('message'),
    };

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        setFormStatus('Thank you! Your message has been sent.');
        (event.target as HTMLFormElement).reset();
      } else {
        throw new Error('Form submission failed');
      }
    } catch (error) {
      console.error(error);
      setFormStatus('Error. Please try again or email us directly.');
    }

    setTimeout(() => setFormStatus(''), 5000);
  }

  return (
    // Use the light purple background color from your screenshot (approx #C6BACE or similar)
    // We apply this background to the entire footer section
    <footer 
      id="contact" 
      className="py-16 sm:py-24 bg-[#C6BACE] border-t border-[#4B3C55]/10 transition-colors duration-300"
    >
      <div className="container mx-auto px-6 max-w-6xl">
        
        {/* Conditional Layout Logic:
            - If Gallery Page: Use 'flex-col' to center everything in one column.
            - If Home Page: Use 'grid' to show contact info and form side-by-side.
        */}
        <div className={`${isGalleryPage ? 'flex flex-col items-center text-center' : 'grid md:grid-cols-2 gap-16'}`}>

          {/* Contact Info Section */}
          <div className={isGalleryPage ? 'max-w-2xl' : ''}>
            {/* Heading Style */}
            <h2 className="text-3xl sm:text-4xl font-bold mb-4 text-[#4B3C55]">
              Let's Plan Your <span className="text-[#4B3C55]">Next Event</span>
            </h2>

            <p className="mb-8 text-lg text-[#4B3C55]/80">
              Get in touch for a free consultation. We'd love to hear your story.
            </p>

            {/* Contact Details */}
            <div className={`space-y-6 ${isGalleryPage ? 'flex flex-col items-center' : ''}`}>
              
              <div className="flex items-center space-x-3">
                <span className="text-[#4B3C55]">
                  <Phone className="w-5 h-5" />
                </span>
                <a href="tel:+919910558865" className="text-[#4B3C55] hover:text-[#2D2433] text-lg transition-colors">
                  (91) 99105 58865
                </a>
              </div>

              <div className="flex items-center space-x-3">
                <span className="text-[#4B3C55]">
                  <Mail className="w-5 h-5" />
                </span>
                <a href="mailto:info@ikrr.co.in" className="text-[#4B3C55] hover:text-[#2D2433] text-lg transition-colors">
                  info@ikrr.co.in
                </a>
              </div>

              <div className="flex items-start space-x-3">
                <span className="text-[#4B3C55] mt-1">
                  <MapPin className="w-5 h-5" />
                </span>
                <p className={`text-[#4B3C55] text-lg ${isGalleryPage ? 'text-center' : 'text-left'}`}>
                  123 Event Street, Sector 15<br />
                  Faridabad, Haryana, 121007
                </p>
              </div>

            </div>

            {/* Social Icons */}
            <div className={`flex space-x-6 mt-10 ${isGalleryPage ? 'justify-center' : ''}`}>
              <a href="#" className="text-[#4B3C55]/70 hover:text-[#4B3C55] transition-colors">
                <Facebook className="w-6 h-6" />
              </a>
              <a href="#" className="text-[#4B3C55]/70 hover:text-[#4B3C55] transition-colors">
                <Instagram className="w-6 h-6" />
              </a>
              <a href="#" className="text-[#4B3C55]/70 hover:text-[#4B3C55] transition-colors">
                <Linkedin className="w-6 h-6" />
              </a>
            </div>
          </div>
          
          {/* Contact Form - Hidden on Gallery Page */}
          {!isGalleryPage && (
            <form 
              onSubmit={handleSubmit} 
              // This creates the "card" look: lighter purple bg, rounded corners, shadow
              className="space-y-4 bg-[#DZD3DB] bg-opacity-40 p-8 rounded-2xl shadow-sm"
              style={{ backgroundColor: 'rgba(255, 255, 255, 0.3)' }} 
            >
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-[#4B3C55] mb-1">Full Name</label>
                <input 
                    type="text" 
                    id="name" 
                    name="name" 
                    required 
                    className="w-full px-4 py-2.5 rounded-lg bg-white border-none text-[#4B3C55] focus:outline-none focus:ring-2 focus:ring-[#4B3C55]/20 shadow-sm" 
                />
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-[#4B3C55] mb-1">Email Address</label>
                <input 
                    type="email" 
                    id="email" 
                    name="email" 
                    required 
                    className="w-full px-4 py-2.5 rounded-lg bg-white border-none text-[#4B3C55] focus:outline-none focus:ring-2 focus:ring-[#4B3C55]/20 shadow-sm" 
                />
              </div>
              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-[#4B3C55] mb-1">Phone Number (Optional)</label>
                <input 
                    type="tel" 
                    id="phone" 
                    name="phone" 
                    className="w-full px-4 py-2.5 rounded-lg bg-white border-none text-[#4B3C55] focus:outline-none focus:ring-2 focus:ring-[#4B3C55]/20 shadow-sm" 
                />
              </div>
              <div>
                <label htmlFor="message" className="block text-sm font-medium text-[#4B3C55] mb-1">Your Query</label>
                <textarea 
                    id="message" 
                    name="message" 
                    rows={4} 
                    required 
                    className="w-full px-4 py-2.5 rounded-lg bg-white border-none text-[#4B3C55] focus:outline-none focus:ring-2 focus:ring-[#4B3C55]/20 shadow-sm resize-none"
                ></textarea>
              </div>
              
              <div className="pt-2">
                  <button 
                    type="submit" 
                    className="w-full bg-[#E0D6E4] text-[#4B3C55] font-bold py-3 px-6 rounded-lg hover:bg-[#D4C8D9] transition-colors disabled:opacity-50 shadow-sm" 
                    disabled={formStatus === 'Sending...'}
                    style={{ backgroundColor: 'rgba(255, 255, 255, 0.5)' }}
                  >
                    {formStatus === 'Sending...' ? 'Sending...' : 'Send Message'}
                  </button>
              </div>
              
              {formStatus && (
                <p className={`text-sm text-center mt-2 ${formStatus.startsWith('Error') ? 'text-red-600' : 'text-green-700'}`}>
                  {formStatus}
                </p>
              )}
            </form>
          )}
        </div>
        
        <div className="text-center border-t border-[#4B3C55]/10 pt-8 mt-16 text-[#4B3C55]/60 text-sm">
            <p>&copy; {new Date().getFullYear()} IK Regal Revelry. All Rights Reserved.</p>
        </div>
      </div>
    </footer>
  );
}