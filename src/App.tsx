import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";
import {
  Camera, Heart, Sparkles, Users, Video, Plane, Award, Quote,
  Star, MapPin, Mail, Phone, Instagram, Youtube, Music2, MessageCircle,
  X, ChevronLeft, ChevronRight, Check, Menu,
} from "lucide-react";
import heroImg from "./assets/hero.jpg";
import ParticleField from "./components/ParticleField";
import ScrollProgress from "./components/ScrollProgress";
import CursorGlow from "./components/CursorGlow";
import TextReveal from "./components/TextReveal";

/* ---------- Data ---------- */
const NAV = ["Home", "Portfolio", "Services", "About", "Testimonials", "Pricing", "Contact"];

const CATEGORIES = ["All", "Weddings", "Portraits", "Fashion", "Events", "Commercial", "Lifestyle"] as const;
type Cat = typeof CATEGORIES[number];

const PHOTOS: { src: string; cat: Exclude<Cat, "All">; h: number; title: string }[] = [
  { src: "https://images.unsplash.com/photo-1519741497674-611481863552?w=900&q=80", cat: "Weddings", h: 520, title: "The Vow" },
  { src: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=900&q=80", cat: "Portraits", h: 700, title: "Lagos Light" },
  { src: "https://images.unsplash.com/photo-1485518882345-15568b007407?w=900&q=80", cat: "Fashion", h: 600, title: "Atelier" },
  { src: "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=900&q=80", cat: "Events", h: 480, title: "Gala Night" },
  { src: "https://images.unsplash.com/photo-1542038784456-1ea8e935640e?w=900&q=80", cat: "Commercial", h: 560, title: "Brand Story" },
  { src: "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=900&q=80", cat: "Lifestyle", h: 720, title: "Sunday Mood" },
  { src: "https://images.unsplash.com/photo-1583939003579-730e3918a45a?w=900&q=80", cat: "Portraits", h: 540, title: "Glow" },
  { src: "https://images.unsplash.com/photo-1606800052052-a08af7148866?w=900&q=80", cat: "Weddings", h: 660, title: "First Dance" },
  { src: "https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=900&q=80", cat: "Fashion", h: 500, title: "Couture" },
  { src: "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=900&q=80", cat: "Events", h: 620, title: "After Hours" },
  { src: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=900&q=80", cat: "Commercial", h: 540, title: "Product Hero" },
  { src: "https://images.unsplash.com/photo-1502323777036-f29e3972d82f?w=900&q=80", cat: "Lifestyle", h: 580, title: "Morning Rituals" },
];

const SERVICES = [
  { icon: Heart, title: "Wedding Photography", desc: "Cinematic storytelling for your most precious day, from ceremony to last dance." },
  { icon: Sparkles, title: "Event Coverage", desc: "Galas, launches, private celebrations — captured with editorial grace." },
  { icon: Users, title: "Fashion Photography", desc: "Editorial campaigns, lookbooks and runway energy with magazine quality." },
  { icon: Camera, title: "Commercial Shoots", desc: "Brand campaigns, product stories and visual identity for premium labels." },
  { icon: Plane, title: "Drone Photography", desc: "Cinematic aerials revealing Lagos from a perspective few ever see." },
  { icon: Video, title: "Video Production", desc: "Short films, brand reels and wedding cinematography in 4K & 6K." },
];

const STATS = [
  { value: "12+", label: "Years Behind The Lens" },
  { value: "480", label: "Happy Clients" },
  { value: "1.2k", label: "Stories Captured" },
  { value: "27", label: "Awards & Features" },
];

const TESTIMONIALS = [
  { name: "Adaeze Okafor", role: "Bride · Ikoyi", quote: "Every frame felt like a painting. Adé's lens turned our wedding into a film we'll cherish forever.", img: "https://images.unsplash.com/photo-1531123897727-8f129e1688ce?w=200&q=80" },
  { name: "Tomi Adebayo", role: "Creative Director, ÒWÒ", quote: "The most refined commercial work we've shot in West Africa. Light, mood, story — flawless.", img: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&q=80" },
  { name: "Chiamaka Eze", role: "Founder, Maison Eze", quote: "He sees what the rest of us can only feel. Our entire brand identity now lives in his frames.", img: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&q=80" },
];

const PRICING = [
  { name: "Starter", price: "₦450k", tagline: "Intimate sessions", featured: false,
    perks: ["3 hour session", "1 location", "40 retouched images", "Online gallery", "Print release"] },
  { name: "Professional", price: "₦1.2M", tagline: "Most chosen", featured: true,
    perks: ["8 hour coverage", "2 locations", "150 retouched images", "Same-day teasers", "Premium album", "1 assistant photographer"] },
  { name: "Luxury", price: "₦3.5M", tagline: "Full editorial production", featured: false,
    perks: ["Full-day coverage", "Unlimited locations", "400+ retouched images", "Cinematic short film", "Heirloom album", "Drone & lighting crew", "Private preview screening"] },
];

/* ---------- Helpers ---------- */
const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  show: (i = 0) => ({ opacity: 1, y: 0, transition: { delay: i * 0.08, duration: 0.7, ease: [0.22, 1, 0.36, 1] as const } }),
};

/* ---------- Components ---------- */
function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  useEffect(() => {
    const f = () => setScrolled(window.scrollY > 30);
    f(); window.addEventListener("scroll", f); return () => window.removeEventListener("scroll", f);
  }, []);
  return (
    <header className={`fixed top-0 inset-x-0 z-50 transition-all duration-500 ${scrolled ? "py-3 backdrop-blur-xl bg-background/70 border-b border-[color:var(--color-border)]" : "py-6 bg-transparent"}`}>
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
        <a href="#home" className="flex items-center gap-2 group">
          <div className="h-9 w-9 rounded-full border border-gold/40 grid place-items-center gold-glow">
            <Camera className="h-4 w-4 text-gold" />
          </div>
          <div className="leading-tight">
            <div className="font-serif text-lg gold-text">Lumière</div>
            <div className="text-[10px] tracking-[0.3em] text-muted-foreground -mt-0.5">LAGOS</div>
          </div>
        </a>
        <nav className="hidden lg:flex items-center gap-9">
          {NAV.map((n) => (
            <a key={n} href={`#${n.toLowerCase()}`} className="text-sm text-foreground/80 hover:text-gold transition-colors relative group">
              {n}
              <span className="absolute -bottom-1 left-0 h-px w-0 bg-gold transition-all group-hover:w-full" />
            </a>
          ))}
        </nav>
        <a href="#contact" className="hidden lg:inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-gold text-background text-sm font-medium hover:bg-gold-glow transition-colors">
          Book Session
        </a>
        <button onClick={() => setOpen(!open)} className="lg:hidden text-foreground p-2" aria-label="Menu">
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>
      <AnimatePresence>
        {open && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }}
            className="lg:hidden glass mt-3 mx-6 rounded-2xl overflow-hidden">
            <div className="flex flex-col p-6 gap-4">
              {NAV.map((n) => (
                <a key={n} href={`#${n.toLowerCase()}`} onClick={() => setOpen(false)} className="text-sm text-foreground/80 hover:text-gold">{n}</a>
              ))}
              <a href="#contact" onClick={() => setOpen(false)} className="mt-2 px-5 py-2.5 rounded-full bg-gold text-background text-sm font-medium text-center">Book Session</a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}

function Hero() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  return (
    <section ref={ref} id="home" className="relative min-h-screen flex items-center overflow-hidden">
      <motion.div className="absolute inset-0" style={{ y, opacity }}>
        <img src={heroImg} alt="Cinematic luxury portrait" className="h-full w-full object-cover scale-110" />
        <div className="absolute inset-0 bg-gradient-to-r from-background via-background/70 to-background/20" />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-background/60" />
      </motion.div>
      {/* gold film grain */}
      <div className="absolute inset-0 opacity-[0.07] pointer-events-none" style={{ backgroundImage: "radial-gradient(circle at 50% 50%, rgba(212,175,55,0.6), transparent 70%)" }} />
      <ParticleField />

      <div className="relative max-w-7xl mx-auto px-6 w-full pt-32 pb-20 z-20">
        <motion.div initial="hidden" animate="show" className="max-w-3xl">
          <motion.div variants={fadeUp} custom={0} className="flex items-center gap-3 mb-8">
            <motion.span
              className="h-px w-12 bg-gold block"
              initial={{ scaleX: 0, originX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 1, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
            />
            <span className="text-xs tracking-[0.4em] text-gold uppercase">Lagos · Est. 2013</span>
          </motion.div>
          <motion.h1 variants={fadeUp} custom={1} className="font-serif text-5xl md:text-7xl lg:text-8xl leading-[1.02] font-medium">
            Capturing <span className="italic font-light silver-text">Stories</span>
            <br />
            Beyond <span className="gold-text">The Lens</span>
          </motion.h1>
          {/* mirror reflection */}
          <motion.div variants={fadeUp} custom={2} aria-hidden className="h-16 mt-1 overflow-hidden opacity-20"
            style={{
              WebkitMaskImage: "linear-gradient(to bottom, rgba(0,0,0,0.6), transparent)",
              maskImage: "linear-gradient(to bottom, rgba(0,0,0,0.6), transparent)",
            }}>
            <div className="font-serif text-5xl md:text-7xl lg:text-8xl leading-[1.02] font-medium" style={{ transform: "scaleY(-1)" }}>
              Capturing Stories
            </div>
          </motion.div>

          <motion.p variants={fadeUp} custom={3} className="mt-8 max-w-xl text-base md:text-lg text-foreground/70 leading-relaxed">
            A cinematic luxury photography studio in Lagos, Nigeria — crafting timeless,
            editorial imagery for weddings, fashion houses and visionary brands.
          </motion.p>

          <motion.div variants={fadeUp} custom={4} className="mt-10 flex flex-wrap gap-4">
            <motion.a
              href="#portfolio"
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.98 }}
              className="group inline-flex items-center gap-3 px-7 py-4 rounded-full bg-gold text-background font-medium hover:bg-gold-glow transition-all hover:gold-glow"
            >
              View Portfolio
              <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </motion.a>
            <motion.a
              href="#contact"
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.98 }}
              className="inline-flex items-center gap-3 px-7 py-4 rounded-full gold-border text-foreground hover:bg-gold/10 transition-all"
            >
              Book Session
            </motion.a>
          </motion.div>
        </motion.div>

        {/* scroll cue */}
        <motion.div
          className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-muted-foreground"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2, duration: 0.8 }}
        >
          <span className="text-[10px] tracking-[0.4em]">SCROLL</span>
          <motion.div
            className="h-10 w-px bg-gradient-to-b from-gold to-transparent"
            animate={{ scaleY: [1, 0.4, 1], opacity: [1, 0.5, 1] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          />
        </motion.div>
      </div>
    </section>
  );
}

function SectionTitle({ kicker, title, subtitle }: { kicker: string; title: React.ReactNode; subtitle?: string }) {
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-80px" }} transition={{ duration: 0.7 }} className="max-w-2xl">
      <div className="flex items-center gap-3 mb-5">
        <span className="h-px w-10 bg-gold" />
        <span className="text-xs tracking-[0.4em] text-gold uppercase">{kicker}</span>
      </div>
      <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl leading-tight">{title}</h2>
      {subtitle && <p className="mt-5 text-foreground/65 text-base md:text-lg leading-relaxed">{subtitle}</p>}
    </motion.div>
  );
}

