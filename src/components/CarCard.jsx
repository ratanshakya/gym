import React from 'react';
import { Settings, Gauge, Fuel, Calendar } from 'lucide-react';
import './CarCard.css';

const CarCard = ({ car }) => {
  return (
    <div className="car-card glass-panel animate-fade-in">
      <div className="car-image-wrapper">
        <img src={car.image} alt={car.name} className="car-image" />
        <div className="car-badge">{car.year}</div>
      </div>
      
      <div className="car-content">
        <div className="car-header">
          <h3 className="car-title">{car.name}</h3>
          <span className="car-price">₹{car.price}</span>
        </div>
        
        <div className="car-specs">
          <div className="spec-item">
            <Gauge size={16} />
            <span>{car.mileage} km</span>
          </div>
          <div className="spec-item">
            <Fuel size={16} />
            <span>{car.fuelType}</span>
          </div>
          <div className="spec-item">
            <Settings size={16} />
            <span>{car.transmission}</span>
          </div>
        </div>
        
        <div className="car-footer">
          <p className="car-location">{car.location}</p>
          <button className="btn-primary view-btn">View Details</button>
        </div>
      </div>
    </div>
  );
};

export default CarCard;
