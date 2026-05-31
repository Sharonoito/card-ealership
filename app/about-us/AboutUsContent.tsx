"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  CheckCircle,
  Users,
  Wrench,
  Search,
  ShieldCheck,
  HeartHandshake,
  Award,
  Star,
  Quote,
} from "lucide-react";

/* ------------------------------------------------------------------ */
/*  DATA                                                               */
/* ------------------------------------------------------------------ */

const coreValues = [
  {
    label: "Quality",
    desc: "Every vehicle is carefully inspected and sourced to meet high standards.",
  },
  {
    label: "Transparency",
    desc: "We believe in honest pricing, clear history, and open communication.",
  },
  {
    label: "Affordability",
    desc: "Competitive pricing that makes quality vehicles accessible to everyone.",
  },
  {
    label: "Reliability",
    desc: "Vehicles you can count on, backed by thorough vetting and support.",
  },
  {
    label: "Customer Satisfaction",
    desc: "Your experience drives everything we do, from search to after-sale care.",
  },
];

const services = [
  {
    label: "Sale of Quality Used Vehicles",
    desc: "Handpicked inventory with verified history and condition reports.",
  },
  {
    label: "Vehicle Sourcing",
    desc: "We find vehicles that match your needs, preferences, and budget.",
  },
  {
    label: "Purchase Advice",
    desc: "Expert guidance to help you make informed, confident decisions.",
  },
  {
    label: "Prepurchase Inspections",
    desc: "We encourage and support third-party inspections for peace of mind.",
  },
  {
    label: "Maintenance Connections",
    desc: "Trusted referrals to reliable service providers after your purchase.",
  },
];

const directors = [
  {
    name: "Marcus Kinyua",
    title: "Director, NovaShift Auto Dealers LLC",
    bio: "Marcus Kinyua is a seasoned business leader, entrepreneur, and financial strategist with extensive experience in business development, operations management, and customer relations. At NovaShift Auto Dealers LLC, he provides strategic leadership focused on delivering quality vehicles, trusted service, and innovative solutions within the automotive industry. With a strong background in finance, compliance, and entrepreneurship, he has successfully led and managed businesses across multiple sectors, including automotive, training, immigration support services, financial services, and fleet management. His leadership is built on professionalism, integrity, and a commitment to excellence.\n\nMarcus holds a Master of Business Administration in Finance from Kenyatta University, a Bachelor of Science in Actuarial Science from Jomo Kenyatta University of Agriculture and Technology, and a Certificate in Immigration Law from Washington Technical Institute. He also serves in leadership roles in Marcus Training Centre & Huduma Services LLC, Sleek Fleet LLC, and Momentum Financial Group LLC.",
    initials: "MK",
    linkedin: "#",
  },
  {
    name: "Johnstone Mwangi",
    title: "Director, NovaShift Auto Dealers LLC",
    bio: "Johnstone Mwangi is an IT student at Green River College with a background that blends technology, entrepreneurship, and hands-on automotive market experience. He also holds an immigration law certification from Washington Technical Institute and has pursued continuing education in AI and LLMs through Highline College. With experience flipping cars in Kenya, he understands the automotive trade from a practical business perspective, including market value assessment, sourcing car parts, and recognizing customer needs. He brings an innovative, solution-driven, and entrepreneurial mindset to the dealership.",
    initials: "JM",
    linkedin: "#",
  },
];

const testimonials = [
  {
    name: "James R.",
    location: "Seattle, WA",
    car: "2018 Honda Accord",
    rating: 5,
    text: "I was dreading the car-buying process, but NovaShift made it genuinely enjoyable. No pressure, no games — just honest answers and a fair price. The Accord I bought was exactly as described, and they even encouraged me to take it to my own mechanic first. That level of transparency is rare.",
  },
  {
    name: "Aisha T.",
    location: "Tacoma, WA",
    car: "2019 Toyota RAV4",
    rating: 5,
    text: "What stood out most was the follow-up. Two weeks after I drove home my RAV4, Marcus called to check how everything was running and offered to connect me with a trusted local shop for routine maintenance. They clearly care about the relationship, not just the sale.",
  },
  {
    name: "David M.",
    location: "Kent, WA",
    car: "Fleet Buyer",
    rating: 5,
    text: "I needed three reliable work vans for my contracting business on short notice. NovaShift sourced them within a week, arranged prepurchase inspections, and negotiated pricing that fit my budget. Their maintenance connections have saved me thousands in downtime since.",
  },
];

