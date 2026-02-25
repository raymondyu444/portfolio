import React, { useEffect, useRef, useState } from 'react';
import designSystem from '../../design-system.json';
import cloudImage from '../assets/cloud.png';
import lightYearsImage from '../assets/light-years.png';
import './CloudBackground.css';

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

  // Log when showGalaxy or showGradient changes
  useEffect(() => {
    console.log('CloudBackground showGalaxy changed to:', showGalaxy);
    console.log('CloudBackground showGradient changed to:', showGradient);
  }, [showGalaxy, showGradient]);

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

    // Load galaxy images dynamically
    let loadedCount = 0;
    const totalGalaxies = 68;
    
    for (let i = 1; i <= totalGalaxies; i++) {
      const img = new Image();
      img.src = `/src/assets/galaxy-${i}.png`;
      img.onload = () => {
        galaxyImgRefs.current[i - 1] = img;
        loadedCount++;
        if (loadedCount === totalGalaxies) {
          console.log(`✅ All ${totalGalaxies} galaxy images loaded successfully`);
          setGalaxiesLoaded(true);
        }
      };
      img.onerror = () => {
        console.log(`❌ Failed to load galaxy image ${i}`);
        loadedCount++;
        if (loadedCount === totalGalaxies) {
          setGalaxiesLoaded(true);
        }
      };
    }
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
            speed: (0.01 + Math.random() * 0.02) * 0.25 * direction, // Gentle cloud drift (75% slower)
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
          speed: (Math.random() - 0.5) * 0.0320166 // Speed increased by another 50%
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

    // Animation loop
    const animate = () => {
      // Clear canvas with appropriate background
      if (showGalaxy && lightYearsLoaded) {
        // Draw light-years background image (cover the canvas)
        const scale = Math.max(
          canvas.width / lightYearsImgRef.current.width,
          canvas.height / lightYearsImgRef.current.height
        );
        const scaledWidth = lightYearsImgRef.current.width * scale;
        const scaledHeight = lightYearsImgRef.current.height * scale;
        const x = (canvas.width - scaledWidth) / 2;
        const y = (canvas.height - scaledHeight) / 2;
        
        ctx.drawImage(lightYearsImgRef.current, x, y, scaledWidth, scaledHeight);
        
        // Draw all galaxies with very subtle movement on top
        if (galaxiesLoaded) {
          galaxyData.current.forEach(galaxy => {
            // Very slow drift
            galaxy.x += galaxy.speed;
            
            // Wrap around screen
            if (galaxy.x > canvas.width + 200) galaxy.x = -200;
            if (galaxy.x < -200) galaxy.x = canvas.width + 200;
            
            drawGalaxy(galaxy);
          });
        }
      } else if (showGradient) {
        // Draw sunset gradient (blue -> yellow -> coral) - color stops must be 0-1
        const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
        gradient.addColorStop(0, '#2b7ead'); // Blue at top
        gradient.addColorStop(0.56, '#e1daa3'); // Yellow in middle
        gradient.addColorStop(1, '#e56d6f'); // Coral at bottom
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      } else {
        // Default: when Case Study modal is open use #26282A, otherwise sky blue
        ctx.fillStyle = showCaseStudyModal ? '#26282A' : designSystem.colors.primary.blueSky;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      }

      // Only update and draw clouds when not showing galaxy
      if (!showGalaxy) {
        clouds.current.forEach((cloud) => {
          // Move cloud
          cloud.x += cloud.speed;

          // Wrap around screen based on direction
          const cloudWidth = 643 * cloud.scale;
          
          if (cloud.isReverse) {
            // Moving left
            if (cloud.x < -cloudWidth) {
              cloud.x = canvas.width;
            }
          } else {
            // Moving right
            if (cloud.x > canvas.width) {
              cloud.x = -cloudWidth;
            }
          }

          // Draw cloud
          drawCloud(cloud.x, cloud.y, cloud.scale, 1);
        });
      }

      requestAnimationFrame(animate);
    };

    animate();

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
