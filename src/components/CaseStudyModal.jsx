/**
 * Case Study modal – Figma 380-1571 first section.
 * Max width 1200px, full height minus 24px top/bottom margin, background #212325.
 */
import React, { useEffect } from 'react';
import heroGif from '../assets/hero.gif';
import finalGif from '../assets/final.gif';
import e1QrCode from '../assets/e1_qr-code.png';
import e2SecureLink from '../assets/e2_secure-link.png';
import e3QrCodeSecureLink from '../assets/e3_qr-code+secure-link.png';
import './CaseStudyModal.css';

const CaseStudyModal = ({ isOpen, onClose }) => {
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
      className="case-study-modal-overlay"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
    >
      <div className="case-study-modal" onClick={(e) => e.stopPropagation()}>
        <div className="case-study-modal__close-wrap">
          <button
            type="button"
            className="case-study-modal__close"
            onClick={onClose}
            aria-label="Close modal"
          >
            <svg className="case-study-modal__close-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
              <path d="M18 6L6 18M6 6l12 12" vectorEffect="nonScalingStroke" />
            </svg>
          </button>
        </div>

        {/* First section – Figma 380-1571: title, subtitle, Challenge | My role, phone mockup */}
        <section className="case-study-modal__hero-section" aria-labelledby="case-study-modal-title">
          <div className="case-study-modal__hero-content">
            <h1 id="case-study-modal-title" className="case-study-modal__title">
              How I improved identity verification by 12%
            </h1>
            <p className="case-study-modal__subtitle">
              And helped protect the bank from fraudsters trying to take advantage of vulnerabilities.
            </p>
          </div>
          <div className="case-study-modal__hero-mockup">
            <img src={heroGif} alt="Scotiabank identity verification – photo of ID" className="case-study-modal__hero-image" />
          </div>
        </section>

        {/* Second section – Figma 343-1489: Challenge | My role, Year/Timeline/Tools; 120px below first */}
        <section className="case-study-modal__overview-section">
          <div className="case-study-modal__overview-col case-study-modal__overview-col--challenge">
            <h2 className="case-study-modal__overview-heading">Challenge</h2>
            <p className="case-study-modal__overview-text">
              A fraud incident in 2023 led to shutting down digital identity verification methods which impacted ~4000 applications online, on a desktop computer, in a 47-day period
            </p>
          </div>
          <div className="case-study-modal__overview-divider" aria-hidden />
          <div className="case-study-modal__overview-col case-study-modal__overview-col--role">
            <h2 className="case-study-modal__overview-heading">My role</h2>
            <p className="case-study-modal__overview-text">
              UX Design, Research, Interaction Design, Prototyping, Usability Testing, Visual Design
            </p>
            <div className="case-study-modal__overview-meta">
              <div className="case-study-modal__overview-meta-item">
                <span className="case-study-modal__overview-meta-label">Year</span>
                <span className="case-study-modal__overview-meta-value">2023</span>
              </div>
              <div className="case-study-modal__overview-meta-item">
                <span className="case-study-modal__overview-meta-label">Timeline</span>
                <span className="case-study-modal__overview-meta-value">3 months</span>
              </div>
              <div className="case-study-modal__overview-meta-item">
                <span className="case-study-modal__overview-meta-label">Tools</span>
                <span className="case-study-modal__overview-meta-value">Figma, FigJam, Confluence</span>
              </div>
            </div>
          </div>
        </section>

        {/* Third section – Figma 343-1508: tl;dr card (Problem, Research, Solution | metrics) */}
        <section className="case-study-modal__tldr-section">
          <div className="case-study-modal__tldr-card">
            <div className="case-study-modal__tldr-col case-study-modal__tldr-col--left">
              <h2 className="case-study-modal__tldr-main-heading">tl;dr</h2>
              <p className="case-study-modal__tldr-question">
                How might we enable users complete identity verification remotely and securely while preventing fraud attacks?
              </p>
              <div className="case-study-modal__tldr-block">
                <h3 className="case-study-modal__tldr-heading">The Problem</h3>
                <p className="case-study-modal__tldr-text">
                  Due to fraud attacks, digital identity verification methods were shut down which impacted ~4000 applications online, on a desktop computer, in a 47-day period.
                </p>
              </div>
              <div className="case-study-modal__tldr-block">
                <h3 className="case-study-modal__tldr-heading">The Research</h3>
                <p className="case-study-modal__tldr-text">
                  After interviewing and conducting usability tests with 6 non-Scotiabank participants, it was revealed that 100% of users preferred self service with identity verification than having to go into a branch.
                </p>
              </div>
              <div className="case-study-modal__tldr-block">
                <h3 className="case-study-modal__tldr-heading">The Solution</h3>
                <p className="case-study-modal__tldr-text">
                  Reuse existing capabilities that have been proven to be safe and secure on mobile devices so people can finish their bank applications where they want.
                </p>
              </div>
            </div>
            <div className="case-study-modal__tldr-divider" aria-hidden />
            <div className="case-study-modal__tldr-col case-study-modal__tldr-col--right">
              <div className="case-study-modal__tldr-metric">
                <span className="case-study-modal__tldr-metric-value">12%</span>
                <span className="case-study-modal__tldr-metric-label">increased overall pass rate</span>
              </div>
              <div className="case-study-modal__tldr-metric">
                <span className="case-study-modal__tldr-metric-value">2x</span>
                <span className="case-study-modal__tldr-metric-label">increased student banking pass rate</span>
              </div>
              <div className="case-study-modal__tldr-metric">
                <span className="case-study-modal__tldr-metric-value">Desktop &gt; Mobile</span>
                <span className="case-study-modal__tldr-metric-label">completion rates</span>
              </div>
            </div>
          </div>
        </section>

        {/* Fourth section – Figma 343-1533: Understand (01) */}
        <section className="case-study-modal__understand-section">
          <header className="case-study-modal__understand-header">
            <span className="case-study-modal__understand-num" aria-hidden><span>01</span></span>
            <h2 className="case-study-modal__understand-title">Understand</h2>
          </header>
          <div className="case-study-modal__understand-content">
            <div className="case-study-modal__understand-block">
              <h3 className="case-study-modal__understand-heading">Context</h3>
              <p className="case-study-modal__understand-text">
                Identity verification is one the most important steps for a bank and client relationship. It&apos;s crucial to prevent fraud, comply with anti-money laundering laws, and to build trust.
              </p>
            </div>
            <div className="case-study-modal__understand-block">
              <h3 className="case-study-modal__understand-heading">Problem</h3>
              <p className="case-study-modal__understand-text">
                Although the vendors that Scotiabank partner with go through intensive screening, vulnerabilities still happen. These events led to improving our current offerings:
              </p>
              <ul className="case-study-modal__understand-list">
                <li>Vulnerabilities with Interac Verification Service and Western Union allowed fraudsters to open fraudulent accounts and access credit.</li>
                <li>People that use their desktop device to apply for bank products were frustrated by being redirected to go into a branch to complete their application.</li>
                <li>People that don&apos;t have access to a branch were excluded.</li>
              </ul>
              <h4 className="case-study-modal__understand-sub">User Problem:</h4>
              <p className="case-study-modal__understand-text case-study-modal__understand-text--bold">
                For people wanting to apply for a bank product online using their desktop computer, they frustrated when their expectations weren&apos;t met.
              </p>
              <h4 className="case-study-modal__understand-sub">Business Problem:</h4>
              <p className="case-study-modal__understand-text case-study-modal__understand-text--bold">The bank lost ~4000 potential primacy clients.</p>
            </div>
            <div className="case-study-modal__understand-block">
              <h4 className="case-study-modal__understand-sub">Goals:</h4>
              <ol className="case-study-modal__understand-list case-study-modal__understand-list--numbered">
                <li>Enable users to verify their identities with us remotely and securely</li>
                <li>Prevent fraud</li>
                               <li>Improve completion rates</li>
              </ol>
            </div>
            <div className="case-study-modal__understand-block">
              <h3 className="case-study-modal__understand-heading">Discovery</h3>
              <p className="case-study-modal__understand-text">
                We uncovered useful insights from current state audits, competitive analysis, and user research:
              </p>
              <ul className="case-study-modal__understand-list">
                <li>There is disparity between identity verification methods between desktop and mobile.</li>
                <li>The main option our competitors verify people&apos;s identity remotely is with a photo ID and a selfie.</li>
                <li>Most of our clients start their banking journeys at home on their desktop computer.</li>
              </ul>
            </div>
            <div className="case-study-modal__understand-block">
              <h3 className="case-study-modal__understand-heading">Emerging Themes</h3>
              <h4 className="case-study-modal__understand-sub case-study-modal__understand-sub--underline">Meet Users Where They Are</h4>
              <p className="case-study-modal__understand-text">72% of people start their bank applications in the privacy of their homes, on a desktop computer.</p>
              <h4 className="case-study-modal__understand-sub case-study-modal__understand-sub--underline">Use The Right Tool For The Job</h4>
              <p className="case-study-modal__understand-text">People understand that scanning their ID is easier on mobile but prefer to finish the application desktop.</p>
              <h4 className="case-study-modal__understand-sub case-study-modal__understand-sub--underline">Guided Continuity</h4>
              <p className="case-study-modal__understand-text">Support users emotionally and cognitively when asking them to switch between different devices.</p>
            </div>
          </div>
        </section>

        {/* Section 02 – Figma 343-1604: Conceptualize */}
        <section className="case-study-modal__conceptualize-section">
          <header className="case-study-modal__understand-header">
            <span className="case-study-modal__understand-num" aria-hidden><span>02</span></span>
            <h2 className="case-study-modal__understand-title">Conceptualize</h2>
          </header>
          <div className="case-study-modal__understand-content">
            <div className="case-study-modal__understand-block">
              <h3 className="case-study-modal__understand-heading">Ideate</h3>
              <p className="case-study-modal__understand-text">
                I facilitated a workshop with my Product Manager and Lead engineer to brainstorm, generate ideas, and develop solutions.
              </p>
              <p className="case-study-modal__understand-text">
                Together we discuss the pros and cons of each option and quickly aligned on a direction that would serve our users needs while also supporting the banks goals of acquisition.
              </p>
              <ol className="case-study-modal__understand-list case-study-modal__understand-list--numbered">
                <li className="case-study-modal__understand-list-item--struck">Search for a new vendor.</li>
                <li className="case-study-modal__understand-list-item--struck">Gracefully direct our users to come into branch to open a bank product:</li>
                <li>Leverage an existing mobile capability and optimize it for desktop.</li>
              </ol>
            </div>
            <div className="case-study-modal__understand-block">
              <h3 className="case-study-modal__understand-heading">Iterate</h3>
              <p className="case-study-modal__understand-text">
                I take my explorations far and wide all the while collaborating with my product manager and engineering. As a team, we decided which 2 experiments we would bring into testing.
              </p>
              <p className="case-study-modal__understand-text">
                The current mobile capability uses technology from the vendor Gemalto. Gemalto&apos;s interface only supports mobile devices. Part of our solution includes how to transition people from desktop to mobile and back from mobile to desktop.
              </p>
              <p className="case-study-modal__understand-text">
                Research with Nielsen Norman and our competitors helped inspire these experiments.
              </p>
            </div>
            <div className="case-study-modal__understand-block">
              <h4 className="case-study-modal__understand-sub">E1 – QR Code</h4>
              <div className="case-study-modal__experiment-mockup">
                <img src={e1QrCode} alt="E1 QR Code experiment mockup" className="case-study-modal__experiment-img" />
              </div>
            </div>
            <div className="case-study-modal__understand-block">
              <h4 className="case-study-modal__understand-sub">E2 – Secure Link</h4>
              <div className="case-study-modal__experiment-mockup">
                <img src={e2SecureLink} alt="E2 Secure Link experiment mockup" className="case-study-modal__experiment-img" />
              </div>
            </div>
            <div className="case-study-modal__understand-block">
              <h4 className="case-study-modal__understand-sub">E3 – QR Code + Secure Link</h4>
              <div className="case-study-modal__experiment-mockup">
                <img src={e3QrCodeSecureLink} alt="E3 QR Code + Secure Link experiment mockup" className="case-study-modal__experiment-img" />
              </div>
            </div>
          </div>
        </section>

        {/* Section 03 – Figma 343-1639: Validate */}
        <section className="case-study-modal__validate-section">
          <header className="case-study-modal__understand-header">
            <span className="case-study-modal__understand-num" aria-hidden><span>03</span></span>
            <h2 className="case-study-modal__understand-title">Validate</h2>
          </header>
          <div className="case-study-modal__understand-content">
            <div className="case-study-modal__understand-block">
              <h3 className="case-study-modal__understand-heading">Testing</h3>
              <p className="case-study-modal__understand-text">
                We conducted usability tests with 6 users – primarily laptop users, 3 female, 3 male, and age ranges from 23-65.
              </p>
              <p className="case-study-modal__understand-text">
                Here is what we learned with our 2 different flows:
              </p>
              <ul className="case-study-modal__understand-list">
                <li>
                  <h4 className="case-study-modal__understand-sub">E1 – QR code:</h4>
                  <p className="case-study-modal__understand-text">This option was perceived as more convenient than in person alternatives.</p>
                  <blockquote className="case-study-modal__understand-quote">&ldquo;Compared to going into the bank, this is <strong>better and easier</strong>.&rdquo;</blockquote>
                </li>
                <li>
                  <h4 className="case-study-modal__understand-sub">E3 – QR Code + Secure Link:</h4>
                  <p className="case-study-modal__understand-text">People are cautious with opening links received via SMS.</p>
                  <blockquote className="case-study-modal__understand-quote">&ldquo;Well, this is what you get from <strong>every scammer trying to scam you, right?</strong>&rdquo;</blockquote>
                </li>
              </ul>
            </div>
          </div>
        </section>

        {/* Section 04 – Figma 343-1662: Finalize */}
        <section className="case-study-modal__finalize-section">
          <header className="case-study-modal__understand-header">
            <span className="case-study-modal__understand-num" aria-hidden><span>04</span></span>
            <h2 className="case-study-modal__understand-title">Finalize</h2>
          </header>
          <div className="case-study-modal__understand-content">
            <div className="case-study-modal__understand-block">
              <h3 className="case-study-modal__understand-heading">Refine</h3>
              <p className="case-study-modal__understand-text">
                We also learned that some people aren&apos;t familiar with how to scan a QR code with their mobile device. We brought this into refining the designs.
              </p>
            </div>
            <div className="case-study-modal__understand-block">
              <h3 className="case-study-modal__understand-heading">Handoff</h3>
              <ul className="case-study-modal__understand-list">
                <li>I work closely with my Product Manager, Engineers, and Delivery Lead to help craft stories, requirements, and interpret the intention of the designs.</li>
                <li>I make myself available and partner closely to makes sure it&apos;s an easy transition.</li>
                <li>During the QA process, I&apos;m as candid as I can be to make sure the vision is captured in the final product.</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Final GIF – 120px between Finalize and here, 120px between here and Results */}
        <div className="case-study-modal__final-gif-wrap">
          <img src={finalGif} alt="" className="case-study-modal__final-gif" />
        </div>

        {/* Section 05 – Figma 343-1688: Results (last section, after final gif) */}
        <section className="case-study-modal__results-section">
          <header className="case-study-modal__understand-header">
            <span className="case-study-modal__understand-num" aria-hidden><span>05</span></span>
            <h2 className="case-study-modal__understand-title">Results</h2>
          </header>
          <div className="case-study-modal__understand-content">
            <div className="case-study-modal__understand-block">
              <h3 className="case-study-modal__understand-heading">Goals</h3>
              <p className="case-study-modal__understand-text">
                As a reminder, these were the goals we aimed for:
              </p>
              <ol className="case-study-modal__understand-list case-study-modal__understand-list--numbered">
                <li>Enable users to verify their identities with us remotely and securely</li>
                <li>Prevent fraud</li>
                <li>Improve completion rates</li>
              </ol>
            </div>
            <div className="case-study-modal__understand-block">
              <h3 className="case-study-modal__understand-heading">Impact</h3>
              <p className="case-study-modal__understand-text">
                The success of the project was driven by team work and collaboration. Here are the highlights of what we accomplished and improved:
              </p>
              <ol className="case-study-modal__understand-list case-study-modal__understand-list--numbered">
                <li>Increased overall pass rate by 12%.</li>
                <li>Increased student banking pass rate by over 2x.</li>
                <li>Completion rates on desktop devices rose above mobile devices.</li>
              </ol>
            </div>
            <div className="case-study-modal__understand-block">
              <h3 className="case-study-modal__understand-heading">Reflection</h3>
              <p className="case-study-modal__understand-text">
                I also learned:
              </p>
              <ul className="case-study-modal__understand-list">
                <li>72% of people start their banking applications in the privacy of their homes, on a desktop computer.</li>
                <li>As common as scanning a QR code is, some people need help to do it.</li>
                <li>Customers make their own assumptions about digital identity verification and choose an option based on perceived convenience.</li>
              </ul>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default CaseStudyModal;
