import React, { useState, useEffect } from 'react';
import CloudBackground from './components/CloudBackground';
import Ticker from './components/Ticker';
import Carousel from './components/Carousel';
import LoreCard from './components/LoreCard';
import CaseStudyCard from './components/CaseStudyCard';
import AboutMeModal from './components/AboutMeModal';
import CaseStudyModal from './components/CaseStudyModal';
import './App.css';

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

  const handleGalaxyChange = (show) => {
    setShowGalaxy(show);
  };

  const handleGradientChange = (show) => {
    setShowGradient(show);
  };

  const handleAboutMeClick = () => {
    setShowAboutModal(true);
  };

  const handleCloseAboutModal = () => {
    setShowAboutModal(false);
  };

  const handleCaseStudyClick = () => {
    setShowCaseStudyModal(true);
  };

  const handleCloseCaseStudyModal = () => {
    setShowCaseStudyModal(false);
  };

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
    <div className="App">
      <CloudBackground showGalaxy={galaxyVisible} showGradient={showGradient} showCaseStudyModal={showCaseStudyModal} />
      {/* Mobile (Figma 293-688): vertical stack, 24px padding, order Ticker → CaseStudy → Lore → Carousel */}
      <div className="app-cards">
        <Ticker size={isMobileView ? 'mobile' : 'desktop'} />
        <CaseStudyCard type={isMobileView ? 'tablet' : 'desktop'} onHoverChange={handleGradientChange} onCaseStudyClick={handleCaseStudyClick} />
        <LoreCard onHoverChange={handleGalaxyChange} onAboutMeClick={handleAboutMeClick} />
        <Carousel gifs={carouselGifs} size="desktop" />
      </div>
      <AboutMeModal isOpen={showAboutModal} onClose={handleCloseAboutModal} />
      <CaseStudyModal isOpen={showCaseStudyModal} onClose={handleCloseCaseStudyModal} />
      <div className="content">
        {/* Future portfolio content will go here */}
      </div>
    </div>
  );
}

export default App;
