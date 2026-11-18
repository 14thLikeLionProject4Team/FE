import loopy from '../assets/avatars/loopy.png'
import loopyMom from '../assets/avatars/loopy-mom.png'
import pororo from '../assets/avatars/pororo.png'
import pororoMom from '../assets/avatars/pororo-mom.png'

export type AccountRole = 'child' | 'parent'

export type Account = {
  /** 백엔드 페르소나 ID (X-Persona-Id 헤더로 전송) */
  id: string
  name: string
  avatar: string
  /** 이름 옆 배지: 자녀 · 본인 · 부모 */
  badge: string
  /** 만 나이 · 생일 등 보조 설명 */
  caption: string
  /** 하단 상태 칩 */
  status: string
  /** 상태 칩 강조 여부 — 강조면 보라 솔리드, 아니면 회색 */
  statusHighlighted: boolean
  role: AccountRole
}

export type Family = {
  id: string
  title: string
  note: string
  members: Account[]
}

export const families: Family[] = [
  {
    id: 'family-a',
    title: '가족 A',
    note: '18세 → 19세로 넘어가는 중',
    members: [
      {
        id: '2',
        name: '루피',
        avatar: loopy,
        badge: '자녀',
        caption: '만 18세 · 2007년 11월생',
        status: '결제일 D-6 · 확인서 발급까지 D-14',
        statusHighlighted: true,
        role: 'child',
      },
      {
        id: '1',
        name: '루피 엄마',
        avatar: loopyMom,
        badge: '부모',
        caption: '루피 보호자 · 가족카드 본인회원',
        status: '확인 기다리는 미션 1',
        statusHighlighted: false,
        role: 'parent',
      },
    ],
  },
  {
    id: 'family-b',
    title: '가족 B',
    note: '막 만 19세가 됨',
    members: [
      {
        id: '4',
        name: '뽀로로',
        avatar: pororo,
        badge: '본인',
        caption: '만 19세 · 10월 3일 성년 전환',
        status: '확인서 발급 가능',
        statusHighlighted: true,
        role: 'child',
      },
      {
        id: '3',
        name: '뽀로로 엄마',
        avatar: pororoMom,
        badge: '부모',
        caption: '뽀로로 보호자 · 가족카드 본인회원',
        status: '기록이 본인에게 넘어감',
        statusHighlighted: false,
        role: 'parent',
      },
    ],
  },
]

/** 시연 기준일 — 디자인에 고정값으로 표기된 날짜 */
export const DEMO_DATE_LABEL = '오늘은 2026년 10월 19일 (월)로 보여요'
