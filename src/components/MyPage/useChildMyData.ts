import {
  getCertificateEligibility,
  getChildMy,
  getLatestCertificate,
  issueCertificate,
} from '../../api/child'
import { getRecordsSummary, getVisibility } from '../../api/common'
import { getCurrentSettlement, getSettlements } from '../../api/settlements'
import { optional, useApi } from '../../api/useApi'
import { birthLabel, monthDay, toDate, yearMonthDot } from '../../utils/format'

/** 자녀 마이 · 본인 마이 화면이 같이 쓰는 데이터 */
export function useChildMyData(accountId?: string) {
  const api = useApi(
    () =>
      Promise.all([
        getChildMy(),
        getCertificateEligibility(),
        getRecordsSummary(),
        optional(getVisibility()),
        optional(getCurrentSettlement()),
        optional(getSettlements({ size: 1 })),
        optional(getLatestCertificate()),
      ]).then(([my, eligibility, records, visibility, current, settlements, latest]) => ({
        my,
        eligibility,
        records,
        visibility,
        current,
        settlements,
        latest,
      })),
    [accountId],
  )

  const issue = async () => {
    await issueCertificate({ identityVerified: true })
    await api.reload()
  }

  return { ...api, issue }
}

type MyData = NonNullable<ReturnType<typeof useChildMyData>['data']>

/** 화면에 그대로 넣을 문구들로 바꿔요 */
export function toMyView(d: MyData) {
  const { my, eligibility: el, records: r, visibility, current, settlements, latest } = d
  const count: number = el.settlementCount
  const required: number = el.settlementRequired

  const settlementNote =
    count >= required
      ? `${count}회 쌓였어요`
      : current && count + 1 >= required
        ? `이번 결제일(${monthDay(current.dueAt)})에 ${required}회가 돼요`
        : `${required - count}회 더 쌓이면 돼요`

  // 기록 기간: 가장 최근 정산 달에서 totalMonths 만큼 거슬러 올라가요
  let period = ''
  const lastEnd: string | undefined = settlements?.items?.[0]?.periodEnd
  if (lastEnd && r.totalMonths) {
    const end = toDate(lastEnd)
    const start = new Date(end.getFullYear(), end.getMonth() - (r.totalMonths - 1), 1)
    period = `${start.getFullYear()}.${start.getMonth() + 1} ~ ${yearMonthDot(lastEnd)}`
  }

  return {
    name: my.name as string,
    meta: `${birthLabel(my.birthDate)} · 만 ${my.age}세`,
    cardChip: my.familyCardLinked ? '가족카드 연결됨' : '가족카드 연결 전',
    adultAt: my.adultTransition?.at as string | null,
    canIssue: el.canIssue as boolean,
    issued: Boolean(latest),
    age: {
      done: el.ageReached as boolean,
      note: el.ageReached
        ? `${my.adultTransition?.at ? monthDay(my.adultTransition.at) : ''}에 됐어요`
        : `${monthDay(my.birthDate)} 생일`,
      value: el.ageReached ? '완료' : `D-${el.birthdayDDay}`,
    },
    settlement: {
      done: count >= required,
      note: settlementNote,
      value: count >= required ? '완료' : `${count} / ${required}`,
      ratio: Math.min(1, count / required),
    },
    availableFrom: el.availableFrom ? `${monthDay(el.availableFrom)}부터 발급할 수 있어요` : '',
    stats: {
      fullPaid: `${r.fullPaidMonths} / ${r.totalMonths}개월`,
      maxStreak: `${r.maxStreak}개월`,
      margin: `평균 ${Math.round(r.avgMarginRate)}%`,
      selfResolved: `${r.selfResolvedCount} / ${r.shortfallCount}건`,
      allResolved: r.shortfallCount > 0 && r.selfResolvedCount === r.shortfallCount,
    },
    period,
    visibility: visibility
      ? `${visibility.label} · ${visibility.changeableBy === 'PARENT' ? '부모님이 정해요' : '내가 정해요'}`
      : '',
  }
}
