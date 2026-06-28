import { formatPenalty } from '../../lib/formatters'
import { problems } from '../../data/problems'

export default function LeaderboardTable({ data, isFrozen }) {
  const thS = {
    padding: '12px 8px', textAlign: 'left',
    fontSize: '10px', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase',
    color: 'var(--th-color)', userSelect: 'none',
    borderBottom: '1px solid var(--th-border)',
    background: 'var(--th-bg)',
  }

  const tdS = {
    padding: '10px 8px',
    fontSize: '13px',
    borderBottom: '1px solid var(--td-border)',
  }

  return (
    <div style={{
      borderRadius: '20px', overflow: 'hidden',
      background: 'var(--card-bg2)', backdropFilter: 'blur(16px)',
      border: '1px solid var(--card-border2)',
      boxShadow: 'var(--card-shadow)',
    }}>
      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', tableLayout: 'fixed', minWidth: '720px' }}>
          <colgroup>
            <col style={{ width: '60px' }} />
            <col style={{ width: '160px' }} />
            <col style={{ width: '130px' }} />
            {problems.map(p => <col key={p.id} style={{ width: '36px' }} />)}
            <col style={{ width: '64px' }} />
            <col style={{ width: '80px' }} />
          </colgroup>
          <thead>
            <tr>
              <th style={thS}>Rank</th>
              <th style={{ ...thS, paddingLeft: '12px' }}>Participant</th>
              <th style={thS}>Institution</th>
              {problems.map(p => (
                <th key={p.id} style={{ ...thS, textAlign: 'center', color: '#FB923C', fontWeight: 800 }}>{p.code}</th>
              ))}
              <th style={{ ...thS, textAlign: 'center' }}>Solved</th>
              <th style={{ ...thS, textAlign: 'right' }}>Penalty</th>
            </tr>
          </thead>
          <tbody>
            {data.length === 0 ? (
              <tr><td colSpan={3 + problems.length + 2} style={{ ...tdS, textAlign: 'center', padding: '48px', color: 'var(--text-muted)' }}>
                No participants yet
              </td></tr>
            ) : data.map((entry, idx) => {
              const isTop3 = entry.rank <= 3
              return (
                <tr key={entry.participantId} style={{
                  background: isTop3 ? 'rgba(249,115,22,0.06)' : idx % 2 === 0 ? 'transparent' : 'var(--row-alt)',
                }}>
                  <td style={{ ...tdS, textAlign: 'center' }}>
                    {entry.rank === 1 && <span>🥇</span>}
                    {entry.rank === 2 && <span>🥈</span>}
                    {entry.rank === 3 && <span>🥉</span>}
                    {entry.rank > 3  && <span style={{ fontFamily: 'monospace', fontSize: '12px', color: 'var(--text-muted)' }}>#{entry.rank}</span>}
                  </td>
                  <td style={{ ...tdS, paddingLeft: '12px', fontWeight: 600, color: 'var(--text-primary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {entry.participantName}
                  </td>
                  <td style={{ ...tdS, fontSize: '11px', color: 'var(--text-secondary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {entry.institution}
                  </td>
                  {problems.map(p => {
                    const solved = entry.solvedProblems?.includes(p.id)
                    return (
                      <td key={p.id} style={{ ...tdS, textAlign: 'center' }}>
                        {solved
                          ? <span style={{ color: '#34D399', fontWeight: 800, fontSize: '13px' }}>✓</span>
                          : <span style={{ color: 'var(--text-muted)', fontSize: '13px' }}>·</span>
                        }
                      </td>
                    )
                  })}
                  <td style={{ ...tdS, textAlign: 'center' }}>
                    <span style={{ fontWeight: 700, color: 'var(--text-primary)' }}>{entry.problemsSolved}</span>
                    <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>/{problems.length}</span>
                  </td>
                  <td style={{ ...tdS, textAlign: 'right', fontFamily: 'monospace', fontSize: '11px', color: 'var(--text-secondary)' }}>
                    {formatPenalty(entry.penaltyTime)}
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
      {isFrozen && (
        <div style={{
          padding: '10px 16px', textAlign: 'center', fontSize: '12px', fontWeight: 600,
          background: 'rgba(59,130,246,0.1)', borderTop: '1px solid rgba(59,130,246,0.2)',
          color: '#60A5FA',
        }}>
          🔒 Rankings frozen — showing leaderboard as of freeze time
        </div>
      )}
    </div>
  )
}
