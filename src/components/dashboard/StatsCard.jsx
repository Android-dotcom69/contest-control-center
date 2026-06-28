const PALETTE = {
  blue:   { bg: 'linear-gradient(135deg, #1e3a8a 0%, #2563eb 50%, #3b82f6 100%)', glow: 'rgba(59,130,246,0.45)',  icon: 'rgba(255,255,255,0.15)', shine: 'rgba(255,255,255,0.08)' },
  purple: { bg: 'linear-gradient(135deg, #4c1d95 0%, #7c3aed 50%, #8b5cf6 100%)', glow: 'rgba(139,92,246,0.45)', icon: 'rgba(255,255,255,0.15)', shine: 'rgba(255,255,255,0.08)' },
  green:  { bg: 'linear-gradient(135deg, #064e3b 0%, #059669 50%, #10b981 100%)', glow: 'rgba(16,185,129,0.45)',  icon: 'rgba(255,255,255,0.15)', shine: 'rgba(255,255,255,0.08)' },
  orange: { bg: 'linear-gradient(135deg, #92400e 0%, #d97706 50%, #f59e0b 100%)', glow: 'rgba(245,158,11,0.45)',  icon: 'rgba(255,255,255,0.15)', shine: 'rgba(255,255,255,0.08)' },
  red:    { bg: 'linear-gradient(135deg, #7f1d1d 0%, #dc2626 50%, #ef4444 100%)', glow: 'rgba(239,68,68,0.45)',   icon: 'rgba(255,255,255,0.15)', shine: 'rgba(255,255,255,0.08)' },
  cyan:   { bg: 'linear-gradient(135deg, #164e63 0%, #0891b2 50%, #06b6d4 100%)', glow: 'rgba(6,182,212,0.45)',   icon: 'rgba(255,255,255,0.15)', shine: 'rgba(255,255,255,0.08)' },
  slate:  { bg: 'linear-gradient(135deg, #1e293b 0%, #334155 50%, #475569 100%)', glow: 'rgba(100,116,139,0.35)', icon: 'rgba(255,255,255,0.12)', shine: 'rgba(255,255,255,0.06)' },
}

export default function StatsCard({ label, value, sub, color = 'slate', icon }) {
  const p = PALETTE[color] ?? PALETTE.slate

  return (
    <div
      style={{
        position: 'relative',
        borderRadius: '16px',
        padding: '18px 18px',
        overflow: 'hidden',
        cursor: 'default',
        userSelect: 'none',
        background: p.bg,
        boxShadow: `0 8px 28px ${p.glow}, 0 2px 8px rgba(0,0,0,0.4)`,
        border: '1px solid rgba(255,255,255,0.12)',
        transition: 'transform 0.2s ease, box-shadow 0.2s ease',
      }}
      onMouseEnter={e => {
        e.currentTarget.style.transform = 'translateY(-2px)'
        e.currentTarget.style.boxShadow = `0 14px 40px ${p.glow}, 0 4px 16px rgba(0,0,0,0.5)`
      }}
      onMouseLeave={e => {
        e.currentTarget.style.transform = 'translateY(0)'
        e.currentTarget.style.boxShadow = `0 8px 28px ${p.glow}, 0 2px 8px rgba(0,0,0,0.4)`
      }}
    >
      {/* Shine */}
      <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', background: `linear-gradient(135deg, ${p.shine} 0%, transparent 50%)` }} />
      {/* Diagonal stripe texture */}
      <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', opacity: 0.25, backgroundImage: 'repeating-linear-gradient(45deg, rgba(255,255,255,0.04) 0px, rgba(255,255,255,0.04) 1px, transparent 1px, transparent 12px)' }} />
      {/* Top shimmer line */}
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '1px', background: 'linear-gradient(90deg, rgba(255,255,255,0.45), rgba(255,255,255,0.04))' }} />

      <div style={{ position: 'relative', display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '10px' }}>
        <div style={{ flex: 1, minWidth: 0 }}>
          <p style={{ fontSize: '10px', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.65)', marginBottom: '8px' }}>
            {label}
          </p>
          <p style={{ fontSize: '32px', fontWeight: 700, color: '#fff', lineHeight: 1, letterSpacing: '-0.5px', fontFamily: 'system-ui, -apple-system, sans-serif' }}>
            {value}
          </p>
          {sub && (
            <p style={{ fontSize: '11px', marginTop: '8px', color: 'rgba(255,255,255,0.55)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {sub}
            </p>
          )}
        </div>
        {icon && (
          <div style={{
            flexShrink: 0, width: '42px', height: '42px', borderRadius: '11px',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: 'white',
            background: p.icon, border: '1px solid rgba(255,255,255,0.2)', backdropFilter: 'blur(8px)',
          }}>
            {icon}
          </div>
        )}
      </div>
    </div>
  )
}
