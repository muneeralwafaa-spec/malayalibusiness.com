'use client'

import { useEffect } from 'react'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error('Page error:', error)
  }, [error])

  return (
    <div style={{ padding: 40, fontFamily: 'monospace', background: '#fff1f1', minHeight: '100vh' }}>
      <h1 style={{ color: '#c00', fontSize: 24, marginBottom: 16 }}>⚠ Application Error</h1>
      <p style={{ marginBottom: 8 }}><strong>Message:</strong> {error.message}</p>
      {error.digest && <p style={{ marginBottom: 8 }}><strong>Digest:</strong> {error.digest}</p>}
      <pre style={{ background: '#fee', padding: 16, borderRadius: 8, overflow: 'auto', fontSize: 12, whiteSpace: 'pre-wrap', marginBottom: 24 }}>
        {error.stack}
      </pre>
      <button
        onClick={reset}
        style={{ background: '#1a7a4a', color: '#fff', padding: '10px 20px', border: 'none', borderRadius: 8, cursor: 'pointer', fontSize: 14 }}
      >
        Try Again
      </button>
    </div>
  )
}
