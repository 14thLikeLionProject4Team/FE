import { useState } from 'react'
import type { ReactNode } from 'react'
import { getCertificateEligibility, getChildHome } from '../../api/child'
import { getAccounts, getRecordsSummary } from '../../api/common'
import { getSettlements } from '../../api/settlements'
import { optional, useApi } from '../../api/useApi'
import { AsyncState } from '../../components/AsyncState/AsyncState'
import { monthDayW, monthLabel, won, num, VISIBILITY_LABEL } from '../../utils/format'
import { useNavigate, useParams } from 'react-router-dom'
import bonusIcon from '../../assets/icons/bonus.svg'
import briefingIcon from '../../assets/icons/briefing.svg'
import calendarIcon from '../../assets/icons/calendar.svg'
import checkCircleIcon from '../../assets/icons/check-circle.svg'
import chevronDownIcon from '../../assets/icons/chevron-down.svg'
import chevronRightIcon from '../../assets/icons/chevron-right.svg'
import privacyShieldIcon from '../../assets/icons/privacy-shield.svg'
import reassureIcon from '../../assets/icons/reassure.svg'
import { AppHeader } from '../../components/AppHeader/AppHeader'
import { BottomNav } from '../../components/BottomNav/BottomNav'
import type { NavTab } from '../../components/BottomNav/BottomNav'
import { PhoneShell } from '../../components/PhoneShell/PhoneShell'
import styles from './ChildHomeRelaxed.module.css'

const RESULT_LABEL: Record<string, string> = {
  FULL_PAID: '결제일에 완납했어요',
  SHORTFALL: '부족분이 있었어요',
  SELF_RESOLVED: '부족분을 스스로 해결했어요',
}

