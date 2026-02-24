import React, { useState, useRef, useEffect } from 'react';
import './Ticker.css';

const CARD_MARGIN = 24;
const LAYOUT_GAP = 24;
const TICKER_DESKTOP_WIDTH = 480;
const TICKER_MOBILE_WIDTH = 327;
const TICKER_HEIGHT = 120;

const clampTickerPosition = (x, y, w, h) => ({
  x: Math.max(CARD_MARGIN, Math.min(x, window.innerWidth - CARD_MARGIN - w)),
  y: Math.max(CARD_MARGIN, Math.min(y, window.innerHeight - CARD_MARGIN - h)),
});

/* Desktop layout: ticker top aligned with carousel, left edge aligned with lore card */
const getTickerDefaultPosition = () => {
  if (typeof window === 'undefined') return { x: 100, y: 80 };
  const cw = window.innerWidth;
  const ch = window.innerHeight;
  const centerX = (cw - 480) / 2;
  const centerY = (ch - 286) / 2;
  const tickerW = TICKER_DESKTOP_WIDTH;
  const carouselSize = 220;
  const loreWidth = 208;
  const carouselDownOffset = 40;
  const tickerLoreLeftOffset = 40;
  const x = Math.max(CARD_MARGIN, Math.min(centerX - loreWidth - LAYOUT_GAP - tickerLoreLeftOffset, cw - CARD_MARGIN - tickerW));
  const y = Math.max(CARD_MARGIN, centerY - carouselSize - LAYOUT_GAP + carouselDownOffset);
  return { x, y };
};

