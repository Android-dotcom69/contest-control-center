import { participants } from '../../data/participants'
import { problems } from '../../data/problems'

const VERDICTS = [
  { value: 'all',                 label: 'All Verdicts' },
  { value: 'accepted',            label: 'Accepted' },
  { value: 'wrong_answer',        label: 'Wrong Answer' },
  { value: 'time_limit_exceeded', label: 'Time Limit Exceeded' },
  { value: 'runtime_error',       label: 'Runtime Error' },
  { value: 'pending',             label: 'Pending' },
  { value: 'running',             label: 'Running' },
]

const LANGUAGES = ['all', 'C++', 'Python', 'Java', 'Go', 'Rust', 'C']

const inputS = {
  background: 'var(--input-bg)',
  border: '1px solid var(--input-border)',
  color: 'var(--text-primary)',
  borderRadius: '10px',
  padding: '8px 10px',
  fontSize: '13px',
  outline: 'none',
  width: '100%',
}

const labelS = {
  fontSize: '10px', fontWeight: 700,
  color: 'var(--text-accent)',
  letterSpacing: '0.1em', textTransform: 'uppercase',
  whiteSpace: 'nowrap',
}

export default function SubmissionFilters({ filters, onChange, languages = LANGUAGES }) {
  function set(key, value) { onChange({ ...filters, [key]: value }) }

  return (
    <div style={{
      borderRadius: '16px', padding: '14px 16px',
      display: 'flex', flexWrap: 'nowrap', gap: '10px', alignItems: 'flex-end',
      background: 'var(--card-bg2)', backdropFilter: 'blur(16px)',
      border: '1px solid var(--card-border2)',
      overflowX: 'auto',
    }}>
      {/* Search */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '5px', flex: '2 1 0', minWidth: '130px' }}>
        <label style={labelS}>Search</label>
        <input type="text" placeholder="Participant or problem..."
          value={filters.search} onChange={e => set('search', e.target.value)}
          style={inputS}
          onFocus={e => e.target.style.borderColor = 'rgba(249,115,22,0.5)'}
          onBlur={e => e.target.style.borderColor = 'var(--input-border)'}
        />
      </div>

      {/* Verdict */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '5px', flex: '1.4 1 0', minWidth: '110px' }}>
        <label style={labelS}>Verdict</label>
        <select value={filters.verdict} onChange={e => set('verdict', e.target.value)} style={inputS}>
          {VERDICTS.map(v => <option key={v.value} value={v.value}>{v.label}</option>)}
        </select>
      </div>

      {/* Problem */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '5px', flex: '1.3 1 0', minWidth: '100px' }}>
        <label style={labelS}>Problem</label>
        <select value={filters.problemId} onChange={e => set('problemId', e.target.value)} style={inputS}>
          <option value="all">All Problems</option>
          {problems.map(p => <option key={p.id} value={p.id}>{p.code} — {p.name}</option>)}
        </select>
      </div>

      {/* Participant */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '5px', flex: '1.5 1 0', minWidth: '110px' }}>
        <label style={labelS}>Participant</label>
        <select value={filters.participantId} onChange={e => set('participantId', e.target.value)} style={inputS}>
          <option value="all">All Participants</option>
          {participants.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
        </select>
      </div>

      {/* Language */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '5px', flex: '1 1 0', minWidth: '90px' }}>
        <label style={labelS}>Language</label>
        <select value={filters.language} onChange={e => set('language', e.target.value)} style={inputS}>
          {languages.map(l => <option key={l} value={l}>{l === 'all' ? 'All' : l}</option>)}
        </select>
      </div>

      {/* Reset */}
      <button
        onClick={() => onChange({ search: '', verdict: 'all', problemId: 'all', participantId: 'all', language: 'all' })}
        style={{
          flexShrink: 0, padding: '8px 14px', borderRadius: '10px', fontSize: '12px', fontWeight: 600, cursor: 'pointer',
          background: 'rgba(249,115,22,0.12)', color: '#FB923C',
          border: '1px solid rgba(249,115,22,0.3)',
          alignSelf: 'flex-end',
        }}
      >Reset</button>
    </div>
  )
}
