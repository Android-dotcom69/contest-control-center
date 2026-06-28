import { useEffect, useState } from 'react'
import { Outlet, NavLink, useLocation, useNavigate } from 'react-router-dom'
import { useContestStore } from '../../store/contestStore'
import { useThemeStore } from '../../store/themeStore'
import { useSubmissionStore } from '../../store/submissionStore'
import { useIsMobile } from '../../hooks/useIsMobile'
import { participants } from '../../data/participants'

const NAV = [
  {
    to: '/dashboard', label: 'Dashboard',
    icon: <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></svg>,
  },
  {
    to: '/participants', label: 'Participants',
    icon: <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>,
  },
  {
    to: '/submissions', label: 'Submissions',
    icon: <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>,
  },
  {
    to: '/leaderboard', label: 'Leaderboard',
    icon: <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="18 20 18 10"/><polyline points="12 20 12 4"/><polyline points="6 20 6 14"/></svg>,
  },
]

const ChefHatIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M6 13.87A4 4 0 0 1 7.41 6a5.11 5.11 0 0 1 1.05-1.54 5 5 0 0 1 7.08 0A5.11 5.11 0 0 1 16.59 6 4 4 0 0 1 18 13.87V21H6Z"/>
    <line x1="6" y1="17" x2="18" y2="17"/>
  </svg>
)

const SunIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/>
    <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
    <line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/>
    <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
  </svg>
)

const MoonIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
  </svg>
)

const HamburgerIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/>
  </svg>
)

