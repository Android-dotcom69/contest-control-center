import { useMemo } from 'react'
import { useSubmissionStore } from '../../store/submissionStore'
import { problems } from '../../data/problems'

const BAR_COLORS = [
  { from: '#6366f1', to: '#818cf8' },
  { from: '#f97316', to: '#fb923c' },
  { from: '#10b981', to: '#34d399' },
  { from: '#8b5cf6', to: '#a78bfa' },
  { from: '#0891b2', to: '#22d3ee' },
  { from: '#dc2626', to: '#f87171' },
  { from: '#d97706', to: '#fbbf24' },
  { from: '#059669', to: '#6ee7b7' },
]

export default function ProgressOverview() {
  const submissions = useSubmissionStore(s => s.submissions)

  const stats = useMemo(() => {
    return problems.map((p, i) => {
      const forProblem = submissions.filter(s => s.problemId === p.id)
      const accepted   = new Set(forProblem.filter(s => s.verdict === 'accepted').map(s => s.participantId)).size
      const attempts   = new Set(forProblem.map(s => s.participantId)).size
      const rate       = attempts > 0 ? Math.round((accepted / attempts) * 100) : 0
      return { ...p, accepted, attempts, rate, colors: BAR_COLORS[i % BAR_COLORS.length] }
    })
  }, [submissions])

  return (
    <div style={{
      borderRadius: '20px', padding: '20px',
      background: 'var(--card-bg2)', backdropFilter: 'blur(16px)',
      border: '1px solid var(--card-border2)',
      boxShadow: 'var(--card-shadow)',
    }}>
      <div style={{ marginBottom: '18px' }}>
        <p style={{ fontSize: '10px', fontWeight: 700, color: 'var(--text-accent)', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: '4px' }}>
          Problem Analytics
        </p>
        <p style={{ fontSize: '15px', fontWeight: 700, color: 'var(--text-primary)' }}>Solve Rate by Problem</p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {stats.map(p => (
          <div key={p.id} style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <span style={{
              flexShrink: 0, fontSize: '11px', fontWeight: 800, fontFamily: 'monospace',
              width: '28px', textAlign: 'center', padding: '4px 4px', borderRadius: '8px',
              background: `linear-gradient(135deg, ${p.colors.from}25, ${p.colors.to}15)`,
              color: p.colors.to, border: `1px solid ${p.colors.from}40`,
            }}>{p.code}</span>

            <span style={{ fontSize: '12px', width: '140px', flexShrink: 0, color: 'var(--text-secondary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {p.name}
            </span>

            <div style={{ flex: 1, height: '6px', borderRadius: '99px', background: 'rgba(255,255,255,0.07)', overflow: 'hidden' }}>
              <div style={{
                height: '100%', borderRadius: '99px',
                width: `${p.rate}%`,
                background: `linear-gradient(90deg, ${p.colors.from}, ${p.colors.to})`,
                boxShadow: `0 0 10px ${p.colors.from}80`,
                transition: 'width 0.7s ease',
              }} />
            </div>

            <div style={{ flexShrink: 0, display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px' }}>
              <span style={{ color: p.colors.to, fontWeight: 600 }}>{p.accepted}</span>
              <span style={{ color: 'var(--text-muted)' }}>/</span>
              <span style={{ color: 'var(--text-secondary)' }}>{p.attempts}</span>
              <span style={{ width: '36px', textAlign: 'right', fontWeight: 700, color: p.rate >= 60 ? '#34d399' : p.rate >= 30 ? '#fbbf24' : '#f87171' }}>
                {p.rate}%
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
