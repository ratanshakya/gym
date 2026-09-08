import React, { useState } from 'react';
import CarCard from '../components/CarCard';
import './Explore.css';

const allCars = [
  {
    id: 1, name: 'Hyundai Creta SX Opt', price: '14,50,000', year: 2021, mileage: '32,000', fuelType: 'Petrol', transmission: 'Automatic', location: 'Bangalore',
    image: 'https://images.unsplash.com/photo-1621007947382-bb3c399b52c5?auto=format&fit=crop&w=800&q=80', brand: 'Hyundai'
  },
  {
    id: 2, name: 'Honda City ZX', price: '11,20,000', year: 2019, mileage: '45,000', fuelType: 'Diesel', transmission: 'Manual', location: 'Mumbai',
    image: 'https://images.unsplash.com/photo-1590362891991-f776e747a588?auto=format&fit=crop&w=800&q=80', brand: 'Honda'
  },
  {
    id: 3, name: 'Kia Seltos GTX+', price: '16,80,000', year: 2022, mileage: '15,000', fuelType: 'Petrol', transmission: 'Automatic', location: 'Delhi',
    image: 'https://images.unsplash.com/photo-1542282088-fe8426682b8f?auto=format&fit=crop&w=800&q=80', brand: 'Kia'
  },
  {
    id: 4, name: 'Maruti Suzuki Baleno Alpha', price: '7,50,000', year: 2020, mileage: '28,000', fuelType: 'Petrol', transmission: 'Manual', location: 'Pune',
    image: 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=800&q=80', brand: 'Maruti Suzuki'
  },
  {
    id: 5, name: 'Tata Nexon XZA+', price: '10,80,000', year: 2021, mileage: '22,000', fuelType: 'Petrol', transmission: 'Automatic', location: 'Bangalore',
    image: 'https://images.unsplash.com/photo-1619682817481-e994891cd1f5?auto=format&fit=crop&w=800&q=80', brand: 'Tata'
  },
  {
    id: 6, name: 'Toyota Fortuner 4x4', price: '32,50,000', year: 2018, mileage: '75,000', fuelType: 'Diesel', transmission: 'Automatic', location: 'Chennai',
    image: 'https://images.unsplash.com/photo-1583121274602-3e2820c69888?auto=format&fit=crop&w=800&q=80', brand: 'Toyota'
  }
];

const brands = ['All', 'Hyundai', 'Honda', 'Kia', 'Maruti Suzuki', 'Tata', 'Toyota'];

const Explore = () => {
  const [activeBrand, setActiveBrand] = useState('All');
  
  const filteredCars = activeBrand === 'All' 
    ? allCars 
    : allCars.filter(car => car.brand === activeBrand);

  return (
    <div className="explore-page container">
      <div className="explore-header">
        <h1>Explore Collection</h1>
        <p>Discover our wide range of premium quality used cars</p>
      </div>

      <div className="explore-layout">
        {/* Filters Sidebar */}
        <aside className="filters-sidebar glass-panel">
          <h3>Filters</h3>
          
          <div className="filter-group">
            <h4>Brand</h4>
            <div className="brand-filters">
              {brands.map(brand => (
                <label key={brand} className="filter-label">
                  <input 
                    type="radio" 
                    name="brand" 
                    checked={activeBrand === brand}
                    onChange={() => setActiveBrand(brand)}
                  />
                  <span>{brand}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="filter-group">
            <h4>Budget</h4>
            <input type="range" className="range-slider" min="100000" max="5000000" />
            <div className="range-labels">
              <span>₹1L</span>
              <span>₹50L+</span>
            </div>
          </div>
          
          <button className="btn-primary" style={{width: '100%'}}>Apply Filters</button>
        </aside>

        {/* Cars Grid */}
        <div className="cars-grid">
          <div className="grid-cols-3">
            {filteredCars.map(car => (
              <CarCard key={car.id} car={car} />
            ))}
          </div>
          
          {filteredCars.length === 0 && (
            <div className="no-results glass-panel">
              <h3>No cars found</h3>
              <p>Try adjusting your filters to see more results.</p>
              <button className="btn-outline mt-2" onClick={() => setActiveBrand('All')}>Clear Filters</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Explore;
