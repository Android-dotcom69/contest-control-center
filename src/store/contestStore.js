import { create } from 'zustand'
import { contest } from '../data/contest'
import { calculateLeaderboard } from '../lib/ranking'
import { useActivityStore } from './activityStore'

export const useContestStore = create((set, get) => ({
  contest: { ...contest },
  isFrozen: false,
  frozenSnapshot: null,

  toggleFreeze: (submissions, participants) => {
    const { isFrozen } = get()

    if (!isFrozen) {
      const snapshot = calculateLeaderboard(submissions, participants, contest.startTime)
      set({ isFrozen: true, frozenSnapshot: snapshot })
      useActivityStore.getState().addActivity({
        type: 'leaderboard_frozen',
        message: 'Leaderboard has been frozen — rankings locked for final phase',
      })
    } else {
      set({ isFrozen: false, frozenSnapshot: null })
      useActivityStore.getState().addActivity({
        type: 'leaderboard_unfrozen',
        message: 'Leaderboard unfrozen — live rankings restored',
      })
    }
  },

  setContestStatus: (status) =>
    set(state => ({ contest: { ...state.contest, status } })),
}))
