import { useState } from 'react'
import type { ReactNode } from 'react'
import { getLatestBriefing } from '../../api/common'
import { getAdultTransition, getChildSpending, getDecisions, getParentHome } from '../../api/parent'
import { optional, useApi } from '../../api/useApi'
import { AsyncState } from '../../components/AsyncState/AsyncState'
import { monthDay, monthDayW, monthLabel, won } from '../../utils/format'
import { useNavigate, useParams } from 'react-router-dom'
import emptyCheckIcon from '../../assets/icons/empty-check.svg'
import expandIcon from '../../assets/icons/expand.svg'
import { BottomNav } from '../../components/BottomNav/BottomNav'
import type { NavTab } from '../../components/BottomNav/BottomNav'
import { ParentHeader } from '../../components/ParentHeader/ParentHeader'
import { PhoneShell } from '../../components/PhoneShell/PhoneShell'
import styles from './ParentHomeRelaxed.module.css'

const PARENT_TABS: NavTab[] = ['home', 'mission', 'my']

/** 부모 홈 — 여유 상태 / 자녀가 만 19세가 되어 기록이 넘어간 경우 */
export function ParentHomeRelaxed() {
  const navigate = useNavigate()
  const { accountId } = useParams()
  const [briefingOpen, setBriefingOpen] = useState(false)

  const { data, loading, error, reload } = useApi(
    () =>
      Promise.all([
        getParentHome(),
        optional(getDecisions()),
        optional(getChildSpending()),
        optional(getLatestBriefing()),
        optional(getAdultTransition()),
      ]).then(([home, decisions, spending, briefing, transition]) => ({
        home,
        decisions,
        spending,
        briefing,
        transition,
      })),
    [accountId],
  )

  const handleNavigate = (tab: NavTab) => {
    if (tab === 'home') return
    navigate(`/parent/${accountId}/${tab}`)
  }

  const home = data?.home
  const shell = (children: ReactNode) => (
    <PhoneShell
      header={
        <ParentHeader
          childName={home?.childName ?? ''}
          date={home ? monthDayW(home.today) : ''}
          privacyNote={home?.visibilityNotice ?? ''}
        />
      }
      footer={<BottomNav active="home" tabs={PARENT_TABS} onNavigate={handleNavigate} />}
    >
      {children}
    </PhoneShell>
  )

  if (loading || error || !data)
    return shell(<AsyncState loading={loading} error={error} onRetry={reload} />)

  const { spending, briefing, transition } = data
  const cardCount: number = data.decisions?.count ?? 0
  const childName: string = home.childName

  return shell(
    <div className={styles.content}>
      {spending ? (
        <section className={styles.summary}>
          <div className={styles.summaryTop}>
            <span className={styles.summaryLabel}>이번 정산 기간</span>
            <span className={styles.dueChip}>
              {monthDayW(spending.dueDate)} 결제일 · D-{spending.dDay}
            </span>
          </div>

          <div className={styles.amountCard}>
            <span className={styles.amountLabel}>사용 총액</span>
            <span className={styles.amount}>{won(spending.totalSpent)}</span>
          </div>

          <p className={styles.summaryNote}>{spending.notice}</p>
        </section>
      ) : (
        transition?.transitioned && (
          <section className={styles.summary}>
            <div className={styles.summaryTop}>
              <span className={styles.summaryLabel}>기록이 {childName}에게 넘어갔어요</span>
              {transition.at && (
                <span className={styles.dueChip}>{monthDay(transition.at)} 만 19세</span>
              )}
            </div>

            <div className={styles.amountCard}>
              <span className={styles.amountLabel}>함께한 결제일 정산</span>
              <span className={styles.amount}>{transition.togetherCount ?? 0}회</span>
            </div>

            <p className={styles.summaryNote}>
              이제 {childName}의 결제 기록은 본인만 볼 수 있어요
            </p>
          </section>
        )
      )}

      {/* 결정할 것 */}
      {cardCount === 0 ? (
        <section className={styles.empty}>
          <div className={styles.emptyIcon}>
            <img src={emptyCheckIcon} width="24" height="24" alt="" />
          </div>
          <h2 className={styles.emptyTitle}>지금 정할 건 없어요</h2>
          <p className={styles.emptyDesc}>새로 생기면 여기에 떠요</p>
        </section>
      ) : (
        <section className={styles.empty}>
          <h2 className={styles.emptyTitle}>결정할 것 {cardCount}개</h2>
          <p className={styles.emptyDesc}>미션 탭에서 확인해 주세요</p>
        </section>
      )}

      {/* 접힌 브리핑 */}
      {briefing && (
        <section className={styles.briefing}>
          <div>
            <h2 className={styles.briefingTitle}>{monthLabel(briefing.targetMonth)} 브리핑</h2>
            <p className={styles.briefingDesc}>{briefing.lines?.spent}</p>
            {briefingOpen && (
              <p className={styles.briefingDesc}>
                {[briefing.lines?.saved, briefing.lines?.changed, briefing.lines?.good]
                  .filter(Boolean)
                  .join(' · ')}
              </p>
            )}
          </div>
          <button
            type="button"
            className={styles.expandButton}
            aria-expanded={briefingOpen}
            onClick={() => setBriefingOpen((v) => !v)}
          >
            {briefingOpen ? '접기' : '펼치기'}
            <img src={expandIcon} width="14" height="14" alt="" />
          </button>
        </section>
      )}

      {/* 진행 상황 */}
      {home.praiseChips?.length > 0 && (
        <section className={styles.progress}>
          <h2 className={styles.progressLabel}>진행 상황</h2>
          <div className={styles.progressChips}>
            {(home.praiseChips as string[]).map((chip) => (
              <span key={chip} className={styles.progressChip}>
                <span className={styles.progressDot}>●</span>
                {chip}
              </span>
            ))}
          </div>
        </section>
      )}
    </div>,
  )
}
