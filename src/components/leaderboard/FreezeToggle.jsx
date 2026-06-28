import { useContestStore } from '../../store/contestStore'
import { useSubmissionStore } from '../../store/submissionStore'
import { useParticipantStore } from '../../store/participantStore'
import { useActivityStore } from '../../store/activityStore'

export default function FreezeToggle() {
  const isFrozen     = useContestStore(s => s.isFrozen)
  const toggleFreeze = useContestStore(s => s.toggleFreeze)
  const submissions  = useSubmissionStore(s => s.submissions)
  const participants = useParticipantStore(s => s.participants)
  const addActivity  = useActivityStore(s => s.addActivity)

  function handleToggle() {
    toggleFreeze(submissions, participants)
    addActivity({
      type: isFrozen ? 'leaderboard_unfrozen' : 'leaderboard_frozen',
      message: isFrozen
        ? 'Leaderboard unfrozen — rankings updated with all submissions'
        : 'Leaderboard frozen — rankings locked for final phase',
    })
  }

  return (
    <div>
      {isFrozen ? (
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: '14px',
          padding: '14px 20px', borderRadius: '16px',
          background: 'rgba(59,130,246,0.1)', backdropFilter: 'blur(12px)',
          border: '1px solid rgba(59,130,246,0.25)',
          boxShadow: '0 4px 20px rgba(59,130,246,0.15)',
        }}>
          <span style={{ fontSize: '20px' }}>🔒</span>
          <div>
            <p style={{ fontSize: '13px', fontWeight: 700, color: '#93C5FD' }}>Leaderboard is Frozen</p>
            <p style={{ fontSize: '11px', color: 'rgba(147,197,253,0.5)', marginTop: '2px' }}>Rankings locked · New submissions still being accepted</p>
          </div>
          <button onClick={handleToggle} style={{
            marginLeft: '8px', padding: '8px 18px', borderRadius: '10px',
            fontSize: '13px', fontWeight: 700, cursor: 'pointer',
            background: 'linear-gradient(135deg, #3b82f6, #2563eb)', color: '#fff',
            border: 'none', boxShadow: '0 4px 16px rgba(59,130,246,0.4)',
          }}>Unfreeze</button>
        </div>
      ) : (
        <button onClick={handleToggle} style={{
          display: 'inline-flex', alignItems: 'center', gap: '8px',
          padding: '10px 18px', borderRadius: '12px',
          fontSize: '13px', fontWeight: 600, cursor: 'pointer',
          background: 'rgba(59,130,246,0.1)', color: '#60A5FA',
          border: '1px solid rgba(59,130,246,0.25)',
        }}>🔒 Freeze Leaderboard</button>
      )}
    </div>
  )
}
