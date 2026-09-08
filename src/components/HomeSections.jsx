import React, { useState } from 'react';
import { Smartphone, ClipboardCheck, Banknote, Star, Users, Heart, Smile, ChevronDown, ChevronUp, MapPin } from 'lucide-react';
import './HomeSections.css';

export const SellingProcess = () => {
  return (
    <section className="selling-process container section-spacing">
      <div className="section-header center">
        <h2>Selling your car made simple</h2>
      </div>
      <div className="grid-cols-3 text-center process-grid">
        <div className="process-step">
          <div className="process-icon-wrapper glass-panel mx-auto">
            <Smartphone size={40} color="var(--primary-color)" />
          </div>
          <h3>Instant online estimate</h3>
          <p>Fill in a few details about your car for an instant estimate</p>
          <a href="#" className="process-link">Get estimate &gt;</a>
        </div>
        <div className="process-step">
          <div className="process-icon-wrapper glass-panel mx-auto">
            <ClipboardCheck size={40} color="var(--secondary-color)" />
          </div>
          <h3>Free evaluation</h3>
          <p>Schedule the evaluation at your convenience, from your home</p>
          <a href="#" className="process-link">Schedule evaluation &gt;</a>
        </div>
        <div className="process-step">
          <div className="process-icon-wrapper glass-panel mx-auto">
            <Banknote size={40} color="#10b981" />
          </div>
          <h3>Same day payment</h3>
          <p>Complete payment and paperwork on the spot instantly</p>
          <a href="#" className="process-link">Sell Car &gt;</a>
        </div>
      </div>
      <div className="center mt-12">
        <button className="btn-primary">Watch how it works</button>
      </div>
    </section>
  );
};

export const Locations = () => {
  const cities = [
    { name: 'Delhi NCR', hubs: 11, cars: '1240+', color: '#eab308', img: 'https://images.unsplash.com/photo-1587474260584-136574528ed5?auto=format&fit=crop&w=400&q=80' },
    { name: 'Bangalore', hubs: 7, cars: '650+', color: '#6366f1', img: 'https://images.unsplash.com/photo-1596176530529-78163a4f7af2?auto=format&fit=crop&w=400&q=80' },
    { name: 'Pune', hubs: 4, cars: '650+', color: '#10b981', img: 'https://images.unsplash.com/photo-1572913017567-02f06484fb94?auto=format&fit=crop&w=400&q=80' },
    { name: 'Hyderabad', hubs: 4, cars: '590+', color: '#8b5cf6', img: 'https://images.unsplash.com/photo-1564507592208-528854cc30e9?auto=format&fit=crop&w=400&q=80' }
  ];

  return (
    <section className="locations-section container section-spacing">
      <div className="section-header center">
        <h2>Cars across India</h2>
      </div>
      <div className="grid-cols-4">
        {cities.map((city) => (
          <div key={city.name} className="city-card" style={{ '--city-color': city.color }}>
            <h3 className="city-name">{city.name}</h3>
            <div className="city-image-container">
              <img src={city.img} alt={city.name} className="city-img" />
            </div>
            <div className="city-stats">
              <span>{city.hubs} hubs</span>
              <span className="dot">•</span>
              <span>{city.cars} cars</span>
            </div>
          </div>
        ))}
      </div>
      <div className="center mt-12">
        <button className="btn-outline">View all locations</button>
      </div>
    </section>
  );
};

export const Insights = () => {
  const insights = [
    { icon: <Star size={32} color="#f59e0b" />, value: '4.8/5', desc: 'Our average review rating on Google and Social platforms' },
    { icon: <Users size={32} color="#10b981" />, value: '35%', desc: 'The number of Spanny customers that are referrals' },
    { icon: <Heart size={32} color="#ec4899" />, value: '> 70%', desc: "People who've become customers after their first test drive" },
    { icon: <Smile size={32} color="#8b5cf6" />, value: '32%', desc: 'Our women customer quotient' }
  ];

  return (
    <section className="insights-section container section-spacing">
      <div className="section-header center">
        <h2>Insights That Drive Us</h2>
      </div>
      <div className="grid-cols-4 insights-grid">
        {insights.map((item, idx) => (
          <div key={idx} className="insight-card glass-panel">
            <div className="insight-icon">{item.icon}</div>
            <div className="insight-content">
              <h3>{item.value}</h3>
              <p>{item.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export const Testimonials = () => {
  const stories = [
    { name: 'Darshan | Delhi', quote: 'Our family had our hearts set on XUV 700. So, when we saw it on Spanny, we just got it home.', img: 'https://images.unsplash.com/photo-1511895426328-dc8714191300?auto=format&fit=crop&w=400&q=80' },
    { name: 'Madhulika Singh | Lucknow', quote: "Spanny helped us find a family car that's great for daily commutes and long trips.", img: 'https://images.unsplash.com/photo-1529333166437-7750a6dd5a70?auto=format&fit=crop&w=400&q=80' },
    { name: 'Pazhaniappan | Chennai', quote: 'Being able to spoil my picky kids with infinite options is a win for Spanny and a safe car in my budget.', img: 'https://images.unsplash.com/photo-1542044896530-05d85be9b11a?auto=format&fit=crop&w=400&q=80' },
    { name: 'Ayush Srivastava | Pune', quote: 'Our first car that we truly fell in love with. The delivery process was smooth.', img: 'https://images.unsplash.com/photo-1601758177583-e070e6e40dcb?auto=format&fit=crop&w=400&q=80' }
  ];

  return (
    <section className="testimonials-section container section-spacing">
      <div className="section-header center">
        <h2>Over 2 Lakh Spanny Love Stories</h2>
      </div>
      <div className="grid-cols-4">
        {stories.map((story, idx) => (
          <div key={idx} className="testimonial-card">
            <img src={story.img} alt={story.name} className="testimonial-bg" />
            <div className="testimonial-overlay">
              <div className="brand-tag">
                <div className="brand-dot">S</div> myspanny
              </div>
              <div className="testimonial-content">
                <h4>{story.name}</h4>
                <p>{story.quote}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export const FAQ = () => {
  const faqs = [
    { q: 'When and where can I take a test drive?', a: 'With our test drive booking form, you can conveniently schedule a test drive at home or visit our hub to try out multiple cars. Once you book your preferred option, your relationship manager will call you to confirm.' },
    { q: "What's the process for booking my car?", a: 'You can book a car by paying a fully refundable token amount. The car will be reserved for you.' },
    { q: 'Will Spanny help me with car finance?', a: 'Yes, we have partnerships with leading banks to provide you with the best finance options at attractive interest rates.' },
    { q: "How does Spanny's money back guarantee work?", a: 'If you are not satisfied with the car, you can return it within 5 days, no questions asked, for a 100% refund.' }
  ];

  const [openIdx, setOpenIdx] = useState(0);

  return (
    <section className="faq-section container section-spacing">
      <div className="section-header center">
        <h2>Frequently Asked Questions</h2>
      </div>
      <div className="faq-container">
        {faqs.map((faq, idx) => (
          <div key={idx} className={`faq-item ${openIdx === idx ? 'open' : ''} glass-panel`} onClick={() => setOpenIdx(idx === openIdx ? -1 : idx)}>
            <div className="faq-question">
              <h4>{faq.q}</h4>
              {openIdx === idx ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
            </div>
            {openIdx === idx && (
              <div className="faq-answer">
                <p>{faq.a}</p>
              </div>
            )}
          </div>
        ))}
      </div>
      <div className="center mt-12">
        <button className="btn-outline">Visit help center</button>
      </div>
    </section>
  );
};
