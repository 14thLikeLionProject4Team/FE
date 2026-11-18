import type { ReactNode } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { getBriefings, getNotificationSettings } from '../../api/common'
import { getAllowanceChanges, getParentMy, getPromise } from '../../api/parent'
import { optional, useApi } from '../../api/useApi'
import loopyMom from '../../assets/avatars/loopy-mom.png'
import dotViolet from '../../assets/dot-violet.svg'
import timelineDot from '../../assets/icons/timeline-dot.svg'
import timelineDotActive from '../../assets/icons/timeline-dot-active.svg'
import { AsyncState } from '../../components/AsyncState/AsyncState'
import { BottomNav } from '../../components/BottomNav/BottomNav'
import type { NavTab } from '../../components/BottomNav/BottomNav'
import {
  Divider,
  ListCard,
  SettingRow,
  TimelineItem,
} from '../../components/MyPage/MyPageParts'
import styles from '../../components/MyPage/MyPage.module.css'
import { PhoneShell } from '../../components/PhoneShell/PhoneShell'
import { findAccount } from '../../data/accounts'
import { monthDay, monthLabel, num, toDate, VISIBILITY_LABEL, won } from '../../utils/format'

const PARENT_TABS: NavTab[] = ['home', 'mission', 'my']

export const REASON_LABEL: Record<string, string> = {
  INITIAL: '처음 정한 용돈',
  INFLATION: '물가',
  SCHOOL: '진학',
  RENEGOTIATION: '다시 약속',
  ETC: '기타',
}

type AllowanceChange = {
  changeId: number
  prevAmount: number | null
  amount: number
  reason: string
  source: string
  effectiveFrom: string
}

/** 화면 M3 — 부모 마이 (가족 A) */
export function ParentMy() {
  const navigate = useNavigate()
  const { accountId } = useParams()

  const { data, loading, error, reload } = useApi(
    () =>
      Promise.all([
        getParentMy(),
        optional(getPromise()),
        optional(getAllowanceChanges({ size: 2 })),
        optional(getBriefings()),
        optional(getNotificationSettings()),
      ]).then(([my, promise, changes, briefings, notifications]) => ({
        my,
        promise,
        changes,
        briefings,
        notifications,
      })),
    [accountId],
  )

  const handleNavigate = (tab: NavTab) => {
    navigate(tab === 'home' ? `/parent/${accountId}` : `/parent/${accountId}/${tab}`)
  }

  const shell = (children: ReactNode) => (
    <PhoneShell footer={<BottomNav active="my" tabs={PARENT_TABS} onNavigate={handleNavigate} />}>
      {children}
    </PhoneShell>
  )

  if (loading || error || !data)
    return shell(<AsyncState loading={loading} error={error} onRetry={reload} />)

  const { my, promise: p, changes, briefings, notifications } = data
  const childName: string = my.children?.[0]?.name ?? ''
  const changeList: AllowanceChange[] = changes?.items ?? []
  const offSettings = (notifications?.items ?? []).filter((n: { enabled: boolean }) => !n.enabled)
  const latestBriefing = briefings?.briefings?.[0]

  const allowanceValue = p
    ? `${won(p.allowance.current)}${
        p.allowance.next && p.allowance.nextEffectiveFrom
          ? ` · ${monthLabel(p.allowance.nextEffectiveFrom.slice(0, 7))}부터 ${won(p.allowance.next)}`
          : ''
      }`
    : ''

  return shell(
    <div className={styles.content}>
      <div className={styles.headerRow}>
        <h1 className={styles.headerTitle}>마이페이지</h1>
        <button type="button" className={styles.childChip}>
          {childName}
        </button>
      </div>

      {/* 프로필 */}
      <section className={styles.card}>
        <div className={styles.profileRow}>
          <img className={styles.avatar} src={findAccount(accountId)?.avatar ?? loopyMom} alt="" />
          <div>
            <p className={styles.profileName}>{my.name}</p>
            <p className={styles.profileMeta}>
              {my.relation}
              {my.cardHolder ? ' · 가족카드 본인회원' : ''}
            </p>
          </div>
        </div>
      </section>

      {/* 자녀와의 약속 */}
      {p && (
        <section className={styles.card}>
          <div className={styles.cardTitleRow}>
            <h2 className={styles.cardTitle}>{childName}와의 약속</h2>
            <span className={styles.statusChip}>
              <img src={dotViolet} width="6" height="6" alt="" />
              {p.streakMonths}개월 연속 완납
            </span>
          </div>

          <SettingRow
            label="월 용돈"
            value={allowanceValue}
            onClick={() => navigate(`/parent/${accountId}/allowance`)}
          />
          <Divider />
          <SettingRow
            label="용돈 보내는 날"
            value={`매월 ${p.allowanceDay}일${p.autoTransfer ? ' · 자동이체' : ''}`}
          />
          <Divider />
          <SettingRow label="결제일" value={`매월 ${p.settlementDay}일`} />
          <Divider />
          <SettingRow label="보는 범위" value={VISIBILITY_LABEL[p.visibility] ?? p.visibility} />
          <Divider />
          <SettingRow
            label="미션 상한"
            value={`한 달 ${won(p.missionCapAmount)} (용돈의 ${p.missionCapRate}%)`}
          />
          <Divider />
          <SettingRow
            label="카드 한도"
            value={`월 ${num(p.cardLimit / 10000)}만 원 · 카드사에서 변경`}
            muted
          />
        </section>
      )}

      {/* 약속 기록 */}
      {changeList.length > 0 && (
        <section className={styles.card}>
          <div className={styles.cardTitleRow}>
            <h2 className={styles.cardTitle}>약속 기록</h2>
            <button type="button" className={styles.link}>
              전체 보기 ›
            </button>
          </div>

          {changeList.map((c, i) => (
            <TimelineItem
              key={c.changeId}
              dot={i === 0 ? timelineDotActive : timelineDot}
              date={
                toDate(c.effectiveFrom).getFullYear() === toDate(changeList[0].effectiveFrom).getFullYear()
                  ? monthDay(c.effectiveFrom)
                  : `${toDate(c.effectiveFrom).getFullYear()}년 ${monthDay(c.effectiveFrom)}`
              }
              title={
                c.prevAmount == null
                  ? `용돈 ${won(c.amount)}`
                  : `용돈 ${num(c.prevAmount)} → ${won(c.amount)}`
              }
              note={`${REASON_LABEL[c.reason] ?? c.reason}${c.source === 'AI' ? ' · AI 제안 적용' : ''}${
                toDate(c.effectiveFrom) > new Date() ? ` · ${monthLabel(c.effectiveFrom.slice(0, 7))}부터` : ''
              }`}
            />
          ))}
        </section>
      )}

      <ListCard
        rows={[
          {
            label: '지난 브리핑',
            value: latestBriefing
              ? `${monthLabel(latestBriefing.targetMonth)}까지 ${briefings.totalCount}개`
              : undefined,
          },
          {
            label: '알림 설정',
            value:
              offSettings.length > 0
                ? `${offSettings.map((n: { label: string }) => n.label).join(', ')} 알림 꺼짐`
                : '모두 켜짐',
          },
          { label: '연결 계좌 · 공동 보호자' },
          { label: '개인정보 · 동의 관리' },
          { label: '고객센터 · 로그아웃', onClick: () => navigate('/') },
        ]}
      />
    </div>,
  )
}
