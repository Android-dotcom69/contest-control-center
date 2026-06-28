import { useState } from 'react'
import Badge from '../ui/Badge'

const VERDICTS = [
  { value: 'accepted',            label: 'Accepted' },
  { value: 'wrong_answer',        label: 'Wrong Answer' },
  { value: 'time_limit_exceeded', label: 'Time Limit Exceeded' },
  { value: 'runtime_error',       label: 'Runtime Error' },
  { value: 'pending',             label: 'Pending' },
]

export default function RejudgeModal({ submission, onConfirm, onClose }) {
  const [selected, setSelected] = useState(submission.verdict)

  if (!submission) return null

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 50, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(8px)' }} onClick={onClose} />

      <div style={{
        position: 'relative', width: '100%', maxWidth: '440px',
        borderRadius: '24px', padding: '28px',
        background: 'var(--card-bg)', backdropFilter: 'blur(20px)',
        border: '1px solid var(--card-border)',
        boxShadow: '0 32px 80px rgba(0,0,0,0.5)',
      }}>
        <h3 style={{ fontSize: '18px', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '6px' }}>Rejudge Submission</h3>
        <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '24px' }}>
          Select a new verdict for <span style={{ fontFamily: 'monospace', color: 'var(--text-primary)', fontWeight: 600 }}>{submission.participantName}</span>
        </p>

        <div style={{ borderRadius: '14px', padding: '16px', marginBottom: '20px', background: 'var(--input-bg)', border: '1px solid var(--input-border)' }}>
          {[
            ['Participant', submission.participantName],
            ['Problem', submission.problemName],
            ['Language', submission.language],
          ].map(([label, val]) => (
            <div key={label} style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', borderBottom: '1px solid var(--td-border)' }}>
              <span style={{ fontSize: '12px', color: 'var(--text-accent)' }}>{label}</span>
              <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-primary)' }}>{val}</span>
            </div>
          ))}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '6px' }}>
            <span style={{ fontSize: '12px', color: 'var(--text-accent)' }}>Current Verdict</span>
            <Badge status={submission.verdict} />
          </div>
        </div>

        <p style={{ fontSize: '10px', fontWeight: 700, color: 'var(--text-muted)', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '10px' }}>
          New Verdict
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', marginBottom: '24px' }}>
          {VERDICTS.map(v => (
            <label key={v.value} style={{
              display: 'flex', alignItems: 'center', gap: '12px',
              padding: '10px 14px', borderRadius: '12px', cursor: 'pointer',
              background: selected === v.value ? 'rgba(249,115,22,0.1)' : 'var(--input-bg)',
              border: selected === v.value ? '1px solid rgba(249,115,22,0.4)' : '1px solid var(--input-border)',
              transition: 'all 0.15s',
            }}>
              <input type="radio" name="verdict" value={v.value}
                checked={selected === v.value} onChange={() => setSelected(v.value)}
                style={{ accentColor: '#F97316' }} />
              <Badge status={v.value} />
              <span style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>{v.label}</span>
            </label>
          ))}
        </div>

        <div style={{ display: 'flex', gap: '10px' }}>
          <button onClick={onClose} style={{
            flex: 1, padding: '11px', borderRadius: '12px', fontSize: '13px', fontWeight: 600, cursor: 'pointer',
            background: 'var(--btn-bg)', color: 'var(--btn-color)',
            border: '1px solid var(--btn-border)',
          }}>Cancel</button>
          <button
            onClick={() => onConfirm(submission.id, selected)}
            disabled={selected === submission.verdict}
            style={{
              flex: 1, padding: '11px', borderRadius: '12px', fontSize: '13px', fontWeight: 700, cursor: 'pointer',
              background: selected === submission.verdict ? 'rgba(249,115,22,0.2)' : 'linear-gradient(135deg, #f97316, #ea580c)',
              color: selected === submission.verdict ? 'var(--text-muted)' : '#fff',
              border: 'none',
              boxShadow: selected === submission.verdict ? 'none' : '0 4px 20px rgba(249,115,22,0.4)',
            }}
          >Confirm Rejudge</button>
        </div>
      </div>
    </div>
  )
}
