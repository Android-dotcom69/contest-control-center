const START = new Date(Date.now() - 90 * 60 * 1000)
function t(minutesIn) {
  return new Date(START.getTime() + minutesIn * 60 * 1000).toISOString()
}

export const initialActivities = [
  { id: 'a001', type: 'participant_joined', timestamp: t(0),  message: 'Arjun Mehta joined the contest' },
  { id: 'a002', type: 'participant_joined', timestamp: t(0),  message: 'Priya Sharma joined the contest' },
  { id: 'a003', type: 'participant_joined', timestamp: t(1),  message: 'Rohan Das joined the contest' },
  { id: 'a004', type: 'submission_received',timestamp: t(2),  message: 'Ankit Verma submitted Problem A — Accepted' },
  { id: 'a005', type: 'submission_received',timestamp: t(3),  message: 'Karan Patel submitted Problem A — Accepted' },
  { id: 'a006', type: 'participant_joined', timestamp: t(3),  message: 'Sneha Iyer joined the contest' },
  { id: 'a007', type: 'submission_received',timestamp: t(4),  message: 'Rohan Das submitted Problem A — Accepted' },
  { id: 'a008', type: 'submission_received',timestamp: t(5),  message: 'Arjun Mehta submitted Problem A — Accepted' },
  { id: 'a009', type: 'submission_received',timestamp: t(6),  message: 'Priya Sharma submitted Problem A — Accepted' },
  { id: 'a010', type: 'submission_received',timestamp: t(8),  message: 'Sneha Iyer submitted Problem A — Wrong Answer' },
  { id: 'a011', type: 'submission_received',timestamp: t(10), message: 'Ankit Verma submitted Problem B — Accepted' },
  { id: 'a012', type: 'submission_received',timestamp: t(12), message: 'Sneha Iyer submitted Problem A — Accepted' },
  { id: 'a013', type: 'submission_received',timestamp: t(15), message: 'Arjun Mehta submitted Problem B — Wrong Answer' },
  { id: 'a014', type: 'submission_received',timestamp: t(22), message: 'Arjun Mehta submitted Problem B — Accepted' },
  { id: 'a015', type: 'submission_received',timestamp: t(25), message: 'Ankit Verma submitted Problem C — Accepted' },
  { id: 'a016', type: 'submission_received',timestamp: t(30), message: 'Aditya Kumar submitted Problem C — Accepted' },
  { id: 'a017', type: 'submission_received',timestamp: t(45), message: 'Ankit Verma submitted Problem D — Accepted' },
  { id: 'a018', type: 'submission_received',timestamp: t(55), message: 'Aditya Kumar submitted Problem D — Accepted' },
  { id: 'a019', type: 'submission_received',timestamp: t(65), message: 'Ankit Verma submitted Problem E — Accepted' },
  { id: 'a020', type: 'submission_received',timestamp: t(80), message: 'Ankit Verma submitted Problem F — Accepted' },
  { id: 'a021', type: 'submission_received',timestamp: t(85), message: 'Aditya Kumar submitted Problem E — Accepted' },
  { id: 'a022', type: 'submission_received',timestamp: t(87), message: 'Arjun Mehta submitted Problem F — Runtime Error' },
  { id: 'a023', type: 'submission_received',timestamp: t(88), message: 'Yash Oberoi submitted Problem G — Wrong Answer' },
  { id: 'a024', type: 'submission_received',timestamp: t(89), message: 'Rahul Joshi submitted Problem B — Pending' },
]
