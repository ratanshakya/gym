import React, { useState, useEffect } from 'react';
import { ArrowRight, ShieldCheck, ThumbsUp, Wrench, ChevronLeft, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import CarCard from '../components/CarCard';
import { SellingProcess, Locations, Insights, Testimonials, FAQ } from '../components/HomeSections';
import './Home.css';

const featuredCars = [
  {
    id: 1,
    name: 'Hyundai Creta SX Opt',
    price: '14,50,000',
    year: 2021,
    mileage: '32,000',
    fuelType: 'Petrol',
    transmission: 'Automatic',
    location: 'Bangalore',
    image: 'https://images.unsplash.com/photo-1621007947382-bb3c399b52c5?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 2,
    name: 'Honda City ZX',
    price: '11,20,000',
    year: 2019,
    mileage: '45,000',
    fuelType: 'Diesel',
    transmission: 'Manual',
    location: 'Mumbai',
    image: 'https://images.unsplash.com/photo-1590362891991-f776e747a588?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 3,
    name: 'Kia Seltos GTX+',
    price: '16,80,000',
    year: 2022,
    mileage: '15,000',
    fuelType: 'Petrol',
    transmission: 'Automatic',
    location: 'Delhi',
    image: 'https://images.unsplash.com/photo-1542282088-fe8426682b8f?auto=format&fit=crop&w=800&q=80'
  }
];

const heroSlides = [
  {
    image: "https://images.unsplash.com/photo-1617469767053-d3b523a0b982?auto=format&fit=crop&w=1920&q=85",
    badge: "New Arrivals",
    title: "Drive Home in Your Dream Car",
    subtitle: "Explore 10,000+ certified pre-owned cars — inspected, reconditioned, and ready for you."
  },
  {
    image: "https://images.unsplash.com/photo-1553440569-bcc63803a83d?auto=format&fit=crop&w=1920&q=85",
    badge: "Best Deals",
    title: "Premium Cars, Honest Prices.",
    subtitle: "No hidden fees, no surprises. Get the best value with complete transparency."
  },
  {
    image: "https://images.unsplash.com/photo-1502877338535-34cb0ca4eb33?auto=format&fit=crop&w=1920&q=85",
    badge: "100% Certified",
    title: "Every Car, Fully Guaranteed.",
    subtitle: "200-point inspection on every vehicle. 5-day return policy. Drive with confidence."
  },
  {
    image: "https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?auto=format&fit=crop&w=1920&q=85",
    badge: "Sell Your Car",
    title: "Sell in 3 Simple Steps.",
    subtitle: "Free inspection, instant quote, and payment within 24 hours. Hassle-free."
  }
];

const Home = () => {
  const navigate = useNavigate();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      goToSlide((prev) => (prev + 1) % heroSlides.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  const goToSlide = (indexFn) => {
    setIsTransitioning(true);
    setTimeout(() => {
      setCurrentSlide(indexFn);
      setIsTransitioning(false);
    }, 300);
  };

  const nextSlide = () => goToSlide((prev) => (prev + 1) % heroSlides.length);
  const prevSlide = () => goToSlide((prev) => (prev - 1 + heroSlides.length) % heroSlides.length);

  const slide = heroSlides[currentSlide];

  return (
    <div className="home">
      {/* ── FULLSCREEN HERO SLIDER ── */}
      <section className="hero-fullscreen">
        {/* Background Slides */}
        {heroSlides.map((s, i) => (
          <div
            key={i}
            className={`hero-bg-slide ${i === currentSlide ? 'active' : ''}`}
            style={{ backgroundImage: `url(${s.image})` }}
          />
        ))}
        {/* Dark overlay */}
        <div className="hero-overlay" />

        {/* Content */}
        <div className={`hero-center-content ${isTransitioning ? 'fade-out' : 'fade-in'}`}>
          <span className="hero-badge">{slide.badge}</span>
          <h1 className="hero-title">{slide.title}</h1>
          <p className="hero-subtitle">{slide.subtitle}</p>
          <div className="hero-cta">
            <button className="hero-btn-primary" onClick={() => navigate('/explore')}>
              Explore Cars <ArrowRight size={20} />
            </button>
            <button className="hero-btn-outline">Sell Your Car</button>
          </div>
        </div>

        {/* Slider Controls */}
        <button className="slide-arrow slide-arrow-left" onClick={prevSlide} aria-label="Previous">
          <ChevronLeft size={28} />
        </button>
        <button className="slide-arrow slide-arrow-right" onClick={nextSlide} aria-label="Next">
          <ChevronRight size={28} />
        </button>

        {/* Dot Indicators */}
        <div className="slide-dots">
          {heroSlides.map((_, i) => (
            <button
              key={i}
              className={`slide-dot ${i === currentSlide ? 'active' : ''}`}
              onClick={() => goToSlide(() => i)}
              aria-label={`Slide ${i + 1}`}
            />
          ))}
        </div>

        {/* Progress bar */}
        <div className="slide-progress-bar" key={currentSlide} />
      </section>

      {/* ── STATS BAR ── */}
      <section className="stats-bar">
        <div className="container stats-container">
          <div className="stat-item">
            <span className="stat-number">10,000+</span>
            <span className="stat-label">Cars Available</span>
          </div>
          <div className="stat-divider" />
          <div className="stat-item">
            <span className="stat-number">50+</span>
            <span className="stat-label">Cities Covered</span>
          </div>
          <div className="stat-divider" />
          <div className="stat-item">
            <span className="stat-number">2 Lakh+</span>
            <span className="stat-label">Happy Customers</span>
          </div>
          <div className="stat-divider" />
          <div className="stat-item">
            <span className="stat-number">200-Point</span>
            <span className="stat-label">Quality Check</span>
          </div>
        </div>
      </section>

      {/* ── BENEFITS ── */}
      <section className="benefits container">
        <div className="benefits-grid grid-cols-3">
          <div className="benefit-card">
            <div className="icon-wrapper">
              <ShieldCheck size={28} />
            </div>
            <h3>200-Point Inspection</h3>
            <p>Every car undergoes a rigorous quality check before it reaches you.</p>
          </div>
          <div className="benefit-card">
            <div className="icon-wrapper icon-amber">
              <Wrench size={28} />
            </div>
            <h3>Fully Reconditioned</h3>
            <p>We fix every detail, so it feels exactly like a brand new car.</p>
          </div>
          <div className="benefit-card">
            <div className="icon-wrapper icon-green">
              <ThumbsUp size={28} />
            </div>
            <h3>5-Day Money Back</h3>
            <p>Not satisfied? Return it within 5 days for a complete refund.</p>
          </div>
        </div>
      </section>

      {/* ── FEATURED CARS ── */}
      <section className="featured container">
        <div className="section-header">
          <div>
            <h2>Trending Cars</h2>
            <p className="section-desc">Hand-picked, recently listed, and ready to drive</p>
          </div>
          <button className="btn-outline" onClick={() => navigate('/explore')}>View All →</button>
        </div>
        <div className="grid-cols-3">
          {featuredCars.map((car) => (
            <CarCard key={car.id} car={car} />
          ))}
        </div>
      </section>

      <SellingProcess />
      <Locations />
      <Insights />
      <Testimonials />
      <FAQ />
    </div>
  );
};

export default Home;
