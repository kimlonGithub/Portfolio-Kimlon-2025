'use client';

import { useEffect, useRef, useState } from 'react';

interface CursorPosition {
  x: number;
  y: number;
}

export default function InteractiveCursor() {
  const cursorRef = useRef<HTMLDivElement>(null);
  const followerRef = useRef<HTMLDivElement>(null);
  const trailRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState<CursorPosition>({ x: 0, y: 0 });
  const [followerPosition, setFollowerPosition] = useState<CursorPosition>({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);
  const [isClicking, setIsClicking] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const updateCursor = (e: MouseEvent) => {
      setPosition({ x: e.clientX, y: e.clientY });
      setIsVisible(true);
    };

    const handleMouseDown = () => setIsClicking(true);
    const handleMouseUp = () => setIsClicking(false);

    const handleMouseEnter = () => setIsVisible(true);
    const handleMouseLeave = () => setIsVisible(false);

    // Add event listeners
    document.addEventListener('mousemove', updateCursor);
    document.addEventListener('mousedown', handleMouseDown);
    document.addEventListener('mouseup', handleMouseUp);
    document.addEventListener('mouseenter', handleMouseEnter);
    document.addEventListener('mouseleave', handleMouseLeave);

    // Handle hover states for interactive elements
    const handleElementMouseEnter = () => setIsHovering(true);
    const handleElementMouseLeave = () => setIsHovering(false);

    // Add hover listeners to interactive elements
    const interactiveElements = document.querySelectorAll('a, button, [role="button"], input, textarea, select');
    interactiveElements.forEach(element => {
      element.addEventListener('mouseenter', handleElementMouseEnter);
      element.addEventListener('mouseleave', handleElementMouseLeave);
    });

    // Smooth follower animation
    const animateFollower = () => {
      setFollowerPosition(prev => ({
        x: prev.x + (position.x - prev.x) * 0.1,
        y: prev.y + (position.y - prev.y) * 0.1,
      }));
      requestAnimationFrame(animateFollower);
    };
    
    animateFollower();

    return () => {
      document.removeEventListener('mousemove', updateCursor);
      document.removeEventListener('mousedown', handleMouseDown);
      document.removeEventListener('mouseup', handleMouseUp);
      document.removeEventListener('mouseenter', handleMouseEnter);
      document.removeEventListener('mouseleave', handleMouseLeave);
      
      interactiveElements.forEach(element => {
        element.removeEventListener('mouseenter', handleElementMouseEnter);
        element.removeEventListener('mouseleave', handleElementMouseLeave);
      });
    };
  }, [position]);

  if (!isVisible) return null;

  return (
    <>
      {/* Main cursor dot */}
      <div
        ref={cursorRef}
        className="fixed pointer-events-none z-[9999] mix-blend-difference"
        style={{
          left: position.x,
          top: position.y,
          transform: 'translate(-50%, -50%)',
        }}
      >
        <div
          className={`w-2 h-2 bg-white rounded-full transition-all duration-150 ease-out ${
            isClicking ? 'scale-50' : 'scale-100'
          } ${isHovering ? 'scale-200 bg-blue-400' : ''}`}
        />
      </div>

      {/* Cursor follower ring */}
      <div
        ref={followerRef}
        className="fixed pointer-events-none z-[9998]"
        style={{
          left: followerPosition.x,
          top: followerPosition.y,
          transform: 'translate(-50%, -50%)',
        }}
      >
        <div
          className={`w-8 h-8 border-2 border-white/40 rounded-full transition-all duration-300 ease-out ${
            isClicking ? 'scale-75 border-white/80' : 'scale-100'
          } ${isHovering ? 'scale-150 border-blue-400/60' : ''}`}
        />
      </div>

      {/* Cursor trail effect */}
      <div
        ref={trailRef}
        className="fixed pointer-events-none z-[9997]"
        style={{
          left: followerPosition.x,
          top: followerPosition.y,
          transform: 'translate(-50%, -50%)',
        }}
      >
        <div
          className={`w-16 h-16 border border-white/20 rounded-full transition-all duration-500 ease-out ${
            isHovering ? 'scale-200 border-blue-400/30' : 'scale-100'
          }`}
        />
      </div>

      {/* Click ripple effect */}
      {isClicking && (
        <div
          className="fixed pointer-events-none z-[9996]"
          style={{
            left: position.x,
            top: position.y,
            transform: 'translate(-50%, -50%)',
          }}
        >
          <div className="w-20 h-20 border-2 border-white/60 rounded-full animate-ping" />
        </div>
      )}

      {/* Hover text effect */}
      {isHovering && (
        <div
          className="fixed pointer-events-none z-[9995]"
          style={{
            left: position.x + 20,
            top: position.y - 20,
            transform: 'translateY(-50%)',
          }}
        >
          <div className="bg-white/10 backdrop-blur-sm text-white text-xs px-2 py-1 rounded-full border border-white/20">
            Click
          </div>
        </div>
      )}
    </>
  );
}
