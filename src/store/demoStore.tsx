import { useCallback, useMemo, useState } from 'react'
import type { ReactNode } from 'react'
import { DemoContext } from './demoContext'
import type {
  ChatMessage,
  DecisionId,
  Mission,
  MissionStatus,
} from './demoContext'

/** 시연 기준 시각 — 원장의 demo_today 와 맞춘다 */
const nowLabel = () => {
  const d = new Date()
  const h = d.getHours()
  const period = h < 12 ? '오전' : '오후'
  const hour12 = h % 12 === 0 ? 12 : h % 12
  return `${period} ${hour12}:${String(d.getMinutes()).padStart(2, '0')}`
}

/** 코치 응답 — 지금은 규칙 기반, 나중에 RAG 응답으로 교체한다 */
const coachReply = (text: string): string => {
  if (text.includes('미션')) {
    return '좋아! 미션 탭에서 가능한 미션을 열어뒀어. 분리수거는 1회만 더 하면 +3,000원이야.'
  }
  if (text.includes('절약') || text.includes('팁')) {
    return '하루 1,000원씩만 줄여도 남은 5일이면 5,000원이야. 편의점 간식부터 줄여볼까?'
  }
  if (text.includes('말할') || text.includes('솔직')) {
    return '좋은 생각이야. 부모님께는 금액 대신 "스스로 해결 중"으로 전달되니까 편하게 말해도 돼.'
  }
  return '알려줘서 고마워. 결제일까지 6일 남았으니까 같이 계획을 세워보자.'
}

const INITIAL_MISSIONS: Mission[] = [
  {
    id: 'm-recycle',
    name: '분리수거 한 달 맡기',
    type: '집안일 돕기',
    amount: 3000,
    status: 'active',
    progress: 80,
    note: '일요일 인증 예정 (4/5회 달성)',
  },
  {
    id: 'm-receipt',
    name: '이번 주 영수증 정리하기',
    type: '금융 배우기',
    amount: 3000,
    status: 'pending',
    note: '어제 저녁 제출 · 영수증 사진 2장 첨부',
  },
  {
    id: 'm-plant',
    name: '베란다 화분 물 주기 · 한 달',
    type: '집안일 돕기',
    amount: 3000,
    status: 'proposed',
    note: '내가 바라는 보상 3,000원',
  },
  {
    id: 'm-saving',
    name: '저축 목표 3주 지키기',
    type: '습관 만들기',
    amount: 3000,
    status: 'active',
    note: '매일 1,000원씩 저금통 챌린지 달성 중',
  },
]

const INITIAL_DECISIONS: DecisionId[] = ['allowance', 'message', 'proof']

export function DemoProvider({ children }: { children: ReactNode }) {
  const [decisions, setDecisions] = useState<DecisionId[]>(INITIAL_DECISIONS)
  const [missions, setMissions] = useState<Mission[]>(INITIAL_MISSIONS)
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [allowance, setAllowanceState] = useState(73000)
  const [toast, setToast] = useState<string | null>(null)

  const addMission = useCallback(
    (input: Omit<Mission, 'id' | 'status'>, status: MissionStatus) => {
      setMissions((prev) => [
        { ...input, id: `m-${Date.now()}`, status },
        ...prev,
      ])
    },
    [],
  )

  const value = useMemo(
    () => ({
      decisions,
      missions,
      messages,
      allowance,
      toast,

      proposeMission: (input: Omit<Mission, 'id' | 'status'>) => {
        addMission(input, 'proposed')
        setToast('부모님께 제안을 보냈어요')
      },

      openMission: (input: Omit<Mission, 'id' | 'status'>) => {
        addMission(input, 'active')
        setToast('미션을 열었어요')
      },

      approveMission: (id: string) => {
        setMissions((prev) =>
          prev.map((m) => (m.id === id ? { ...m, status: 'done' } : m)),
        )
        setToast('보상을 보냈어요')
      },

      rejectMission: (id: string) => {
        setMissions((prev) => prev.filter((m) => m.id !== id))
        setToast('다시 부탁했어요')
      },

      submitProof: (id: string) => {
        setMissions((prev) =>
          prev.map((m) => (m.id === id ? { ...m, status: 'pending' } : m)),
        )
        setToast('인증을 보냈어요')
      },

      sendMessage: (text: string) => {
        const trimmed = text.trim()
        if (!trimmed) return
        const time = nowLabel()
        setMessages((prev) => [
          ...prev,
          { id: `c-${Date.now()}`, role: 'child', text: trimmed, time },
        ])
        // 코치 응답은 약간 늦게 — 실제 API 호출 자리
        window.setTimeout(() => {
          setMessages((prev) => [
            ...prev,
            {
              id: `k-${Date.now()}`,
              role: 'coach',
              text: coachReply(trimmed),
              time: nowLabel(),
            },
          ])
        }, 600)
      },

      setAllowance: (amount: number) => {
        setAllowanceState(amount)
        setToast(`11월부터 ${amount.toLocaleString()}원으로 바꿨어요`)
      },

      resolveDecision: (id: DecisionId, message: string) => {
        setDecisions((prev) => prev.filter((d) => d !== id))
        setToast(message)
      },

      clearToast: () => setToast(null),
    }),
    [decisions, missions, messages, allowance, toast, addMission],
  )

  return <DemoContext.Provider value={value}>{children}</DemoContext.Provider>
}
