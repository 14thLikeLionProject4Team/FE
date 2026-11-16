import { useContext } from 'react'
import { DemoContext } from './demoContext'

/** 시연용 전역 상태. 백엔드가 붙으면 이 훅 내부만 API 호출로 바꾸면 된다. */
export function useDemo() {
  const ctx = useContext(DemoContext)
  if (!ctx) throw new Error('useDemo 는 DemoProvider 안에서만 쓸 수 있어요')
  return ctx
}
