import { useCallback, useEffect, useState } from 'react'
import type { DependencyList } from 'react'

/**
 * API 를 불러와 { data, loading, error, reload } 로 돌려주는 훅.
 * 화면이 처음 열릴 때 한 번 부르고, reload() 로 다시 부를 수 있어요.
 *
 *   const { data, loading, error, reload } = useApi(() => getChildHome(), [])
 */
export function useApi<T = any>(
  fetcher: () => Promise<T>,
  deps: DependencyList = [],
) {
  const [data, setData] = useState<T | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const load = useCallback(fetcher, deps)

  const reload = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      setData(await load())
    } catch (e) {
      setError(errorMessage(e))
    } finally {
      setLoading(false)
    }
  }, [load])

  useEffect(() => {
    reload()
  }, [reload])

  return { data, loading, error, reload, setData }
}

/** 백엔드 에러 응답에서 사용자에게 보여줄 문구를 꺼내요. */
export function errorMessage(e: unknown): string {
  const err = e as { response?: { data?: { message?: string } }; message?: string }
  return err?.response?.data?.message ?? '서버와 연결하지 못했어요'
}

/** 실패해도 화면 전체를 막지 않아야 하는 요청용 — 실패하면 null 을 돌려줘요. */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const optional = (p: Promise<any>): Promise<any> => p.catch(() => null)
