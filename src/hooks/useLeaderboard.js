import { useMemo } from 'react'
import { useSubmissionStore } from '../store/submissionStore'
import { useParticipantStore } from '../store/participantStore'
import { useContestStore } from '../store/contestStore'
import { calculateLeaderboard } from '../lib/ranking'
import { contest } from '../data/contest'

export function useLeaderboard() {
  const submissions = useSubmissionStore(s => s.submissions)
  const participants = useParticipantStore(s => s.participants)
  const isFrozen = useContestStore(s => s.isFrozen)
  const frozenSnapshot = useContestStore(s => s.frozenSnapshot)

  const liveLeaderboard = useMemo(
    () => calculateLeaderboard(submissions, participants, contest.startTime),
    [submissions, participants]
  )

  // If frozen, show snapshot. Otherwise show live.
  return isFrozen && frozenSnapshot ? frozenSnapshot : liveLeaderboard
}
