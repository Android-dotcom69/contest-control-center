import { useRef, useState } from 'react'
import { useContestStats } from '../hooks/useContestStats'
import { useIsMobile } from '../hooks/useIsMobile'
import StatsCard from '../components/dashboard/StatsCard'
import ContestTimer from '../components/dashboard/ContestTimer'
import ActivityFeedPreview from '../components/dashboard/ActivityFeedPreview'
import ProgressOverview from '../components/dashboard/ProgressOverview'
import VerdictDonut from '../components/dashboard/VerdictDonut'
import SubmissionsBarChart from '../components/dashboard/SubmissionsBarChart'

const icons = {
  participants: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>,
  problems:     <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>,
  submissions:  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>,
  check:        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>,
  x:            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>,
  clock:        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>,
}

const WIDGET_DEFS = [
  { id: 'donut',    el: <VerdictDonut /> },
  { id: 'barchart', el: <SubmissionsBarChart /> },
  { id: 'activity', el: <ActivityFeedPreview /> },
]

export default function Dashboard() {
  const stats = useContestStats()
  const isMobile = useIsMobile()
  const acceptRate = stats.totalSubmissions > 0
    ? ((stats.accepted / stats.totalSubmissions) * 100).toFixed(1)
    : '0.0'

  const cards = [
    { label: 'Participants',      value: stats.totalParticipants, color: 'blue',   sub: 'Registered contestants',           icon: icons.participants },
    { label: 'Problems',          value: stats.totalProblems,     color: 'purple', sub: 'Problems A through H',             icon: icons.problems    },
    { label: 'Total Submissions', value: stats.totalSubmissions,  color: 'slate',  sub: `${stats.pending} pending/running`, icon: icons.submissions },
    { label: 'Accepted',          value: stats.accepted,          color: 'green',  sub: `${acceptRate}% acceptance rate`,   icon: icons.check       },
    { label: 'Rejected',          value: stats.rejected,          color: 'red',    sub: 'WA · TLE · Runtime Error',         icon: icons.x           },
    { label: 'Contest Status',    value: 'LIVE',                  color: 'orange', sub: 'Contest is currently running',     icon: icons.clock       },
  ]

  // ── Drag-and-drop widget ordering ──────────────────────────
  const [order, setOrder] = useState(['donut', 'barchart', 'activity'])
  const [dragOver, setDragOver] = useState(null)
  const dragging = useRef(null)

  function onDragStart(id) { dragging.current = id }
  function onDragOver(e, id) { e.preventDefault(); setDragOver(id) }
  function onDrop(id) {
    if (!dragging.current || dragging.current === id) { setDragOver(null); return }
    const next = [...order]
    const from = next.indexOf(dragging.current)
    const to   = next.indexOf(id)
    next.splice(from, 1)
    next.splice(to, 0, dragging.current)
    setOrder(next)
    setDragOver(null)
    dragging.current = null
  }
  function onDragEnd() { dragging.current = null; setDragOver(null) }

  const widgetMap = Object.fromEntries(WIDGET_DEFS.map(w => [w.id, w.el]))

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '18px', width: '100%' }}>

      {/* Header */}
      <div>
        <p style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-accent-hi)', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: '4px' }}>
          Contest Control
        </p>
        <h1 style={{ fontSize: '26px', fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-0.5px' }}>Dashboard Overview</h1>
        <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginTop: '2px' }}>
          Real-time monitoring — Competitive Programming Contest 2026
        </p>
      </div>

      {/* Stat cards */}
      <div style={{ display: 'grid', gridTemplateColumns: isMobile ? 'repeat(2, minmax(0,1fr))' : 'repeat(3, minmax(0, 1fr))', gap: '14px' }}>
        {cards.map(c => <StatsCard key={c.label} {...c} />)}
      </div>

      {/* Row 2: Draggable widgets */}
      <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(3, minmax(0,1fr))', gap: '14px' }}>
        {order.map((id) => (
          <div key={id}
            draggable
            onDragStart={() => onDragStart(id)}
            onDragOver={e => onDragOver(e, id)}
            onDrop={() => onDrop(id)}
            onDragEnd={onDragEnd}
            style={{
              opacity: dragOver === id && dragging.current !== id ? 0.55 : 1,
              transform: dragOver === id && dragging.current !== id ? 'scale(0.98)' : 'scale(1)',
              transition: 'opacity 0.15s, transform 0.15s',
              cursor: 'grab',
              outline: dragOver === id && dragging.current !== id ? '2px dashed rgba(139,92,246,0.5)' : 'none',
              borderRadius: '20px',
            }}
          >
            {widgetMap[id]}
          </div>
        ))}
      </div>

      {/* Row 3: Timer + Solve Rate */}
      <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'minmax(0,1fr) minmax(0,2.5fr)', gap: '14px' }}>
        <ContestTimer />
        <ProgressOverview />
      </div>

      {/* Drag hint */}
      <p style={{ fontSize: '11px', color: 'var(--text-muted)', textAlign: 'center', letterSpacing: '0.05em' }}>
        ↕ Drag the cards above to reorder widgets
      </p>
    </div>
  )
}
