import { createContext } from 'react'

type DemoState = {
  /** 저장·승인 직후 안내 문구 — 화면 상단 토스트에 쓴다 */
  toast: string | null
}

type DemoActions = {
  /** 화면 상단에 잠깐 안내 문구를 띄워요 */
  showToast: (message: string) => void
  clearToast: () => void
}

/**
 * 화면 사이에서 같이 쓰는 상태.
 * 데이터(미션·용돈·대화 등)는 이제 전부 백엔드 API 에서 받아오고,
 * 여기에는 토스트 같은 화면 상태만 남아 있어요.
 */
export const DemoContext = createContext<(DemoState & DemoActions) | null>(null)
