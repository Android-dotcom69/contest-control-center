const institutions = [
  'All Institutions', 'VIT Vellore', 'VIT Chennai',
  'NIT Trichy', 'NIT Surathkal', 'BITS Pilani', 'BITS Goa', 'IIT Madras',
]

const inputS = {
  background: 'var(--input-bg)',
  border: '1px solid var(--input-border)',
  color: 'var(--text-primary)',
  borderRadius: '10px',
  padding: '8px 12px',
  fontSize: '13px',
  outline: 'none',
  width: '100%',
  transition: 'border-color 0.15s',
}

const labelS = {
  fontSize: '10px', fontWeight: 700,
  color: 'var(--text-accent)',
  letterSpacing: '0.1em', textTransform: 'uppercase',
}

export default function ParticipantFilters({ filters, onChange }) {
  function set(key, value) { onChange({ ...filters, [key]: value }) }

  return (
    <div style={{
      borderRadius: '16px', padding: '16px',
      display: 'flex', flexWrap: 'wrap', gap: '12px', alignItems: 'flex-end',
      background: 'var(--card-bg2)', backdropFilter: 'blur(16px)',
      border: '1px solid var(--card-border2)',
    }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', minWidth: '200px' }}>
        <label style={labelS}>Search</label>
        <input type="text" placeholder="Name or institution..."
          value={filters.search} onChange={e => set('search', e.target.value)}
          style={inputS}
          onFocus={e => e.target.style.borderColor = 'rgba(249,115,22,0.5)'}
          onBlur={e => e.target.style.borderColor = 'var(--input-border)'}
        />
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', minWidth: '180px' }}>
        <label style={labelS}>Institution</label>
        <select value={filters.institution} onChange={e => set('institution', e.target.value)} style={inputS}>
          {institutions.map(i => <option key={i} value={i}>{i}</option>)}
        </select>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', minWidth: '130px' }}>
        <label style={labelS}>Min Solved</label>
        <select value={filters.minProblems} onChange={e => set('minProblems', Number(e.target.value))} style={inputS}>
          {[0,1,2,3,4,5,6].map(n => <option key={n} value={n}>{n === 0 ? 'Any' : `≥ ${n}`}</option>)}
        </select>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', minWidth: '120px' }}>
        <label style={labelS}>Rank Filter</label>
        <select value={filters.maxRank} onChange={e => set('maxRank', Number(e.target.value))} style={inputS}>
          <option value={0}>All Ranks</option>
          <option value={10}>Top 10</option>
          <option value={25}>Top 25</option>
          <option value={50}>Top 50</option>
        </select>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', minWidth: '110px' }}>
        <label style={labelS}>Status</label>
        <select value={filters.status} onChange={e => set('status', e.target.value)} style={inputS}>
          <option value="all">All</option>
          <option value="active">Active</option>
          <option value="disqualified">Disqualified</option>
        </select>
      </div>

      <button
        onClick={() => onChange({ search: '', institution: 'All Institutions', minProblems: 0, maxRank: 0, status: 'all' })}
        style={{
          padding: '8px 16px', borderRadius: '10px', fontSize: '12px', fontWeight: 600, cursor: 'pointer',
          background: 'rgba(249,115,22,0.12)', color: '#FB923C',
          border: '1px solid rgba(249,115,22,0.3)', transition: 'all 0.15s',
        }}
      >Reset</button>
    </div>
  )
}
