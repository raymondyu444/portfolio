import React, { useState, useRef, useEffect, useLayoutEffect } from 'react';
import squirtleGif from '../assets/squirtle.gif';
import texturePng from '../assets/texture.png';
import ArrowIcon from './ArrowIcon';
import './LoreCard.css';

const CARD_MARGIN = 24;
const LORE_CARD_WIDTH = 208;
/** Used until ResizeObserver reports real height (content-hugging card). */
const LORE_CARD_HEIGHT_FALLBACK = 300;

const clampLorePosition = (x, y, cardHeight = LORE_CARD_HEIGHT_FALLBACK) => ({
  x: Math.max(CARD_MARGIN, Math.min(x, window.innerWidth - CARD_MARGIN - LORE_CARD_WIDTH)),
  y: Math.max(CARD_MARGIN, Math.min(y, window.innerHeight - CARD_MARGIN - cardHeight)),
});

/* Desktop layout: lore card below and left of case study */
const LAYOUT_GAP = 24;
const LORE_LEFT_OFFSET = 40;
const LORE_UP_OFFSET = 48 + 24;
const getLoreDefaultPosition = (cardHeight = LORE_CARD_HEIGHT_FALLBACK) => {
  if (typeof window === 'undefined') return { x: 100, y: 480 };
  const cw = window.innerWidth;
  const ch = window.innerHeight;
  const centerX = (cw - 480) / 2;
  const centerY = (ch - 286) / 2;
  return clampLorePosition(
    centerX - LORE_CARD_WIDTH - LAYOUT_GAP - LORE_LEFT_OFFSET,
    centerY + 286 + LAYOUT_GAP - LORE_UP_OFFSET,
    cardHeight
  );
};

