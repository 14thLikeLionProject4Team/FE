import { useContext } from 'react'
import { DemoContext } from './demoContext'

/** 토스트 등 화면 사이에서 같이 쓰는 상태 */
export function useDemo() {
  const ctx = useContext(DemoContext)
  if (!ctx) throw new Error('useDemo 는 DemoProvider 안에서만 쓸 수 있어요')
  return ctx
}
