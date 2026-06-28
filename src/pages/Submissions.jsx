import { useState, useMemo } from 'react'
import { useSubmissionStore } from '../store/submissionStore'
import { participants } from '../data/participants'
import { problems } from '../data/problems'
import SubmissionFilters from '../components/submissions/SubmissionFilters'
import SubmissionTable from '../components/submissions/SubmissionTable'
import RejudgeModal from '../components/submissions/RejudgeModal'

const DEFAULT_FILTERS = { search: '', verdict: 'all', problemId: 'all', participantId: 'all', language: 'all' }
const DEFAULT_SORT    = { key: 'submissionTime', dir: 'desc' }
const participantMap  = Object.fromEntries(participants.map(p => [p.id, p.name]))
const problemMap      = Object.fromEntries(problems.map(p => [p.id, { name: p.name, code: p.code }]))

export default function Submissions() {
  const submissions = useSubmissionStore(s => s.submissions)
  const rejudge     = useSubmissionStore(s => s.rejudge)
  const [filters, setFilters]   = useState(DEFAULT_FILTERS)
  const [sort, setSort]         = useState(DEFAULT_SORT)
  const [page, setPage]         = useState(1)
  const [modalSub, setModalSub] = useState(null)

  const enriched = useMemo(() => submissions.map(s => ({
    ...s,
    participantName: participantMap[s.participantId] ?? s.participantId,
    problemName:     problemMap[s.problemId]?.name   ?? s.problemId,
    problemCode:     problemMap[s.problemId]?.code   ?? '?',
  })), [submissions])

  const filtered = useMemo(() => {
    let r = enriched
    if (filters.search.trim()) {
      const q = filters.search.toLowerCase()
      r = r.filter(s => s.participantName.toLowerCase().includes(q) || s.problemName.toLowerCase().includes(q))
    }
    if (filters.verdict !== 'all')       r = r.filter(s => s.verdict === filters.verdict)
    if (filters.problemId !== 'all')     r = r.filter(s => s.problemId === filters.problemId)
    if (filters.participantId !== 'all') r = r.filter(s => s.participantId === filters.participantId)
    if (filters.language !== 'all')      r = r.filter(s => s.language === filters.language)
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

  const languages = useMemo(() => {
    const langs = [...new Set(enriched.map(s => s.language).filter(Boolean))].sort()
    return ['all', ...langs]
  }, [enriched])

  const counts = useMemo(() => ({
    accepted: enriched.filter(s => s.verdict === 'accepted').length,
    rejected: enriched.filter(s => ['wrong_answer','time_limit_exceeded','runtime_error'].includes(s.verdict)).length,
    pending:  enriched.filter(s => ['pending','running'].includes(s.verdict)).length,
  }), [enriched])

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', width: '100%' }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <p style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-accent-hi)', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: '4px' }}>
            Submission Monitor
          </p>
          <h1 style={{ fontSize: '26px', fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-0.5px' }}>Submissions</h1>
          <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginTop: '2px' }}>{filtered.length} of {enriched.length} submissions</p>
        </div>
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', alignItems: 'center' }}>
          {[
            { label: `✓ ${counts.accepted} Accepted`, bg: 'rgba(16,185,129,0.1)',  color: '#34d399', border: 'rgba(16,185,129,0.25)'  },
            { label: `✗ ${counts.rejected} Rejected`, bg: 'rgba(239,68,68,0.1)',   color: '#f87171', border: 'rgba(239,68,68,0.25)'   },
            { label: `◌ ${counts.pending} Pending`,   bg: 'rgba(99,102,241,0.1)',  color: '#818cf8', border: 'rgba(99,102,241,0.25)'  },
          ].map(p => (
            <span key={p.label} style={{
              fontSize: '12px', fontWeight: 600, padding: '5px 12px', borderRadius: '20px',
              background: p.bg, color: p.color, border: `1px solid ${p.border}`,
            }}>{p.label}</span>
          ))}
        </div>
      </div>

      <SubmissionFilters filters={filters} onChange={f => { setFilters(f); setPage(1) }} languages={languages} />
      <SubmissionTable data={sorted} sort={sort} onSort={key => { setSort(p => p.key === key ? { key, dir: p.dir === 'asc' ? 'desc' : 'asc' } : { key, dir: 'desc' }); setPage(1) }} page={page} onPage={setPage} onRejudge={setModalSub} />

      {modalSub && (
        <RejudgeModal
          submission={modalSub}
          onConfirm={(id, v) => { rejudge(id, v); setModalSub(null) }}
          onClose={() => setModalSub(null)}
        />
      )}
    </div>
  )
}
