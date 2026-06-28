import { useState } from 'react'
import { useActivityStore } from '../../store/activityStore'
import { timeAgo } from '../../lib/formatters'

const META = {
  participant_joined:   { color: '#60A5FA', bg: 'rgba(59,130,246,0.18)',  dot: '#3b82f6', label: 'Joined'  },
  submission_received:  { color: '#34D399', bg: 'rgba(52,211,153,0.18)',  dot: '#10b981', label: 'Submit'  },
  submission_rejudged:  { color: '#FBBF24', bg: 'rgba(251,191,36,0.18)',  dot: '#f59e0b', label: 'Rejudge' },
  leaderboard_frozen:   { color: '#22D3EE', bg: 'rgba(34,211,238,0.18)',  dot: '#06b6d4', label: 'Frozen'  },
  leaderboard_unfrozen: { color: '#A78BFA', bg: 'rgba(167,139,250,0.18)', dot: '#8b5cf6', label: 'Unfreeze'},
}

function ActivityRow({ a }) {
  const [hovered, setHovered] = useState(false)
  const m = META[a.type] ?? { color: '#94A3B8', bg: 'rgba(148,163,184,0.1)', dot: '#64748b', label: 'Event' }

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        position: 'relative',
        display: 'flex', alignItems: 'center', gap: '9px',
        padding: '8px 10px', borderRadius: '10px',
        background: hovered ? 'var(--row-hover)' : 'var(--row-alt)',
        border: '1px solid rgba(255,255,255,0.04)',
        cursor: 'default', transition: 'background 0.15s',
      }}
    >
      <span style={{ width: '7px', height: '7px', borderRadius: '50%', background: m.dot, flexShrink: 0, boxShadow: `0 0 7px ${m.dot}` }} />
      <span style={{ fontSize: '10px', fontWeight: 700, padding: '2px 6px', borderRadius: '5px', flexShrink: 0, background: m.bg, color: m.color, minWidth: '46px', textAlign: 'center' }}>
        {m.label}
      </span>
      <p style={{ fontSize: '12px', flex: 1, color: 'var(--text-secondary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
        {a.message}
      </p>
      <span style={{ fontSize: '11px', color: 'var(--text-muted)', flexShrink: 0 }}>{timeAgo(a.timestamp)}</span>

      {hovered && (
        <div style={{
          position: 'absolute', bottom: 'calc(100% + 8px)', left: '10px', right: '10px', zIndex: 50,
          background: 'rgba(10,6,28,0.97)', border: '1px solid rgba(139,92,246,0.35)',
          borderRadius: '10px', padding: '9px 12px',
          boxShadow: '0 8px 32px rgba(0,0,0,0.7)', pointerEvents: 'none',
        }}>
          <p style={{ fontSize: '12px', color: '#e9d5ff', lineHeight: 1.5, wordBreak: 'break-word' }}>{a.message}</p>
          <p style={{ fontSize: '10px', color: 'rgba(167,139,250,0.45)', marginTop: '4px' }}>{new Date(a.timestamp).toLocaleTimeString()}</p>
          <div style={{ position: 'absolute', bottom: '-5px', left: '20px', width: '8px', height: '8px', background: 'rgba(10,6,28,0.97)', border: '1px solid rgba(139,92,246,0.35)', borderTop: 'none', borderLeft: 'none', transform: 'rotate(45deg)' }} />
        </div>
      )}
    </div>
  )
}

export default function ActivityFeedPreview() {
  const activities = useActivityStore(s => s.activities)
  const recent     = activities.slice(0, 8)

  return (
    <div style={{
      borderRadius: '20px', padding: '18px', display: 'flex', flexDirection: 'column',
      background: 'var(--card-bg)', backdropFilter: 'blur(16px)',
      border: '1px solid var(--card-border)',
      boxShadow: 'var(--card-shadow)',
    }}>
      <div style={{ marginBottom: '14px' }}>
        <p style={{ fontSize: '10px', fontWeight: 700, color: 'var(--text-accent)', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: '3px' }}>Live Activity</p>
        <p style={{ fontSize: '14px', fontWeight: 700, color: 'var(--text-primary)' }}>Recent Events</p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
        {recent.map(a => <ActivityRow key={a.id} a={a} />)}
      </div>
    </div>
  )
}