function Portfolio() {
  const [cat, setCat] = useState<Cat>("All");
  const [lightbox, setLightbox] = useState<number | null>(null);
  const items = PHOTOS.filter((p) => cat === "All" || p.cat === cat);

  return (
    <section id="portfolio" className="relative py-32 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-14">
          <SectionTitle kicker="Portfolio" title={<>A curated <span className="italic gold-text">archive</span> of moments.</>} />
          <div className="flex flex-wrap gap-2">
            {CATEGORIES.map((c) => (
              <button key={c} onClick={() => setCat(c)}
                className={`px-4 py-2 rounded-full text-xs tracking-wider uppercase border transition-all ${cat === c ? "bg-gold text-background border-gold" : "border-[color:var(--color-border)] text-foreground/70 hover:border-gold/60 hover:text-gold"}`}>
                {c}
              </button>
            ))}
          </div>
        </div>

        <div className="columns-1 sm:columns-2 lg:columns-3 gap-5 [column-fill:_balance]">
          {items.map((p, i) => (
            <motion.figure key={p.src} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-50px" }} transition={{ duration: 0.6, delay: (i % 6) * 0.05 }}
              onClick={() => setLightbox(i)}
              className="mb-5 break-inside-avoid relative overflow-hidden rounded-xl cursor-pointer group cinematic-shadow">
              <img src={p.src} loading="lazy" alt={p.title}
                style={{ height: p.h }}
                className="w-full object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-110" />
              <div className="absolute inset-0 bg-gradient-to-t from-background/95 via-background/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <figcaption className="absolute bottom-0 inset-x-0 p-5 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500">
                <div className="text-[10px] tracking-[0.3em] text-gold uppercase mb-1">{p.cat}</div>
                <div className="font-serif text-xl">{p.title}</div>
              </figcaption>
              {/* gold corner accents */}
              <span className="absolute top-3 left-3 h-4 w-4 border-t border-l border-gold/0 group-hover:border-gold transition-all duration-500" />
              <span className="absolute bottom-3 right-3 h-4 w-4 border-b border-r border-gold/0 group-hover:border-gold transition-all duration-500" />
            </motion.figure>
          ))}
        </div>
      </div>

      <AnimatePresence>
        {lightbox !== null && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-background/95 backdrop-blur-xl grid place-items-center p-6"
            onClick={() => setLightbox(null)}>
            <button className="absolute top-6 right-6 h-11 w-11 grid place-items-center rounded-full gold-border text-gold hover:bg-gold hover:text-background transition" onClick={() => setLightbox(null)}><X className="h-5 w-5" /></button>
            <button className="absolute left-4 md:left-10 top-1/2 -translate-y-1/2 h-11 w-11 grid place-items-center rounded-full gold-border text-gold hover:bg-gold hover:text-background transition"
              onClick={(e) => { e.stopPropagation(); setLightbox((lightbox - 1 + items.length) % items.length); }}><ChevronLeft /></button>
            <button className="absolute right-4 md:right-10 top-1/2 -translate-y-1/2 h-11 w-11 grid place-items-center rounded-full gold-border text-gold hover:bg-gold hover:text-background transition"
              onClick={(e) => { e.stopPropagation(); setLightbox((lightbox + 1) % items.length); }}><ChevronRight /></button>
            <motion.img key={items[lightbox].src} initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
              src={items[lightbox].src} alt={items[lightbox].title}
              onClick={(e) => e.stopPropagation()}
              className="max-h-[85vh] max-w-[90vw] rounded-xl cinematic-shadow" />
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}

function Services() {
  return (
    <section id="services" className="relative py-32 px-6 bg-gradient-to-b from-transparent via-[#080706] to-transparent">
      <div className="max-w-7xl mx-auto">
        <SectionTitle kicker="Services" title={<>Crafted with <span className="italic gold-text">intention</span>.</>}
          subtitle="From intimate portraits to full editorial productions, every service is tailored, considered, and delivered with cinematic precision." />

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-16">
          {SERVICES.map((s, i) => (
            <motion.div key={s.title} variants={fadeUp} custom={i} initial="hidden" whileInView="show" viewport={{ once: true, margin: "-50px" }}
              className="group relative p-8 rounded-2xl glass hover:gold-glow transition-all duration-500 overflow-hidden">
              <div className="absolute -top-20 -right-20 h-40 w-40 rounded-full bg-gold/10 blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
              <div className="relative">
                <div className="h-14 w-14 rounded-xl grid place-items-center bg-background gold-border mb-6 group-hover:rotate-6 transition-transform">
                  <s.icon className="h-6 w-6 text-gold" />
                </div>
                <h3 className="font-serif text-2xl mb-3">{s.title}</h3>
                <p className="text-sm text-foreground/65 leading-relaxed">{s.desc}</p>
                <div className="mt-6 text-xs tracking-[0.3em] text-gold uppercase flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  Inquire <ChevronRight className="h-3 w-3" />
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function About() {
  return (
    <section id="about" className="relative py-32 px-6">
      <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-center">
        <motion.div initial={{ opacity: 0, x: -40 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.9 }}
          className="relative">
          <div className="relative aspect-[4/5] rounded-2xl overflow-hidden cinematic-shadow">
            <img src="https://images.unsplash.com/photo-1554080353-a576cf803bda?w=900&q=80" alt="Photographer at work" className="h-full w-full object-cover" loading="lazy" />
            <div className="absolute inset-0 bg-gradient-to-t from-background/60 to-transparent" />
          </div>
          <div className="absolute -bottom-8 -right-4 md:-right-10 glass rounded-2xl p-6 max-w-[220px] gold-glow">
            <Award className="h-6 w-6 text-gold mb-2" />
            <div className="font-serif text-lg leading-tight">Lagos Creative Award 2024</div>
            <div className="text-xs text-muted-foreground mt-1">Photographer of the Year</div>
          </div>
        </motion.div>

        <div>
          <SectionTitle kicker="About" title={<>The eye behind <span className="italic gold-text">Lumière</span>.</>} />
          <p className="mt-6 text-foreground/70 leading-relaxed">
            I'm Adé Bankole — a Lagos-born photographer drawn to light, texture and the
            quiet moments most people miss. For over a decade I've documented the city's
            most discerning weddings, fashion houses and creative founders, building a
            studio rooted in craft, calm and uncompromising taste.
          </p>
          <p className="mt-4 text-foreground/70 leading-relaxed">
            Every shoot is treated as a small film: storyboarded, lit with intention,
            and edited like an heirloom. The goal is never just a beautiful image —
            it's a record of who you were in that moment.
          </p>

          <div className="grid grid-cols-2 gap-5 mt-10">
            {STATS.map((s, i) => (
              <motion.div key={s.label} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08 }}
                className="glass rounded-xl p-5">
                <div className="font-serif text-4xl gold-text">{s.value}</div>
                <div className="text-xs tracking-[0.2em] uppercase text-muted-foreground mt-2">{s.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function Testimonials() {
  const [i, setI] = useState(0);
  const next = () => setI((i + 1) % TESTIMONIALS.length);
  const prev = () => setI((i - 1 + TESTIMONIALS.length) % TESTIMONIALS.length);
  useEffect(() => {
    const t = setInterval(next, 6500);
    return () => clearInterval(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [i]);
  const t = TESTIMONIALS[i];
  return (
    <section id="testimonials" className="relative py-32 px-6 bg-gradient-to-b from-transparent via-[#080706] to-transparent">
      <div className="max-w-5xl mx-auto text-center">
        <SectionTitle kicker="Testimonials" title={<>Words from <span className="italic gold-text">clients</span>.</>} />
      </div>

      <div className="max-w-4xl mx-auto mt-14 relative">
        <AnimatePresence mode="wait">
          <motion.div key={t.name} initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -30 }} transition={{ duration: 0.6 }}
            className="glass rounded-3xl p-10 md:p-14 text-center relative overflow-hidden">
            <Quote className="h-12 w-12 text-gold/30 mx-auto mb-6" />
            <p className="font-serif text-2xl md:text-3xl leading-snug text-foreground/90 italic">"{t.quote}"</p>
            <div className="flex justify-center gap-1 mt-8">
              {[...Array(5)].map((_, k) => <Star key={k} className="h-4 w-4 fill-gold text-gold" />)}
            </div>
            <div className="flex items-center justify-center gap-4 mt-6">
              <div className="relative">
                <img src={t.img} alt={t.name} className="h-14 w-14 rounded-full object-cover gold-border" />
                <span className="absolute inset-0 rounded-full ring-2 ring-gold/40" />
              </div>
              <div className="text-left">
                <div className="font-medium">{t.name}</div>
                <div className="text-xs text-muted-foreground tracking-wider">{t.role}</div>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
        <div className="flex justify-center gap-3 mt-8">
          <button onClick={prev} className="h-11 w-11 grid place-items-center rounded-full gold-border text-gold hover:bg-gold hover:text-background transition"><ChevronLeft className="h-4 w-4" /></button>
          {TESTIMONIALS.map((_, k) => (
            <button key={k} onClick={() => setI(k)} className={`h-2 self-center rounded-full transition-all ${k === i ? "bg-gold w-8" : "bg-foreground/20 w-2"}`} />
          ))}
          <button onClick={next} className="h-11 w-11 grid place-items-center rounded-full gold-border text-gold hover:bg-gold hover:text-background transition"><ChevronRight className="h-4 w-4" /></button>
        </div>
      </div>
    </section>
  );
}

function Pricing() {
  return (
    <section id="pricing" className="relative py-32 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="text-center max-w-2xl mx-auto">
          <div className="flex items-center justify-center gap-3 mb-5">
            <span className="h-px w-10 bg-gold" />
            <span className="text-xs tracking-[0.4em] text-gold uppercase">Pricing</span>
            <span className="h-px w-10 bg-gold" />
          </div>
          <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl">Investments in <span className="italic gold-text">memory</span>.</h2>
          <p className="mt-5 text-foreground/65">Three thoughtfully composed packages. Each can be tailored to your story.</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-6 mt-16 items-stretch">
          {PRICING.map((p, i) => (
            <motion.div key={p.name} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1, duration: 0.7 }}
              className={`relative rounded-3xl p-8 md:p-10 flex flex-col ${p.featured ? "bg-gradient-to-b from-gold/10 via-background to-background gold-border gold-glow scale-[1.02]" : "glass"}`}>
              {p.featured && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-gold text-background text-[10px] tracking-[0.3em] uppercase">Most Chosen</div>
              )}
              <div className="text-xs tracking-[0.3em] uppercase text-gold mb-2">{p.tagline}</div>
              <h3 className="font-serif text-3xl mb-6">{p.name}</h3>
              <div className="flex items-baseline gap-2 mb-8">
                <span className={`font-serif text-5xl ${p.featured ? "gold-text" : "silver-text"}`}>{p.price}</span>
                <span className="text-xs text-muted-foreground">starting</span>
              </div>
              <ul className="space-y-3 mb-8 flex-1">
                {p.perks.map((perk) => (
                  <li key={perk} className="flex items-start gap-3 text-sm text-foreground/80">
                    <Check className="h-4 w-4 text-gold shrink-0 mt-0.5" />
                    <span>{perk}</span>
                  </li>
                ))}
              </ul>
              <a href="#contact" className={`block text-center px-6 py-3.5 rounded-full text-sm font-medium transition-all ${p.featured ? "bg-gold text-background hover:bg-gold-glow" : "gold-border text-foreground hover:bg-gold/10"}`}>
                Reserve Date
              </a>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Contact() {
  return (
    <section id="contact" className="relative py-32 px-6 bg-gradient-to-b from-transparent to-[#080706]">
      <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-14">
        <div>
          <SectionTitle kicker="Contact" title={<>Let's create something <span className="italic gold-text">timeless</span>.</>}
            subtitle="Available worldwide. Based in Lagos, Nigeria. Tell us about your project and we'll be in touch within 24 hours." />

          <div className="mt-10 space-y-5">
            <a href="https://maps.google.com" target="_blank" rel="noopener" className="flex items-start gap-4 group">
              <div className="h-11 w-11 grid place-items-center rounded-full gold-border text-gold shrink-0"><MapPin className="h-4 w-4" /></div>
              <div><div className="text-xs tracking-[0.3em] uppercase text-muted-foreground">Studio</div><div className="text-foreground/90 group-hover:text-gold transition">Victoria Island, Lagos, Nigeria</div></div>
            </a>
            <a href="mailto:hello@lumiere-lagos.com" className="flex items-start gap-4 group">
              <div className="h-11 w-11 grid place-items-center rounded-full gold-border text-gold shrink-0"><Mail className="h-4 w-4" /></div>
              <div><div className="text-xs tracking-[0.3em] uppercase text-muted-foreground">Email</div><div className="text-foreground/90 group-hover:text-gold transition">hello@lumiere-lagos.com</div></div>
            </a>
            <a href="tel:+2348000000000" className="flex items-start gap-4 group">
              <div className="h-11 w-11 grid place-items-center rounded-full gold-border text-gold shrink-0"><Phone className="h-4 w-4" /></div>
              <div><div className="text-xs tracking-[0.3em] uppercase text-muted-foreground">Phone</div><div className="text-foreground/90 group-hover:text-gold transition">+234 800 000 0000</div></div>
            </a>
          </div>

          <div className="mt-10 flex gap-3">
            {[
              { Icon: Instagram, href: "https://instagram.com" },
              { Icon: Music2, href: "https://tiktok.com" },
              { Icon: Youtube, href: "https://youtube.com" },
            ].map(({ Icon, href }, k) => (
              <a key={k} href={href} target="_blank" rel="noopener" className="h-11 w-11 grid place-items-center rounded-full gold-border text-gold hover:bg-gold hover:text-background transition">
                <Icon className="h-4 w-4" />
              </a>
            ))}
          </div>
        </div>

        <motion.form initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.7 }}
          onSubmit={(e) => { e.preventDefault(); alert("Thank you — we'll be in touch within 24 hours."); }}
          className="glass rounded-3xl p-8 md:p-10 space-y-5">
          <div className="grid sm:grid-cols-2 gap-5">
            <Field label="Full name" name="name" />
            <Field label="Email" name="email" type="email" />
          </div>
          <Field label="Phone (optional)" name="phone" />
          <div>
            <label className="text-xs tracking-[0.3em] uppercase text-muted-foreground">Service</label>
            <select className="mt-2 w-full bg-transparent border-b border-[color:var(--color-border)] focus:border-gold outline-none py-3 text-foreground">
              {SERVICES.map((s) => <option key={s.title} className="bg-background">{s.title}</option>)}
            </select>
          </div>
          <div>
            <label className="text-xs tracking-[0.3em] uppercase text-muted-foreground">Tell us about your project</label>
            <textarea rows={4} className="mt-2 w-full bg-transparent border-b border-[color:var(--color-border)] focus:border-gold outline-none py-3 text-foreground resize-none" />
          </div>
          <button type="submit" className="w-full px-7 py-4 rounded-full bg-gold text-background font-medium hover:bg-gold-glow transition-all">
            Send Inquiry
          </button>
        </motion.form>
      </div>
    </section>
  );
}

function Field({ label, name, type = "text" }: { label: string; name: string; type?: string }) {
  return (
    <div>
      <label className="text-xs tracking-[0.3em] uppercase text-muted-foreground">{label}</label>
      <input name={name} type={type} required={type !== "tel"} className="mt-2 w-full bg-transparent border-b border-[color:var(--color-border)] focus:border-gold outline-none py-3 text-foreground" />
    </div>
  );
}

function Footer() {
  return (
    <footer className="border-t border-[color:var(--color-border)] py-10 px-6">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-muted-foreground">
        <div className="flex items-center gap-2">
          <Camera className="h-3.5 w-3.5 text-gold" />
          <span>© {new Date().getFullYear()} Lumière Lagos. All rights reserved.</span>
        </div>
        <div className="tracking-[0.3em] uppercase">Crafted in Lagos · Nigeria</div>
      </div>
    </footer>
  );
}

function WhatsAppFab() {
  return (
    <a href="https://wa.me/2348000000000" target="_blank" rel="noopener"
      className="fixed bottom-6 right-6 z-40 group">
      <span className="absolute inset-0 rounded-full bg-gold/40 animate-ping" />
      <span className="relative h-14 w-14 grid place-items-center rounded-full bg-gold text-background gold-glow float">
        <MessageCircle className="h-6 w-6" />
      </span>
      <span className="absolute right-16 top-1/2 -translate-y-1/2 whitespace-nowrap px-3 py-1.5 rounded-full glass text-xs opacity-0 group-hover:opacity-100 transition">
        Chat on WhatsApp
      </span>
    </a>
  );
}

function FloatingOrbs() {
  return (
    <div className="fixed inset-0 pointer-events-none z-[1] overflow-hidden">
      <motion.div
        className="absolute -top-20 -left-20 h-[400px] w-[400px] rounded-full opacity-20"
        style={{
          background: "radial-gradient(circle, rgba(212,175,55,0.25), transparent 70%)",
          filter: "blur(60px)",
        }}
        animate={{ x: [0, 30, 0], y: [0, 40, 0] }}
        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute top-1/3 -right-32 h-[500px] w-[500px] rounded-full opacity-15"
        style={{
          background: "radial-gradient(circle, rgba(192,192,192,0.18), transparent 70%)",
          filter: "blur(80px)",
        }}
        animate={{ x: [0, -40, 0], y: [0, 30, 0] }}
        transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
      />
    </div>
  );
}

export default function App() {
  return (
    <>
      <ScrollProgress />
      <CursorGlow />
      <FloatingOrbs />
      <main className="relative">
        <Nav />
        <Hero />
        <Portfolio />
        <Services />
        <About />
        <Testimonials />
        <Pricing />
        <Contact />
        <Footer />
        <WhatsAppFab />
      </main>
    </>
  );
}
