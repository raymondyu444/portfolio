import React, { useState, useEffect, useCallback, lazy, Suspense } from 'react';
import PasswordGate from './components/PasswordGate';
import CloudBackground from './components/CloudBackground';
import Ticker from './components/Ticker';
import Carousel from './components/Carousel';
import LoreCard from './components/LoreCard';
import CaseStudyCard from './components/CaseStudyCard';
import './App.css';

const AboutMeModal = lazy(() => import('./components/AboutMeModal'));
const CaseStudyModal = lazy(() => import('./components/CaseStudyModal'));

const MOBILE_BREAKPOINT = 767;

// Import local anime GIFs
import anime1 from './assets/anime-1.gif';
import anime2 from './assets/anime-2.gif';
import anime3 from './assets/anime-3.gif';
import anime4 from './assets/anime-4.gif';
import anime5 from './assets/anime-5.gif';

function App() {
  const [showGalaxy, setShowGalaxy] = useState(false);
  const [showGradient, setShowGradient] = useState(false);
  const [showAboutModal, setShowAboutModal] = useState(false);
  const [showCaseStudyModal, setShowCaseStudyModal] = useState(false);
  const [isMobileView, setIsMobileView] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT}px)`);
    const update = () => setIsMobileView(mq.matches);
    update();
    mq.addEventListener('change', update);
    return () => mq.removeEventListener('change', update);
  }, []);

  const handleGalaxyChange = useCallback((show) => setShowGalaxy(show), []);
  const handleGradientChange = useCallback((show) => setShowGradient(show), []);
  const handleAboutMeClick = useCallback(() => setShowAboutModal(true), []);
  const handleCloseAboutModal = useCallback(() => setShowAboutModal(false), []);
  const handleCaseStudyClick = useCallback(() => setShowCaseStudyModal(true), []);
  const handleCloseCaseStudyModal = useCallback(() => setShowCaseStudyModal(false), []);

  // Galaxy shows when hovering lore card OR when About Me modal is open
  const galaxyVisible = showGalaxy || showAboutModal;

  // Anime GIFs from local assets
  const carouselGifs = [
    anime1,
    anime2,
    anime3,
    anime4,
    anime5,
  ];

  return (
    <>
      <CloudBackground showGalaxy={galaxyVisible} showGradient={showGradient} showCaseStudyModal={showCaseStudyModal} />
      <PasswordGate>
        <div className="App">
          {/* Mobile (Figma 293-688): vertical stack, 24px padding, order Ticker → CaseStudy → Lore → Carousel */}
          <div className="app-cards">
            <Ticker size={isMobileView ? 'mobile' : 'desktop'} />
            <CaseStudyCard type={isMobileView ? 'tablet' : 'desktop'} onHoverChange={handleGradientChange} onCaseStudyClick={handleCaseStudyClick} />
            <LoreCard onHoverChange={handleGalaxyChange} onAboutMeClick={handleAboutMeClick} />
            <Carousel gifs={carouselGifs} size="desktop" />
          </div>
          <Suspense fallback={null}>
            <AboutMeModal isOpen={showAboutModal} onClose={handleCloseAboutModal} />
            <CaseStudyModal isOpen={showCaseStudyModal} onClose={handleCloseCaseStudyModal} />
          </Suspense>
          <div className="content">
            {/* Future portfolio content will go here */}
          </div>
        </div>
      </PasswordGate>
    </>
  );
}

export default App;
