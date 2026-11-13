import React from 'react';
// Celular genérico (sem marca): corpo, borda metálica, ilha superior
export const Phone = ({ w = 560, h = 1160, children, style, screenStyle }) => (
  <div style={{
    width: w, height: h, borderRadius: w * 0.16, padding: 16, boxSizing: 'border-box',
    background: 'linear-gradient(145deg,#E9E9EC,#B9B9BF 40%,#F4F4F6 60%,#A9A9AF)',
    boxShadow: '0 6px 14px rgba(0,0,0,0.10), 0 60px 120px rgba(0,0,0,0.22)', ...style,
  }}>
    <div style={{ width: '100%', height: '100%', borderRadius: w * 0.135, background: '#111', padding: 8, boxSizing: 'border-box' }}>
      <div style={{ position: 'relative', width: '100%', height: '100%', borderRadius: w * 0.12, overflow: 'hidden', background: '#F5F5F7', ...screenStyle }}>
        {children}
        <div style={{ position: 'absolute', top: 18, left: '50%', width: 150, height: 42, marginLeft: -75, borderRadius: 22, background: '#000' }} />
      </div>
    </div>
  </div>
);
