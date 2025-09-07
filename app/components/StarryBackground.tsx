'use client';

import { useEffect, useRef, useState } from 'react';

interface Star {
  x: number;
  y: number;
  size: number;
  speed: number;
  opacity: number;
  twinklePhase: number;
  originalX: number;
  originalY: number;
  originalSize: number;
  originalOpacity: number;
}

interface CursorPosition {
  x: number;
  y: number;
}

export default function StarryBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number | null>(null);
  const starsRef = useRef<Star[]>([]);
  const [cursorPosition, setCursorPosition] = useState<CursorPosition>({ x: 0, y: 0 });
  const [isMouseOver, setIsMouseOver] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    const resizeCanvas = () => {
      const dpr = window.devicePixelRatio || 1;
      const rect = canvas.getBoundingClientRect();
      
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      
      ctx.scale(dpr, dpr);
      canvas.style.width = rect.width + 'px';
      canvas.style.height = rect.height + 'px';
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Mouse event handlers
    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      setCursorPosition({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      });
    };

    const handleMouseEnter = () => setIsMouseOver(true);
    const handleMouseLeave = () => setIsMouseOver(false);

    canvas.addEventListener('mousemove', handleMouseMove);
    canvas.addEventListener('mouseenter', handleMouseEnter);
    canvas.addEventListener('mouseleave', handleMouseLeave);

    // Create stars with enhanced variety
    const createStars = () => {
      const stars: Star[] = [];
      const rect = canvas.getBoundingClientRect();
      const numStars = Math.floor((rect.width * rect.height) / 5000);
      
      for (let i = 0; i < numStars; i++) {
        const x = Math.random() * rect.width;
        const y = Math.random() * rect.height;
        const size = Math.random() * 2 + 0.2;
        const opacity = Math.random() * 0.8 + 0.1;
        
        stars.push({
          x,
          y,
          size,
          speed: Math.random() * 0.2 + 0.02,
          opacity,
          twinklePhase: Math.random() * Math.PI * 2,
          originalX: x,
          originalY: y,
          originalSize: size,
          originalOpacity: opacity,
        });
      }
      
      starsRef.current = stars;
    };

    createStars();

    // Animation loop
    const animate = () => {
      const rect = canvas.getBoundingClientRect();
      ctx.clearRect(0, 0, rect.width, rect.height);
      
      starsRef.current.forEach((star) => {
        // Calculate distance from cursor
        const dx = cursorPosition.x - star.x;
        const dy = cursorPosition.y - star.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        // Cursor interaction effects
        let interactionFactor = 1;
        let attractionX = 0;
        let attractionY = 0;
        
        if (isMouseOver && distance < 150) {
          // Attraction effect - stars move towards cursor
          const attractionStrength = (150 - distance) / 150;
          const attractionForce = attractionStrength * 0.5;
          
          attractionX = dx * attractionForce * 0.01;
          attractionY = dy * attractionForce * 0.01;
          
          // Size and opacity increase near cursor
          interactionFactor = 1 + attractionStrength * 2;
        }
        
        // Update star position with attraction
        star.y += star.speed + attractionY;
        star.x += attractionX;
        star.twinklePhase += 0.02;
        
        // Reset star position if it goes off screen
        if (star.y > rect.height) {
          star.y = 0;
          star.x = Math.random() * rect.width;
          star.originalX = star.x;
          star.originalY = star.y;
        }
        
        // Calculate twinkling opacity with interaction
        const twinkleOpacity = 0.5 + 0.5 * Math.sin(star.twinklePhase);
        const finalOpacity = star.originalOpacity * twinkleOpacity * interactionFactor;
        const finalSize = star.originalSize * interactionFactor;
        
        // Draw star with enhanced effects
        ctx.save();
        ctx.globalAlpha = finalOpacity;
        
        // Create gradient for star
        const gradient = ctx.createRadialGradient(
          star.x, star.y, 0,
          star.x, star.y, finalSize * 3
        );
        
        // Color changes based on cursor proximity - enhanced cosmic colors
        if (distance < 100) {
          gradient.addColorStop(0, '#8b5cf6');
          gradient.addColorStop(0.3, '#3b82f6');
          gradient.addColorStop(0.7, '#06b6d4');
          gradient.addColorStop(1, 'transparent');
        } else {
          gradient.addColorStop(0, '#ffffff');
          gradient.addColorStop(0.3, '#e0e7ff');
          gradient.addColorStop(0.7, '#c7d2fe');
          gradient.addColorStop(1, 'transparent');
        }
        
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(star.x, star.y, finalSize * 3, 0, Math.PI * 2);
        ctx.fill();
        
        // Add bright core
        ctx.globalAlpha = finalOpacity * 1.5;
        ctx.fillStyle = distance < 100 ? '#8b5cf6' : '#ffffff';
        ctx.beginPath();
        ctx.arc(star.x, star.y, finalSize * 0.8, 0, Math.PI * 2);
        ctx.fill();
        
        // Add sparkle effect for nearby stars
        if (distance < 80) {
          ctx.globalAlpha = finalOpacity * 0.8;
          ctx.fillStyle = '#ffffff';
          ctx.beginPath();
          ctx.arc(star.x, star.y, finalSize * 0.3, 0, Math.PI * 2);
          ctx.fill();
        }
        
        ctx.restore();
      });
      
      // Draw cursor trail effect with cosmic colors
      if (isMouseOver) {
        ctx.save();
        ctx.globalAlpha = 0.08;
        
        // Create cursor trail gradient
        const trailGradient = ctx.createRadialGradient(
          cursorPosition.x, cursorPosition.y, 0,
          cursorPosition.x, cursorPosition.y, 80
        );
        trailGradient.addColorStop(0, '#8b5cf6');
        trailGradient.addColorStop(0.5, '#3b82f6');
        trailGradient.addColorStop(1, 'transparent');
        
        ctx.fillStyle = trailGradient;
        ctx.beginPath();
        ctx.arc(cursorPosition.x, cursorPosition.y, 80, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }
      
      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      canvas.removeEventListener('mousemove', handleMouseMove);
      canvas.removeEventListener('mouseenter', handleMouseEnter);
      canvas.removeEventListener('mouseleave', handleMouseLeave);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [cursorPosition, isMouseOver]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 w-full h-full z-0"
      style={{ 
        background: 'linear-gradient(135deg, #0f0f23 0%, #1a1a2e 50%, #16213e 100%)',
        cursor: 'none'
      }}
    />
  );
}