export default function Layout() {
  const isFrozen      = useContestStore(s => s.isFrozen)
  const toggleFreeze  = useContestStore(s => s.toggleFreeze)
  const submissions   = useSubmissionStore(s => s.submissions)
  const { isDark, toggleTheme } = useThemeStore()
  const location      = useLocation()
  const navigate      = useNavigate()
  const isMobile      = useIsMobile()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const pageLabel     = NAV.find(n => location.pathname.startsWith(n.to))?.label ?? 'Dashboard'

  // Close sidebar on route change (mobile)
  useEffect(() => { setSidebarOpen(false) }, [location.pathname])

  // ── Keyboard shortcuts ─────────────────────────────────────
  useEffect(() => {
    function onKey(e) {
      if (['INPUT','TEXTAREA','SELECT'].includes(e.target.tagName)) return
      const ctrl = e.ctrlKey || e.metaKey
      if (ctrl && e.key === '1') { e.preventDefault(); navigate('/dashboard') }
      if (ctrl && e.key === '2') { e.preventDefault(); navigate('/participants') }
      if (ctrl && e.key === '3') { e.preventDefault(); navigate('/submissions') }
      if (ctrl && e.key === '4') { e.preventDefault(); navigate('/leaderboard') }
      if (e.key === 't' && !ctrl && !e.shiftKey) toggleTheme()
      if (e.key === 'f' && !ctrl && !e.shiftKey) toggleFreeze(submissions, participants)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [navigate, toggleTheme, toggleFreeze, submissions])

  const sidebarVisible = !isMobile || sidebarOpen

  return (
    <div style={{ display: 'flex', height: '100vh', overflow: 'hidden', background: 'transparent', position: 'relative' }}>

      {/* ── Mobile overlay backdrop ── */}
      {isMobile && sidebarOpen && (
        <div onClick={() => setSidebarOpen(false)} style={{
          position: 'fixed', inset: 0, zIndex: 19,
          background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(2px)',
        }} />
      )}

      {/* ── Sidebar ── */}
      <aside style={{
        width: '216px', flexShrink: 0, display: 'flex', flexDirection: 'column',
        background: 'var(--sidebar-bg)',
        backdropFilter: 'blur(20px)',
        borderRight: '1px solid var(--card-border)',
        zIndex: 20,
        transition: 'transform 0.25s ease, background 0.3s',
        ...(isMobile ? {
          position: 'fixed', top: 0, left: 0, height: '100vh',
          transform: sidebarOpen ? 'translateX(0)' : 'translateX(-100%)',
        } : {}),
      }}>
        {/* Logo */}
        <div style={{ padding: '18px 14px', borderBottom: '1px solid var(--nav-sep)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '11px' }}>
            <div style={{
              width: '40px', height: '40px', borderRadius: '11px', flexShrink: 0,
              background: 'linear-gradient(135deg, #5b21b6, #7c3aed, #a78bfa)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: '0 4px 18px rgba(124,58,237,0.55)',
            }}>
              <ChefHatIcon />
            </div>
            <div>
              <div style={{ fontSize: '14px', fontWeight: 700, color: 'var(--text-primary)', lineHeight: 1.2 }}>CodeChef</div>
              <div style={{ fontSize: '11px', color: 'var(--text-accent)', lineHeight: 1.3 }}>Contest Control</div>
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav style={{ flex: 1, padding: '10px 10px', display: 'flex', flexDirection: 'column', gap: '2px' }}>
          <p style={{ fontSize: '10px', fontWeight: 700, color: 'var(--text-accent)', letterSpacing: '0.12em', textTransform: 'uppercase', padding: '6px 8px 8px' }}>Navigation</p>
          {NAV.map(({ to, label, icon }) => (
            <NavLink key={to} to={to}
              style={({ isActive }) => ({
                display: 'flex', alignItems: 'center', gap: '10px',
                padding: '9px 12px', borderRadius: '10px',
                fontSize: '13px', fontWeight: 500, textDecoration: 'none',
                transition: 'all 0.15s',
                background: isActive ? 'linear-gradient(135deg, rgba(124,58,237,0.25), rgba(139,92,246,0.12))' : 'transparent',
                color: isActive ? '#c4b5fd' : 'var(--text-secondary)',
                border: isActive ? '1px solid rgba(139,92,246,0.35)' : '1px solid transparent',
                boxShadow: isActive ? '0 2px 14px rgba(124,58,237,0.25)' : 'none',
              })}
            >
              <span style={{ flexShrink: 0 }}>{icon}</span>
              {label}
            </NavLink>
          ))}
        </nav>

        {/* Keyboard shortcut hint */}
        {!isMobile && (
          <div style={{ padding: '0 14px 8px', fontSize: '11px', color: 'var(--text-secondary)' }}>
            <div style={{ borderTop: '1px solid var(--nav-sep)', paddingTop: '10px' }}>
              <div style={{ marginBottom: '6px', fontWeight: 700, color: 'var(--text-accent)', letterSpacing: '0.08em', textTransform: 'uppercase', fontSize: '10px' }}>Shortcuts</div>
              <div style={{ marginBottom: '3px' }}>Ctrl+1–4 &nbsp;Navigate</div>
              <div style={{ marginBottom: '3px' }}>T &nbsp;Toggle theme</div>
              <div>F &nbsp;Freeze toggle</div>
            </div>
          </div>
        )}

        {/* Status chip */}
        <div style={{ padding: '10px 10px 14px' }}>
          <div style={{ borderRadius: '12px', padding: '11px 12px', background: 'rgba(139,92,246,0.07)', border: '1px solid rgba(139,92,246,0.14)' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '3px' }}>
              <span style={{ fontSize: '11px', fontWeight: 600, color: 'var(--text-accent)' }}>CP 2026</span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '11px', fontWeight: 700, color: '#34D399' }}>
                <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#34D399', boxShadow: '0 0 8px #34D399', display: 'inline-block' }} />
                Live
              </span>
            </div>
            <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>CP Contest 2026</div>
          </div>
        </div>
      </aside>

      {/* ── Main ── */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', minWidth: 0 }}>

        {/* Topbar */}
        <header style={{
          height: '54px', flexShrink: 0,
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '0 16px',
          background: 'var(--topbar-bg)',
          backdropFilter: 'blur(20px)',
          borderBottom: '1px solid var(--card-border)',
          transition: 'background 0.3s',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            {/* Hamburger on mobile */}
            {isMobile && (
              <button onClick={() => setSidebarOpen(o => !o)} style={{
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                width: '32px', height: '32px', borderRadius: '8px', cursor: 'pointer',
                background: 'rgba(139,92,246,0.1)', color: 'var(--text-primary)',
                border: '1px solid rgba(139,92,246,0.2)',
              }}>
                <HamburgerIcon />
              </button>
            )}
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px' }}>
              <span style={{ color: 'var(--text-muted)' }}>Contest</span>
              <span style={{ color: 'rgba(139,92,246,0.3)' }}>/</span>
              <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{pageLabel}</span>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            {isFrozen && (
              <span style={{ fontSize: '12px', fontWeight: 600, padding: '4px 10px', borderRadius: '20px', background: 'rgba(59,130,246,0.12)', color: '#93c5fd', border: '1px solid rgba(59,130,246,0.25)' }}>🔒 Frozen</span>
            )}
            <button onClick={toggleTheme} title="Toggle theme (T)" style={{
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              width: '32px', height: '32px', borderRadius: '10px', cursor: 'pointer',
              background: 'rgba(139,92,246,0.1)', color: isDark ? '#fbbf24' : '#7c3aed',
              border: '1px solid rgba(139,92,246,0.2)',
              transition: 'all 0.2s',
            }}>
              {isDark ? <SunIcon /> : <MoonIcon />}
            </button>
            <span style={{
              display: 'flex', alignItems: 'center', gap: '6px',
              fontSize: '12px', fontWeight: 700, padding: '4px 12px', borderRadius: '20px',
              background: 'rgba(16,185,129,0.12)', color: '#34D399',
              border: '1px solid rgba(16,185,129,0.28)',
              boxShadow: '0 0 14px rgba(16,185,129,0.18)',
            }}>
              <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#34D399', boxShadow: '0 0 8px #34D399', display: 'inline-block' }} />
              {!isMobile && 'LIVE'}
            </span>
          </div>
        </header>

        {/* Page content */}
        <main style={{ flex: 1, overflow: 'auto', padding: isMobile ? '14px' : '22px' }}>
          <Outlet />
        </main>
      </div>

    </div>
  )
}
