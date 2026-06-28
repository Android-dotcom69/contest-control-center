import Badge from '../ui/Badge'
import { formatTime } from '../../lib/formatters'

const PAGE_SIZE = 15

const COLUMNS = [
  { key: 'participantName', label: 'Participant', sortable: true  },
  { key: 'problemName',     label: 'Problem',     sortable: true  },
  { key: 'submissionTime',  label: 'Time',        sortable: true  },
  { key: 'verdict',         label: 'Verdict',     sortable: true  },
  { key: 'language',        label: 'Language',    sortable: true  },
  { key: 'actions',         label: '',            sortable: false },
]

export default function SubmissionTable({ data, sort, onSort, page, onPage, onRejudge }) {
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
    padding: '11px 16px',
    fontSize: '13px',
    borderBottom: '1px solid var(--td-border)',
  }

  const btnBase = {
    padding: '5px 12px', borderRadius: '8px', fontSize: '12px', fontWeight: 600, cursor: 'pointer',
    background: 'var(--btn-bg)', color: 'var(--btn-color)',
    border: '1px solid var(--btn-border)',
  }

  return (
    <div style={{
      borderRadius: '20px', overflow: 'hidden',
      background: 'var(--card-bg2)', backdropFilter: 'blur(16px)',
      border: '1px solid var(--card-border2)',
      boxShadow: 'var(--card-shadow)',
    }}>
      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
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
                      {sort.key === col.key ? (sort.dir === 'asc' ? '↑' : '↓') : '↕'}
                    </span>
                  )}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {pageData.length === 0 ? (
              <tr><td colSpan={6} style={{ ...tdS, textAlign: 'center', padding: '48px', color: 'var(--text-muted)' }}>
                No submissions match the current filters
              </td></tr>
            ) : pageData.map((sub, idx) => (
              <tr key={sub.id} style={{ background: idx % 2 === 0 ? 'transparent' : 'var(--row-alt)' }}>
                <td style={{ ...tdS, fontWeight: 600, color: 'var(--text-primary)' }}>
                  {sub.participantName}
                  {sub.isRejudged && <span style={{ marginLeft: '6px', fontSize: '11px', color: '#FBBF24' }} title="Rejudged">✦</span>}
                </td>
                <td style={tdS}>
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{
                      fontFamily: 'monospace', fontWeight: 800, fontSize: '11px',
                      padding: '2px 7px', borderRadius: '6px',
                      background: 'rgba(249,115,22,0.15)', color: '#FB923C',
                      border: '1px solid rgba(249,115,22,0.3)',
                    }}>{sub.problemCode}</span>
                    <span style={{ color: 'var(--text-secondary)' }}>{sub.problemName}</span>
                  </span>
                </td>
                <td style={{ ...tdS, fontFamily: 'monospace', fontSize: '11px', color: 'var(--text-muted)' }}>
                  {formatTime(sub.submissionTime)}
                </td>
                <td style={tdS}><Badge status={sub.verdict} /></td>
                <td style={{ ...tdS, fontSize: '12px', color: 'var(--text-secondary)' }}>{sub.language}</td>
                <td style={tdS}>
                  {sub.verdict !== 'pending' && sub.verdict !== 'running' && (
                    <button onClick={() => onRejudge(sub)} style={{
                      padding: '5px 12px', borderRadius: '8px', fontSize: '12px', fontWeight: 600, cursor: 'pointer',
                      background: 'rgba(249,115,22,0.12)', color: '#FB923C',
                      border: '1px solid rgba(249,115,22,0.3)',
                    }}>Rejudge</button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '12px 16px', borderTop: '1px solid var(--pg-border)', background: 'var(--pg-bg)',
        }}>
          <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
            Showing {(page - 1) * PAGE_SIZE + 1}–{Math.min(page * PAGE_SIZE, data.length)} of {data.length}
          </span>
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
                  }}>{n}</button>
              )}
            <button onClick={() => onPage(page + 1)} disabled={page === totalPages} style={{ ...btnBase, opacity: page === totalPages ? 0.3 : 1 }}>Next →</button>
          </div>
        </div>
      )}
    </div>
  )
}
