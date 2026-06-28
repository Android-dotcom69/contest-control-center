import { useState, useMemo } from 'react'
import { useLeaderboard } from '../hooks/useLeaderboard'
import { useParticipantStore } from '../store/participantStore'
import ParticipantFilters from '../components/participants/ParticipantFilters'
import ParticipantTable from '../components/participants/ParticipantTable'

const DEFAULT_FILTERS = { search: '', institution: 'All Institutions', minProblems: 0, maxRank: 0, status: 'all' }
const DEFAULT_SORT    = { key: 'rank', dir: 'asc' }

export default function Participants() {
  const leaderboard  = useLeaderboard()
  const participants = useParticipantStore(s => s.participants)
  const [filters, setFilters] = useState(DEFAULT_FILTERS)
  const [sort, setSort]       = useState(DEFAULT_SORT)
  const [page, setPage]       = useState(1)

  const enriched = useMemo(() => {
    const statusMap = Object.fromEntries(participants.map(p => [p.id, p.contestStatus]))
    return leaderboard.map(entry => ({ ...entry, contestStatus: statusMap[entry.participantId] ?? 'active' }))
  }, [leaderboard, participants])

  const filtered = useMemo(() => {
    let r = enriched
    if (filters.search.trim()) {
      const q = filters.search.toLowerCase()
      r = r.filter(p => p.participantName.toLowerCase().includes(q) || p.institution.toLowerCase().includes(q))
    }
    if (filters.institution !== 'All Institutions') r = r.filter(p => p.institution === filters.institution)
    if (filters.minProblems > 0) r = r.filter(p => p.problemsSolved >= filters.minProblems)
    if (filters.maxRank > 0) r = r.filter(p => p.rank <= filters.maxRank)
    if (filters.status !== 'all') r = r.filter(p => p.contestStatus === filters.status)
    return r
  }, [enriched, filters])

  const sorted = useMemo(() => [...filtered].sort((a, b) => {
    let av = a[sort.key], bv = b[sort.key]
    if (typeof av === 'string') av = av.toLowerCase()
    if (typeof bv === 'string') bv = bv.toLowerCase()
    if (av < bv) return sort.dir === 'asc' ? -1 : 1
    if (av > bv) return sort.dir === 'asc' ? 1 : -1
    return 0
  }), [filtered, sort])

  function handleSort(key) {
    setSort(prev => prev.key === key
      ? { key, dir: prev.dir === 'asc' ? 'desc' : 'asc' }
      : { key, dir: key === 'rank' || key === 'penaltyTime' ? 'asc' : 'desc' }
    )
    setPage(1)
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', width: '100%' }}>
      <div>
        <p style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-accent-hi)', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: '4px' }}>
          Contestant Management
        </p>
        <h1 style={{ fontSize: '26px', fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-0.5px' }}>Participants</h1>
        <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginTop: '2px' }}>
          {sorted.length} of {enriched.length} participants
        </p>
      </div>

      <ParticipantFilters filters={filters} onChange={f => { setFilters(f); setPage(1) }} />
      <ParticipantTable data={sorted} sort={sort} onSort={handleSort} page={page} onPage={setPage} />
    </div>
  )
}
