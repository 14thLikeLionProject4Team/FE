/** 화면에 숫자·날짜를 보여줄 때 쓰는 공통 함수 */

const WEEKDAYS = ['일', '월', '화', '수', '목', '금', '토']

/** 79500 → "79,500" */
export const num = (n?: number | null) => (n ?? 0).toLocaleString('ko-KR')

/** 79500 → "79,500원" */
export const won = (n?: number | null) => `${num(n)}원`

/** "2026-10-25" / "2026-10-25T18:00:00" → Date (로컬 시간 기준) */
export const toDate = (s: string) =>
  new Date(s.length === 10 ? `${s}T00:00:00` : s)

/** "10월 25일" */
export const monthDay = (s: string) => {
  const d = toDate(s)
  return `${d.getMonth() + 1}월 ${d.getDate()}일`
}

/** "토" */
export const weekday = (s: string) => WEEKDAYS[toDate(s).getDay()]

/** "10월 25일 (토)" */
export const monthDayW = (s: string) => `${monthDay(s)} (${weekday(s)})`

/** "오후 6시" / "오후 6시 30분" */
export const timeLabel = (s: string) => {
  const d = toDate(s)
  const h = d.getHours()
  const m = d.getMinutes()
  return `${h < 12 ? '오전' : '오후'} ${h % 12 || 12}시${m ? ` ${m}분` : ''}`
}

/** "2026-10-17T17:39:00" → "10월 17일 오후 5시 39분" */
export const dateTime = (s: string) => `${monthDay(s)} ${timeLabel(s)}`

/** "2007-11-02" → "2007년 11월생" */
export const birthLabel = (s: string) => {
  const d = toDate(s)
  return `${d.getFullYear()}년 ${d.getMonth() + 1}월생`
}

/** "2026-09" → "9월" */
export const monthLabel = (ym: string) => `${Number(ym.split('-')[1])}월`

/** "2024-07-01" → "2024.7" */
export const yearMonthDot = (s: string) => {
  const d = toDate(s)
  return `${d.getFullYear()}.${d.getMonth() + 1}`
}

export const MISSION_TYPE_LABEL: Record<string, string> = {
  CHORE: '집안일 돕기',
  FINANCE: '금융 배우기',
  HABIT: '습관 만들기',
}

export const VISIBILITY_LABEL: Record<string, string> = {
  TOTAL_ONLY: '총액만',
  CATEGORY: '카테고리까지',
  DETAIL: '자세히',
}

/** "2026-10-19" 에 days 일을 더해요 */
export const addDays = (ymd: string, days: number) => {
  const d = new Date(`${ymd}T00:00:00`)
  d.setDate(d.getDate() + days)
  const pad = (n: number) => String(n).padStart(2, '0')
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`
}

/** 날짜 칸 안에 넣는 달력 입력 — 디자인 글씨체를 그대로 따라가요 */
export const dateInputStyle = {
  border: 'none',
  background: 'transparent',
  padding: 0,
  font: 'inherit',
  color: 'inherit',
  width: '100%',
} as const
