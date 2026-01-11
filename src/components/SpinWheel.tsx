import React, { useEffect, useRef, useState, useCallback } from 'react';

interface SpinWheelProps {
  items: string[];
  onWinner: (winner: string) => void;
  size?: number;
  spinning?: boolean;
  forcedWinner?: string;
}

const vibrantPalette = [
  '#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A', 
  '#98D8C8', '#FDCB6E', '#6C5CE7', '#FF85A2',
  '#2ECC71', '#3498DB', '#E67E22', '#F1C40F'
];

const SpinWheel: React.FC<SpinWheelProps> = ({ items, onWinner, size = 600, spinning: externalSpinning = false, forcedWinner }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isSpinning, setIsSpinning] = useState(false);
  const rotationRef = useRef(0);
  const animationRef = useRef<number>(0);
  const imagesRef = useRef<Record<string, HTMLImageElement>>({});

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const centerX = size / 2;
    const centerY = size / 2;
    const radius = size / 2 - 10;
    const totalItems = items.length;
    
    // Fallback if no items
    if (totalItems === 0) {
      ctx.clearRect(0, 0, size, size);
      ctx.beginPath();
      ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI);
      ctx.strokeStyle = '#e2e8f0';
      ctx.lineWidth = 2;
      ctx.stroke();
      return;
    }

    const arcSize = (2 * Math.PI) / totalItems;

    ctx.clearRect(0, 0, size, size);

    // Draw slices
    items.forEach((item, i) => {
      const startAngle = i * arcSize + rotationRef.current;
      const endAngle = startAngle + arcSize;

      ctx.beginPath();
      ctx.moveTo(centerX, centerY);
      ctx.arc(centerX, centerY, radius, startAngle, endAngle);
      ctx.closePath();

      // Use vibrant palette
      ctx.fillStyle = vibrantPalette[i % vibrantPalette.length];
      ctx.fill();

      // Border around slice
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.4)';
      ctx.lineWidth = 2;
      ctx.stroke();

      // Draw text and image
      ctx.save();
      ctx.translate(centerX, centerY);
      ctx.rotate(startAngle + arcSize / 2);
      ctx.textAlign = 'right';
      ctx.textBaseline = 'middle';
      ctx.fillStyle = '#ffffff';
      ctx.shadowColor = 'rgba(0, 0, 0, 0.3)';
      ctx.shadowBlur = 4;
      
      const fontSize = totalItems > 30 ? 10 : 16;
      ctx.font = `bold ${fontSize}px Inter`;

      const img = imagesRef.current[item];
      if (img) {
        // Draw image next to text
        const imgSize = fontSize * 2;
        ctx.drawImage(img, radius - 40 - imgSize, -imgSize / 2, imgSize, imgSize);
        ctx.fillText(item, radius - 45 - imgSize, 0);
      } else {
        // Just text
        ctx.fillText(item.length > 20 ? item.substring(0, 17) + '...' : item, radius - 30, 0);
      }
      
      ctx.restore();
    });

    // Outer border ring
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI);
    ctx.strokeStyle = '#2d3436';
    ctx.lineWidth = 12;
    ctx.stroke();

    // Inner glowing ring
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius - 6, 0, 2 * Math.PI);
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
    ctx.lineWidth = 2;
    ctx.stroke();

    // Center hub
    const hubGradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, 25);
    hubGradient.addColorStop(0, '#2d3436');
    hubGradient.addColorStop(1, '#000000');
    
    ctx.beginPath();
    ctx.arc(centerX, centerY, 25, 0, 2 * Math.PI);
    ctx.fillStyle = hubGradient;
    ctx.fill();
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 4;
    ctx.stroke();

    // Small highlight on hub
    ctx.beginPath();
    ctx.arc(centerX - 8, centerY - 8, 4, 0, 2 * Math.PI);
    ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
    ctx.fill();
  }, [items, size]);

  // Preload images
  useEffect(() => {
    items.forEach(item => {
      // Check if it's a reward amount (numeric)
      if (/^\d+$/.test(item) && !imagesRef.current[item]) {
        const img = new Image();
        img.src = `/diamonds/${item}.webp`;
        img.onload = () => {
          imagesRef.current[item] = img;
          draw(); // Redraw once image is loaded
        };
      }
    });
  }, [items, draw]);

  useEffect(() => {
    draw();
  }, [draw]);

  const spin = useCallback(() => {
    if (isSpinning || items.length === 0) return;

    setIsSpinning(true);
    const spinDuration = 5000 + Math.random() * 2000; // 5-7 seconds
    const startTime = Date.now();
    
    let totalRotation;
    const arcSize = (2 * Math.PI) / items.length;
    const targetIndex = forcedWinner ? items.indexOf(forcedWinner) : -1;

    if (targetIndex !== -1) {
      // Precise calculation for forced winner
      // We want: (3/2 * PI) - currentRotation = targetIndex * arcSize + offset
      const targetAngle = ( (3/2 * Math.PI) - (targetIndex + 0.5) * arcSize + (10 * Math.PI) ) % (2 * Math.PI);
      totalRotation = 10 * Math.PI * 2 + targetAngle;
    } else {
      // Random rotation
      totalRotation = 10 * Math.PI * 2 + Math.random() * Math.PI * 2;
    }

    const animate = () => {
      const now = Date.now();
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / spinDuration, 1);

      // Ease out cubic for realistic deceleration
      const easeOut = (t: number) => 1 - Math.pow(1 - t, 3);
      const currentRotation = totalRotation * easeOut(progress);
      
      rotationRef.current = currentRotation % (Math.PI * 2);
      draw();

      if (progress < 1) {
        animationRef.current = requestAnimationFrame(animate);
      } else {
        setIsSpinning(false);
        // Calculate winner
        // Arrow is at the top (3/2 * PI)
        const normalizedRotation = rotationRef.current % (Math.PI * 2);
        const winningIndex = Math.floor(
          ( (3/2 * Math.PI) - normalizedRotation + (4 * Math.PI) ) % (2 * Math.PI) / arcSize
        );
        onWinner(items[winningIndex]);
      }
    };

    animationRef.current = requestAnimationFrame(animate);
  }, [isSpinning, items, onWinner, draw, forcedWinner]);

  // Expose spin method or watch for prop
  useEffect(() => {
    if (externalSpinning && !isSpinning) {
      // Use setTimeout to defer the call and avoid the "cascading renders" warning.
      // This ensures the state update happens after the current render cycle.
      const timer = setTimeout(() => {
        spin();
      }, 0);
      return () => clearTimeout(timer);
    }
  }, [externalSpinning, isSpinning, spin]);

  return (
    <div className="relative flex flex-col items-center">
      {/* Arrow Indicator - Triangle pointing down */}
      <div className="absolute -top-6 z-20">
        <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M20 38L2 4L38 4L20 38Z" fill="black" stroke="white" strokeWidth="3"/>
        </svg>
      </div>
      
      <canvas
        ref={canvasRef}
        width={size}
        height={size}
        className="rounded-full shadow-[0_40px_80px_-15px_rgba(0,0,0,0.15)] bg-white transition-opacity duration-300"
        style={{
          width: size,
          height: size,
        }}
      />

      {!externalSpinning && (
        <div className="mt-8">
          <button
            onClick={spin}
            disabled={isSpinning || items.length === 0}
            className={`
              px-12 py-4 bg-black text-white rounded-full font-bold uppercase tracking-widest
              hover:bg-gray-800 transition-all active:scale-95 disabled:bg-gray-300 disabled:cursor-not-allowed
              shadow-xl hover:shadow-2xl
            `}
          >
            {isSpinning ? 'Spinning...' : 'Spin'}
          </button>
        </div>
      )}
    </div>
  );
};

export default SpinWheel;
