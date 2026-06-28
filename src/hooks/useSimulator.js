import { useEffect } from 'react'
import { startSimulator } from '../lib/simulator'

export function useSimulator() {
  useEffect(() => {
    const stop = startSimulator()
    return stop
  }, [])
}
