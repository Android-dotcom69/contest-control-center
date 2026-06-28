import { create } from 'zustand'

const stored = localStorage.getItem('cc-theme') ?? 'dark'
document.documentElement.setAttribute('data-theme', stored)

export const useThemeStore = create((set) => ({
  isDark: stored === 'dark',
  toggleTheme: () => {
    set(s => {
      const isDark = !s.isDark
      const t = isDark ? 'dark' : 'light'
      document.documentElement.setAttribute('data-theme', t)
      localStorage.setItem('cc-theme', t)
      return { isDark }
    })
  },
}))
