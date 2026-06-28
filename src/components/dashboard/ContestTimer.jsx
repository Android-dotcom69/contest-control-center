import { useState, useEffect } from 'react'
import { contest } from '../../data/contest'
import { useThemeStore } from '../../store/themeStore'

function pad(n) { return String(n).padStart(2, '0') }

export default function ContestTimer() {
  const [secondsLeft, setSecondsLeft] = useState(0)
  const isDark = useThemeStore(s => s.isDark)

  useEffect(() => {
    function calc() {
      const end = new Date(contest.endTime).getTime()
      setSecondsLeft(Math.max(0, Math.floor((end - Date.now()) / 1000)))
    }
    calc()
    const id = setInterval(calc, 1000)
    return () => clearInterval(id)
  }, [])

  const total   = (new Date(contest.endTime) - new Date(contest.startTime)) / 1000
  const elapsed = total - secondsLeft
  const pct     = Math.min(100, (elapsed / total) * 100)
  const urgent  = secondsLeft < 30 * 60
  const ended   = secondsLeft === 0

  const hh = Math.floor(secondsLeft / 3600)
  const mm = Math.floor((secondsLeft % 3600) / 60)
  const ss = secondsLeft % 60

  const accent = urgent ? '#ef4444' : '#a78bfa'
  const bg = urgent
    ? 'linear-gradient(135deg, #450a0a 0%, #7f1d1d 100%)'
    : isDark
      ? 'linear-gradient(135deg, #0f0a2e 0%, #1a1050 100%)'
      : 'linear-gradient(135deg, #ede9ff 0%, #ddd6fe 100%)'

  const borderCol = urgent
    ? 'rgba(239,68,68,0.25)'
    : isDark ? 'rgba(139,92,246,0.22)' : 'rgba(124,58,237,0.3)'

  const shadowCol = urgent
    ? 'rgba(239,68,68,0.3)'
    : isDark ? 'rgba(139,92,246,0.28)' : 'rgba(124,58,237,0.18)'

  const digitColor  = urgent ? '#fff' : isDark ? '#fff' : '#1a0a3c'
  const labelColor  = urgent ? 'rgba(255,255,255,0.3)' : isDark ? 'rgba(255,255,255,0.28)' : 'rgba(26,10,60,0.35)'
  const pctColor    = urgent ? 'rgba(255,255,255,0.28)' : isDark ? 'rgba(255,255,255,0.28)' : 'rgba(26,10,60,0.3)'

  const R = 52, CIRC = 2 * Math.PI * R
  const dash = CIRC * (1 - pct / 100)

  return (
    <div style={{
      borderRadius: '20px', padding: '20px', height: '100%',
      background: bg,
      border: `1px solid ${borderCol}`,
      boxShadow: `0 8px 32px ${shadowCol}`,
      display: 'flex', flexDirection: 'column', position: 'relative', overflow: 'hidden',
    }}>
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '1px', background: `linear-gradient(90deg, ${accent}60, transparent)` }} />

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
        <p style={{ fontSize: '10px', fontWeight: 700, color: labelColor, letterSpacing: '0.12em', textTransform: 'uppercase' }}>Time Remaining</p>
        <span style={{
          fontSize: '10px', fontWeight: 700, padding: '3px 9px', borderRadius: '20px',
          background: 'rgba(255,255,255,0.1)', color: ended ? labelColor : urgent ? '#fca5a5' : '#c4b5fd',
          border: `1px solid ${urgent ? 'rgba(239,68,68,0.3)' : 'rgba(139,92,246,0.3)'}`,
        }}>
          {ended ? 'Ended' : urgent ? '⚠ Final' : 'Live'}
        </span>
      </div>

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '12px' }}>
        <div style={{ position: 'relative', width: '120px', height: '120px' }}>
          <svg width="120" height="120" style={{ position: 'absolute', inset: 0, transform: 'rotate(-90deg)' }}>
            <circle cx="60" cy="60" r={R} fill="none" stroke="rgba(255,255,255,0.07)" strokeWidth="6" />
            <circle cx="60" cy="60" r={R} fill="none"
              stroke={accent} strokeWidth="6"
              strokeLinecap="round"
              strokeDasharray={CIRC}
              strokeDashoffset={dash}
              style={{ filter: `drop-shadow(0 0 6px ${accent})`, transition: 'stroke-dashoffset 1s linear' }}
            />
          </svg>
          <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '2px' }}>
              <DigitPair value={pad(hh)} accent={accent} color={digitColor} />
              <Colon accent={accent} color={digitColor} />
              <DigitPair value={pad(mm)} accent={accent} color={digitColor} />
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '2px', marginTop: '2px' }}>
              <Colon accent={accent} color={digitColor} small />
              <DigitPair value={pad(ss)} accent={accent} color={digitColor} small />
            </div>
          </div>
        </div>
        <div style={{ display: 'flex', gap: '20px', fontSize: '9px', fontWeight: 700, color: labelColor, letterSpacing: '0.1em', textTransform: 'uppercase' }}>
          <span style={{ width: '28px', textAlign: 'center' }}>HRS</span>
          <span style={{ width: '28px', textAlign: 'center' }}>MIN</span>
        </div>
      </div>

      <div style={{ marginTop: '12px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '10px', color: pctColor, marginBottom: '5px' }}>
          <span>0%</span>
          <span style={{ color: accent, fontWeight: 600 }}>{Math.round(pct)}% elapsed</span>
          <span>100%</span>
        </div>
        <div style={{ height: '4px', borderRadius: '99px', background: 'rgba(255,255,255,0.08)', overflow: 'hidden' }}>
          <div style={{
            height: '100%', borderRadius: '99px', width: `${pct}%`,
            background: urgent ? 'linear-gradient(90deg,#fca5a5,#ef4444)' : `linear-gradient(90deg,#7c3aed,${accent})`,
            boxShadow: `0 0 8px ${accent}80`,
            transition: 'width 1s linear',
          }} />
        </div>
      </div>
    </div>
  )
}

function DigitPair({ value, accent, color, small }) {
  return (
    <span style={{ fontFamily: 'monospace', fontSize: small ? '14px' : '22px', fontWeight: 800, color, lineHeight: 1, textShadow: `0 0 12px ${accent}80` }}>
      {value}
    </span>
  )
}

function Colon({ accent, color, small }) {
  const [vis, setVis] = useState(true)
  useEffect(() => {
    const id = setInterval(() => setVis(v => !v), 1000)
    return () => clearInterval(id)
  }, [])
  return (
    <span style={{ fontFamily: 'monospace', fontSize: small ? '10px' : '18px', fontWeight: 800, color: vis ? accent : 'transparent', lineHeight: 1, transition: 'color 0.1s', textShadow: vis ? `0 0 10px ${accent}` : 'none' }}>
      :
    </span>
  )
}
