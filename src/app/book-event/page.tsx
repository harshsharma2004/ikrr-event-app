"use client";

import { useState, FormEvent, useRef } from "react";
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import DatePicker from "react-datepicker";
import { ArrowLeft, UploadCloud, X, CalendarIcon } from "lucide-react";
import "react-datepicker/dist/react-datepicker.css";

export default function BookEventPage() {
  const { data: session } = useSession();
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Redirect if not logged in
  if (!session) {
    return redirect("/");
  }

  // --- State for Form Fields ---
  const [eventType, setEventType] = useState<string[]>([]);
  const [otherEventType, setOtherEventType] = useState("");
  const [eventDates, setEventDates] = useState<Array<{ date: Date | null; time: string }>>([{ date: null, time: "" }]);
  const [eventVenue, setEventVenue] = useState("");
  const [attendeeCount, setAttendeeCount] = useState(50);
  const [setupDetails, setSetupDetails] = useState("");
  const [themeDetails, setThemeDetails] = useState("");
  const [avNeeds, setAvNeeds] = useState("");
  const [foodNeeds, setFoodNeeds] = useState("");
  const [brandingNeeds, setBrandingNeeds] = useState("");
  const [brandingFileUrl, setBrandingFileUrl] = useState("");
  const [brandingFileName, setBrandingFileName] = useState("");
  const [budget, setBudget] = useState("");
  const [contactInfo, setContactInfo] = useState({ name: "", email: "", phone: "" });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState("");
  const [uploadingFile, setUploadingFile] = useState(false);

  // Event Options
  const eventOptions = [
    "Birthday", "Wedding", "Corporate", "Kitty Party", 
    "Bachelorette", "Fresher", "Farewell", "After-party"
  ];

  const weddingSubOptions = [
    "Engagement", "Mehendi", "Sangeet", "Bangle Ceremony", 
    "Haldi", "Lagan Sagai", "Shaadi"
  ];

  // Helper to handle checkbox changes
  const handleEventTypeChange = (value: string) => {
    setEventType(prev => 
      prev.includes(value) 
        ? prev.filter(item => item !== value) 
        : [...prev, value]
    );
  };

  // Handle file upload
  const handleFileUpload = async (file: File) => {
    try {
      setUploadingFile(true);
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch("/api/bookings/upload", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to upload file");
      }

      const data = await response.json();
      setBrandingFileUrl(data.fileUrl);
      setBrandingFileName(file.name);
    } catch (error) {
      alert(error instanceof Error ? error.message : "Failed to upload file");
    } finally {
      setUploadingFile(false);
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileUpload(file);
    }
  };

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus("");

    // Validation
    if (!eventType.length) {
      setSubmitStatus("error-validation");
      setIsSubmitting(false);
      return;
    }

    // Filter out empty date entries
    const validDates = eventDates.filter(ed => ed.date !== null);
    if (validDates.length === 0) {
      setSubmitStatus("error-please-add-at-least-one-date");
      setIsSubmitting(false);
      return;
    }

    const formData = {
      eventTypes: eventType.includes("Other") ? [...eventType.filter(e => e !== "Other"), otherEventType] : eventType,
      otherEvent: otherEventType || null,
      eventDates: validDates.map(ed => ed.date?.toISOString() || new Date().toISOString()),
      eventTimes: validDates.map(ed => ed.time || ""),
      eventVenue,
      attendeeCount: parseInt(attendeeCount.toString()),
      setupDetails: setupDetails || null,
      themeDetails: themeDetails || null,
      avNeeds: avNeeds || null,
      foodNeeds: foodNeeds || null,
      brandingNeeds: brandingNeeds || null,
      brandingFileUrl: brandingFileUrl || null,
      budget,
      poc: `${contactInfo.name}|${contactInfo.email}|${contactInfo.phone}`,
    };

    try {
      const response = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setSubmitStatus("success");
        // Reset form
        setEventType([]);
        setOtherEventType("");
        setEventDates([{ date: null, time: "" }]);
        setEventVenue("");
        setAttendeeCount(50);
        setSetupDetails("");
        setThemeDetails("");
        setAvNeeds("");
        setFoodNeeds("");
        setBrandingNeeds("");
        setBrandingFileUrl("");
        setBrandingFileName("");
        setBudget("");
        setContactInfo({ name: "", email: "", phone: "" });
      } else {
        const error = await response.json();
        setSubmitStatus(`error-${error.error}`);
      }
    } catch (error) {
      console.error("Submission error:", error);
      setSubmitStatus("error-network");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main className="min-h-screen bg-[#C6BACE] pt-32 pb-20 px-6">
      <div className="container mx-auto max-w-3xl">
        
        {/* Back Button */}
        <a 
          href="/" 
          className="inline-flex items-center text-[#4B3C55] hover:text-[#2D2433] transition-colors mb-8 font-medium"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          Back to Home
        </a>

        {/* Header */}
        <div className="text-center mb-16 animate-fade-in-up">
          <h1 className="text-4xl sm:text-6xl font-bold text-[#4B3C55] mb-6">
            Book Your Event
          </h1>
          <p className="text-[#4B3C55]/80 text-lg max-w-2xl mx-auto">
            Tell us about your vision. Fill out the details below, and we'll craft the perfect experience for you.
          </p>
        </div>

        {/* Form Container */}
        <form onSubmit={handleSubmit} className="bg-white/40 backdrop-blur-md p-8 sm:p-12 rounded-3xl shadow-xl border border-white/40 space-y-10">

          {/* 1. Event Type */}
          <div className="space-y-4">
            <label className="block text-xl font-bold text-[#4B3C55]">1. What type of event is it?</label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {eventOptions.map(option => (
                <label key={option} className={`cursor-pointer border rounded-lg p-3 text-center transition-all duration-200 font-medium ${eventType.includes(option) ? 'bg-[#4B3C55] text-white border-[#4B3C55]' : 'bg-white/60 text-[#4B3C55] border-[#4B3C55]/30 hover:border-[#4B3C55]'}`}>
                  <input type="checkbox" className="hidden" checked={eventType.includes(option)} onChange={() => handleEventTypeChange(option)} />
                  {option}
                </label>
              ))}
            </div>
            
            {/* Wedding Sub-options (Show if Wedding is selected) */}
            {eventType.includes("Wedding") && (
              <div className="mt-4 p-5 bg-white/50 rounded-xl border border-[#4B3C55]/20">
                <p className="text-sm text-[#4B3C55] mb-3 font-bold uppercase tracking-wider">Select Wedding Events:</p>
                <div className="grid grid-cols-2 gap-3">
                  {weddingSubOptions.map(sub => (
                    <label key={sub} className="flex items-center space-x-2 text-[#4B3C55] cursor-pointer hover:opacity-80">
                      <input 
                        type="checkbox" 
                        className="w-4 h-4 rounded border-[#4B3C55] text-[#4B3C55] focus:ring-[#4B3C55]" 
                        checked={eventType.includes(sub)} 
                        onChange={() => handleEventTypeChange(sub)} 
                      />
                      <span>{sub}</span>
                    </label>
                  ))}
                </div>
              </div>
            )}

            {/* Other Option */}
            <label className={`cursor-pointer border rounded-lg p-3 text-center block transition-all font-medium ${eventType.includes("Other") ? 'bg-[#4B3C55] text-white border-[#4B3C55]' : 'bg-white/60 text-[#4B3C55] border-[#4B3C55]/30 hover:border-[#4B3C55]'}`}>
              <input type="checkbox" className="hidden" checked={eventType.includes("Other")} onChange={() => handleEventTypeChange("Other")} />
              Other
            </label>
            {eventType.includes("Other") && (
              <input 
                type="text" 
                placeholder="Please specify..." 
                className="w-full bg-white/80 border border-[#4B3C55]/30 rounded-lg px-4 py-3 text-[#4B3C55] focus:ring-2 focus:ring-[#4B3C55] outline-none placeholder-[#4B3C55]/50"
                value={otherEventType}
                onChange={(e) => setOtherEventType(e.target.value)}
              />
            )}
          </div>

          {/* 2. Date & Venue */}
          <div className="space-y-4">
            <div>
              <label className="block text-xl font-bold text-[#4B3C55] mb-4">2. Event Dates & Times</label>
              <p className="text-sm text-gray-600 mb-4">Add one or more dates and times for multiple events</p>
              
              <div className="space-y-3">
                {eventDates.map((eventDateTime, index) => (
                  <div key={index} className="flex gap-3">
                    <div className="relative flex-1">
                      <DatePicker 
                        selected={eventDateTime.date} 
                        onChange={(date) => {
                          const newDates = [...eventDates];
                          newDates[index].date = date;
                          setEventDates(newDates);
                        }} 
                        showTimeSelect
                        dateFormat="MMMM d, yyyy h:mm aa"
                        placeholderText="Select date and time"
                        className="w-full bg-white/80 border border-[#4B3C55]/30 rounded-lg px-4 py-3 text-[#4B3C55] focus:ring-2 focus:ring-[#4B3C55] outline-none pl-10 placeholder-[#4B3C55]/50"
                        wrapperClassName="w-full"
                      />
                      <CalendarIcon className="absolute left-3 top-3.5 w-5 h-5 text-[#4B3C55]/70" />
                    </div>
                    
                    {eventDates.length > 1 && (
                      <button
                        type="button"
                        onClick={() => setEventDates(eventDates.filter((_, i) => i !== index))}
                        className="p-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    )}
                  </div>
                ))}
              </div>

              <button
                type="button"
                onClick={() => setEventDates([...eventDates, { date: null, time: "" }])}
                className="mt-3 px-4 py-2 bg-[#4B3C55] text-white rounded-lg hover:bg-[#2D2433] transition-colors font-medium text-sm"
              >
                + Add Another Date
              </button>
            </div>

            <div className="space-y-4">
              <label className="block text-xl font-bold text-[#4B3C55]">Venue</label>
              <input 
                type="text" 
                placeholder="Where is the event?" 
                className="w-full bg-white/80 border border-[#4B3C55]/30 rounded-lg px-4 py-3 text-[#4B3C55] focus:ring-2 focus:ring-[#4B3C55] outline-none placeholder-[#4B3C55]/50"
                value={eventVenue}
                onChange={(e) => setEventVenue(e.target.value)}
              />
            </div>
          </div>

          {/* 3. Attendees */}
          <div className="space-y-4">
            <label className="block text-xl font-bold text-[#4B3C55]">
              3. Expected Guests: <span className="bg-[#4B3C55] text-white px-3 py-1 rounded-full text-lg ml-2">{attendeeCount}</span>
            </label>
            <input 
              type="range" 
              min="10" 
              max="5000" 
              step="10" 
              value={attendeeCount} 
              onChange={(e) => setAttendeeCount(parseInt(e.target.value))}
              className="w-full h-2 bg-white/50 rounded-lg appearance-none cursor-pointer accent-[#4B3C55]"
            />
            <div className="flex justify-between text-xs text-[#4B3C55]/70 font-medium">
              <span>10</span>
              <span>5000+</span>
            </div>
          </div>

          {/* 4. Setup */}
          <div className="space-y-4">
            <label className="block text-xl font-bold text-[#4B3C55]">4. Setup & Arrangements</label>
            <textarea 
              rows={3}
              placeholder="Describe the seating, layout, or specific arrangements needed..." 
              className="w-full bg-white/80 border border-[#4B3C55]/30 rounded-lg px-4 py-3 text-[#4B3C55] focus:ring-2 focus:ring-[#4B3C55] outline-none resize-none placeholder-[#4B3C55]/50"
              value={setupDetails}
              onChange={(e) => setSetupDetails(e.target.value)}
            />
          </div>

          {/* 5. Theme */}
          <div className="space-y-4">
            <label className="block text-xl font-bold text-[#4B3C55]">5. Theme & Decor</label>
            <textarea 
              rows={3}
              placeholder="Any specific color palette, style (e.g., vintage, modern), or floral preferences?" 
              className="w-full bg-white/80 border border-[#4B3C55]/30 rounded-lg px-4 py-3 text-[#4B3C55] focus:ring-2 focus:ring-[#4B3C55] outline-none resize-none placeholder-[#4B3C55]/50"
              value={themeDetails}
              onChange={(e) => setThemeDetails(e.target.value)}
            />
          </div>

          {/* 6. AV/Lighting */}
          <div className="space-y-4">
            <label className="block text-xl font-bold text-[#4B3C55]">6. Audio, Lighting & Stage</label>
            <textarea 
              rows={2}
              placeholder="Do you need a DJ, live band, projector, or spotlighting?" 
              className="w-full bg-white/80 border border-[#4B3C55]/30 rounded-lg px-4 py-3 text-[#4B3C55] focus:ring-2 focus:ring-[#4B3C55] outline-none resize-none placeholder-[#4B3C55]/50"
              value={avNeeds}
              onChange={(e) => setAvNeeds(e.target.value)}
            />
          </div>

          {/* 7. Food */}
          <div className="space-y-4">
            <label className="block text-xl font-bold text-[#4B3C55]">7. Food & Refreshments</label>
            <textarea 
              rows={2}
              placeholder="Buffet, sit-down dinner, cocktail snacks? Veg/Non-veg preferences?" 
              className="w-full bg-white/80 border border-[#4B3C55]/30 rounded-lg px-4 py-3 text-[#4B3C55] focus:ring-2 focus:ring-[#4B3C55] outline-none resize-none placeholder-[#4B3C55]/50"
              value={foodNeeds}
              onChange={(e) => setFoodNeeds(e.target.value)}
            />
          </div>

          {/* 8. Branding */}
          <div className="space-y-4">
            <label className="block text-xl font-bold text-[#4B3C55]">8. Branding & Display</label>
            <textarea 
              rows={2}
              placeholder="Any banners, standees, or custom branding required?" 
              className="w-full bg-white/80 border border-[#4B3C55]/30 rounded-lg px-4 py-3 text-[#4B3C55] focus:ring-2 focus:ring-[#4B3C55] outline-none resize-none placeholder-[#4B3C55]/50"
              value={brandingNeeds}
              onChange={(e) => setBrandingNeeds(e.target.value)}
            />
            
            {/* File Upload Area */}
            {!brandingFileUrl ? (
              <div 
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-[#4B3C55]/30 rounded-lg p-6 text-center cursor-pointer hover:border-[#4B3C55] hover:bg-white/30 transition-all bg-white/20"
              >
                <UploadCloud className="w-8 h-8 text-[#4B3C55]/60 mx-auto mb-2" />
                <p className="text-[#4B3C55]/70 text-sm font-medium">
                  {uploadingFile ? "Uploading..." : "Click to upload reference images (JPEG/PNG/GIF/WebP)"}
                </p>
                <p className="text-[#4B3C55]/50 text-xs mt-1">Max 5MB</p>
                <input 
                  ref={fileInputRef}
                  type="file" 
                  accept="image/jpeg,image/png,image/gif,image/webp"
                  onChange={handleFileInputChange}
                  disabled={uploadingFile}
                  className="hidden" 
                />
              </div>
            ) : (
              <div className="border-2 border-dashed border-green-400/50 rounded-lg p-6 bg-green-50/30 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <UploadCloud className="w-6 h-6 text-green-600" />
                  <div className="text-left">
                    <p className="text-sm font-medium text-green-800">{brandingFileName}</p>
                    <p className="text-xs text-green-700">File uploaded successfully</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setBrandingFileUrl("");
                    setBrandingFileName("");
                  }}
                  className="p-2 text-green-600 hover:bg-green-100 rounded-lg transition"
                >
                  <X size={18} />
                </button>
              </div>
            )}
          </div>

          {/* 9. Budget */}
          <div className="space-y-4">
            <label className="block text-xl font-bold text-[#4B3C55]">9. Budget Expectation</label>
            <input 
              type="text" 
              placeholder="e.g., ₹5,00,000 - ₹10,00,000" 
              className="w-full bg-white/80 border border-[#4B3C55]/30 rounded-lg px-4 py-3 text-[#4B3C55] focus:ring-2 focus:ring-[#4B3C55] outline-none placeholder-[#4B3C55]/50"
              value={budget}
              onChange={(e) => setBudget(e.target.value)}
            />
          </div>

          {/* 10. Contact Info */}
          <div className="space-y-4">
            <label className="block text-xl font-bold text-[#4B3C55]">10. Point of Contact</label>
            <div className="grid md:grid-cols-2 gap-4">
              <input 
                type="text" 
                placeholder="Full Name" 
                required
                className="w-full bg-white/80 border border-[#4B3C55]/30 rounded-lg px-4 py-3 text-[#4B3C55] focus:ring-2 focus:ring-[#4B3C55] outline-none placeholder-[#4B3C55]/50"
                value={contactInfo.name}
                onChange={(e) => setContactInfo({...contactInfo, name: e.target.value})}
              />
              <input 
                type="tel" 
                placeholder="Phone Number" 
                required
                className="w-full bg-white/80 border border-[#4B3C55]/30 rounded-lg px-4 py-3 text-[#4B3C55] focus:ring-2 focus:ring-[#4B3C55] outline-none placeholder-[#4B3C55]/50"
                value={contactInfo.phone}
                onChange={(e) => setContactInfo({...contactInfo, phone: e.target.value})}
              />
              <input 
                type="email" 
                placeholder="Email Address" 
                required
                className="w-full bg-white/80 border border-[#4B3C55]/30 rounded-lg px-4 py-3 text-[#4B3C55] focus:ring-2 focus:ring-[#4B3C55] outline-none md:col-span-2 placeholder-[#4B3C55]/50"
                value={contactInfo.email}
                onChange={(e) => setContactInfo({...contactInfo, email: e.target.value})}
              />
            </div>
          </div>

          {/* Submit Button */}
          <button 
            type="submit" 
            disabled={isSubmitting || uploadingFile}
            className="w-full bg-[#4B3C55] text-white font-bold py-4 px-8 rounded-xl text-xl hover:bg-[#4B3C55]/90 transition-all duration-300 shadow-lg hover:shadow-[#4B3C55]/30 disabled:opacity-50 disabled:cursor-not-allowed transform hover:-translate-y-1"
          >
            {isSubmitting ? "Submitting Request..." : "Submit Booking Request"}
          </button>

          {/* Status Messages */}
          {submitStatus === "success" && (
            <div className="p-4 bg-green-100 border border-green-500 text-green-800 rounded-lg text-center font-medium">
              ✓ Booking submitted successfully! We will contact you shortly.
            </div>
          )}
          {submitStatus === "error-validation" && (
            <div className="p-4 bg-red-100 border border-red-500 text-red-800 rounded-lg text-center font-medium">
              Please select at least one event type.
            </div>
          )}
          {submitStatus.startsWith("error-") && submitStatus !== "error-validation" && (
            <div className="p-4 bg-red-100 border border-red-500 text-red-800 rounded-lg text-center font-medium">
              Something went wrong. Please try again or contact us directly.
            </div>
          )}

        </form>
      </div>
    </main>
  );
}