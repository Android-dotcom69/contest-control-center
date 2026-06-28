import { useMemo } from 'react'
import { useSubmissionStore } from '../../store/submissionStore'

const SEGMENTS = [
  { key: 'accepted',            label: 'Accepted',  color: '#10b981' },
  { key: 'wrong_answer',        label: 'Wrong Ans', color: '#ef4444' },
  { key: 'time_limit_exceeded', label: 'TLE',       color: '#f59e0b' },
  { key: 'runtime_error',       label: 'Runtime',   color: '#f97316' },
  { key: 'pending',             label: 'Pending',   color: '#6366f1' },
  { key: 'running',             label: 'Running',   color: '#8b5cf6' },
]

function polarXY(cx, cy, r, deg) {
  const rad = (deg - 90) * Math.PI / 180
  return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) }
}

function arcPath(cx, cy, r, start, end) {
  if (Math.abs(end - start) >= 359.9) {
    const top    = polarXY(cx, cy, r, 0)
    const bottom = polarXY(cx, cy, r, 180)
    return `M ${top.x} ${top.y} A ${r} ${r} 0 1 1 ${bottom.x} ${bottom.y} A ${r} ${r} 0 1 1 ${top.x} ${top.y}`
  }
  const s = polarXY(cx, cy, r, start)
  const e = polarXY(cx, cy, r, end)
  const large = (end - start) > 180 ? 1 : 0
  return `M ${s.x.toFixed(2)} ${s.y.toFixed(2)} A ${r} ${r} 0 ${large} 1 ${e.x.toFixed(2)} ${e.y.toFixed(2)}`
}

export default function VerdictDonut() {
  const submissions = useSubmissionStore(s => s.submissions)

  const counts = useMemo(() =>
    SEGMENTS.map(seg => ({ ...seg, count: submissions.filter(s => s.verdict === seg.key).length }))
             .filter(s => s.count > 0),
    [submissions]
  )

  const total = counts.reduce((sum, s) => sum + s.count, 0)

  const segments = useMemo(() => {
    let cum = 0
    return counts.map(s => {
      const angle = (s.count / total) * 360
      const start = cum; cum += angle
      return { ...s, start, end: cum }
    })
  }, [counts, total])

  const SIZE = 120, CX = 60, CY = 60, R = 44, THICK = 18

  return (
    <div style={{
      borderRadius: '20px', padding: '18px',
      background: 'var(--card-bg)', backdropFilter: 'blur(16px)',
      border: '1px solid var(--card-border)',
      boxShadow: 'var(--card-shadow)',
      display: 'flex', flexDirection: 'column',
    }}>
      <p style={{ fontSize: '10px', fontWeight: 700, color: 'var(--text-accent)', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: '3px' }}>Analytics</p>
      <p style={{ fontSize: '14px', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '16px' }}>Verdict Distribution</p>

      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '16px' }}>
        <svg width={SIZE} height={SIZE} style={{ overflow: 'visible' }}>
          <circle cx={CX} cy={CY} r={R} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth={THICK} />
          {segments.map((seg, i) => (
            <path key={i} d={arcPath(CX, CY, R, seg.start, seg.end)}
              fill="none" stroke={seg.color} strokeWidth={THICK} strokeLinecap="butt"
              style={{ filter: `drop-shadow(0 0 5px ${seg.color}70)` }} />
          ))}
          <text x={CX} y={CY - 6} textAnchor="middle" fill="var(--text-primary)" fontSize="18" fontWeight="700" fontFamily="system-ui">{total}</text>
          <text x={CX} y={CY + 10} textAnchor="middle" fill="var(--text-muted)" fontSize="8" fontFamily="system-ui">TOTAL</text>
        </svg>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px 10px' }}>
        {counts.map(s => (
          <div key={s.key} style={{ display: 'flex', alignItems: 'center', gap: '6px', minWidth: 0 }}>
            <span style={{ width: '7px', height: '7px', borderRadius: '50%', background: s.color, flexShrink: 0, boxShadow: `0 0 5px ${s.color}` }} />
            <span style={{ fontSize: '11px', color: 'var(--text-secondary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', flex: 1 }}>{s.label}</span>
            <span style={{ fontSize: '11px', fontWeight: 700, color: s.color, flexShrink: 0 }}>{s.count}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
