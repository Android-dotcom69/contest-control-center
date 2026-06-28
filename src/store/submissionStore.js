import { create } from 'zustand'
import { submissions as initialSubmissions } from '../data/submissions'
import { participants } from '../data/participants'
import { problems } from '../data/problems'
import { useActivityStore } from './activityStore'

const participantMap = Object.fromEntries(participants.map(p => [p.id, p.name]))
const problemMap     = Object.fromEntries(problems.map(p => [p.id, p.code]))

export const useSubmissionStore = create((set, get) => ({
  submissions: [...initialSubmissions],
  undoStack:   [],

  rejudge: (submissionId, newVerdict) => {
    const { submissions, undoStack } = get()
    const target = submissions.find(s => s.id === submissionId)
    if (!target) return

    const oldVerdict = target.verdict
    set({
      submissions: submissions.map(s =>
        s.id === submissionId
          ? { ...s, verdict: newVerdict, isRejudged: true, originalVerdict: oldVerdict }
          : s
      ),
      undoStack: [...undoStack.slice(-9), { submissionId, oldVerdict }],
    })

    const name    = participantMap[target.participantId] ?? target.participantId
    const problem = problemMap[target.problemId] ?? target.problemId
    useActivityStore.getState().addActivity({
      type: 'submission_rejudged',
      message: `${name} — Problem ${problem} rejudged: ${fmt(oldVerdict)} → ${fmt(newVerdict)}`,
    })
  },

  undoRejudge: () => {
    const { undoStack, submissions } = get()
    if (!undoStack.length) return
    const { submissionId, oldVerdict } = undoStack[undoStack.length - 1]
    set({
      submissions: submissions.map(s =>
        s.id === submissionId
          ? { ...s, verdict: oldVerdict, isRejudged: false, originalVerdict: null }
          : s
      ),
      undoStack: undoStack.slice(0, -1),
    })
  },

  addSubmission: (submission) => {
    set(state => ({ submissions: [submission, ...state.submissions] }))
    const name    = participantMap[submission.participantId] ?? submission.participantId
    const problem = problemMap[submission.problemId] ?? submission.problemId
    useActivityStore.getState().addActivity({
      type: 'submission_received',
      message: `${name} submitted Problem ${problem} — ${fmt(submission.verdict)}`,
    })
  },

  resolveSubmission: (submissionId, verdict) => {
    const target = get().submissions.find(s => s.id === submissionId)
    set(state => ({
      submissions: state.submissions.map(s =>
        s.id === submissionId ? { ...s, verdict } : s
      ),
    }))
    if (target) {
      const name    = participantMap[target.participantId] ?? target.participantId
      const problem = problemMap[target.problemId] ?? target.problemId
      useActivityStore.getState().addActivity({
        type: 'submission_received',
        message: `${name} submitted Problem ${problem} — ${fmt(verdict)}`,
      })
    }
  },
}))

function fmt(v) {
  return { accepted:'Accepted', wrong_answer:'Wrong Answer', time_limit_exceeded:'TLE', runtime_error:'Runtime Error', pending:'Pending', running:'Running' }[v] ?? v
}
