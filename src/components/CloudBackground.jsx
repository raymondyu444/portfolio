import React, { useEffect, useRef, useState } from 'react';
import designSystem from '../../design-system.json';
import cloudImage from '../assets/cloud.png';
import lightYearsImage from '../assets/light-years.png';
import './CloudBackground.css';

// Load galaxy images via Vite so URLs resolve in dev and build
const galaxyModules = import.meta.glob('../assets/galaxy-*.png', { query: '?url', import: 'default', eager: true });
const galaxyUrls = Object.keys(galaxyModules)
  .sort((a, b) => parseInt(a.match(/galaxy-(\d+)/)[1], 10) - parseInt(b.match(/galaxy-(\d+)/)[1], 10))
  .map((key) => galaxyModules[key]);

const TRANSITION_MS = 500;
// Galaxy transition: light-years first; galaxy PNGs stay at 0 until light-years is fully in
const GALAXY_TRANSITION_MS = 1000;
const GALAXY_BG_FRAC = 0.25;     // progress 0–0.25: light-years fades in
const GALAXY_DELAY_FRAC = 0.14; // sprites start at 140ms
const GALAXY_DRIFT_MULTIPLIER = 0.25; // 50% slower (half of previous)

// Smoothstep for eased transition
const smoothstep = (t) => t * t * (3 - 2 * t);
// Smootherstep (zero derivative at 0 and 1) for gentler galaxy fade-in
const smootherstep = (t) => t * t * t * (t * (t * 6 - 15) + 10);

