const STYLES = {
  accepted:            { background: 'rgba(16,185,129,0.15)',  color: '#34d399', border: '1px solid rgba(16,185,129,0.3)'  },
  wrong_answer:        { background: 'rgba(239,68,68,0.15)',   color: '#f87171', border: '1px solid rgba(239,68,68,0.3)'   },
  time_limit_exceeded: { background: 'rgba(245,158,11,0.15)',  color: '#fbbf24', border: '1px solid rgba(245,158,11,0.3)'  },
  runtime_error:       { background: 'rgba(249,115,22,0.15)',  color: '#fb923c', border: '1px solid rgba(249,115,22,0.3)'  },
  pending:             { background: 'rgba(99,102,241,0.15)',  color: '#818cf8', border: '1px solid rgba(99,102,241,0.3)'  },
  running:             { background: 'rgba(139,92,246,0.15)',  color: '#a78bfa', border: '1px solid rgba(139,92,246,0.3)'  },
  active:              { background: 'rgba(16,185,129,0.12)',  color: '#34d399', border: '1px solid rgba(16,185,129,0.25)' },
  disqualified:        { background: 'rgba(239,68,68,0.12)',   color: '#f87171', border: '1px solid rgba(239,68,68,0.25)'  },
  live:                { background: 'rgba(16,185,129,0.12)',  color: '#34d399', border: '1px solid rgba(16,185,129,0.25)' },
  upcoming:            { background: 'rgba(99,102,241,0.12)',  color: '#818cf8', border: '1px solid rgba(99,102,241,0.25)' },
  ended:               { background: 'rgba(100,116,139,0.12)', color: '#94a3b8', border: '1px solid rgba(100,116,139,0.25)'},
}

const LABELS = {
  accepted: 'Accepted', wrong_answer: 'Wrong Answer', time_limit_exceeded: 'TLE',
  runtime_error: 'Runtime Error', pending: 'Pending', running: 'Running',
  active: 'Active', disqualified: 'Disqualified', live: 'Live', upcoming: 'Upcoming', ended: 'Ended',
}

const DEFAULT = { background: 'rgba(100,116,139,0.12)', color: '#94a3b8', border: '1px solid rgba(100,116,139,0.25)' }

export default function Badge({ status }) {
  const s = STYLES[status] ?? DEFAULT
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center',
      padding: '2px 8px', borderRadius: '6px',
      fontSize: '11px', fontWeight: 600,
      whiteSpace: 'nowrap',
      ...s,
    }}>
      {LABELS[status] ?? status}
    </span>
  )
}
