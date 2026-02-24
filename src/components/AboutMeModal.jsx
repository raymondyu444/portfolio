/**
 * About Me modal – Figma node 291-2248
 * https://www.figma.com/design/OvCMtnYWhCIcoEWGNEbNQT/Portfolio-2026?node-id=291-2248&m=dev
 */
import React, { useEffect } from 'react';
import rayProfile from '../assets/ray-profile.png';
import './AboutMeModal.css';

const STATS = [
  { label: 'Location', value: 'Vancouver, BC' },
  { label: 'Experience', value: '7+ years' },
  { label: 'Superpower', value: 'High fidelity prototyping' },
  { label: 'Hours surfed', value: '2,433' },
  { label: 'Countries Visited', value: '10' },
  { label: 'Highest Elevation', value: '4,096 m' },
];

const AboutMeModal = ({ isOpen, onClose }) => {
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = '';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="about-me-modal-overlay"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="about-me-heading"
    >
      <div className="about-me-modal" onClick={(e) => e.stopPropagation()}>
        {/* Close in its own div, top-right corner (all breakpoints) */}
        <div className="about-me-modal__close-wrap">
          <button
            type="button"
            className="about-me-modal__close"
            onClick={onClose}
            aria-label="Close modal"
          >
            <svg className="about-me-modal__close-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
              <path d="M18 6L6 18M6 6l12 12" vectorEffect="nonScalingStroke" />
            </svg>
          </button>
        </div>

        <div className="about-me-modal__content">
          {/* Mobile only: profile image only (no close in image area) */}
          <div className="about-me-modal__mobile-header">
            <div className="about-me-modal__profile about-me-modal__profile--mobile">
              <img src={rayProfile} alt="Ray" className="about-me-modal__profile-image" />
            </div>
          </div>

          {/* Main: title full-width, then row of paragraphs + image (image aligned with paragraphs) */}
          <div className="about-me-modal__main">
            <h1 id="about-me-heading" className="about-me-modal__heading">
              Hello there!
            </h1>
            <div className="about-me-modal__main-row">
              <div className="about-me-modal__bio">
                <p>My name is Ray and I enjoy the innovation of craft, solving problems, and mentoring others.</p>
                <p>I'm curious by nature and love exploring this wonderful world. I also enjoy travelling and meeting new people.</p>
                <p>Outside of work I enjoy fixing things, taking pictures, and thinking outdoors.</p>
              </div>
              <div className="about-me-modal__profile about-me-modal__profile--desktop">
                <img src={rayProfile} alt="Ray" className="about-me-modal__profile-image" />
              </div>
            </div>
          </div>

          <div className="about-me-modal__stats">
            {STATS.map(({ label, value }) => (
              <div key={label} className="about-me-modal__stat">
                <span className="about-me-modal__stat-label">{label}</span>
                <span className="about-me-modal__stat-value">{value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutMeModal;
