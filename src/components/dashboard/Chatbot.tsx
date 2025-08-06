import React, { useRef, useEffect, useState } from 'react';

const Chatbot = () => {
  const chatbotRef = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  const [position, setPosition] = useState<{ x: number; y: number } | null>(null);

  const [dragging, setDragging] = useState(false);
  const [dragStarted, setDragStarted] = useState(false);
  const [offset, setOffset] = useState({ x: 0, y: 0 });

  const CHAT_WIDTH = 400;
  const CHAT_HEIGHT = 600;
  const BUTTON_SIZE = 60;
  const MARGIN = 20;

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (dragging) {
        const newX = e.clientX - offset.x;
        const newY = e.clientY - offset.y;
        setPosition({ x: newX, y: newY });
        setDragStarted(true);
      }
    };

    const handleMouseUp = () => {
      if (dragging) {
        setDragging(false);
        setTimeout(() => setDragStarted(false), 50);
      }
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [dragging, offset]);

  const startDragging = (e: React.MouseEvent) => {
    if (chatbotRef.current) {
      const rect = chatbotRef.current.getBoundingClientRect();
      setOffset({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      });
      setDragging(true);
      setDragStarted(false);
    }
  };

  const handleClick = () => {
    if (!dragStarted) {
      // Force the chatbot window to appear such that its bottom-right aligns with the button
      if (position === null) {
        const x = window.innerWidth - CHAT_WIDTH - MARGIN;
        const y = window.innerHeight - CHAT_HEIGHT - MARGIN;
        setPosition({ x, y });
      }
      setVisible(true);
    }
  };

  const posX = position?.x ?? window.innerWidth - BUTTON_SIZE - MARGIN;
  const posY = position?.y ?? window.innerHeight - BUTTON_SIZE - MARGIN;

  return (
    <div
      ref={chatbotRef}
      onMouseDown={startDragging}
      style={{
        position: 'fixed',
        left: `${posX}px`,
        top: `${posY}px`,
        zIndex: 9999,
        cursor: 'grab',
      }}
    >
      {visible ? (
        <div
          style={{
            width: `${CHAT_WIDTH}px`,
            height: `${CHAT_HEIGHT}px`,
            background: '#fff',
            borderRadius: '12px',
            boxShadow: '0 4px 20px rgba(0,0,0,0.2)',
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
          }}
        >
          <div
            style={{
              background: '#7c4dff',
              color: '#fff',
              padding: '8px 12px',
              fontWeight: 'bold',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <span>Mentora ✨</span>
            <button
              onClick={() => setVisible(false)}
              style={{
                background: 'transparent',
                border: 'none',
                color: 'white',
                fontSize: '18px',
                fontWeight: 'bold',
                cursor: 'pointer',
              }}
            >
              ×
            </button>
          </div>
          <iframe
            src="http://localhost:5000"
            title="AmiBot"
            style={{
              width: '100%',
              height: 'calc(100% - 40px)',
              border: 'none',
            }}
          />
        </div>
      ) : (
        <button
          onClick={handleClick}
          style={{
            position: 'fixed',
            bottom: `${MARGIN}px`,
            right: `${MARGIN}px`,
            background: '#7c4dff',
            color: 'white',
            border: 'none',
            borderRadius: '50%',
            width: `${BUTTON_SIZE}px`,
            height: `${BUTTON_SIZE}px`,
            fontSize: '24px',
            cursor: 'pointer',
            boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
          }}
        >
          💬
        </button>
      )}
    </div>
  );
};

export default Chatbot;
