import React, { useRef, useEffect, useState } from 'react';
import './ScratchCard.css';

const ScratchCard = () => {
  const canvasRef = useRef(null);
  const [revealed, setRevealed] = useState(false);
  const [isDrawing, setIsDrawing] = useState(false);
  const contextRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    canvas.width = 320;
    canvas.height = 320;
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = '#333';
    ctx.fillRect(0, 0, 320, 320);
    ctx.globalCompositeOperation = 'destination-out';
    contextRef.current = ctx;
  }, []);

  const getPos = (e) => {
    const rect = canvasRef.current.getBoundingClientRect();
    const clientX = e.clientX || e.touches?.[0]?.clientX;
    const clientY = e.clientY || e.touches?.[0]?.clientY;
    return { x: clientX - rect.left, y: clientY - rect.top };
  };

  const checkReveal = () => {
    const canvas = canvasRef.current;
    const ctx = contextRef.current;
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;
    
    let transparent = 0;
    for (let i = 3; i < data.length; i += 4) {
      if (data[i] === 0) transparent++;
    }
    
    const percentage = (transparent / (canvas.width * canvas.height)) * 100;
    if (percentage > 60) {
      setRevealed(true);
      revealAll();
    }
  };

  const scratch = (x, y) => {
    const ctx = contextRef.current;
    ctx.beginPath();
    ctx.arc(x, y, 20, 0, Math.PI * 2);
    ctx.fill();
    checkReveal();
  };

  const handleMouseDown = (e) => {
    setIsDrawing(true);
    const { x, y } = getPos(e);
    scratch(x, y);
  };

  const handleMouseUp = () => setIsDrawing(false);
  
  const handleMouseMove = (e) => {
    if (!isDrawing || revealed) return;
    const { x, y } = getPos(e);
    scratch(x, y);
  };

  const handleTouchStart = (e) => {
    setIsDrawing(true);
    const { x, y } = getPos(e);
    scratch(x, y);
  };

  const handleTouchMove = (e) => {
    if (revealed) return;
    const { x, y } = getPos(e);
    scratch(x, y);
  };

  const handleTouchEnd = () => setIsDrawing(false);

  const revealAll = () => {
    const canvas = canvasRef.current;
    const ctx = contextRef.current;
    
    canvas.style.opacity = '1';
    canvas.style.transition = 'opacity 1s cubic-bezier(0.4, 0, 0.2, 1)';
    
    requestAnimationFrame(() => {
      canvas.style.opacity = '0';
    });
    
    setTimeout(() => {
      ctx.clearRect(0, 0, 320, 320);
      canvas.style.opacity = '1';
      canvas.style.transition = 'none';
    }, 1000);
  };

  const reset = () => {
    const canvas = canvasRef.current;
    const ctx = contextRef.current;
    
    canvas.style.opacity = '1';
    canvas.style.transition = 'none';
    
    ctx.globalCompositeOperation = 'source-over';
    ctx.clearRect(0, 0, 320, 320);
    ctx.fillStyle = '#333';
    ctx.fillRect(0, 0, 320, 320);
    ctx.globalCompositeOperation = 'destination-out';
    
    setRevealed(false);
    setIsDrawing(false);
  };

  return (
    <div className="container">
      <div className="phone-frame">
        <div className="phone-screen">
          <h1>Scratch Card</h1>
          <div className="card">
            <div className="content">
              <div className="coupon">
                <h2>33% OFF</h2>
                <p>Your Exclusive Discount</p>
                <div className="code-box">
                  <span>XLCV 33</span>
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
              onTouchStart={handleTouchStart}
              onTouchEnd={handleTouchEnd}
              onTouchMove={handleTouchMove}
              className="canvas"
            />
          </div>
          {revealed && <p className="msg">Revealed!</p>}
          <button onClick={reset} className="btn">Reset</button>
        </div>
      </div>
    </div>
  );
};

export default ScratchCard;
