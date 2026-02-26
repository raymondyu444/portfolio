import React, { useState, useRef, useEffect } from 'react';
import squirtleGif from '../assets/squirtle.gif';
import ArrowIcon from './ArrowIcon';
import './LoreCard.css';

const CARD_MARGIN = 24;
const LORE_CARD_WIDTH = 208;
const LORE_CARD_HEIGHT = 290;

const clampLorePosition = (x, y) => ({
  x: Math.max(CARD_MARGIN, Math.min(x, window.innerWidth - CARD_MARGIN - LORE_CARD_WIDTH)),
  y: Math.max(CARD_MARGIN, Math.min(y, window.innerHeight - CARD_MARGIN - LORE_CARD_HEIGHT)),
});

/* Desktop layout: lore card below and left of case study */
const LAYOUT_GAP = 24;
const LORE_LEFT_OFFSET = 40;
const LORE_UP_OFFSET = 48 + 24;
const getLoreDefaultPosition = () => {
  if (typeof window === 'undefined') return { x: 100, y: 480 };
  const cw = window.innerWidth;
  const ch = window.innerHeight;
  const centerX = (cw - 480) / 2;
  const centerY = (ch - 286) / 2;
  return clampLorePosition(
    centerX - LORE_CARD_WIDTH - LAYOUT_GAP - LORE_LEFT_OFFSET,
    centerY + 286 + LAYOUT_GAP - LORE_UP_OFFSET
  );
};