/* ------------------------------------------------------------------ */
/*  ANIMATION VARIANTS                                                 */
/* ------------------------------------------------------------------ */

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: "easeOut" as const },
  },
};


const staggerContainer = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.08, delayChildren: 0.1 },
  },
};

const scaleUp = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.6, ease: "easeOut" as const },
  },
};

const slideLeft = {
  hidden: { opacity: 0, x: -60 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.7, ease: "easeOut" as const },
  },
};

const slideRight = {
  hidden: { opacity: 0, x: 60 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.7, ease: "easeOut" as const },
  },
};

const heroStagger = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.15, delayChildren: 0.2 },
  },
};

const heroItem = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease: "easeOut" as const },
  },
};

/* ------------------------------------------------------------------ */
/*  COMPONENT                                                          */
/* ------------------------------------------------------------------ */

export default function AboutUsContent() {
  return (
    <div className="min-h-screen bg-white font-sans selection:bg-[#0071d2]/10">
      {/* ===================== HERO ===================== */}
      <section className="bg-slate-950 pt-32 pb-24 px-6 text-center relative overflow-hidden">
        <motion.div
          className="relative z-10 max-w-4xl mx-auto"
          variants={heroStagger}
          initial="hidden"
          animate="visible"
        >
          <motion.p
            variants={heroItem}
            className="text-[11px] font-black uppercase tracking-[0.6em] text-[#0071d2] mb-6"
          >
            Who We Are
          </motion.p>
          <motion.h1
            variants={heroItem}
            className="text-4xl sm:text-6xl md:text-8xl font-black text-white tracking-tighter leading-[0.9] italic"
          >
            Driven by <br />
            <span className="not-italic text-[#4a9fe6]">Trust & Value.</span>
          </motion.h1>
        </motion.div>

        {/* Animated radial glow */}
        <motion.div
          className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(0,113,210,0.1)_0%,transparent_70%)]"
          animate={{ scale: [1, 1.15, 1], opacity: [0.6, 1, 0.6] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        />
      </section>

      {/* ===================== COMPANY INTRO ===================== */}
      <section className="max-w-4xl mx-auto px-6 py-12 sm:py-24 text-center">
        <motion.p
          className="text-xl md:text-2xl text-slate-600 font-medium leading-relaxed"
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
        >
          NovaShift Auto Dealers LLC is a used car dealership focused on
          providing quality vehicles at affordable prices while maintaining
          transparency, reliability, and customer satisfaction.
        </motion.p>
      </section>

      {/* ===================== MISSION & VISION ===================== */}
      <section className="bg-slate-50 py-24 px-6">
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-16">
          <motion.div
            className="bg-white rounded-[2.5rem] p-10 md:p-14 border border-slate-100 shadow-sm"
            variants={slideLeft}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
          >
            <div className="flex items-center gap-3 mb-6">
              <span className="h-[1px] w-8 bg-[#0071d2]" />
              <p className="text-[10px] font-black uppercase tracking-[0.4em] text-[#0071d2]">
                Mission
              </p>
            </div>
            <p className="text-lg text-slate-600 font-medium leading-relaxed">
              To provide quality cars at affordable prices while delivering
              excellent customer satisfaction through honesty, transparency, and
              dependable service.
            </p>
          </motion.div>

          <motion.div
            className="bg-white rounded-[2.5rem] p-10 md:p-14 border border-slate-100 shadow-sm"
            variants={slideRight}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
          >
            <div className="flex items-center gap-3 mb-6">
              <span className="h-[1px] w-8 bg-[#0071d2]" />
              <p className="text-[10px] font-black uppercase tracking-[0.4em] text-[#0071d2]">
                Vision
              </p>
            </div>
            <p className="text-lg text-slate-600 font-medium leading-relaxed">
              To become a leading used car dealership in the United States known
              for quality, affordability, reliability, and trusted customer
              relationships.
            </p>
          </motion.div>
        </div>
      </section>

      {/* ===================== VALUE PROPOSITION ===================== */}
      <section className="max-w-7xl mx-auto px-6 py-24">
        <motion.div
          className="flex items-center gap-3 mb-8"
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
        >
          <span className="h-[1px] w-8 bg-[#0071d2]" />
          <p className="text-[10px] font-black uppercase tracking-[0.4em] text-[#0071d2]">
            Why Choose Us
          </p>
        </motion.div>

        <motion.h2
          className="text-4xl md:text-5xl font-black text-slate-900 tracking-tighter mb-10"
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
        >
          Value{" "}
          <span className="italic font-serif text-[#0071d2] lowercase">
            Proposition.
          </span>
        </motion.h2>

        <motion.div
          className="bg-[#0071d2]/5 rounded-[2.5rem] p-10 md:p-14 border border-[#0071d2]/10"
          variants={scaleUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
        >
          <p className="text-lg text-slate-700 font-medium leading-relaxed">
            We help individuals and businesses access quality used vehicles with
            confidence. We carefully source vehicles, offer guidance during the
            purchase process, encourage prepurchase inspections, and connect
            customers with reliable maintenance support after purchase. Our goal
            is to offer not just vehicles, but value, trust, and peace of mind.
          </p>
        </motion.div>
      </section>

      {/* ===================== CORE VALUES ===================== */}
      <section className="bg-slate-50 py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <motion.div
            className="flex items-center gap-3 mb-8"
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
          >
            <span className="h-[1px] w-8 bg-[#0071d2]" />
            <p className="text-[10px] font-black uppercase tracking-[0.4em] text-[#0071d2]">
              What We Stand For
            </p>
          </motion.div>

          <motion.h2
            className="text-4xl md:text-5xl font-black text-slate-900 tracking-tighter mb-16"
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
          >
            Core{" "}
            <span className="italic font-serif text-[#0071d2] lowercase">
              Values.
            </span>
          </motion.h2>

          <motion.div
            className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6"
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-60px" }}
          >
            {coreValues.map((item, i) => (
              <motion.div
                key={i}
                variants={fadeUp}
                whileHover={{
                  scale: 1.03,
                  y: -6,
                  boxShadow: "0 20px 40px -12px rgba(0,113,210,0.15)",
                }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                className="bg-white rounded-[2rem] p-8 border border-slate-100 shadow-sm cursor-default"
              >
                <motion.div
                  className="h-10 w-10 rounded-full bg-[#0071d2]/10 flex items-center justify-center text-[#0071d2] mb-5"
                  whileHover={{ rotate: [0, -10, 10, 0], scale: 1.1 }}
                  transition={{ duration: 0.5 }}
                >
                  <CheckCircle size={20} />
                </motion.div>
                <h4 className="text-lg font-black text-slate-900 mb-2">
                  {item.label}
                </h4>
                <p className="text-sm text-slate-500 font-medium leading-relaxed">
                  {item.desc}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ===================== SERVICES ===================== */}
      <section className="max-w-7xl mx-auto px-6 py-24">
        <motion.div
          className="flex items-center gap-3 mb-8"
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
        >
          <span className="h-[1px] w-8 bg-[#0071d2]" />
          <p className="text-[10px] font-black uppercase tracking-[0.4em] text-[#0071d2]">
            What We Offer
          </p>
        </motion.div>

        <motion.h2
          className="text-4xl md:text-5xl font-black text-slate-900 tracking-tighter mb-16"
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
        >
          Our{" "}
          <span className="italic font-serif text-[#0071d2] lowercase">
            Services.
          </span>
        </motion.h2>

        <motion.div
          className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6"
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-60px" }}
        >
          {services.map((item, i) => (
            <motion.div
              key={i}
              variants={fadeUp}
              whileHover={{
                scale: 1.03,
                y: -6,
                backgroundColor: "#ffffff",
                boxShadow: "0 20px 40px -12px rgba(0,113,210,0.12)",
              }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
              className="bg-slate-50 rounded-[2rem] p-8 border border-slate-100 cursor-default"
            >
              <motion.div
                className="h-10 w-10 rounded-full bg-[#0071d2]/10 flex items-center justify-center text-[#0071d2] mb-5"
                whileHover={{ rotate: [0, -10, 10, 0], scale: 1.1 }}
                transition={{ duration: 0.5 }}
              >
                {i === 0 && <Award size={20} />}
                {i === 1 && <Search size={20} />}
                {i === 2 && <HeartHandshake size={20} />}
                {i === 3 && <ShieldCheck size={20} />}
                {i === 4 && <Wrench size={20} />}
              </motion.div>
              <h4 className="text-lg font-black text-slate-900 mb-2">
                {item.label}
              </h4>
              <p className="text-sm text-slate-500 font-medium leading-relaxed">
                {item.desc}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* ===================== DIRECTORS ===================== */}
      <section className="bg-slate-50 py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <motion.div
            className="flex items-center gap-3 mb-8"
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
          >
            <span className="h-[1px] w-8 bg-[#0071d2]" />
            <p className="text-[10px] font-black uppercase tracking-[0.4em] text-[#0071d2]">
              Leadership
            </p>
          </motion.div>

          <motion.h2
            className="text-4xl md:text-5xl font-black text-slate-900 tracking-tighter mb-16"
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
          >
            Meet the{" "}
            <span className="italic font-serif text-[#0071d2] lowercase">
              Directors.
            </span>
          </motion.h2>

          <motion.div
            className="grid md:grid-cols-2 gap-10"
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-60px" }}
          >
            {directors.map((director, i) => (
              <motion.div
                key={i}
                variants={fadeUp}
                whileHover={{
                  y: -8,
                  boxShadow: "0 24px 48px -12px rgba(0,0,0,0.08)",
                }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                className="bg-white rounded-[2.5rem] p-10 md:p-12 border border-slate-100 shadow-sm"
              >
                <div className="flex items-center gap-6 mb-8">
                  <motion.div
                    className="h-20 w-20 rounded-full bg-[#0071d2]/10 flex items-center justify-center text-[#0071d2] text-2xl font-black border-2 border-[#0071d2]/20"
                    whileHover={{ scale: 1.08, rotate: 5 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    {director.initials}
                  </motion.div>
                  <div>
                    <h4 className="text-xl font-black text-slate-900">
                      {director.name}
                    </h4>
                    <p className="text-[10px] font-black uppercase tracking-widest text-[#0071d2] mt-1">
                      {director.title}
                    </p>
                  </div>
                </div>

                <p className="text-sm text-slate-600 font-medium leading-relaxed whitespace-pre-line mb-6">
                  {director.bio}
                </p>

                <a
                  href={director.linkedin}
                  className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-[#0071d2] transition-colors border-b-2 border-slate-100 hover:border-[#0071d2] pb-1"
                >
                  <Users size={14} />
                  LinkedIn Profile
                </a>

                <div className="mt-6 p-4 bg-[#0071d2]/5 rounded-xl border border-[#0071d2]/10">
                  <p className="text-[10px] font-black uppercase tracking-widest text-[#0071d2]">
                    Placeholder — Headshot & LinkedIn link coming soon
                  </p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ===================== TESTIMONIALS ===================== */}
      <section className="max-w-7xl mx-auto px-6 py-24">
        <motion.div
          className="flex items-center gap-3 mb-8"
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
        >
          <span className="h-[1px] w-8 bg-[#0071d2]" />
          <p className="text-[10px] font-black uppercase tracking-[0.4em] text-[#0071d2]">
            Social Proof
          </p>
        </motion.div>

        <motion.h2
          className="text-4xl md:text-5xl font-black text-slate-900 tracking-tighter mb-16"
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
        >
          What People{" "}
          <span className="italic font-serif text-[#0071d2] lowercase">
            Say.
          </span>
        </motion.h2>

        <motion.div
          className="grid md:grid-cols-3 gap-6"
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-60px" }}
        >
          {testimonials.map((t, idx) => (
            <motion.div
              key={idx}
              variants={fadeUp}
              whileHover={{
                y: -8,
                boxShadow: "0 24px 48px -12px rgba(0,113,210,0.12)",
              }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
              className="bg-slate-50 rounded-[2.5rem] p-10 border border-slate-100 text-center relative overflow-hidden"
            >
              {/* Decorative quote background */}
              <motion.div
                className="absolute -top-4 -right-4 text-[#0071d2]/5"
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
              >
                <Quote size={120} />
              </motion.div>

              <div className="relative z-10">
                <motion.div
                  className="h-12 w-12 rounded-full bg-[#0071d2]/10 flex items-center justify-center text-[#0071d2] mx-auto mb-6"
                  whileHover={{ scale: 1.15, rotate: 10 }}
                >
                  <Quote size={24} />
                </motion.div>

                <div className="flex justify-center gap-1 mb-4">
                  {[...Array(t.rating)].map((_, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, scale: 0 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.3 + i * 0.08, type: "spring" }}
                    >
                      <Star size={16} className="text-[#0071d2] fill-[#0071d2]" />
                    </motion.div>
                  ))}
                </div>

                <p className="text-sm text-slate-600 font-medium italic mb-6 leading-relaxed">
                  &ldquo;{t.text}&rdquo;
                </p>

                <motion.div
                  className="h-10 w-10 rounded-full bg-gradient-to-br from-[#0071d2]/20 to-[#4a9fe6]/20 mx-auto mb-3 flex items-center justify-center text-[#0071d2] text-xs font-black"
                  whileHover={{ scale: 1.15 }}
                >
                  {t.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </motion.div>

                <p className="text-xs font-black text-slate-900 uppercase tracking-widest">
                  {t.name}
                </p>
                <p className="text-[10px] text-slate-400 font-medium mt-1">
                  {t.location} &middot; {t.car}
                </p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* ===================== CTA ===================== */}
      <section className="px-6 pb-24">
        <motion.div
          className="max-w-7xl mx-auto rounded-[3rem] bg-slate-950 py-24 px-6 text-center relative overflow-hidden"
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
        >
          <div className="relative z-10 max-w-2xl mx-auto">
            <motion.h2
              className="text-5xl md:text-6xl font-black text-white tracking-tight leading-[1.1] mb-8"
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
            >
              Ready to find your <br />
              <span className="text-[#4a9fe6]">next car?</span>
            </motion.h2>

            <motion.p
              className="text-slate-400 text-lg mb-12 font-medium"
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
            >
              Browse our inventory or get in touch for personalized assistance.
            </motion.p>

            <motion.div
              className="flex flex-col sm:flex-row gap-4 justify-center"
              variants={staggerContainer}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
            >
              <motion.div variants={fadeUp}>
                <Link
                  href="/cars"
                  className="inline-block bg-[#0071d2] text-white px-12 py-5 rounded-full font-black uppercase text-xs tracking-widest hover:bg-[#005ba3] transition-all shadow-xl active:scale-95"
                >
                  Browse Inventory
                </Link>
              </motion.div>

              <motion.div variants={fadeUp}>
                <Link
                  href="/contact-us"
                  className="inline-block bg-white text-slate-950 px-12 py-5 rounded-full font-black uppercase text-xs tracking-widest hover:bg-slate-200 transition-all shadow-xl active:scale-95"
                >
                  Contact Us
                </Link>
              </motion.div>
            </motion.div>
          </div>

          {/* Animated radial glow */}
          <motion.div
            className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(0,113,210,0.08)_0%,transparent_70%)]"
            animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
          />
        </motion.div>
      </section>
    </div>
  );
}
