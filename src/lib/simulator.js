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

// Returns the next problem a participant should work on.
// They must solve problems in order — they can only attempt the first
// unsolved problem, or retry a problem they've failed before.
function getNextProblemId(participantId, submissions) {
  const mySubmissions = submissions.filter(s => s.participantId === participantId)
  const solved = new Set(
    mySubmissions.filter(s => s.verdict === 'accepted').map(s => s.problemId)
  )

  // Find the first problem (in order A→H) that isn't solved yet
  const nextUnsolved = problems.find(p => !solved.has(p.id))
  if (!nextUnsolved) return null // solved everything

  // They might also be retrying the previous problem (already failed it)
  const hasFailed = mySubmissions.some(
    s => s.problemId === nextUnsolved.id &&
         ['wrong_answer', 'time_limit_exceeded', 'runtime_error'].includes(s.verdict)
  )

  // 70% chance to attempt the next unsolved, 30% chance to retry a failed one
  // (but only retry if they've actually failed it before)
  if (hasFailed && Math.random() < 0.3) return nextUnsolved.id
  return nextUnsolved.id
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