const CloudBackground = ({ showGalaxy, showGradient, showCaseStudyModal }) => {
  const canvasRef = useRef(null);
  const clouds = useRef([]);
  const cloudImgRef = useRef(null);
  const lightYearsImgRef = useRef(null);
  const galaxyImgRefs = useRef([]);
  const galaxyData = useRef([]);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [lightYearsLoaded, setLightYearsLoaded] = useState(false);
  const [galaxiesLoaded, setGalaxiesLoaded] = useState(false);
  const transitionRef = useRef({ progress: 1, from: 'sky', to: 'sky', durationMs: TRANSITION_MS });
  const lastFrameTimeRef = useRef(null);

  useEffect(() => {
    // Load cloud image
    const img = new Image();
    img.src = cloudImage;
    img.onload = () => {
      cloudImgRef.current = img;
      setImageLoaded(true);
    };

    // Load light-years background image
    const lightYearsImg = new Image();
    lightYearsImg.src = lightYearsImage;
    lightYearsImg.onload = () => {
      console.log('✅ Light-years background loaded');
      lightYearsImgRef.current = lightYearsImg;
      setLightYearsLoaded(true);
    };
    lightYearsImg.onerror = () => {
      console.log('❌ Failed to load light-years background');
    };

    // Load galaxy images (URLs from Vite so they work in dev and build)
    let loadedCount = 0;
    const totalGalaxies = galaxyUrls.length;
    if (totalGalaxies === 0) setGalaxiesLoaded(true);

    galaxyUrls.forEach((url, index) => {
      const img = new Image();
      img.src = url;
      img.onload = () => {
        galaxyImgRefs.current[index] = img;
        loadedCount++;
        if (loadedCount === totalGalaxies) {
          console.log(`✅ All ${totalGalaxies} galaxy images loaded successfully`);
          setGalaxiesLoaded(true);
        }
      };
      img.onerror = () => {
        console.log(`❌ Failed to load galaxy image ${index + 1}`);
        loadedCount++;
        if (loadedCount === totalGalaxies) setGalaxiesLoaded(true);
      };
    });
  }, []);

  useEffect(() => {
    if (!imageLoaded) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    
    // Cloud data structure - evenly spaced grid layout
    const generateClouds = () => {
      const generatedClouds = [];
      const cloudWidth = 643;
      const cloudHeight = 298;
      
      // Calculate grid: 5 rows x dynamic columns based on screen width
      const rows = 5;
      const cols = Math.ceil((canvas.width / cloudWidth) * 0.15) + 2;
      
      // Calculate spacing
      const horizontalSpacing = canvas.width / cols;
      const verticalSpacing = canvas.height / rows;
      
      for (let row = 0; row < rows; row++) {
        // Vary the starting x offset for each row
        const rowXOffset = (row * horizontalSpacing * 0.5) % horizontalSpacing;
        
        for (let col = 0; col < cols; col++) {
          // Evenly space clouds with row offset
          const x = col * horizontalSpacing - cloudWidth / 2 + rowXOffset;
          const y = row * verticalSpacing;
          
          let isReverse;
          if (row === 0 || row === 1 || row === 3) {
            isReverse = false; // Move right
          } else {
            isReverse = true; // Move left
          }
          
          const direction = isReverse ? -1 : 1;
          
          generatedClouds.push({
            x: x,
            y: y,
            initialX: x,
            row: row,
            col: col,
            scale: 1,
            speed: (0.01 + Math.random() * 0.02) * 0.33203125 * direction, // Gentle cloud drift (15% slower)
            opacity: 1,
            isReverse: isReverse
          });
        }
      }

      return generatedClouds;
    };

    // Generate random positions for galaxies across the screen
    const generateGalaxyPositions = () => {
      galaxyData.current = [];
      
      // Create a grid-based distribution for natural spacing
      const cols = Math.ceil(canvas.width / 200); // Galaxy every ~200px
      const rows = Math.ceil(canvas.height / 200);
      
      galaxyImgRefs.current.forEach((img, index) => {
        if (!img) return;
        
        // Distribute galaxies across screen with some randomness
        const col = index % cols;
        const row = Math.floor(index / cols) % rows;
        
        // Add randomness to grid positions
        const baseX = (col / cols) * canvas.width;
        const baseY = (row / rows) * canvas.height;
        const randomOffsetX = (Math.random() - 0.5) * 150;
        const randomOffsetY = (Math.random() - 0.5) * 150;
        
        galaxyData.current.push({
          img: img,
          x: baseX + randomOffsetX,
          y: baseY + randomOffsetY,
          // Increased by 10%: scale between 13.75% and 35.75%
          scale: 0.1375 + Math.random() * 0.22,
          opacity: 0.4 + Math.random() * 0.6, // Varied brightness
          speed: (Math.random() - 0.5) * 0.01120581 // 50% slower
        });
      });
    };
    
    // Set canvas size to window size
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      
      // Regenerate galaxy positions on resize
      if (galaxiesLoaded) {
        generateGalaxyPositions();
      }
    };
    
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Use same clouds for blue sky and gradient hover - only generate once
    if (!clouds.current.length) {
      clouds.current = generateClouds();
    }
    
    if (galaxiesLoaded) {
      generateGalaxyPositions();
    }

    // Draw a single cloud using the image
    const drawCloud = (x, y, scale, opacity) => {
      if (!cloudImgRef.current) return;

      ctx.save();
      ctx.globalAlpha = opacity;
      
      const width = 643 * scale;
      const height = 298 * scale;
      
      ctx.drawImage(cloudImgRef.current, x, y, width, height);
      
      ctx.restore();
    };

    // Draw a single galaxy with preserved aspect ratio
    const drawGalaxy = (galaxy) => {
      if (!galaxy.img) return;

      ctx.save();
      ctx.globalAlpha = galaxy.opacity;
      
      // Preserve aspect ratio - scale uniformly
      const width = galaxy.img.width * galaxy.scale;
      const height = galaxy.img.height * galaxy.scale;
      
      ctx.drawImage(galaxy.img, galaxy.x, galaxy.y, width, height);
      
      ctx.restore();
    };

    const getTargetState = () => {
      if (showGalaxy) return 'galaxy';
      if (showGradient) return 'gradient';
      return 'sky';
    };

    const drawSkyBg = () => {
      ctx.fillStyle = showCaseStudyModal ? '#26282A' : designSystem.colors.primary.blueSky;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    };

    const drawGradientBg = () => {
      const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
      gradient.addColorStop(0, '#2b7ead');
      gradient.addColorStop(0.56, '#e1daa3');
      gradient.addColorStop(1, '#e56d6f');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    };

    // Light-years image only (no galaxy sprites)
    const drawGalaxyBgImage = () => {
      if (!lightYearsImgRef.current || !lightYearsLoaded) return;
      const scale = Math.max(
        canvas.width / lightYearsImgRef.current.width,
        canvas.height / lightYearsImgRef.current.height
      );
      const scaledWidth = lightYearsImgRef.current.width * scale;
      const scaledHeight = lightYearsImgRef.current.height * scale;
      const x = (canvas.width - scaledWidth) / 2;
      const y = (canvas.height - scaledHeight) / 2;
      ctx.drawImage(lightYearsImgRef.current, x, y, scaledWidth, scaledHeight);
    };

    const updateGalaxyPositions = () => {
      if (!galaxiesLoaded) return;
      galaxyData.current.forEach(galaxy => {
        galaxy.x += galaxy.speed * GALAXY_DRIFT_MULTIPLIER;
        if (galaxy.x > canvas.width + 200) galaxy.x = -200;
        if (galaxy.x < -200) galaxy.x = canvas.width + 200;
      });
    };

    const drawGalaxySpritesOnly = () => {
      if (!galaxiesLoaded) return;
      galaxyData.current.forEach(galaxy => drawGalaxy(galaxy));
    };

    const drawGalaxyBg = () => {
      drawGalaxyBgImage();
      updateGalaxyPositions();
      drawGalaxySpritesOnly();
    };

    const drawBackground = (state) => {
      if (state === 'galaxy') drawGalaxyBg();
      else if (state === 'gradient') drawGradientBg();
      else drawSkyBg();
    };

    // Start transition when target state changes
    const target = getTargetState();
    if (target !== transitionRef.current.to) {
      transitionRef.current.from = transitionRef.current.to;
      transitionRef.current.to = target;
      transitionRef.current.progress = 0;
      transitionRef.current.durationMs = target === 'galaxy' ? GALAXY_TRANSITION_MS : TRANSITION_MS;
      lastFrameTimeRef.current = null; // so first frame doesn't use stale delta and jump progress
    }
    // If effect re-runs while entering galaxy (e.g. images just loaded), restart from 0 so nothing shows until transition
    if (target === 'galaxy' && transitionRef.current.progress > 0 && transitionRef.current.progress < GALAXY_BG_FRAC) {
      transitionRef.current.progress = 0;
      lastFrameTimeRef.current = null;
    }

    // Animation loop
    const animate = (now) => {
      const t = transitionRef.current;
      if (lastFrameTimeRef.current != null && t.progress < 1) {
        let delta = now - lastFrameTimeRef.current;
        delta = Math.min(delta, 80); // cap so we never skip the transition (e.g. tab in background)
        t.progress = Math.min(1, t.progress + delta / t.durationMs);
      }
      lastFrameTimeRef.current = now;

      if (t.progress < 1) {
        const eased = smoothstep(t.progress);
        drawBackground(t.from);
        ctx.save();
        if (t.to === 'galaxy') {
          const p = t.progress;
          const bgAlpha = p < GALAXY_BG_FRAC ? smootherstep(p / GALAXY_BG_FRAC) : 1;
          const spriteT = p <= GALAXY_DELAY_FRAC ? 0 : (p - GALAXY_DELAY_FRAC) / (1 - GALAXY_DELAY_FRAC);
          const spritesAlpha = spriteT <= 0 ? 0 : 0.5 - 0.5 * Math.cos(Math.PI * spriteT);
          ctx.globalAlpha = bgAlpha;
          drawGalaxyBgImage();
          updateGalaxyPositions();
          if (p > GALAXY_DELAY_FRAC) {
            ctx.globalAlpha = spritesAlpha;
            drawGalaxySpritesOnly();
          }
        } else {
          ctx.globalAlpha = eased;
          drawBackground(t.to);
        }
        ctx.restore();
      } else {
        drawBackground(t.to);
      }

      if (!showGalaxy) {
        clouds.current.forEach((cloud) => {
          cloud.x += cloud.speed;
          const cloudWidth = 643 * cloud.scale;
          if (cloud.isReverse) {
            if (cloud.x < -cloudWidth) cloud.x = canvas.width;
          } else {
            if (cloud.x > canvas.width) cloud.x = -cloudWidth;
          }
          drawCloud(cloud.x, cloud.y, cloud.scale, 1);
        });
      }

      requestAnimationFrame(animate);
    };

    requestAnimationFrame(animate);

    return () => {
      window.removeEventListener('resize', resizeCanvas);
    };
  }, [imageLoaded, showGalaxy, showGradient, showCaseStudyModal, lightYearsLoaded, galaxiesLoaded]);

  return (
    <div className="cloud-background">
      <canvas ref={canvasRef} className="cloud-canvas" />
    </div>
  );
};

export default CloudBackground;
