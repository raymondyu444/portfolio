import React, { useState, useRef, useEffect } from 'react';
import './Carousel.css';

const CARD_MARGIN = 24;
const LAYOUT_GAP = 24;
const CAROUSEL_DOWN_OFFSET = 40;
const CAROUSEL_SIZE = 220;

const clampCarouselPosition = (x, y) => ({
  x: Math.max(CARD_MARGIN, Math.min(x, window.innerWidth - CARD_MARGIN - CAROUSEL_SIZE)),
  y: Math.max(CARD_MARGIN, Math.min(y, window.innerHeight - CARD_MARGIN - CAROUSEL_SIZE)),
});

/* Desktop layout: carousel above and right of case study, top aligned with ticker, moved down slightly */
const getCarouselDefaultPosition = () => {
  if (typeof window === 'undefined') return { x: 720, y: 150 };
  const cw = window.innerWidth;
  const ch = window.innerHeight;
  const centerX = (cw - 480) / 2;
  const centerY = (ch - 286) / 2;
  const carouselRightOffset = 40;
  const x = Math.max(CARD_MARGIN, Math.min(centerX + 480 + LAYOUT_GAP + carouselRightOffset, cw - CARD_MARGIN - CAROUSEL_SIZE));
  const y = Math.max(CARD_MARGIN, centerY - CAROUSEL_SIZE - LAYOUT_GAP + CAROUSEL_DOWN_OFFSET);
  return { x, y };
};

const Carousel = ({ gifs = [], size = 'desktop' }) => {
  const [position, setPosition] = useState(getCarouselDefaultPosition);
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isMobileView, setIsMobileView] = useState(false);
  const carouselRef = useRef(null);
  const intervalRef = useRef(null);

  const isMobile = size === 'mobile';
  const width = CAROUSEL_SIZE;
  const height = CAROUSEL_SIZE;

  useEffect(() => {
    const mq = window.matchMedia('(max-width: 767px)');
    const update = () => setIsMobileView(mq.matches);
    update();
    mq.addEventListener('change', update);
    return () => mq.removeEventListener('change', update);
  }, []);

  // Keep carousel within viewport (24px margin); re-clamp on resize
  useEffect(() => {
    const onResize = () => {
      setPosition((prev) => clampCarouselPosition(prev.x, prev.y));
    };
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  // Reset to default layout when switching from desktop to mobile so layout is default when returning to desktop
  useEffect(() => {
    if (isMobileView) {
      setPosition(getCarouselDefaultPosition());
    }
  }, [isMobileView]);

  // Auto-rotate carousel every 3 seconds
  useEffect(() => {
    if (gifs.length <= 1) return;

    intervalRef.current = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % gifs.length);
    }, 3000);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [gifs.length]);

  // Drag handlers
  const handleMouseDown = (e) => {
    setIsDragging(true);
    const rect = carouselRef.current.getBoundingClientRect();
    setDragOffset({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    });
  };

  const handleTouchStart = (e) => {
    setIsDragging(true);
    const touch = e.touches[0];
    const rect = carouselRef.current.getBoundingClientRect();
    setDragOffset({
      x: touch.clientX - rect.left,
      y: touch.clientY - rect.top
    });
  };

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (!isDragging) return;
      const next = clampCarouselPosition(e.clientX - dragOffset.x, e.clientY - dragOffset.y);
      setPosition(next);
    };

    const handleTouchMove = (e) => {
      if (!isDragging) return;
      const touch = e.touches[0];
      const next = clampCarouselPosition(touch.clientX - dragOffset.x, touch.clientY - dragOffset.y);
      setPosition(next);
    };

    const handleMouseUp = () => {
      setIsDragging(false);
    };

    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      document.addEventListener('touchmove', handleTouchMove);
      document.addEventListener('touchend', handleMouseUp);
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      document.removeEventListener('touchmove', handleTouchMove);
      document.removeEventListener('touchend', handleMouseUp);
    };
  }, [isDragging, dragOffset]);

  if (gifs.length === 0) {
    return null;
  }

  return (
    <div
      ref={carouselRef}
      className={`carousel ${isMobile ? 'carousel--mobile' : 'carousel--desktop'} ${isDragging ? 'carousel--dragging' : ''}`}
      style={{
        left: `${position.x}px`,
        top: `${position.y}px`,
        width: `${width}px`,
        height: `${height}px`
      }}
      onMouseDown={handleMouseDown}
      onTouchStart={handleTouchStart}
    >
      <div className="carousel__image-container">
        {gifs.map((gif, index) => (
          <img
            key={index}
            src={gif}
            alt={`Carousel item ${index + 1}`}
            className={`carousel__image ${index === currentIndex ? 'carousel__image--active' : ''}`}
          />
        ))}
      </div>
    </div>
  );
};

export default Carousel;