const LoreCard = ({ onHoverChange, onAboutMeClick }) => {
  const [cardHeight, setCardHeight] = useState(LORE_CARD_HEIGHT_FALLBACK);
  const [position, setPosition] = useState(() => getLoreDefaultPosition());
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);
  const [isTouchDrag, setIsTouchDrag] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const cardRef = useRef(null);
  const aboutMeButtonRef = useRef(null);
  const lastFlipTimeRef = useRef(0);
  const aboutMeHandledByTouchRef = useRef(false);

  const IGNORE_DISMISS_MS = 400;

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

  // Track intrinsic height for viewport clamping (card hugs content; no fixed CSS height).
  useLayoutEffect(() => {
    const el = cardRef.current;
    if (!el) return undefined;
    const sync = () => {
      setCardHeight(Math.round(el.getBoundingClientRect().height));
    };
    sync();
    const ro = new ResizeObserver(sync);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  useEffect(() => {
    setPosition((prev) => clampLorePosition(prev.x, prev.y, cardHeight));
  }, [cardHeight]);

  // Keep card within viewport (24px from edges); re-clamp on resize
  useEffect(() => {
    const onResize = () => {
      setPosition((prev) => clampLorePosition(prev.x, prev.y, cardHeight));
    };
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, [cardHeight]);

  // Reset to default layout when switching from desktop to mobile so layout is default when returning to desktop
  useEffect(() => {
    if (isMobile) {
      const h =
        cardRef.current != null
          ? Math.round(cardRef.current.getBoundingClientRect().height)
          : LORE_CARD_HEIGHT_FALLBACK;
      setPosition(getLoreDefaultPosition(h));
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
    if (isMobile) {
      /* On mobile (e.g. DevTools device mode with mouse): treat click as tap – flip card, don't drag */
      lastFlipTimeRef.current = Date.now();
      setIsHovered(true);
      return;
    }
    startDrag(e.clientX, e.clientY);
  };

  const handleTouchStart = (e) => {
    if (isMobile) {
      e.preventDefault();
      lastFlipTimeRef.current = Date.now();
      setIsHovered(true);
      return;
    }
    const touch = e.touches[0];
    startDrag(touch.clientX, touch.clientY, true);
  };

  const handleTouchEnd = () => {
    if (isMobile) return; /* keep hover; clear only on next tap outside / not on link */
  };

  // On mobile: when hovered (card flipped), dismiss on any tap/click anywhere – except tap on About Me opens modal.
  // Time window prevents the synthetic mousedown (after a real touch) from closing the card.
  useEffect(() => {
    if (!isMobile || !isHovered) return;

    const handleDismiss = (e) => {
      const now = Date.now();
      if (now - lastFlipTimeRef.current < IGNORE_DISMISS_MS) return;

      const target = e.target;
      const aboutMeBtn = aboutMeButtonRef.current;
      const tappedAboutMe = aboutMeBtn && (aboutMeBtn === target || aboutMeBtn.contains(target));
      if (tappedAboutMe) return; /* About Me tap opens modal via button handler */

      setIsHovered(false); /* tap/click anywhere else → flip back */
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
        e.clientY - dragOffset.y,
        cardHeight
      );
      setPosition(next);
    };

    const handleTouchMove = (e) => {
      if (!isDragging) return;
      const touch = e.touches[0];
      const next = clampLorePosition(
        touch.clientX - dragOffset.x,
        touch.clientY - dragOffset.y,
        cardHeight
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
  }, [isDragging, dragOffset, cardHeight]);

  const handleMouseEnter = () => {
    if (!isDragging) {
      setIsHovered(true);
    }
  };

  const handleMouseLeave = () => {
    if (isMobile) return; /* on mobile, hover is cleared only by tap-outside (document touchstart), not by synthetic mouseleave when finger lifts */
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
          <div className="lore-card__front-shell">
            <div className="lore-card__inner">
              <div className="lore-card__texture" aria-hidden="true">
                <img src={texturePng} alt="" className="lore-card__texture-img" />
              </div>
              <section className="lore-card__section" aria-label="Lore card content">
                <div className="lore-card__hero">
                  <div className="lore-card__header">
                    <h2 className="lore-card__name">HoneyRayRay</h2>
                    <div className="lore-card__level">
                      <span className="lore-card__level-label">LVL</span>
                      <span className="lore-card__level-number">31</span>
                    </div>
                  </div>
                  <div className="lore-card__image-frame">
                    <div className="lore-card__image-container">
                      <img
                        src={characterGif}
                        alt="Character"
                        className="lore-card__image"
                      />
                    </div>
                  </div>
                </div>

                <div className="lore-card__stat-groups">
                  <div className="lore-card__stat-block lore-card__stat-block--abilities">
                    <div className="lore-card__stat-block-bg" aria-hidden="true" />
                    <div className="lore-card__pill-title">
                      <span>ABILITIES</span>
                    </div>
                    <div className="lore-card__sparkle-cluster lore-card__sparkle-cluster--fire" aria-hidden="true">
                      <span className="lore-card__sparkle-fire lore-card__sparkle-fire--1">🔥</span>
                      <span className="lore-card__sparkle-fire lore-card__sparkle-fire--2">🔥</span>
                      <span className="lore-card__sparkle-fire lore-card__sparkle-fire--3">🔥</span>
                      <span className="lore-card__sparkle-fire lore-card__sparkle-fire--4">🔥</span>
                      <span className="lore-card__sparkle-fire lore-card__sparkle-fire--5">🔥</span>
                      <span className="lore-card__sparkle-fire lore-card__sparkle-fire--6">🔥</span>
                    </div>
                    <div className="lore-card__line-items">
                      <div className="lore-card__line-item">
                        <div className="lore-card__line-item-left">
                          <div className="lore-card__emoji-pill">
                            <span className="lore-card__emoji-pill-text">🍣</span>
                          </div>
                          <span className="lore-card__line-item-name">Eating</span>
                        </div>
                        <span className="lore-card__line-item-value">+88</span>
                      </div>
                      <div className="lore-card__line-item">
                        <div className="lore-card__line-item-left">
                          <div className="lore-card__emoji-pill">
                            <span className="lore-card__emoji-pill-text">😴</span>
                          </div>
                          <span className="lore-card__line-item-name">Sleeping</span>
                        </div>
                        <span className="lore-card__line-item-value">+84</span>
                      </div>
                    </div>
                  </div>

                  <div className="lore-card__stat-block lore-card__stat-block--weakness">
                    <div className="lore-card__stat-block-bg" aria-hidden="true" />
                    <div className="lore-card__pill-title">
                      <span>WEAKNESS</span>
                    </div>
                    <div className="lore-card__sparkle-cluster lore-card__sparkle-cluster--neutral" aria-hidden="true">
                      <span className="lore-card__sparkle-neutral lore-card__sparkle-neutral--1">🫤</span>
                      <span className="lore-card__sparkle-neutral lore-card__sparkle-neutral--2">🫤</span>
                      <span className="lore-card__sparkle-neutral lore-card__sparkle-neutral--3">🫤</span>
                    </div>
                    <div className="lore-card__line-items lore-card__line-items--single">
                      <div className="lore-card__line-item">
                        <div className="lore-card__line-item-left">
                          <div className="lore-card__emoji-pill">
                            <span className="lore-card__emoji-pill-text">☔️</span>
                          </div>
                          <span className="lore-card__line-item-name">Rain</span>
                        </div>
                        <span className="lore-card__line-item-value">-140</span>
                      </div>
                    </div>
                  </div>
                </div>
              </section>
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
            onTouchEnd={(e) => {
              e.stopPropagation();
              if (e.changedTouches?.length && onAboutMeClick) {
                aboutMeHandledByTouchRef.current = true;
                onAboutMeClick();
              }
            }}
            onClick={(e) => {
              e.stopPropagation();
              if (aboutMeHandledByTouchRef.current) {
                aboutMeHandledByTouchRef.current = false;
                return;
              }
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
