const PENALTY_PER_WRONG = 20 // minutes

/**
 * Computes the full leaderboard from raw submissions.
 * Returns array sorted by: problemsSolved DESC, penaltyTime ASC.
 */
export function calculateLeaderboard(submissions, participants, contestStartTime) {
  const start = new Date(contestStartTime).getTime()

  // Build per-participant scoring
  const scoreMap = {}

  participants.forEach(p => {
    scoreMap[p.id] = { problemsSolved: 0, penaltyTime: 0, solvedSet: new Set() }
  })

  // Group submissions by participant + problem
  const grouped = {}
  submissions.forEach(sub => {
    const key = `${sub.participantId}_${sub.problemId}`
    if (!grouped[key]) grouped[key] = []
    grouped[key].push(sub)
  })

  // For each participant+problem group, calculate contribution
  Object.values(grouped).forEach(subs => {
    const participantId = subs[0].participantId
    if (!scoreMap[participantId]) return

    // Sort by submission time
    const sorted = [...subs].sort(
      (a, b) => new Date(a.submissionTime) - new Date(b.submissionTime)
    )

    let wrongsBefore = 0
    let solved = false

    for (const sub of sorted) {
      if (solved) break
      if (sub.verdict === 'accepted') {
        solved = true
        const submitMs = new Date(sub.submissionTime).getTime()
        const minutesTaken = Math.floor((submitMs - start) / 60000)
        const penalty = minutesTaken + wrongsBefore * PENALTY_PER_WRONG
        scoreMap[participantId].problemsSolved += 1
        scoreMap[participantId].penaltyTime += penalty
        scoreMap[participantId].solvedSet.add(sub.problemId)
      } else if (
        sub.verdict === 'wrong_answer' ||
        sub.verdict === 'time_limit_exceeded' ||
        sub.verdict === 'runtime_error'
      ) {
        wrongsBefore += 1
      }
      // pending / running don't count
    }
  })

  // Build sorted leaderboard array
  const entries = participants.map(p => ({
    participantId: p.id,
    participantName: p.name,
    institution: p.institution,
    problemsSolved: scoreMap[p.id]?.problemsSolved ?? 0,
    penaltyTime: scoreMap[p.id]?.penaltyTime ?? 0,
    solvedProblems: Array.from(scoreMap[p.id]?.solvedSet ?? []),
  }))

  entries.sort((a, b) => {
    if (b.problemsSolved !== a.problemsSolved) return b.problemsSolved - a.problemsSolved
    return a.penaltyTime - b.penaltyTime
  })

  return entries.map((entry, i) => ({ ...entry, rank: i + 1 }))
}