const Ticker = ({ size = 'desktop' }) => {
  const [position, setPosition] = useState(getTickerDefaultPosition);
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const tickerRef = useRef(null);
  const pathRef = useRef(null);
  const textPathRef = useRef(null);
  const animationRef = useRef(null);

  const isMobile = size === 'mobile';
  const width = isMobile ? TICKER_MOBILE_WIDTH : TICKER_DESKTOP_WIDTH;
  const height = TICKER_HEIGHT;
  const textFontSize = isMobile ? 24 : 28; /* Figma 340-3071: mobile ticker */

  // Keep ticker within viewport (24px margin); re-clamp on resize
  useEffect(() => {
    const onResize = () => {
      setPosition((prev) => clampTickerPosition(prev.x, prev.y, width, height));
    };
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, [width]);

  // Reset to default layout when switching from desktop to mobile so layout is default when returning to desktop
  useEffect(() => {
    if (isMobile) {
      setPosition(getTickerDefaultPosition());
    }
  }, [isMobile]);

  const singleText = "Welcome to my website • My name is Ray • I'm a Senior Product Designer • I live in Vancouver • ";
  
  // Repeat text many times to ensure smooth scrolling
  const repeatedText = singleText.repeat(50);

  // Drag handlers
  const handleMouseDown = (e) => {
    setIsDragging(true);
    const rect = tickerRef.current.getBoundingClientRect();
    setDragOffset({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    });
  };

  const handleTouchStart = (e) => {
    setIsDragging(true);
    const touch = e.touches[0];
    const rect = tickerRef.current.getBoundingClientRect();
    setDragOffset({
      x: touch.clientX - rect.left,
      y: touch.clientY - rect.top
    });
  };

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (!isDragging) return;
      const next = clampTickerPosition(e.clientX - dragOffset.x, e.clientY - dragOffset.y, width, height);
      setPosition(next);
    };

    const handleTouchMove = (e) => {
      if (!isDragging) return;
      const touch = e.touches[0];
      const next = clampTickerPosition(touch.clientX - dragOffset.x, touch.clientY - dragOffset.y, width, height);
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
  }, [isDragging, dragOffset, width]);

  // Generate wave path
  const extendLeft = 400;
  const extendRight = 400;
  const pathStart = -extendLeft;
  const pathEnd = width + extendRight;
  const pathLength = pathEnd - pathStart;
  const topY = 25;
  const bottomY = height - 5;
  const centerY = (topY + bottomY) / 2;
  const numWaves = isMobile ? 2 : 3;
  const segments = 200;

  let pathD = `M ${pathStart} ${centerY}`;
  for (let i = 1; i <= segments; i++) {
    const x = pathStart + (pathLength * i / segments);
    const progress = i / segments;
    const wavePhase = progress * Math.PI * 2 * numWaves;
    const amplitudeVariation = Math.abs(Math.sin(progress * Math.PI * numWaves * 0.7)) * 0.6 + 0.4;
    const maxAmplitude = (bottomY - topY) / 2;
    const currentAmplitude = maxAmplitude * amplitudeVariation;
    const y = centerY + Math.sin(wavePhase) * currentAmplitude;
    pathD += ` L ${x} ${y}`;
  }

  // Animation using requestAnimationFrame - measure actual rendered text on path
  useEffect(() => {
    const pathEl = pathRef.current;
    const textPathEl = textPathRef.current;
    const textElement = textPathEl?.parentElement;
    if (!pathEl || !textPathEl || !textElement) return;

    // Wait for fonts and full layout
    const timer = setTimeout(() => {
      // Create temporary single-copy text to measure on the actual path
      const tempG = document.createElementNS('http://www.w3.org/2000/svg', 'g');
      const tempText = document.createElementNS('http://www.w3.org/2000/svg', 'text');
      tempText.setAttribute('font-size', String(textFontSize));
      tempText.setAttribute('font-family', "'Work Sans', sans-serif");
      tempText.setAttribute('font-weight', '700');
      tempText.setAttribute('letter-spacing', '0.1em');
      tempText.setAttribute('fill', 'white');
      
      const tempTextPath = document.createElementNS('http://www.w3.org/2000/svg', 'textPath');
      tempTextPath.setAttribute('href', `#wavePath-${size}`);
      tempTextPath.textContent = singleText;
      
      tempText.appendChild(tempTextPath);
      tempG.appendChild(tempText);
      textElement.parentElement.appendChild(tempG);
      
      // Force layout and measure
      requestAnimationFrame(() => {
        const bbox = tempText.getBBox();
        const measuredWidth = bbox.width;
        tempG.remove();
        
        const speed = 30; // pixels per second
        let offset = 0;
        let lastTime = performance.now();

        const animate = (currentTime) => {
          const deltaTime = (currentTime - lastTime) / 1000;
          lastTime = currentTime;

          // Cap delta
          const cappedDelta = Math.min(deltaTime, 0.05);
          
          // Increment offset smoothly
          offset += speed * cappedDelta;
          
          // Loop using the exact measured width
          if (offset >= measuredWidth) {
            offset = offset - measuredWidth;
          }

          textPathEl.setAttribute('startOffset', -offset);
          
          animationRef.current = requestAnimationFrame(animate);
        };

        animationRef.current = requestAnimationFrame(animate);
      });
    }, 300); // Even longer wait for complete rendering

    return () => {
      clearTimeout(timer);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [singleText, size, textFontSize]);

  return (
    <div
      ref={tickerRef}
      className={`ticker ${isMobile ? 'ticker--mobile' : 'ticker--desktop'} ${isDragging ? 'ticker--dragging' : ''}`}
      style={{
        left: `${position.x}px`,
        top: `${position.y}px`,
        width: `${width}px`,
        height: `${height}px`
      }}
      onMouseDown={handleMouseDown}
      onTouchStart={handleTouchStart}
    >
      <svg
        width={width}
        height={height}
        viewBox={`0 0 ${width} ${height}`}
        className="ticker__svg"
        style={{ overflow: 'visible' }}
      >
        <defs>
          <path
            ref={pathRef}
            id={`wavePath-${size}`}
            d={pathD}
            fill="none"
          />
          <clipPath id={`clip-${size}`}>
            <rect x="0" y="0" width={width} height={height} />
          </clipPath>
        </defs>

        <g clipPath={`url(#clip-${size})`}>
          <text className="ticker__text" fill="white" fontSize={textFontSize} fontFamily="'Work Sans', sans-serif" fontWeight="700" letterSpacing="0.1em">
            <textPath ref={textPathRef} href={`#wavePath-${size}`} startOffset="0">
              {repeatedText}
            </textPath>
          </text>
        </g>
      </svg>
    </div>
  );
};

export default Ticker;
