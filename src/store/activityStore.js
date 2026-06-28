import { create } from 'zustand'
import { initialActivities } from '../data/activities'

let _id = initialActivities.length + 1

export const useActivityStore = create((set) => ({
  activities: [...initialActivities].reverse(), // newest first

  addActivity: ({ type, message }) => {
    const newActivity = {
      id: `a${String(_id++).padStart(3, '0')}`,
      type,
      timestamp: new Date().toISOString(),
      message,
    }
    set(state => ({ activities: [newActivity, ...state.activities] }))
  },
}))
