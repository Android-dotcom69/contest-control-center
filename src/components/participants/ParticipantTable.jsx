import Badge from '../ui/Badge'
import { formatPenalty } from '../../lib/formatters'

const COLUMNS = [
  { key: 'rank',            label: 'Rank',        sortable: true  },
  { key: 'participantName', label: 'Name',        sortable: true  },
  { key: 'institution',     label: 'Institution', sortable: true  },
  { key: 'problemsSolved',  label: 'Solved',      sortable: true  },
  { key: 'penaltyTime',     label: 'Penalty',     sortable: true  },
  { key: 'contestStatus',   label: 'Status',      sortable: false },
]

const PAGE_SIZE = 25

export default function ParticipantTable({ data, sort, onSort, page, onPage }) {
  const totalPages = Math.ceil(data.length / PAGE_SIZE)
  const pageData   = data.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

  const thS = {
    padding: '12px 16px', textAlign: 'left',
    fontSize: '10px', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase',
    color: 'var(--th-color)', userSelect: 'none',
    borderBottom: '1px solid var(--th-border)',
    background: 'var(--th-bg)',
  }
  const tdS = {
    padding: '11px 16px', fontSize: '13px',
    borderBottom: '1px solid var(--td-border)',
  }
  const btnBase = {
    padding: '5px 12px', borderRadius: '8px', fontSize: '12px', fontWeight: 600, cursor: 'pointer',
    background: 'var(--btn-bg)', color: 'var(--btn-color)',
    border: '1px solid var(--btn-border)', transition: 'all 0.15s',
  }

  return (
    <div style={{
      borderRadius: '20px', overflow: 'hidden',
      background: 'var(--card-bg2)', backdropFilter: 'blur(16px)',
      border: '1px solid var(--card-border2)',
      boxShadow: 'var(--card-shadow)',
    }}>
      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', fontSize: '13px', borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              {COLUMNS.map(col => (
                <th key={col.key}
                  onClick={() => col.sortable && onSort(col.key)}
                  style={{ ...thS, cursor: col.sortable ? 'pointer' : 'default' }}
                >
                  {col.label}
                  {col.sortable && (
                    <span style={{ marginLeft: '4px', color: sort.key === col.key ? '#FB923C' : 'var(--text-muted)' }}>
                      {sort.key === col.key ? (sort.dir === 'asc' ? ' ↑' : ' ↓') : ' ↕'}
                    </span>
                  )}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {pageData.length === 0 ? (
              <tr><td colSpan={6} style={{ ...tdS, textAlign: 'center', padding: '48px', color: 'var(--text-muted)' }}>
                No participants match the current filters
              </td></tr>
            ) : pageData.map((p, idx) => (
              <tr key={p.participantId} style={{
                background: p.rank <= 3 ? 'rgba(249,115,22,0.06)' : idx % 2 === 0 ? 'transparent' : 'var(--row-alt)',
              }}>
                <td style={tdS}>
                  {p.rank === 1 && <span style={{ fontWeight: 800, color: '#FBBF24' }}>🥇 1</span>}
                  {p.rank === 2 && <span style={{ fontWeight: 800, color: '#CBD5E1' }}>🥈 2</span>}
                  {p.rank === 3 && <span style={{ fontWeight: 800, color: '#FB923C' }}>🥉 3</span>}
                  {p.rank > 3  && <span style={{ fontFamily: 'monospace', color: 'var(--text-muted)' }}>#{p.rank}</span>}
                </td>
                <td style={{ ...tdS, fontWeight: 600, color: 'var(--text-primary)' }}>{p.participantName}</td>
                <td style={{ ...tdS, color: 'var(--text-secondary)', fontSize: '12px' }}>{p.institution}</td>
                <td style={tdS}>
                  <span style={{ fontWeight: 700, color: 'var(--text-primary)' }}>{p.problemsSolved}</span>
                  <span style={{ fontSize: '11px', color: 'var(--text-muted)', marginLeft: '3px' }}>/ 8</span>
                </td>
                <td style={{ ...tdS, fontFamily: 'monospace', color: 'var(--text-secondary)' }}>
                  {formatPenalty(p.penaltyTime)}
                </td>
                <td style={tdS}><Badge status={p.contestStatus} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '12px 16px',
        borderTop: '1px solid var(--pg-border)',
        background: 'var(--pg-bg)',
      }}>
        <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
          {data.length === 0 ? '0 participants'
            : `Showing ${(page - 1) * PAGE_SIZE + 1}–${Math.min(page * PAGE_SIZE, data.length)} of ${data.length}`}
        </span>
        {totalPages > 1 && (
          <div style={{ display: 'flex', gap: '4px' }}>
            <button onClick={() => onPage(page - 1)} disabled={page === 1} style={{ ...btnBase, opacity: page === 1 ? 0.3 : 1 }}>← Prev</button>
            {Array.from({ length: totalPages }, (_, i) => i + 1)
              .filter(n => n === 1 || n === totalPages || Math.abs(n - page) <= 1)
              .reduce((acc, n, idx, arr) => {
                if (idx > 0 && n - arr[idx - 1] > 1) acc.push('...')
                acc.push(n)
                return acc
              }, [])
              .map((n, i) => n === '...'
                ? <span key={`d${i}`} style={{ padding: '5px 8px', color: 'var(--text-muted)', fontSize: '12px' }}>…</span>
                : <button key={n} onClick={() => onPage(n)} style={{
                    ...btnBase,
                    background: page === n ? 'linear-gradient(135deg, #f97316, #ea580c)' : 'var(--btn-bg)',
                    color: page === n ? '#fff' : 'var(--btn-color)',
                    border: page === n ? '1px solid #f97316' : '1px solid var(--btn-border)',
                    boxShadow: page === n ? '0 2px 12px rgba(249,115,22,0.4)' : 'none',
                  }}>{n}</button>
              )}
            <button onClick={() => onPage(page + 1)} disabled={page === totalPages} style={{ ...btnBase, opacity: page === totalPages ? 0.3 : 1 }}>Next →</button>
          </div>
        )}
      </div>
    </div>
  )
}
