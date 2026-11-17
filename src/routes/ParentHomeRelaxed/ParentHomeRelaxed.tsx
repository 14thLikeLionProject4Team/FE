import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import emptyCheckIcon from '../../assets/icons/empty-check.svg'
import expandIcon from '../../assets/icons/expand.svg'
import { BottomNav } from '../../components/BottomNav/BottomNav'
import type { NavTab } from '../../components/BottomNav/BottomNav'
import { ParentHeader } from '../../components/ParentHeader/ParentHeader'
import { PhoneShell } from '../../components/PhoneShell/PhoneShell'
import styles from './ParentHomeRelaxed.module.css'

const PARENT_TABS: NavTab[] = ['home', 'mission', 'my']

export function ParentHomeRelaxed() {
  const navigate = useNavigate()
  const { accountId } = useParams()
  const [briefingOpen, setBriefingOpen] = useState(false)

  const handleNavigate = (tab: NavTab) => {
    if (tab === 'home') return
    navigate(`/parent/${accountId}/${tab}`)
  }

  return (
    <PhoneShell
      header={
        <ParentHeader
          childName="하늘"
          date="10월 14일 (수)"
          privacyNote="하늘이에게도 이렇게 보여요"
        />
      }
      footer={
        <BottomNav
          active="home"
          tabs={PARENT_TABS}
          onNavigate={handleNavigate}
        />
      }
    >
      <div className={styles.content}>
        <section className={styles.summary}>
          <div className={styles.summaryTop}>
            <span className={styles.summaryLabel}>이번 정산 기간</span>
            <span className={styles.dueChip}>10월 25일 (일) 결제일 · D-11</span>
          </div>

          <div className={styles.amountCard}>
            <span className={styles.amountLabel}>사용 총액</span>
            <span className={styles.amount}>58,900원</span>
          </div>

          <p className={styles.summaryNote}>결과는 결제일에 알려드려요</p>
        </section>

        {/* 결정할 것 없음 */}
        <section className={styles.empty}>
          <div className={styles.emptyIcon}>
            <img src={emptyCheckIcon} width="24" height="24" alt="" />
          </div>
          <h2 className={styles.emptyTitle}>지금 정할 건 없어요</h2>
          <p className={styles.emptyDesc}>새로 생기면 여기에 떠요</p>
        </section>

        {/* 접힌 브리핑 */}
        <section className={styles.briefing}>
          <div>
            <h2 className={styles.briefingTitle}>9월 브리핑</h2>
            <p className={styles.briefingDesc}>
              61,500원 사용 · <em>결제일에 완납했어요</em>
            </p>
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

        {/* 진행 상황 */}
        <section className={styles.progress}>
          <h2 className={styles.progressLabel}>진행 상황</h2>
          <div className={styles.progressChips}>
            <span className={styles.progressChip}>
              <span className={styles.progressDot}>●</span>
              6개월 연속 결제일 완납
            </span>
            <span className={styles.progressChip}>
              <span className={styles.progressDot}>●</span>
              확인서 발급까지 D-19
            </span>
          </div>
        </section>
      </div>
    </PhoneShell>
  )
}
