import { create } from 'zustand'
import { participants as initialParticipants } from '../data/participants'

export const useParticipantStore = create(() => ({
  participants: [...initialParticipants],
}))