/** 화면 — 여유 있는 자녀 홈 (가족 B · 만 19세) */
export function ChildHomeRelaxed() {
  const navigate = useNavigate()
  const { accountId } = useParams()
  const [briefingOpen, setBriefingOpen] = useState(false)

  const { data, loading, error, reload } = useApi(
    () =>
      Promise.all([
        getChildHome(),
        optional(getAccounts()),
        optional(getRecordsSummary()),
        optional(getCertificateEligibility()),
        optional(getSettlements({ size: 1 })),
      ]).then(([home, accounts, records, eligibility, settlements]) => ({
        home,
        accounts,
        records,
        eligibility,
        settlements,
      })),
    [accountId],
  )

  const handleNavigate = (tab: NavTab) => {
    if (tab === 'home') return
    navigate(`/child/${accountId}/${tab}`)
  }

  const name: string = data?.home?.member?.name ?? ''
  const shell = (children: ReactNode) => (
    <PhoneShell
      header={<AppHeader role="자녀" subtitle={name ? `${name}의 지갑` : ''} />}
      footer={<BottomNav active="home" onNavigate={handleNavigate} />}
    >
      {children}
    </PhoneShell>
  )

  if (loading || error || !data)
    return shell(<AsyncState loading={loading} error={error} onRetry={reload} />)

  const { home, accounts, records, eligibility, settlements } = data
  const st = home.settlement
  const myAccount = accounts?.items?.find((a: { ownerRole: string }) => a.ownerRole === 'CHILD')
  const balance: number = st ? st.availableAmount : (myAccount?.balance ?? 0)
  const spent: number = st?.billedAmount ?? 0
  const surplus = balance - spent
  const usedRate = balance > 0 ? Math.min(100, Math.round((spent / balance) * 100)) : 0
  const last = settlements?.items?.[0]
  const visibility = VISIBILITY_LABEL[home.chips?.visibility] ?? '총액만'
  const streak: number = home.chips?.streakMonths ?? records?.maxStreak ?? 0

  return shell(
    <div className={styles.content}>
      <div className={styles.dateBar}>
        <div className={styles.dateGroup}>
          <span className={styles.date}>{monthDayW(home.today)}</span>
          <span className={styles.dateDot} />
        </div>
        <span className={styles.privacyBadge}>
          <img src={privacyShieldIcon} width="9.333" height="11.667" alt="" />
          엄마·아빠는 {visibility} 봐요
        </span>
      </div>

      {/* 정산 카드 — 여유 상태 */}
      <section className={styles.settlement}>
        <div className={styles.settlementRow}>
          <span className={styles.caption}>이번 정산 기간</span>
          {st && (
            <span className={styles.dueChip}>
              <img src={calendarIcon} width="10.5" height="11.667" alt="" />
              {monthDayW(st.dueAt)} 결제일 · D-{st.dDay}
            </span>
          )}
        </div>

        <div className={styles.hero}>
          <div className={styles.amountRow}>
            <span className={styles.amount}>{num(spent)}</span>
            <span className={styles.amountUnit}>원</span>
            <span className={styles.amountNote}>{st ? '사용 중' : '이번 기간 결제 없음'}</span>
          </div>

          <div className={styles.compare}>
            <span className={styles.compareLeft}>
              <span className={styles.compareDot} />
              <span>
                내 계좌 잔액 <strong>{won(balance)}</strong> 대비{' '}
                {surplus >= 0 ? '충분함' : '부족함'}
              </span>
            </span>
            <span className={styles.surplus}>
              {surplus >= 0 ? `+${won(surplus)} 여유` : `${won(-surplus)} 부족`}
            </span>
          </div>
        </div>

        <div className={styles.gauge}>
          <div className={styles.gaugeTrack}>
            <div className={styles.gaugeFill} style={{ width: `${usedRate}%` }} />
          </div>
          <div className={styles.gaugeLegend}>
            <span>현재 사용 {usedRate}%</span>
            <span>한도 내 안전선</span>
          </div>
        </div>

        <div className={styles.reassure}>
          <span className={styles.reassureLeft}>
            <img src={reassureIcon} width="13.333" height="13.333" alt="" />
            결과는 결제일에 알려드려요
          </span>
          <span>안심 보호 중</span>
        </div>
      </section>

      {/* 점검할 것 없음 */}
      {!home.shortfallCheckShow && (
        <section className={styles.statusCard}>
          <div className={styles.statusIcon}>
            <img src={checkCircleIcon} width="21.667" height="21.667" alt="" />
          </div>
          <div>
            <h2 className={styles.statusTitle}>지금 점검할 건 없어요</h2>
            <p className={styles.statusDesc}>
              용돈 잔액이 넉넉해서 결제일까지 안심해도 돼요. 계획대로 멋지게
              생활하고 있어요!
            </p>
          </div>
        </section>
      )}

      {/* 지난달 정산 기록 */}
      {last && (
        <section className={styles.briefing}>
          <div className={styles.briefingLeft}>
            <div className={styles.briefingIcon}>
              <img src={briefingIcon} width="15" height="16.667" alt="" />
            </div>
            <div>
              <h2 className={styles.briefingTitle}>{monthLabel(last.periodEnd.slice(0, 7))} 브리핑</h2>
              <p className={styles.briefingDesc}>
                {won(last.billedAmount)} 사용 · {RESULT_LABEL[last.result] ?? '정산 완료'}
              </p>
            </div>
          </div>
          <button
            type="button"
            className={styles.briefingToggle}
            aria-label={briefingOpen ? '브리핑 접기' : '브리핑 열기'}
            aria-expanded={briefingOpen}
            onClick={() => setBriefingOpen((v) => !v)}
          >
            <img
              src={chevronDownIcon}
              width="10"
              height="6.167"
              alt=""
              style={{
                transform: briefingOpen ? 'rotate(180deg)' : undefined,
                transition: 'transform 0.15s ease',
              }}
            />
          </button>
        </section>
      )}

      {/* 신용 성장 기록 */}
      <section className={styles.growth}>
        <p className={styles.growthLabel}>내 신용 성장 기록</p>
        <div className={styles.growthChips}>
          <span className={styles.growthChip}>
            {streak}개월 연속 결제일 완납
            <span className={styles.growthDot} />
          </span>
          {eligibility && (
            <span className={styles.growthChip}>
              {eligibility.canIssue
                ? '확인서 발급 가능'
                : `확인서 발급까지 D-${eligibility.birthdayDDay}`}
              <span className={styles.growthDot} />
            </span>
          )}
        </div>
      </section>

      {/* 보너스 팁 */}
      <section className={styles.bonus} onClick={() => navigate(`/child/${accountId}/mission`)}>
        <div className={styles.bonusLeft}>
          <div className={styles.bonusIcon}>
            <img src={bonusIcon} width="11.25" height="15" alt="" />
          </div>
          <div>
            <p className={styles.bonusTitle}>이번 주 보너스 팁</p>
            <p className={styles.bonusDesc}>
              잔액을 유지하면 다음 달 보너스 미션이 열려요
            </p>
          </div>
        </div>
        <img src={chevronRightIcon} width="6.167" height="10" alt="" />
      </section>
    </div>,
  )
}
