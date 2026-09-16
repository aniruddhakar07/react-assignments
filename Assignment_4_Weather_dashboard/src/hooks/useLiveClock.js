import { useEffect, useRef, useState } from 'react'

// Weather API responses only give us a timestamp for the moment they
// were fetched (`dt`). Without this, the "Local time" display would
// stay frozen at that instant for as long as the page stays open.
// This hook ticks forward from that anchor every second using the
// device's own clock, so the displayed time — and anything derived
// from it, like the sun's position on the arc — stays live.
export function useLiveClock(anchorUnixSeconds) {
  const [nowUnixSeconds, setNowUnixSeconds] = useState(anchorUnixSeconds)
  const anchorRef = useRef({ dt: anchorUnixSeconds, perfMs: performance.now() })

  useEffect(() => {
    anchorRef.current = { dt: anchorUnixSeconds, perfMs: performance.now() }
    setNowUnixSeconds(anchorUnixSeconds)

    const interval = setInterval(() => {
      const elapsedSeconds = (performance.now() - anchorRef.current.perfMs) / 1000
      setNowUnixSeconds(anchorRef.current.dt + elapsedSeconds)
    }, 1000)

    return () => clearInterval(interval)
  }, [anchorUnixSeconds])

  return Math.floor(nowUnixSeconds)
}
