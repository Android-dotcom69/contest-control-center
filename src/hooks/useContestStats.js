import { useMemo } from 'react'
import { useSubmissionStore } from '../store/submissionStore'
import { useParticipantStore } from '../store/participantStore'
import { problems } from '../data/problems'

export function useContestStats() {
  const submissions = useSubmissionStore(s => s.submissions)
  const participants = useParticipantStore(s => s.participants)

  return useMemo(() => {
    const total       = submissions.length
    const accepted    = submissions.filter(s => s.verdict === 'accepted').length
    const rejected    = submissions.filter(s =>
      ['wrong_answer','time_limit_exceeded','runtime_error'].includes(s.verdict)
    ).length
    const pending     = submissions.filter(s =>
      ['pending','running'].includes(s.verdict)
    ).length

    return {
      totalParticipants: participants.length,
      totalProblems:     problems.length,
      totalSubmissions:  total,
      accepted,
      rejected,
      pending,
    }
  }, [submissions, participants])
}
