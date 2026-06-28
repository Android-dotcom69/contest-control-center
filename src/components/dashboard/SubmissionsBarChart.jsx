import { useMemo } from 'react'
import { useSubmissionStore } from '../../store/submissionStore'
import { problems } from '../../data/problems'

export default function SubmissionsBarChart() {
  const submissions = useSubmissionStore(s => s.submissions)

  const data = useMemo(() => {
    return problems.map(p => {
      const all      = submissions.filter(s => s.problemId === p.id)
      const accepted = all.filter(s => s.verdict === 'accepted').length
      const total    = all.length
      return { code: p.code, name: p.name, total, accepted }
    })
  }, [submissions])

  const maxTotal = Math.max(...data.map(d => d.total), 1)

  return (
    <div style={{
      borderRadius: '20px', padding: '18px',
      background: 'var(--card-bg)', backdropFilter: 'blur(16px)',
      border: '1px solid var(--card-border)',
      boxShadow: 'var(--card-shadow)',
    }}>
      <p style={{ fontSize: '10px', fontWeight: 700, color: 'var(--text-accent)', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: '3px' }}>Analytics</p>
      <p style={{ fontSize: '14px', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '16px' }}>Submissions per Problem</p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {data.map(d => (
          <div key={d.code} style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{ flexShrink: 0, fontSize: '12px', fontWeight: 800, fontFamily: 'monospace', width: '18px', color: '#c4b5fd' }}>
              {d.code}
            </span>
            <div style={{ flex: 1, height: '16px', borderRadius: '6px', background: 'rgba(255,255,255,0.05)', position: 'relative', overflow: 'hidden' }}>
              <div style={{
                position: 'absolute', left: 0, top: 0, bottom: 0,
                width: `${(d.total / maxTotal) * 100}%`,
                background: 'rgba(139,92,246,0.25)',
                borderRadius: '6px',
                transition: 'width 0.7s ease',
              }} />
              <div style={{
                position: 'absolute', left: 0, top: 0, bottom: 0,
                width: `${(d.accepted / maxTotal) * 100}%`,
                background: 'linear-gradient(90deg, #7c3aed, #a78bfa)',
                borderRadius: '6px',
                boxShadow: '0 0 10px rgba(139,92,246,0.6)',
                transition: 'width 0.7s ease',
              }} />
            </div>
            <div style={{ flexShrink: 0, display: 'flex', gap: '4px', fontSize: '12px', width: '60px', justifyContent: 'flex-end' }}>
              <span style={{ fontWeight: 700, color: '#a78bfa' }}>{d.accepted}</span>
              <span style={{ color: 'var(--text-muted)' }}>/</span>
              <span style={{ color: 'var(--text-secondary)' }}>{d.total}</span>
            </div>
          </div>
        ))}
      </div>

      <div style={{ display: 'flex', gap: '16px', marginTop: '14px', paddingTop: '12px', borderTop: '1px solid var(--card-border)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '7px', fontSize: '11px', color: 'var(--text-secondary)' }}>
          <span style={{ width: '12px', height: '5px', borderRadius: '3px', background: 'rgba(139,92,246,0.25)', display: 'inline-block' }} />
          Total
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '7px', fontSize: '11px', color: 'var(--text-secondary)' }}>
          <span style={{ width: '12px', height: '5px', borderRadius: '3px', background: 'linear-gradient(90deg,#7c3aed,#a78bfa)', display: 'inline-block' }} />
          Accepted
        </div>
      </div>
    </div>
  )
}
