import React from 'react';

export default function Landing() {
  return (
    <div style={{
      width: '100vw',
      height: '100vh',
      margin: 0,
      padding: 0,
      overflow: 'hidden',
      position: 'fixed',
      top: 0,
      left: 0,
      zIndex: 999999,
      backgroundColor: '#090d16'
    }}>
      <iframe
        src="/landing.html"
        title="SkillPrep Landing"
        style={{
          width: '100%',
          height: '100%',
          border: 'none',
          display: 'block'
        }}
      />
    </div>
  );
}
