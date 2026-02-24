import React, { useState, useRef, useEffect } from 'react';
import heroScotiabank from '../assets/hero-scotiabank.png';
import './CaseStudyCard.css';

const CARD_MARGIN = 24;
const CASE_STUDY_DESKTOP_WIDTH = 480;
const CASE_STUDY_TABLET_WIDTH = 327;
const CASE_STUDY_HEIGHT = 286;
const LAYOUT_GAP = 24; /* gap between cards – Figma 74-276 */

/** Desktop layout: case study centered; used by other cards for relative positioning */
const getLayoutCenter = () => {
  if (typeof window === 'undefined') return { x: 0, y: 0 };
  return {
    x: (window.innerWidth - CASE_STUDY_DESKTOP_WIDTH) / 2,
    y: (window.innerHeight - CASE_STUDY_HEIGHT) / 2,
  };
};

const clampCaseStudyPosition = (x, y, width, height) => ({
  x: Math.max(CARD_MARGIN, Math.min(x, window.innerWidth - CARD_MARGIN - width)),
  y: Math.max(CARD_MARGIN, Math.min(y, window.innerHeight - CARD_MARGIN - height)),
});

const CaseStudyCard = ({ type = 'desktop', onHoverChange, onCaseStudyClick }) => {
  const isDesktop = type === 'desktop';
  const isTablet = type === 'tablet';
  const cardWidth = isDesktop ? CASE_STUDY_DESKTOP_WIDTH : CASE_STUDY_TABLET_WIDTH;
  const clampPosition = (x, y) => clampCaseStudyPosition(x, y, cardWidth, CASE_STUDY_HEIGHT);

  /* Desktop default: Figma 74-276 – case study centered horizontally and vertically */
  const [position, setPosition] = useState(() => {
    const center = getLayoutCenter();
    return clampCaseStudyPosition(center.x, center.y, cardWidth, CASE_STUDY_HEIGHT);
  });
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const cardRef = useRef(null);

  // Mobile breakpoint: no dragging on mobile
  useEffect(() => {
    const mq = window.matchMedia('(max-width: 767px)');
    const update = () => setIsMobile(mq.matches);
    update();
    mq.addEventListener('change', update);
    return () => mq.removeEventListener('change', update);
  }, []);

  // Keep card within viewport (24px from edges); re-clamp on resize
  useEffect(() => {
    const onResize = () => {
      setPosition((prev) => clampPosition(prev.x, prev.y));
    };
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, [cardWidth]);

  // Reset to default layout when switching from desktop to mobile so layout is default when returning to desktop
  useEffect(() => {
    if (isTablet) {
      const center = getLayoutCenter();
      setPosition(clampCaseStudyPosition(center.x, center.y, CASE_STUDY_DESKTOP_WIDTH, CASE_STUDY_HEIGHT));
    }
  }, [isTablet]);

  // Notify parent of hover state changes
  useEffect(() => {
    if (onHoverChange) {
      const shouldShowGradient = isHovered && !isDragging;
      onHoverChange(shouldShowGradient);
    }
  }, [isHovered, isDragging, onHoverChange]);

  // Drag handlers
  const handleMouseDown = (e) => {
    startDrag(e.clientX, e.clientY);
  };

  const handleTouchStart = (e) => {
    if (isMobile) return; /* no dragging on mobile */
    const touch = e.touches[0];
    startDrag(touch.clientX, touch.clientY);
  };

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (!isDragging) return;
      const next = clampCaseStudyPosition(e.clientX - dragOffset.x, e.clientY - dragOffset.y, cardWidth, CASE_STUDY_HEIGHT);
      setPosition(next);
    };

    const handleTouchMove = (e) => {
      if (!isDragging) return;
      const touch = e.touches[0];
      const next = clampCaseStudyPosition(touch.clientX - dragOffset.x, touch.clientY - dragOffset.y, cardWidth, CASE_STUDY_HEIGHT);
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
  }, [isDragging, dragOffset, cardWidth]);

  const handleMouseEnter = () => {
    if (!isDragging) {
      setIsHovered(true);
    }
  };

  const handleMouseLeave = () => {
    if (!isDragging) {
      setIsHovered(false);
    }
  };

  const startDrag = (clientX, clientY) => {
    setIsDragging(true);
    setIsHovered(false);
    const rect = cardRef.current.getBoundingClientRect();
    setDragOffset({
      x: clientX - rect.left,
      y: clientY - rect.top
    });
  };

  return (
    <div 
      ref={cardRef}
      className={`case-study-card-container ${isMobile ? 'case-study-card-container--mobile' : ''} ${isDragging ? 'case-study-card-container--dragging' : ''}`}
      style={{
        left: `${position.x}px`,
        top: `${position.y}px`
      }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onMouseDown={handleMouseDown}
      onTouchStart={handleTouchStart}
    >
      <div 
        className={`case-study-card ${isDesktop ? 'case-study-card--desktop' : 'case-study-card--tablet'} ${isHovered || isTablet ? 'case-study-card--hovered' : ''}`}
      >
        {isDesktop && (
          <>
            {/* Desktop Layout */}
            <div className="case-study-card__content">
              <div className="case-study-card__text-section">
                <div className="case-study-card__company">
                  <div className="case-study-card__company-dot"></div>
                  <div className="case-study-card__company-name">SCOTIABANK</div>
                </div>
                <h2 className="case-study-card__title">
                  How I improved identity verification by +12%
                </h2>
              </div>
              
              <button
                type="button"
                className={`case-study-card__cta ${isHovered ? 'case-study-card__cta--visible' : ''}`}
                onClick={(e) => {
                  e.stopPropagation();
                  e.preventDefault();
                  onCaseStudyClick?.();
                }}
                onMouseDown={(e) => e.stopPropagation()}
                onTouchStart={(e) => e.stopPropagation()}
              >
                <span className="case-study-card__cta-text">READ CASE STUDY</span>
                <div className="case-study-card__arrows">
                  <span className="case-study-card__arrow case-study-card__arrow--1">→</span>
                  <span className="case-study-card__arrow case-study-card__arrow--2">→</span>
                  <span className="case-study-card__arrow case-study-card__arrow--3">→</span>
                </div>
              </button>
            </div>

            <div className="case-study-card__image-wrapper">
              <img 
                src={heroScotiabank} 
                alt="Scotiabank mobile interface" 
                className="case-study-card__image"
              />
            </div>
          </>
        )}

        {isTablet && (
          <>
            {/* Tablet/Mobile Layout */}
            <div className="case-study-card__company">
              <div className="case-study-card__company-dot"></div>
              <div className="case-study-card__company-name">SCOTIABANK</div>
            </div>

            <div className="case-study-card__image-container">
              <img 
                src={heroScotiabank} 
                alt="Scotiabank mobile interface" 
                className="case-study-card__image"
              />
            </div>

            <h2 className="case-study-card__title">
              How I improved identity verification by +12%
            </h2>
            {onCaseStudyClick && (
              <button
                type="button"
                className="case-study-card__cta case-study-card__cta--visible"
                onClick={(e) => {
                  e.stopPropagation();
                  e.preventDefault();
                  onCaseStudyClick();
                }}
                onMouseDown={(e) => e.stopPropagation()}
                onTouchStart={(e) => e.stopPropagation()}
              >
                <span className="case-study-card__cta-text">READ CASE STUDY</span>
                <div className="case-study-card__arrows">
                  <span className="case-study-card__arrow case-study-card__arrow--1">→</span>
                  <span className="case-study-card__arrow case-study-card__arrow--2">→</span>
                  <span className="case-study-card__arrow case-study-card__arrow--3">→</span>
                </div>
              </button>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default CaseStudyCard;
