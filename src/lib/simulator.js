import { participants } from '../data/participants'
import { problems } from '../data/problems'
import { useSubmissionStore } from '../store/submissionStore'

const PARTICIPANT_IDS = participants.map(p => p.id)
const LANGUAGES       = ['C++', 'Python', 'Java', 'C']

// Weighted verdicts — AC ~35%, WA ~38%, TLE ~15%, RE ~12%
const VERDICTS = [
  ...Array(7).fill('accepted'),
  ...Array(7).fill('wrong_answer'),
  ...Array(3).fill('time_limit_exceeded'),
  ...Array(3).fill('runtime_error'),
]

let _counter = 5000

function pick(arr) {
  return arr[Math.floor(Math.random() * arr.length)]
}

function randBetween(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

// Returns a random unsolved problem for the participant.
// Participants can attempt any problem in any order (no sequential constraint).
function getNextProblemId(participantId, submissions) {
  const solved = new Set(
    submissions
      .filter(s => s.participantId === participantId && s.verdict === 'accepted')
      .map(s => s.problemId)
  )
  const unsolved = problems.filter(p => !solved.has(p.id))
  if (!unsolved.length) return null
  return pick(unsolved).id
}

export function startSimulator() {
  let stopped = false

  function scheduleNext() {
    if (stopped) return
    const delay = randBetween(6000, 14000)
    setTimeout(() => {
      if (stopped) return
      spawnSubmission()
      scheduleNext()
    }, delay)
  }

  scheduleNext()

  return () => { stopped = true }
}

function spawnSubmission() {
  const submissions   = useSubmissionStore.getState().submissions
  const participantId = pick(PARTICIPANT_IDS)
  const problemId     = getNextProblemId(participantId, submissions)

  // Skip if they've already solved everything
  if (!problemId) return

  const id = `sim${String(++_counter).padStart(4, '0')}`
  const submission = {
    id,
    participantId,
    problemId,
    submissionTime:  new Date().toISOString(),
    verdict:         'running',
    language:        pick(LANGUAGES),
    isRejudged:      false,
    originalVerdict: null,
  }

  useSubmissionStore.getState().addSubmission(submission)

  // Resolve to final verdict after 2–4 seconds
  setTimeout(() => {
    useSubmissionStore.getState().resolveSubmission(id, pick(VERDICTS))
  }, randBetween(2000, 4000))
}
