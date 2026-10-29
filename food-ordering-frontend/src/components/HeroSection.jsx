import React from "react";

function HeroSection({ onExplore }) {
  return (
    <section className="hero-section">
      <div className="hero-content">
        <span className="hero-badge">
          🍽️ Delicious Food, Delivered Fast
        </span>

        <h1>
          Your Favourite Food,
          <br />
          <span>Delivered Fresh.</span>
        </h1>

        <p>
          Discover delicious meals, explore your favourite restaurants,
          and enjoy fresh food delivered straight to your doorstep.
        </p>

        <button
          className="hero-button"
          onClick={onExplore}
        >
          Explore Menu →
        </button>

        <div className="hero-highlights">
          <div>
            <strong>🍔</strong>
            <span>Fresh Food</span>
          </div>

          <div>
            <strong>🚀</strong>
            <span>Quick Ordering</span>
          </div>

          <div>
            <strong>❤️</strong>
            <span>Made With Care</span>
          </div>
        </div>
      </div>

      <div className="hero-visual">
        <div className="hero-food-circle">
          🍕
        </div>

        <div className="hero-floating-card">
          <span>⭐</span>
          <div>
            <strong>Delicious Choices</strong>
            <small>Something for everyone</small>
          </div>
        </div>
      </div>
    </section>
  );
}

export default HeroSection;