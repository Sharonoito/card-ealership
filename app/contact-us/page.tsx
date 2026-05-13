import React from "react";
import { Mail, Phone, MapPin, Clock } from "lucide-react"; // Assuming lucide-react is installed

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-white font-sans selection:bg-[#0071d2]/10">
      {/* Header Section */}
      <section className="pt-32 pb-20 bg-slate-950 text-center relative overflow-hidden">
        <div className="relative z-10 max-w-7xl mx-auto px-6">
          <p className="text-[11px] font-black uppercase tracking-[0.6em] text-[#0071d2] mb-6">
            Get in Touch
          </p>
          <h1 className="text-6xl md:text-8xl font-black text-white tracking-tighter leading-[0.9] italic">
            Connect with <br />
            <span className="not-italic text-[#4a9fe6]">Our Experts.</span>
          </h1>
        </div>
        {/* Subtle background glow */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(16,185,129,0.1)_0%,transparent_70%)]" />
      </section>

      <div className="max-w-7xl mx-auto px-6 py-24">
        <div className="grid lg:grid-cols-2 gap-20 items-start">
          
          {/* Left Column: Contact Info */}
          <div className="space-y-12">
            <div>
              <h2 className="text-3xl font-black tracking-tight text-slate-900 mb-6">
                Direct Channels
              </h2>
              <p className="text-slate-500 font-medium text-lg leading-relaxed">
                Whether you're looking to start a bid or need a market analysis, our team is standing by.
              </p>
            </div>

            <div className="grid sm:grid-cols-2 gap-8">
              <div className="space-y-4">
                <div className="h-12 w-12 rounded-2xl bg-[#0071d2]/5 flex items-center justify-center text-[#005ba3]">
                  <Phone size={24} />
                </div>
                <h4 className="font-black text-slate-900 uppercase text-[10px] tracking-widest">Phone</h4>
                <p className="text-slate-600 font-bold">2069901808</p>
              </div>

              <div className="space-y-4">
                <div className="h-12 w-12 rounded-2xl bg-[#0071d2]/5 flex items-center justify-center text-[#005ba3]">
                  <Mail size={24} />
                </div>
                <h4 className="font-black text-slate-900 uppercase text-[10px] tracking-widest">Email</h4>
                <p className="text-slate-600 font-bold">novashiftautodealersllc@gmail.com</p>
              </div>

              <div className="space-y-4">
                <div className="h-12 w-12 rounded-2xl bg-[#0071d2]/5 flex items-center justify-center text-[#005ba3]">
                  <MapPin size={24} />
                </div>
                <h4 className="font-black text-slate-900 uppercase text-[10px] tracking-widest">Office</h4>
                <p className="text-slate-600 font-bold">1505 S 356TH ST SUITE 114-17</p>
              </div>

              <div className="space-y-4">
                <div className="h-12 w-12 rounded-2xl bg-[#0071d2]/5 flex items-center justify-center text-[#005ba3]">
                  <Clock size={24} />
                </div>
                <h4 className="font-black text-slate-900 uppercase text-[10px] tracking-widest">Hours</h4>
                <p className="text-slate-600 font-bold">MON-FRI 9AM -5PM<br />SAT 10AM- 3PM<br />SUN CLOSED</p>
              </div>
            </div>
          </div>

          {/* Right Column: Refined Form */}
          <div className="bg-slate-50 rounded-[3rem] p-8 md:p-12 border border-slate-100">
            <form className="space-y-8">
              <div className="grid md:grid-cols-2 gap-8">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Full Name</label>
                  <input
                    type="text"
                    placeholder="John Doe"
                    className="w-full bg-white rounded-2xl border-none px-6 py-4 text-slate-900 placeholder:text-slate-300 focus:ring-2 focus:ring-[#0071d2] shadow-sm transition-all"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Email Address</label>
                  <input
                    type="email"
                    placeholder="john@example.com"
                    className="w-full bg-white rounded-2xl border-none px-6 py-4 text-slate-900 placeholder:text-slate-300 focus:ring-2 focus:ring-[#0071d2] shadow-sm transition-all"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Inquiry Type</label>
                <select className="w-full bg-white rounded-2xl border-none px-6 py-4 text-slate-900 focus:ring-2 focus:ring-[#0071d2] shadow-sm transition-all appearance-none">
                  <option>New Vehicle Acquisition</option>
                  <option>Auction Deposit Help</option>
                  <option>Selling a Vehicle</option>
                  <option>General Inquiry</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Your Message</label>
                <textarea
                  rows={5}
                  placeholder="Tell us about the vehicle you're looking for..."
                  className="w-full bg-white rounded-2xl border-none px-6 py-4 text-slate-900 placeholder:text-slate-300 focus:ring-2 focus:ring-[#0071d2] shadow-sm transition-all"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-slate-950 text-white font-black uppercase text-xs tracking-[0.2em] py-5 rounded-2xl hover:bg-[#005ba3] transition-all shadow-xl active:scale-95"
              >
                Send Message
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* FAQ "Flesh" Section */}
      <section className="bg-slate-50 py-32 rounded-[4rem] mx-4 mb-12">
        <div className="max-w-4xl mx-auto px-6">
          <h3 className="text-center text-4xl font-black tracking-tighter text-slate-900 mb-16">
            Common <span className="italic font-serif text-[#0071d2] lowercase">questions</span>
          </h3>
          
          <div className="space-y-6">
            {[
              { q: "How quickly will I hear back?", a: "Our concierge team typically responds within 2-4 business hours." },
              { q: "Can I visit the office in person?", a: "Yes, we welcome visitors at our Federal Way location, though we recommend an appointment for vehicle viewings." },
              { q: "Is there a fee for a consultation?", a: "No. All initial market analysis and consultations are free of charge." }
            ].map((item, i) => (
              <div key={i} className="bg-white p-8 rounded-3xl border border-slate-100">
                <h4 className="font-black text-slate-900 mb-2">{item.q}</h4>
                <p className="text-slate-500 font-medium">{item.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}