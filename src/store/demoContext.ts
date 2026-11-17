import { createContext } from 'react'

export type MissionStatus =
  | 'proposed' // 자녀가 제안, 부모 확인 대기
  | 'pending' // 자녀가 인증 제출, 부모 확인 대기
  | 'active' // 진행 중
  | 'done' // 완료 · 보상 지급

export type Mission = {
  id: string
  name: string
  /** 집안일 돕기 · 금융 배우기 · 습관 만들기 */
  type: string
  amount: number
  status: MissionStatus
  /** 완료 기준 */
  criteria?: string
  /** 진행률 0~100 */
  progress?: number
  note?: string
}

export type ChatMessage = {
  id: string
  role: 'child' | 'coach'
  text: string
  time: string
}

/** 부모 홈 "결정할 것" 카드 — 처리하면 목록에서 빠진다 */
export type DecisionId = 'allowance' | 'message' | 'proof'

type DemoState = {
  decisions: DecisionId[]
  missions: Mission[]
  messages: ChatMessage[]
  allowance: number
  /** 제안·생성 직후 안내 문구 — 화면 상단 토스트에 쓴다 */
  toast: string | null
}

type DemoActions = {
  /** 결정 카드를 처리해 목록에서 제거한다 */
  resolveDecision: (id: DecisionId, message: string) => void
  /** 자녀가 미션을 제안한다 */
  proposeMission: (input: Omit<Mission, 'id' | 'status'>) => void
  /** 부모가 미션을 연다 */
  openMission: (input: Omit<Mission, 'id' | 'status'>) => void
  /** 부모가 인증을 승인한다 */
  approveMission: (id: string) => void
  /** 부모가 인증을 거절한다 */
  rejectMission: (id: string) => void
  /** 자녀가 인증을 제출한다 */
  submitProof: (id: string) => void
  sendMessage: (text: string) => void
  setAllowance: (amount: number) => void
  clearToast: () => void
}

export const DemoContext = createContext<
  (DemoState & DemoActions) | null
>(null)

