// BottomRightChatbot.tsx
//import React from 'react';

const Chatbot = () => {
  return (
    <iframe
      src="http://localhost:5000"
      title="AmiBot"
      style={{
        position: 'fixed',
        bottom: '20px',
        right: '20px',
        width: '400px',
        height: '600px',
        border: 'none',
        borderRadius: '12px',
        zIndex: 9999,
      }}
    />
  );
};

export default Chatbot;
