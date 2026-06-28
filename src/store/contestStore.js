import { create } from 'zustand'
import { contest } from '../data/contest'
import { calculateLeaderboard } from '../lib/ranking'

export const useContestStore = create((set, get) => ({
  contest: { ...contest },
  isFrozen: false,
  frozenSnapshot: null,

  toggleFreeze: (submissions, participants) => {
    const { isFrozen } = get()

    if (!isFrozen) {
      // Freezing — take a snapshot of current live leaderboard
      const snapshot = calculateLeaderboard(submissions, participants, contest.startTime)
      set({ isFrozen: true, frozenSnapshot: snapshot })
    } else {
      // Unfreezing — clear snapshot, live data takes over
      set({ isFrozen: false, frozenSnapshot: null })
    }
  },

  setContestStatus: (status) =>
    set(state => ({ contest: { ...state.contest, status } })),
}))