const LoreCard = ({ onHoverChange, onAboutMeClick }) => {
  const [position, setPosition] = useState(getLoreDefaultPosition);
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);
  const [isTouchDrag, setIsTouchDrag] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const cardRef = useRef(null);
  const aboutMeButtonRef = useRef(null);

  // Character GIF from local assets
  const characterGif = squirtleGif;

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
      setPosition((prev) => clampLorePosition(prev.x, prev.y));
    };
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  // Reset to default layout when switching from desktop to mobile so layout is default when returning to desktop
  useEffect(() => {
    if (isMobile) {
      setPosition(getLoreDefaultPosition());
    }
  }, [isMobile]);

  // Notify parent of hover state changes
  useEffect(() => {
    if (onHoverChange) {
      const shouldShowGalaxy = isHovered && !isDragging;
      onHoverChange(shouldShowGalaxy);
    }
  }, [isHovered, isDragging, onHoverChange]);

  // Drag handlers
  const handleMouseDown = (e) => {
    startDrag(e.clientX, e.clientY);
  };

  const handleTouchStart = (e) => {
    const touch = e.touches[0];
    if (isMobile) {
      setIsHovered(true); /* show hover until they tap elsewhere */
      return;
    }
    startDrag(touch.clientX, touch.clientY, true);
  };

  const handleTouchEnd = () => {
    if (isMobile) return; /* keep hover; clear only on next tap outside / not on link */
  };

  // On mobile: when hovered, dismiss hover if user taps anywhere other than the About Me link
  useEffect(() => {
    if (!isMobile || !isHovered) return;

    const handleDismiss = (e) => {
      const target = e.target;
      const aboutMeBtn = aboutMeButtonRef.current;
      const tappedOnAboutMe = aboutMeBtn && (aboutMeBtn === target || aboutMeBtn.contains(target));
      if (!tappedOnAboutMe) setIsHovered(false);
    };

    document.addEventListener('touchstart', handleDismiss, true);
    document.addEventListener('mousedown', handleDismiss, true);
    return () => {
      document.removeEventListener('touchstart', handleDismiss, true);
      document.removeEventListener('mousedown', handleDismiss, true);
    };
  }, [isMobile, isHovered]);

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (!isDragging) return;
      const next = clampLorePosition(
        e.clientX - dragOffset.x,
        e.clientY - dragOffset.y
      );
      setPosition(next);
    };

    const handleTouchMove = (e) => {
      if (!isDragging) return;
      const touch = e.touches[0];
      const next = clampLorePosition(
        touch.clientX - dragOffset.x,
        touch.clientY - dragOffset.y
      );
      setPosition(next);
    };

    const handlePointerUp = () => {
      setIsDragging(false);
      setIsTouchDrag(false);
    };

    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handlePointerUp);
      document.addEventListener('touchmove', handleTouchMove);
      document.addEventListener('touchend', handlePointerUp);
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handlePointerUp);
      document.removeEventListener('touchmove', handleTouchMove);
      document.removeEventListener('touchend', handlePointerUp);
    };
  }, [isDragging, dragOffset]);

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

  // When dragging starts, ensure hover state is false (except on touch: keep hover look)
  const startDrag = (clientX, clientY, fromTouch = false) => {
    setIsDragging(true);
    if (fromTouch) {
      setIsTouchDrag(true);
    } else {
      setIsHovered(false);
    }
    const rect = cardRef.current.getBoundingClientRect();
    setDragOffset({
      x: clientX - rect.left,
      y: clientY - rect.top
    });
  };

  return (
    <div 
      ref={cardRef}
      className={`lore-card-container ${isMobile ? 'lore-card-container--mobile' : ''} ${isDragging ? 'lore-card-container--dragging' : ''} ${isTouchDrag ? 'lore-card-container--touch-dragging' : ''} ${(isHovered && !isDragging) || isTouchDrag ? 'lore-card-container--hovered' : ''}`}
      style={{
        left: `${position.x}px`,
        top: `${position.y}px`
      }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onMouseDown={handleMouseDown}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      <div className={`lore-card ${(isHovered && !isDragging) || isTouchDrag ? 'lore-card--flipped' : ''}`}>
        {/* Front of card */}
        <div className="lore-card__face lore-card__face--front">
          <div className="lore-card__inner">
            {/* Header with name and level */}
            <div className="lore-card__header">
              <h2 className="lore-card__name">Ray Ray</h2>
              <div className="lore-card__level">
                <span className="lore-card__level-label">LVL</span>
                <span className="lore-card__level-number">31</span>
              </div>
            </div>

            {/* Character image */}
            <div className="lore-card__image-container">
              <img 
                src={characterGif} 
                alt="Character" 
                className="lore-card__image"
              />
            </div>

            {/* Abilities section */}
            <div className="lore-card__section">
              <h3 className="lore-card__section-title">ABILITIES</h3>
              <div className="lore-card__ability">
                <div className="lore-card__ability-sparkles">
                  <span className="lore-card__sparkle lore-card__sparkle--1">✨</span>
                  <span className="lore-card__sparkle lore-card__sparkle--2">✨</span>
                  <span className="lore-card__sparkle lore-card__sparkle--3">✨</span>
                </div>
                <div className="lore-card__ability-content">
                  <div className="lore-card__ability-left">
                    <span className="lore-card__emoji">🍣</span>
                    <span className="lore-card__ability-name">Eating</span>
                  </div>
                  <span className="lore-card__ability-value">+80</span>
                </div>
              </div>
            </div>

            {/* Weaknesses section */}
            <div className="lore-card__section lore-card__section--weaknesses">
              <h3 className="lore-card__section-title">WEAKNESSES</h3>
              <div className="lore-card__weaknesses-grid">
                <div className="lore-card__weaknesses-row">
                  <div className="lore-card__weakness">
                    <span className="lore-card__weakness-emoji">⏰</span>
                    <span className="lore-card__weakness-name">Waking up</span>
                  </div>
                  <div className="lore-card__weakness">
                    <span className="lore-card__weakness-emoji">🥦</span>
                    <span className="lore-card__weakness-name">Vegetables</span>
                  </div>
                </div>
                <div className="lore-card__weaknesses-row lore-card__weaknesses-row--second">
                  <div className="lore-card__weakness">
                    <span className="lore-card__weakness-emoji">💰</span>
                    <span className="lore-card__weakness-name">Taxes</span>
                  </div>
                  <div className="lore-card__weakness">
                    <span className="lore-card__weakness-emoji">🏋️‍♂️</span>
                    <span className="lore-card__weakness-name">Exercise</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Back of card - only the CTA is clickable */}
        <div className="lore-card__face lore-card__face--back">
          <button
            ref={aboutMeButtonRef}
            type="button"
            className="lore-card__cta lore-card__cta-button"
            onMouseDown={(e) => e.stopPropagation()}
            onTouchStart={(e) => e.stopPropagation()}
            onClick={(e) => {
              e.stopPropagation();
              if (onAboutMeClick) onAboutMeClick();
            }}
          >
            <span className="lore-card__cta-text">ABOUT ME</span>
            <div className="lore-card__arrows">
              <ArrowIcon className="lore-card__arrow lore-card__arrow--1" />
              <ArrowIcon className="lore-card__arrow lore-card__arrow--2" />
              <ArrowIcon className="lore-card__arrow lore-card__arrow--3" />
            </div>
          </button>
        </div>
      </div>
    </div>
  );
};

export default LoreCard;
