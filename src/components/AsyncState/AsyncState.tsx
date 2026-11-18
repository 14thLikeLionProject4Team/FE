import type { CSSProperties } from 'react'

type AsyncStateProps = {
  loading: boolean
  error: string | null
  onRetry?: () => void
}

/**
 * 불러오는 중 / 실패 화면. 둘 다 아니면 아무것도 그리지 않아요.
 *
 *   if (loading || error || !data) return <AsyncState loading={loading} error={error} onRetry={reload} />
 */
export function AsyncState({ loading, error, onRetry }: AsyncStateProps) {
  const box: CSSProperties = {
    padding: '48px 24px',
    textAlign: 'center',
    color: '#8a8a99',
    fontSize: 14,
    lineHeight: 1.6,
  }

  if (loading) return <div style={box}>불러오는 중...</div>

  if (error)
    return (
      <div style={box}>
        <p>{error}</p>
        {onRetry && (
          <button
            type="button"
            onClick={onRetry}
            style={{
              marginTop: 12,
              padding: '8px 16px',
              borderRadius: 8,
              border: '1px solid #d9d9e3',
              background: '#fff',
              cursor: 'pointer',
            }}
          >
            다시 시도
          </button>
        )}
      </div>
    )

  return null
}
