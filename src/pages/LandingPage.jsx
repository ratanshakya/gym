import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGym } from '../context/GymContext';
import { Dumbbell, ShieldCheck, Fingerprint, MessageSquare, ShoppingBag, Calendar, TrendingUp, CheckCircle2, ArrowRight, Play, Star, ChevronDown, ChevronUp, Zap, Sparkles, Users, IndianRupee, Activity, BarChart3, Lock, Cloud, Tag, RefreshCw, ChevronLeft, ChevronRight, Flame, Menu, X } from 'lucide-react';
import './Landing.css';

export default function LandingPage() {
  const navigate = useNavigate();
  const { setActiveTab, setShowBiometricModal, data, processBiometricPunch, sendWhatsAppMessage } = useGym();
  const [activeModule, setActiveModule] = useState('biometric');
  const [billingCycle, setBillingCycle] = useState('monthly');
  const [openFaq, setOpenFaq] = useState(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // ---- High-Energy Cinematic Hero Slides ----
  const [currentSlide, setCurrentSlide] = useState(0);
  const heroSlides = [
    {
      src: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=1920&q=85',
      badge: 'Heavy Iron Zone',
      tag: 'Industrial Strength Floor'
    },
    {
      src: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=1920&q=85',
      badge: 'Olympic Powerlifting',
      tag: 'Chalk, Barbells & Peak Intensity'
    },
    {
      src: 'https://images.unsplash.com/photo-1540497077202-7c8a3999166f?w=1920&q=85',
      badge: 'Smart Fitness Facility',
      tag: 'Ambient Neon & Biometric Gates'
    },
    {
      src: 'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?w=1920&q=85',
      badge: 'Athlete Conditioning',
      tag: 'Muscular Power & Performance'
    },
    {
      src: 'https://images.unsplash.com/photo-1599058945522-28d584b6f0ff?w=1920&q=85',
      badge: 'Functional Kinetic HIIT',
      tag: 'Dynamic Agility & High Energy'
    }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide(prev => (prev + 1) % heroSlides.length);
    }, 5500);
    return () => clearInterval(timer);
  }, [heroSlides.length]);

  // ---- Stats strip: staggered entrance + count-up ----
  const statsRef = useRef(null);
  const [counted, setCounted] = useState(false);
  const [statsVisible, setStatsVisible] = useState(false);
  const [displayVals, setDisplayVals] = useState({ s0: 0, s1: 0, s2: 0, s3: 0 });

  useEffect(() => {
    const el = statsRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !counted) {
        setCounted(true);
        setStatsVisible(true);
        // Stagger: count-up starts 600ms after cards begin appearing
        const targets  = [500, 2.5, 99.9, 40];
        const duration = 1800;
        const steps    = 60;
        const interval = duration / steps;
        let step = 0;
        setTimeout(() => {
          const timer = setInterval(() => {
            step++;
            const ease = 1 - Math.pow(1 - step / steps, 3);
            setDisplayVals({
              s0: Math.round(targets[0] * ease),
              s1: parseFloat((targets[1] * ease).toFixed(1)),
              s2: parseFloat((targets[2] * ease).toFixed(1)),
              s3: Math.round(targets[3] * ease),
            });
            if (step >= steps) clearInterval(timer);
          }, interval);
        }, 600); // wait for cards to slide in first
      }
    }, { threshold: 0.25 });
    observer.observe(el);
    return () => observer.disconnect();
  }, [counted]);

  const modules = [
    {
      id: 'biometric',
      title: 'Biometric Access Control',
      icon: Fingerprint,
      desc: 'Seamless integration with fingerprint scanners, RFID cards, and 3D facial recognition gates. Prevents proxy attendance and automatically blocks expired members at turnstiles.',
      points: ['Contactless Facial & Fingerprint Check-in', 'Auto-Turnstile Door Lock/Unlock', 'Buddy-punching Prevention', 'Real-time Entry Logs']
    },
    {
      id: 'members',
      title: 'Membership & Renewal CRM',
      icon: ShieldCheck,
      desc: 'Track member lifecycles, active plans, instant freezes, and pending dues with automated GST billing invoice generation.',
      points: ['Instant Membership Reactivation', 'Automated Renewal Alerts', 'Custom Subscription Tiers', 'Dues Recovery Tracking']
    },
    {
      id: 'whatsapp',
      title: 'WhatsApp & SMS Automation',
      icon: MessageSquare,
      desc: 'Boost retention by 40% with automated WhatsApp renewal reminders, birthday wishes, payment links, and promotional broadcasts.',
      points: ['Green Badge WhatsApp API', 'Automated Expiry Alerts', 'Birthday Wishes & Gift Coupons', 'Bulk Marketing Broadcasts']
    },
    {
      id: 'pos',
      title: 'POS Store & GST Billing',
      icon: ShoppingBag,
      desc: 'Sell whey protein, supplements, gym gear, and beverages directly at the front desk with instant tax-compliant receipt generation.',
      points: ['Barcode Scanner Compatibility', 'Automatic GST Tax Calculation', 'Inventory Stock Alerts', 'Digital QR UPI Payment']
    },
    {
      id: 'scheduler',
      title: 'Trainer & Class Timetable',
      icon: Calendar,
      desc: 'Schedule group fitness sessions like CrossFit, Zumba, and Yoga. Assign personal trainers and allow members to book slots online.',
      points: ['Group Class Booking System', 'Trainer Performance Rating', 'Capacity Limit Control', 'Daily Workouts Roster']
    },
    {
      id: 'analytics',
      title: 'Financials & Peak Hour Analytics',
      icon: TrendingUp,
      desc: 'Data-driven analytics to monitor monthly revenue, gym attendance heatmaps, peak hours, and member churn rates.',
      points: ['Real-time Revenue Graph', 'Peak Hour Occupancy Heatmap', 'Expense & Ledger Statements', 'Multi-Branch Comparison']
    }
  ];

  const faqs = [
    { q: 'Does EasyGym Software work with fingerprint scanners and facial recognition hardware?', a: 'Yes! EasyGym Pro seamlessly connects with all major biometric turnstile gates, fingerprint scanners (ZKTeco, Starlink), and 3D facial cameras over TCP/IP LAN.' },
    { q: 'How does WhatsApp automation work?', a: 'Our software automatically sends automated WhatsApp messages to members when their plan is expiring in 7 days, on their birthday, or when dues are pending.' },
    { q: 'Can I manage multiple gym branches from a single admin panel?', a: 'Absolutely. The multi-branch enterprise plan allows you to switch between branches, compare revenue, and unify member databases across cities.' },
    { q: 'Is GST billing compliant for tax filing?', a: 'Yes, all invoices generated in the POS and membership modules are 100% GST-compliant with itemized tax breakdowns and exportable Excel reports.' }
  ];

  return (
    <div style={{ background: '#050811', color: '#f9fafb', position: 'relative', overflowX: 'hidden' }}>

      {/* ===== FULL-PAGE DEEP OBSIDIAN AMBIENT BACKDROP ===== */}
      <div className="landing-bg">
        {/* Dynamic glowing orbs */}
        <div className="orb orb-1" />
        <div className="orb orb-2" />
        <div className="orb orb-3" />
        <div className="orb orb-4" />

        {/* High-tech Cyber Grid with smooth radial edge fade */}
        <div className="grid-overlay" />

        {/* Ambient gym energy beams */}
        <div className="ambient-beam beam-1" />
        <div className="ambient-beam beam-2" />

        {/* Floating Luminous Fitness Particles / Embers */}
        <div className="particles-field">
          {Array.from({ length: 8 }).map((_, i) => (
            <span key={i} className="particle" />
          ))}
        </div>
      </div>

      {/* ===== NAVBAR ===== */}
      <nav className="landing-nav">
        <div className="container nav-inner-container">
          <div className="brand-logo" onClick={() => navigate('/')} style={{ cursor: 'pointer' }}>
            <div className="brand-icon"><Dumbbell size={22} /></div>
            <div>
              <span style={{ color: '#f9fafb' }}>EasyGym</span>
              <span style={{ color: '#10b981', marginLeft: '4px' }}>Software</span>
            </div>
          </div>

          <div className="landing-nav-links desktop-only">
            <a href="#pricing">Pricing</a>
            <a href="#features">Features</a>
            <a href="#testimonials">Reviews</a>
            <a href="#faq">FAQ</a>
          </div>

          <div className="nav-actions-wrap">
            <button onClick={() => { navigate('/admin'); setActiveTab('overview'); }} className="btn btn-primary btn-sm pulse-3d admin-nav-btn">
              <span>Admin Portal</span> <ArrowRight size={14} />
            </button>

            {/* Mobile Hamburger Button */}
            <button
              className="mobile-menu-btn"
              onClick={() => setMobileMenuOpen(prev => !prev)}
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X size={22} color="#10b981" /> : <Menu size={22} color="#f9fafb" />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Drawer */}
        {mobileMenuOpen && (
          <div className="mobile-nav-drawer animate-slide-up">
            <a href="#pricing" onClick={() => setMobileMenuOpen(false)}>💳 Pricing Plans</a>
            <a href="#features" onClick={() => setMobileMenuOpen(false)}>⚡ Features & Modules</a>
            <a href="#testimonials" onClick={() => setMobileMenuOpen(false)}>⭐ Customer Reviews</a>
            <a href="#faq" onClick={() => setMobileMenuOpen(false)}>❓ Frequently Asked Questions</a>
            <div className="mobile-nav-divider" />
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <button
                onClick={() => { setMobileMenuOpen(false); navigate('/admin'); setActiveTab('overview'); }}
                className="btn btn-primary"
                style={{ width: '100%', justifyContent: 'center' }}
              >
                Open Admin Portal <ArrowRight size={16} />
              </button>
              <a
                href="#pricing"
                onClick={() => setMobileMenuOpen(false)}
                className="btn btn-secondary"
                style={{ width: '100%', justifyContent: 'center', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '8px' }}
              >
                <Sparkles size={16} color="#10b981" /> Explore Free Plans
              </a>
            </div>
          </div>
        )}
      </nav>

      {/* ===== HERO SECTION ===== */}
      <header className="hero-section" style={{ position: 'relative', zIndex: 1 }}>

        {/* High-Energy Gym Image Slideshow Background with Ken Burns & Smooth Crossfade */}
        <div className="hero-bg-slider">
          {heroSlides.map((slide, i) => (
            <div
              key={i}
              className={`hero-slide slide-${i} ${currentSlide === i ? 'active' : ''}`}
              style={{
                backgroundImage: `url(${slide.src})`,
              }}
            />
          ))}
          {/* Multi-layer cinematic obsidian & emerald glow overlay */}
          <div className="hero-slide-overlay" />
          {/* High-tech energy scanlines */}
          <div className="hero-scanline-overlay" />
        </div>

        <div className="container hero-grid">
          <div>
            <div className="hero-badge">
              <Sparkles size={14} /> #1 Rated All-In-One Gym Management Platform
            </div>

            <h1 className="hero-title">
              Streamline Gym Operations with <span className="gradient-text">Biometric & WhatsApp</span> Automation
            </h1>

            <p className="hero-desc">
              Eliminate manual registers, block expired members automatically at turnstile gates, automate WhatsApp renewals, and boost revenue with GST POS billing.
            </p>

            <div className="hero-cta-group animate-slide-up delay-200">
              <button onClick={() => navigate('/admin')} className="btn btn-primary pulse-3d" style={{ padding: '16px 28px', fontSize: '0.95rem' }}>
                Open Admin Portal <ArrowRight size={18} />
              </button>
              <a href="#pricing" className="btn btn-secondary" style={{ padding: '16px 28px', fontSize: '0.95rem', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
                <Sparkles size={18} color="#10b981" /> View Free Plans
              </a>
            </div>

            <div className="hero-stats">
              <div className="stat-item">
                <h4>500+</h4>
                <p>Fitness Clubs Powered</p>
              </div>
              <div className="stat-item">
                <h4>99.9%</h4>
                <p>Biometric Uptime</p>
              </div>
              <div className="stat-item">
                <h4>40%</h4>
                <p>Higher Retention</p>
              </div>
            </div>

            {/* Cinematic Slide Controller Bar */}
            <div className="hero-slide-bar animate-slide-up delay-300">
              <div className="hero-slide-tag">
                <span className="hero-slide-tag-dot" />
                <span>{heroSlides[currentSlide].badge}</span>
              </div>
              <div className="hero-slide-indicators">
                {heroSlides.map((slide, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentSlide(idx)}
                    className="hero-indicator-btn"
                    title={slide.badge}
                    aria-label={`Switch to ${slide.badge}`}
                  >
                    <span className={`hero-indicator-pill ${currentSlide === idx ? 'active' : ''}`} />
                  </button>
                ))}
              </div>
              <div style={{ display: 'flex', gap: '6px' }}>
                <button
                  onClick={() => setCurrentSlide(prev => (prev - 1 + heroSlides.length) % heroSlides.length)}
                  className="hero-nav-arrow"
                  aria-label="Previous Slide"
                  title="Previous Slide"
                >
                  <ChevronLeft size={14} />
                </button>
                <button
                  onClick={() => setCurrentSlide(prev => (prev + 1) % heroSlides.length)}
                  className="hero-nav-arrow"
                  aria-label="Next Slide"
                  title="Next Slide"
                >
                  <ChevronRight size={14} />
                </button>
              </div>
            </div>
          </div>

          {/* Hero Visual Mockup Card */}
          <div className="glass-card hero-preview-card animate-float-3d">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', paddingBottom: '14px', borderBottom: '1px solid var(--border-dark)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#ef4444' }}></div>
                <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#f59e0b' }}></div>
                <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#10b981' }}></div>
                <span style={{ fontSize: '0.8rem', color: '#9ca3af', marginLeft: '8px' }}>FitPulse Gym - Live Dashboard Preview</span>
              </div>
              <span className="badge badge-active">● Biometric Hardware Live</span>
            </div>

            {/* Simulated Live Stream Feed inside Hero */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div style={{ background: 'rgba(255,255,255,0.03)', padding: '16px', borderRadius: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <img src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100" alt="Rahul" style={{ width: '42px', height: '42px', borderRadius: '50%', objectFit: 'cover' }} />
                  <div>
                    <strong style={{ fontSize: '0.95rem' }}>Rahul Sharma</strong>
                    <div style={{ fontSize: '0.78rem', color: '#9ca3af' }}>Platinum Plan | Biometric Fingerprint</div>
                  </div>
                </div>
                <span className="badge badge-active">Gate Unlocked</span>
              </div>

              <div style={{ background: 'rgba(255,255,255,0.03)', padding: '16px', borderRadius: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <img src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100" alt="Rohan" style={{ width: '42px', height: '42px', borderRadius: '50%', objectFit: 'cover' }} />
                  <div>
                    <strong style={{ fontSize: '0.95rem' }}>Rohan Kapoor</strong>
                    <div style={{ fontSize: '0.78rem', color: '#fca5a5' }}>Plan Expired 10 Days Ago</div>
                  </div>
                </div>
                <span className="badge badge-expired">Gate Locked</span>
              </div>

              <div style={{ background: 'rgba(37, 211, 102, 0.1)', border: '1px solid rgba(37, 211, 102, 0.3)', padding: '14px', borderRadius: '12px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                <MessageSquare size={20} color="#25D366" />
                <div style={{ fontSize: '0.82rem' }}>
                  <strong style={{ color: '#25D366', display: 'block' }}>WhatsApp Automation Trigger:</strong>
                  Sent renewal reminder link to Rohan Kapoor via WhatsApp Business API.
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Section Glow Accent Divider */}
      <div className="section-glow-divider" />

      {/* ===== STATS STRIP ===== */}
      <div className="stats-strip-section" ref={statsRef}>
        <div className="container stats-strip-row">
          {[
            { val: `${displayVals.s0}+`,     label: 'Fitness Clubs Powered',   color: '#10b981', Icon: Users },
            { val: `₹${displayVals.s1}Cr+`,   label: 'Monthly Revenue Tracked', color: '#38bdf8', Icon: IndianRupee },
            { val: `${displayVals.s2}%`,     label: 'Biometric Gate Uptime',   color: '#fbbf24', Icon: Activity },
            { val: `${displayVals.s3}%`,     label: 'Higher Retention Rate',   color: '#a78bfa', Icon: BarChart3 },
          ].map((s, i, arr) => (
            <div
              key={i}
              className={`stats-strip-item${statsVisible ? ' stat-enter' : ''}`}
              style={{ animationDelay: `${i * 0.16}s` }}
            >
              <div className="stats-strip-meta">
                <s.Icon size={14} color={s.color} strokeWidth={2.2} />
                <span className="stats-strip-label" style={{ color: s.color + 'bb' }}>{s.label}</span>
              </div>
              <div className="stats-strip-num" style={{ color: s.color }}>{s.val}</div>
              {i < arr.length - 1 && <div className="stats-strip-divider" />}
            </div>
          ))}
        </div>
      </div>

      {/* ===== WHY EASYGYM – 3-COLUMN PITCH ===== */}
      <div style={{ position: 'relative', zIndex: 1, padding: '80px 0' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '48px' }}>
            <span className="hero-badge">Why Gym Owners Love Us</span>
            <h2 style={{ fontSize: '2.2rem', marginTop: '12px' }}>Built for the <span className="gradient-text">Real Gym Floor</span></h2>
          </div>
          <div className="why-easygym-grid">
            {[
              { Icon: Lock,       title: 'Auto Gate Control',       desc: 'Expired member tries to enter? The turnstile locks automatically. Zero manual intervention needed.',                       color: 'rgba(16,185,129,0.12)',  border: 'rgba(16,185,129,0.28)',  iconColor: '#10b981' },
              { Icon: MessageSquare, title: 'WhatsApp Renewal Bot',  desc: 'System sends a personalised WhatsApp message 7 days before expiry. Retention goes up by 40% automatically.',         color: 'rgba(14,165,233,0.10)',  border: 'rgba(14,165,233,0.28)', iconColor: '#38bdf8' },
              { Icon: ShoppingBag,  title: 'GST POS Billing',        desc: 'Sell protein, gear, merchandise at the counter. Auto GST invoice generation. Linked to member account.',              color: 'rgba(139,92,246,0.10)',  border: 'rgba(139,92,246,0.28)', iconColor: '#a78bfa' },
              { Icon: BarChart3,    title: 'Live Revenue Dashboard',  desc: 'Real-time revenue tracking, pending dues, peak hour heatmap and renewal charts — all in one screen.',               color: 'rgba(245,158,11,0.10)',  border: 'rgba(245,158,11,0.28)', iconColor: '#fbbf24' },
              { Icon: Tag,          title: 'Flexible Plans & Freezes',desc: 'Create unlimited custom plans. Members can freeze, upgrade, or switch plans mid-cycle with full audit trail.',       color: 'rgba(16,185,129,0.10)',  border: 'rgba(16,185,129,0.28)', iconColor: '#34d399' },
              { Icon: Cloud,        title: 'Cloud + MongoDB Atlas',   desc: 'All data stored securely in cloud. Login from any device, any location. 100% data isolation per gym owner.',          color: 'rgba(14,165,233,0.10)',  border: 'rgba(14,165,233,0.28)', iconColor: '#38bdf8' },
            ].map((c, i) => (
              <div key={i} className="landing-feature-card animate-slide-up" style={{ animationDelay: `${0.1 + i * 0.08}s`, background: c.color, borderColor: c.border }}>
                <div className="feature-icon-wrap" style={{ background: `${c.iconColor}18`, border: `1px solid ${c.iconColor}40` }}>
                  <c.Icon size={22} color={c.iconColor} strokeWidth={1.8} />
                </div>
                <h4 style={{ fontSize: '1.05rem', marginBottom: '10px', color: '#f9fafb' }}>{c.title}</h4>
                <p style={{ fontSize: '0.87rem', color: '#9ca3af', lineHeight: '1.6' }}>{c.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Section Glow Accent Divider */}
      <div className="section-glow-divider" />

      {/* Pricing Section */}
      <section id="pricing" className="pricing-section container animate-slide-up" style={{ position: 'relative', zIndex: 1 }}>
        <div style={{ textAlign: 'center', maxWidth: '680px', margin: '0 auto 32px' }}>
          <span className="hero-badge">Simple Transparent Pricing</span>
          <h2 style={{ fontSize: '2.4rem', marginTop: '8px' }}>Plans Built For Every Gym Size</h2>

          {/* Limited Time Free Announcement Pill */}
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            background: 'rgba(16, 185, 129, 0.15)',
            border: '1px solid rgba(16, 185, 129, 0.4)',
            borderRadius: '999px',
            padding: '6px 20px',
            marginTop: '14px',
            color: '#34d399',
            fontSize: '0.85rem',
            fontWeight: '600'
          }}>
            <Sparkles size={15} color="#10b981" />
            <span>🎉 Abhi ke liye EasyGym sabhi gym owners ke liye <strong>100% Free</strong> hai!</span>
          </div>

          {/* Monthly / Yearly Toggle */}
          <div style={{ display: 'flex', justifyContent: 'center', marginTop: '20px' }}>
            <div style={{ display: 'inline-flex', background: 'rgba(255,255,255,0.06)', padding: '4px', borderRadius: '999px' }}>
              <button
                onClick={() => setBillingCycle('monthly')}
                style={{ padding: '8px 24px', borderRadius: '999px', color: billingCycle === 'monthly' ? '#000' : '#9ca3af', background: billingCycle === 'monthly' ? '#10b981' : 'transparent', fontWeight: '700' }}
              >
                Monthly Billing
              </button>
              <button
                onClick={() => setBillingCycle('yearly')}
                style={{ padding: '8px 24px', borderRadius: '999px', color: billingCycle === 'yearly' ? '#000' : '#9ca3af', background: billingCycle === 'yearly' ? '#10b981' : 'transparent', fontWeight: '700' }}
              >
                Yearly (Save 20%)
              </button>
            </div>
          </div>
        </div>

        <div className="pricing-grid">
          {/* 100% Free Plan */}
          <div className="pricing-card free-tier">
            <div style={{ position: 'absolute', top: '-14px', right: '20px', background: 'linear-gradient(135deg, #10b981, #059669)', color: '#000', padding: '4px 12px', borderRadius: '999px', fontSize: '0.72rem', fontWeight: '800', letterSpacing: '0.5px' }}>
              🎉 100% FREE NOW
            </div>
            <h3 style={{ fontSize: '1.35rem', color: '#34d399' }}>Free Community</h3>
            <p style={{ fontSize: '0.82rem', color: '#9ca3af', marginTop: '4px' }}>Full access for early gym owners & single fitness studios</p>
            <div style={{ margin: '20px 0' }}>
              <span style={{ fontSize: '2.6rem', fontWeight: '900', color: '#10b981' }}>₹0</span>
              <span style={{ color: '#34d399', fontSize: '0.88rem', fontWeight: '600' }}> / Free Forever</span>
            </div>
            <ul style={{ display: 'flex', flexDirection: 'column', gap: '11px', fontSize: '0.88rem', color: '#9ca3af', marginBottom: '28px' }}>
              <li style={{ color: '#f9fafb' }}>✔ Unlimited Gym Members CRM</li>
              <li style={{ color: '#f9fafb' }}>✔ Biometric Turnstile Simulation</li>
              <li style={{ color: '#f9fafb' }}>✔ Automated WhatsApp Alerts</li>
              <li style={{ color: '#f9fafb' }}>✔ POS Supplement Billing & GST</li>
              <li style={{ color: '#f9fafb' }}>✔ Cloud Database & Security</li>
            </ul>
            <button onClick={() => navigate('/admin')} className="btn btn-primary pulse-3d" style={{ width: '100%', padding: '12px' }}>
              Start 100% Free Now
            </button>
          </div>

          {/* Starter Plan - Reduced from ₹1,499 down to ₹499 */}
          <div className="pricing-card">
            <h3 style={{ fontSize: '1.35rem' }}>Starter Gym</h3>
            <p style={{ fontSize: '0.82rem', color: '#9ca3af', marginTop: '4px' }}>For single fitness studios under 250 members</p>
            <div style={{ margin: '20px 0' }}>
              <span style={{ fontSize: '2.5rem', fontWeight: '800', color: '#f9fafb' }}>₹{billingCycle === 'monthly' ? '499' : '399'}</span>
              <span style={{ color: '#9ca3af', fontSize: '0.85rem' }}> / month</span>
            </div>
            <ul style={{ display: 'flex', flexDirection: 'column', gap: '11px', fontSize: '0.88rem', color: '#9ca3af', marginBottom: '28px' }}>
              <li style={{ color: '#f9fafb' }}>✔ Up to 250 Active Members</li>
              <li style={{ color: '#f9fafb' }}>✔ Biometric Fingerprint & RFID</li>
              <li style={{ color: '#f9fafb' }}>✔ Basic Billing & Invoices</li>
              <li style={{ color: '#f9fafb' }}>✔ Member Attendance Heatmap</li>
              <li>✖ Dedicated WhatsApp API</li>
            </ul>
            <button onClick={() => navigate('/admin')} className="btn btn-secondary" style={{ width: '100%', padding: '12px' }}>
              Choose Starter
            </button>
          </div>

          {/* Pro Plan - Reduced from ₹2,999 down to ₹999 */}
          <div className="pricing-card featured">
            <div style={{ position: 'absolute', top: '-14px', right: '20px', background: '#38bdf8', color: '#000', padding: '4px 12px', borderRadius: '999px', fontSize: '0.72rem', fontWeight: '800' }}>
              MOST POPULAR
            </div>
            <h3 style={{ fontSize: '1.35rem', color: '#38bdf8' }}>Pro Gym Software</h3>
            <p style={{ fontSize: '0.82rem', color: '#9ca3af', marginTop: '4px' }}>For commercial gyms requiring turnstiles & WhatsApp</p>
            <div style={{ margin: '20px 0' }}>
              <span style={{ fontSize: '2.5rem', fontWeight: '800', color: '#38bdf8' }}>₹{billingCycle === 'monthly' ? '999' : '799'}</span>
              <span style={{ color: '#9ca3af', fontSize: '0.85rem' }}> / month</span>
            </div>
            <ul style={{ display: 'flex', flexDirection: 'column', gap: '11px', fontSize: '0.88rem', color: '#9ca3af', marginBottom: '28px' }}>
              <li>✔ Unlimited Gym Members</li>
              <li>✔ 3D Facial Recognition & Gates</li>
              <li>✔ Automated WhatsApp Renewal Bot</li>
              <li>✔ POS Store & Tax-Compliant GST</li>
              <li>✔ Trainer & Class Scheduler</li>
            </ul>
            <button onClick={() => navigate('/admin')} className="btn btn-primary" style={{ width: '100%', padding: '12px', background: 'linear-gradient(135deg, #0284c7, #38bdf8)' }}>
              Choose Pro
            </button>
          </div>

          {/* Multi-Branch Enterprise - Reduced from ₹5,999 down to ₹1,999 */}
          <div className="pricing-card">
            <h3 style={{ fontSize: '1.35rem' }}>Multi-Branch Enterprise</h3>
            <p style={{ fontSize: '0.82rem', color: '#9ca3af', marginTop: '4px' }}>For fitness chains with 3+ locations</p>
            <div style={{ margin: '20px 0' }}>
              <span style={{ fontSize: '2.5rem', fontWeight: '800', color: '#f9fafb' }}>₹{billingCycle === 'monthly' ? '1,999' : '1,599'}</span>
              <span style={{ color: '#9ca3af', fontSize: '0.85rem' }}> / month</span>
            </div>
            <ul style={{ display: 'flex', flexDirection: 'column', gap: '11px', fontSize: '0.88rem', color: '#9ca3af', marginBottom: '28px' }}>
              <li style={{ color: '#f9fafb' }}>✔ Unlimited Branches & Members</li>
              <li style={{ color: '#f9fafb' }}>✔ Central Multi-Branch Sync</li>
              <li style={{ color: '#f9fafb' }}>✔ Custom Hardware API Connector</li>
              <li style={{ color: '#f9fafb' }}>✔ Dedicated Account Manager</li>
              <li style={{ color: '#f9fafb' }}>✔ Priority 24/7 Phone Support</li>
            </ul>
            <button onClick={() => navigate('/admin')} className="btn btn-secondary" style={{ width: '100%', padding: '12px' }}>
              Contact Sales
            </button>
          </div>
        </div>
      </section>

      {/* Section Glow Accent Divider */}
      <div className="section-glow-divider" />

      {/* Feature Modules Tab Section */}
      <section id="features" className="features-section container animate-slide-up delay-300" style={{ position: 'relative', zIndex: 1 }}>
        <div style={{ textAlign: 'center', maxWidth: '640px', margin: '0 auto 32px' }}>
          <span className="hero-badge">Comprehensive Modules</span>
          <h2 style={{ fontSize: '2.4rem', marginTop: '8px' }}>Everything You Need To Scale Your Gym</h2>
          <p style={{ color: '#9ca3af', marginTop: '10px' }}>
            Built specifically for single fitness studios and multi-branch gym chains.
          </p>
        </div>

        {/* Tab Buttons */}
        <div className="module-tabs">
          {modules.map(mod => {
            const Icon = mod.icon;
            return (
              <button
                key={mod.id}
                onClick={() => setActiveModule(mod.id)}
                className={`module-tab-btn ${activeModule === mod.id ? 'active' : ''}`}
              >
                <Icon size={18} /> {mod.title}
              </button>
            );
          })}
        </div>

        {/* Selected Module Detail Display */}
        {(() => {
          const mod = modules.find(m => m.id === activeModule);
          const Icon = mod.icon;
          return (
            <div className="glass-card feature-detail-card">
              <div>
                <div style={{ width: '52px', height: '52px', background: 'rgba(16, 185, 129, 0.15)', borderRadius: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#10b981', marginBottom: '20px' }}>
                  <Icon size={28} />
                </div>
                <h3 style={{ fontSize: '1.8rem', marginBottom: '14px' }}>{mod.title}</h3>
                <p style={{ color: '#9ca3af', fontSize: '1rem', marginBottom: '24px' }}>{mod.desc}</p>
                <div className="feature-points-grid">
                  {mod.points.map((pt, i) => (
                    <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.9rem', color: '#f9fafb' }}>
                      <CheckCircle2 size={16} color="#10b981" /> {pt}
                    </div>
                  ))}
                </div>
                <button
                  onClick={() => { navigate('/admin'); setActiveTab(mod.id === 'analytics' ? 'financials' : mod.id); }}
                  className="btn btn-primary"
                  style={{ marginTop: '32px' }}
                >
                  Try {mod.title} in Admin <ArrowRight size={16} />
                </button>
              </div>

              <div style={{ background: '#111827', border: '1px solid var(--border-dark)', borderRadius: 'var(--radius-xl)', padding: '28px' }}>
                <h4 style={{ fontSize: '1.1rem', color: '#38bdf8', marginBottom: '16px' }}>Live Feature Sandbox</h4>
                {mod.id === 'biometric' && (
                  <div>
                    <p style={{ fontSize: '0.85rem', color: '#9ca3af', marginBottom: '16px' }}>Biometric turnstile hardware logs & member punch records:</p>
                    <button onClick={() => { navigate('/admin'); setActiveTab('biometric'); }} className="btn btn-primary" style={{ width: '100%' }}>
                      <Fingerprint size={18} /> Open Biometric Turnstile Logs
                    </button>
                  </div>
                )}
                {mod.id === 'members' && (
                  <div>
                    <p style={{ fontSize: '0.85rem', color: '#9ca3af', marginBottom: '12px' }}>Registered Active Members: <strong>{data.members.length}</strong></p>
                    <button onClick={() => { navigate('/admin'); setActiveTab('members'); }} className="btn btn-secondary" style={{ width: '100%' }}>
                      Manage Members Directory
                    </button>
                  </div>
                )}
                {mod.id === 'whatsapp' && (
                  <div>
                    <p style={{ fontSize: '0.85rem', color: '#9ca3af', marginBottom: '12px' }}>Test instant WhatsApp renewal alert dispatch:</p>
                    <button onClick={() => sendWhatsAppMessage("Sample Member", "+919876543210", "Renewal offer from EasyGym!")} className="btn btn-primary" style={{ width: '100%', background: '#25D366', color: '#000' }}>
                      <MessageSquare size={18} /> Send Test WhatsApp Msg
                    </button>
                  </div>
                )}
                {mod.id !== 'biometric' && mod.id !== 'members' && mod.id !== 'whatsapp' && (
                  <div>
                    <p style={{ fontSize: '0.85rem', color: '#9ca3af', marginBottom: '12px' }}>Integrated with GST tax billing and automated reports.</p>
                    <button onClick={() => { navigate('/admin'); setActiveTab('pos'); }} className="btn btn-primary" style={{ width: '100%' }}>
                      Open POS Billing Counter
                    </button>
                  </div>
                )}
              </div>
            </div>
          );
        })()}
      </section>

      {/* Section Glow Accent Divider */}
      <div className="section-glow-divider" />

      {/* ===== INSTAGRAM REELS STYLE SECTION ===== */}
      <section id="testimonials" className="reels-section animate-slide-up delay-400" style={{ position: 'relative', zIndex: 1 }}>
        {/* Heading stays contained */}
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '48px' }}>
            <h2 style={{ fontSize: '2.2rem' }}>Real Stories from <span className="gradient-text">Real Gym Owners</span></h2>
            <p style={{ color: '#9ca3af', marginTop: '10px' }}>Swipe through short reels from gym owners who scaled their business with EasyGym</p>
          </div>
        </div>

        {/* Reels Row — full viewport width, breaks out of container */}
        <div className="reels-row">
            {[
              {
                user: 'fitpulse_gym',
                avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&q=80',
                bg: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=400&q=80',
                caption: '🔥 Biometric gate ne sab badal diya! Ab koi bhi expired member enter nahi kar sakta.',
                likes: '12.4K',
                comments: '342',
                shares: '891',
                tag: 'Biometric Setup',
                tagColor: '#10b981',
                duration: '0:47'
              },
              {
                user: 'ironzone_club',
                avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&q=80',
                bg: 'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?w=400&q=80',
                caption: '💪 WhatsApp automation se renewal rate 40% badh gayi! EasyGym is 🔥',
                likes: '8.7K',
                comments: '215',
                shares: '543',
                tag: 'WhatsApp Bot',
                tagColor: '#25D366',
                duration: '1:02'
              },
              {
                user: 'zenfit_wellness',
                avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&q=80',
                bg: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?w=400&q=80',
                caption: '✅ GST billing aur POS store ek hi dashboard pe — best decision ever!',
                likes: '6.1K',
                comments: '189',
                shares: '320',
                tag: 'POS Billing',
                tagColor: '#f59e0b',
                duration: '0:38'
              },
              {
                user: 'elitepulse_fit',
                avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&q=80',
                bg: 'https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?w=400&q=80',
                caption: '📊 Revenue dashboard real-time dikhta hai — ek screen pe poora gym!',
                likes: '9.3K',
                comments: '401',
                shares: '677',
                tag: 'Analytics',
                tagColor: '#8b5cf6',
                duration: '0:55'
              },
              {
                user: 'apex_fitnesschain',
                avatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=100&q=80',
                bg: 'https://images.unsplash.com/photo-1574680096145-d05b474e2155?w=400&q=80',
                caption: '🏅 3 branches manage karta hoon ek hi login se. EasyGym enterprise 💯',
                likes: '15.2K',
                comments: '587',
                shares: '1.2K',
                tag: 'Multi-Branch',
                tagColor: '#38bdf8',
                duration: '1:15'
              },
            ].map((reel, idx) => (
              <div key={idx} className="ig-reel-card">
                {/* Background image */}
                <img src={reel.bg} alt={reel.user} className="ig-reel-bg" />

                {/* Dark gradient overlays */}
                <div className="ig-reel-overlay-top" />
                <div className="ig-reel-overlay-bottom" />

                {/* Top: Avatar + Username + Tag */}
                <div className="ig-reel-top">
                  <div className="ig-avatar-ring">
                    <img src={reel.avatar} alt={reel.user} className="ig-avatar-img" />
                  </div>
                  <div>
                    <div className="ig-username">@{reel.user}</div>
                    <span className="ig-tag" style={{ background: reel.tagColor + '22', color: reel.tagColor, border: `1px solid ${reel.tagColor}55` }}>{reel.tag}</span>
                  </div>
                  <div className="ig-duration-badge">{reel.duration}</div>
                </div>

                {/* Center: Play button */}
                <div className="ig-play-btn">
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="white"><path d="M8 5v14l11-7z"/></svg>
                </div>

                {/* Right: Action buttons */}
                <div className="ig-actions">
                  <div className="ig-action-item">
                    <div className="ig-action-icon">❤️</div>
                    <span>{reel.likes}</span>
                  </div>
                  <div className="ig-action-item">
                    <div className="ig-action-icon">💬</div>
                    <span>{reel.comments}</span>
                  </div>
                  <div className="ig-action-item">
                    <div className="ig-action-icon">↗️</div>
                    <span>{reel.shares}</span>
                  </div>
                  <div className="ig-action-item">
                    <div className="ig-action-icon">🔖</div>
                    <span>Save</span>
                  </div>
                </div>

                {/* Bottom: Caption */}
                <div className="ig-reel-caption">
                  <p className="ig-caption-text">{reel.caption}</p>
                  <div className="ig-music-bar">
                    <span>🎵</span>
                    <span className="ig-music-name">EasyGym Original Audio</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
      </section>

      {/* Section Glow Accent Divider */}
      <div className="section-glow-divider" />

      {/* FAQ Accordion Section */}
      <section id="faq" className="container" style={{ padding: '80px 0', position: 'relative', zIndex: 1 }}>
        <div style={{ textAlign: 'center', maxWidth: '640px', margin: '0 auto 48px' }}>
          <h2 style={{ fontSize: '2.2rem' }}>Frequently Asked Questions</h2>
        </div>

        <div style={{ maxWidth: '800px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {faqs.map((faq, idx) => (
            <div key={idx} className="glass-card faq-card" style={{ padding: '20px 24px', cursor: 'pointer' }} onClick={() => setOpenFaq(openFaq === idx ? null : idx)}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h4 style={{ fontSize: '1.05rem', color: '#f9fafb' }}>{faq.q}</h4>
                {openFaq === idx ? <ChevronUp size={20} color="#10b981" /> : <ChevronDown size={20} color="#9ca3af" />}
              </div>
              {openFaq === idx && (
                <p style={{ marginTop: '12px', color: '#9ca3af', fontSize: '0.9rem', lineHeight: '1.6' }}>{faq.a}</p>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer style={{ borderTop: '1px solid rgba(255,255,255,0.06)', background: 'rgba(5, 8, 17, 0.95)', padding: '48px 0 24px', position: 'relative', zIndex: 1 }}>
        <div className="container landing-footer-row">
          <div className="brand-logo">
            <div className="brand-icon"><Dumbbell size={20} /></div>
            <span>EasyGym Software Pro</span>
          </div>

          <p style={{ fontSize: '0.85rem', color: '#6b7280' }}>
            © {new Date().getFullYear()} EasyGym Software. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
