import React from 'react';
import { C, text, shadow } from '../styles/tokens';
import { Icon } from './Icon';
// Notificação genérica em vidro fosco (UI do app fictício; nenhuma marca real)
export const Notif = ({ icon = 'in', iconBg = C.blue, title, body, app = 'Banco', time = 'agora', tag, tagColor = C.red, width = 860, scale = 1, style }) => (
  <div style={{
    width, padding: '30px 34px', borderRadius: 44, background: 'rgba(255,255,255,0.86)', backdropFilter: 'blur(20px)',
    boxShadow: shadow, display: 'flex', gap: 26, alignItems: 'center', transform: `scale(${scale})`, ...style,
  }}>
    {typeof icon === 'string'
      ? <div style={{ width: 92, height: 92, borderRadius: 24, background: iconBg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}><Icon name={icon} size={52} color="#fff" stroke={2.4} /></div>
      : icon}
    <div style={{ flex: 1, minWidth: 0 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', ...text(500), fontSize: 26, color: C.ink2, marginBottom: 6 }}>
        <span style={{ textTransform: 'uppercase', letterSpacing: '0.04em' }}>{app}</span><span>{time}</span>
      </div>
      <div style={{ ...text(600), fontSize: 38, color: C.ink, lineHeight: 1.15, display: 'flex', alignItems: 'center', gap: 14 }}>
        {title}
        {tag && <span style={{ ...text(600), fontSize: 24, color: '#fff', background: tagColor, padding: '6px 14px', borderRadius: 99 }}>{tag}</span>}
      </div>
      {body && <div style={{ ...text(400), fontSize: 30, color: C.ink2, marginTop: 6, lineHeight: 1.25 }}>{body}</div>}
    </div>
  </div>
);
