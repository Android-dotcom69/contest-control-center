import { useState } from 'react'
import { useLeaderboard } from '../hooks/useLeaderboard'
import { useContestStore } from '../store/contestStore'
import { useIsMobile } from '../hooks/useIsMobile'
import LeaderboardTable from '../components/leaderboard/LeaderboardTable'
import FreezeToggle from '../components/leaderboard/FreezeToggle'
import { formatPenalty } from '../lib/formatters'

const PODIUM = [
  { idx: 1, medal: '🥈', border: 'rgba(148,163,184,0.25)', glow: 'transparent',           mt: '32px',  scale: 0.88 },
  { idx: 0, medal: '🥇', border: 'rgba(251,191,36,0.4)',   glow: 'rgba(251,191,36,0.12)', mt: '0px',   scale: 1    },
  { idx: 2, medal: '🥉', border: 'rgba(249,115,22,0.25)',  glow: 'transparent',           mt: '52px',  scale: 0.78 },
]

export default function Leaderboard() {
  const leaderboard = useLeaderboard()
  const isFrozen    = useContestStore(s => s.isFrozen)
  const isMobile    = useIsMobile()
  const [search, setSearch] = useState('')

  const filtered = search.trim()
    ? leaderboard.filter(e =>
        e.participantName.toLowerCase().includes(search.toLowerCase()) ||
        e.institution.toLowerCase().includes(search.toLowerCase()))
    : leaderboard

  function exportCSV() {
    const csv = [['Rank','Name','Institution','Solved','Penalty'], ...leaderboard.map(e => [e.rank,e.participantName,e.institution,e.problemsSolved,e.penaltyTime])].map(r=>r.join(',')).join('\n')
    const a = Object.assign(document.createElement('a'), { href: URL.createObjectURL(new Blob([csv],{type:'text/csv'})), download: 'leaderboard.csv' })
    a.click()
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', width: '100%' }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <p style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-accent-hi)', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: '4px' }}>
            Live Rankings
          </p>
          <h1 style={{ fontSize: '26px', fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-0.5px' }}>Leaderboard</h1>
          <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginTop: '2px' }}>
            {isFrozen ? '🔒 Frozen rankings' : `${leaderboard.length} participants ranked`}
          </p>
        </div>
        <div style={{ display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap' }}>
          <input type="text" placeholder="Search participant..." value={search} onChange={e => setSearch(e.target.value)}
            style={{ padding: '8px 12px', borderRadius: '10px', fontSize: '13px', width: '190px', background: 'var(--input-bg)', color: 'var(--text-primary)', border: '1px solid var(--input-border)', outline: 'none' }}
            onFocus={e => e.target.style.borderColor = 'rgba(139,92,246,0.5)'}
            onBlur={e => e.target.style.borderColor = 'var(--input-border)'}
          />
          <button onClick={exportCSV} style={{ padding: '8px 16px', borderRadius: '10px', fontSize: '12px', fontWeight: 600, cursor: 'pointer', background: 'rgba(16,185,129,0.1)', color: '#34D399', border: '1px solid rgba(16,185,129,0.25)' }}>
            ↓ Export CSV
          </button>
        </div>
      </div>

      <FreezeToggle />

      {!search && leaderboard.length >= 3 && (
        <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(3, minmax(0,1fr))', gap: '12px', alignItems: isMobile ? 'stretch' : 'flex-end' }}>
          {(isMobile ? [...PODIUM].sort((a,b) => a.idx - b.idx) : PODIUM).map(({ idx, medal, border, glow, mt, scale }) => {
            const entry = leaderboard[idx]
            if (!entry) return null
            return (
              <div key={entry.participantId} style={{
                borderRadius: '20px', padding: '22px', textAlign: 'center', marginTop: mt,
                background: 'var(--card-bg)', backdropFilter: 'blur(16px)',
                border: `1px solid ${border}`,
                boxShadow: glow !== 'transparent' ? `0 0 40px ${glow}, 0 8px 32px rgba(0,0,0,0.4)` : 'var(--card-shadow)',
                transform: `scale(${scale})`,
                transformOrigin: 'top center',
                transition: 'transform 0.2s',
              }}>
                <div style={{ fontSize: `${Math.round(32 * scale)}px`, marginBottom: '8px' }}>{medal}</div>
                <div style={{ fontSize: `${Math.round(14 * scale)}px`, fontWeight: 700, color: 'var(--text-primary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{entry.participantName}</div>
                <div style={{ fontSize: `${Math.round(11 * scale)}px`, color: 'var(--text-accent)', marginTop: '3px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{entry.institution}</div>
                <div style={{ marginTop: '10px', display: 'flex', justifyContent: 'center', gap: '10px' }}>
                  <span style={{ fontSize: `${Math.round(12 * scale)}px`, fontWeight: 700, color: '#a78bfa' }}>{entry.problemsSolved} solved</span>
                  <span style={{ fontSize: `${Math.round(12 * scale)}px`, color: 'var(--text-muted)' }}>{formatPenalty(entry.penaltyTime)}</span>
                </div>
              </div>
            )
          })}
        </div>
      )}

      <LeaderboardTable data={filtered} isFrozen={isFrozen} />
    </div>
  )
}
