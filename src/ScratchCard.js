import React, { useRef, useEffect, useState } from 'react';
import './ScratchCard.css';

const ScratchCard = () => {
  const canvasRef = useRef(null);
  const [revealed, setRevealed] = useState(false);
  const [isDrawing, setIsDrawing] = useState(false);
  const [scratches, setScratches] = useState(0);
  const contextRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    canvas.width = 320;
    canvas.height = 320;
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = '#333';
    ctx.fillRect(0, 0, 320, 320);
    contextRef.current = ctx;
  }, []);

  const getPos = (e) => {
    const rect = canvasRef.current.getBoundingClientRect();
    const clientX = e.clientX || e.touches?.[0]?.clientX;
    const clientY = e.clientY || e.touches?.[0]?.clientY;
    return { x: clientX - rect.left, y: clientY - rect.top };
  };

  const scratch = (e) => {
    const { x, y } = getPos(e);
    contextRef.current.clearRect(x - 15, y - 15, 30, 30);
  };

  const handleMouseDown = () => setIsDrawing(true);
  const handleMouseUp = () => {
    setIsDrawing(false);
    setScratches(prev => {
      const newCount = prev + 1;
      if (newCount >= 3) {
        setRevealed(true);
        revealAll();
      }
      return newCount;
    });
  };
  const handleMouseMove = (e) => {
    if (!isDrawing || revealed) return;
    scratch(e);
  };

  const handleTouchMove = (e) => {
    if (revealed) return;
    scratch(e);
  };

  const revealAll = () => {
    const canvas = canvasRef.current;
    const ctx = contextRef.current;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  };

  const reset = () => {
    const ctx = contextRef.current;
    ctx.fillStyle = '#333';
    ctx.fillRect(0, 0, 320, 320);
    setRevealed(false);
    setIsDrawing(false);
    setScratches(0);
  };

  return (
    <div className="container">
      <h1>Scratch Card</h1>
      <div className="card">
        <div className="content">
          <div className="coupon">
            <h2>50% OFF</h2>
            <p>Your Exclusive Discount</p>
            <div className="code-box">
              <span>LUCKY50</span>
            </div>
            <p className="validity">Valid till Dec 31, 2025</p>
          </div>
        </div>
        <canvas
          ref={canvasRef}
          onMouseDown={handleMouseDown}
          onMouseUp={handleMouseUp}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseUp}
          onTouchStart={() => setIsDrawing(true)}
          onTouchEnd={() => setIsDrawing(false)}
          onTouchMove={handleTouchMove}
          className="canvas"
        />
      </div>
      {revealed && <p className="msg">Revealed!</p>}
      <button onClick={reset} className="btn">Reset</button>
    </div>
  );
};

export default ScratchCard;
