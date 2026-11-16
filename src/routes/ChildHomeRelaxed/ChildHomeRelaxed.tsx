import { useState } from 'react'
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

/** 58,900 / 70,000 ≈ 84% — 디자인의 실제 막대 비율 */
const GAUGE_RATIO = 255.66 / 304

export function ChildHomeRelaxed() {
  const navigate = useNavigate()
  const { accountId } = useParams()
  const [briefingOpen, setBriefingOpen] = useState(false)

  const handleNavigate = (tab: NavTab) => {
    if (tab === 'home') return
    navigate(`/child/${accountId}/${tab}`)
  }

  return (
    <PhoneShell
      header={<AppHeader role="자녀" subtitle="하늘의 지갑" />}
      footer={<BottomNav active="home" onNavigate={handleNavigate} />}
    >
      <div className={styles.content}>
        <div className={styles.dateBar}>
          <div className={styles.dateGroup}>
            <span className={styles.date}>10월 14일 (수)</span>
            <span className={styles.dateDot} />
          </div>
          <span className={styles.privacyBadge}>
            <img src={privacyShieldIcon} width="9.333" height="11.667" alt="" />
            엄마·아빠는 총액만 봐요
          </span>
        </div>

        {/* 정산 카드 — 여유 상태 */}
        <section className={styles.settlement}>
          <div className={styles.settlementRow}>
            <span className={styles.caption}>이번 정산 기간</span>
            <span className={styles.dueChip}>
              <img src={calendarIcon} width="10.5" height="11.667" alt="" />
              10월 25일 (일) 결제일 · D-11
            </span>
          </div>

          <div className={styles.hero}>
            <div className={styles.amountRow}>
              <span className={styles.amount}>58,900</span>
              <span className={styles.amountUnit}>원</span>
              <span className={styles.amountNote}>사용 중</span>
            </div>

            <div className={styles.compare}>
              <span className={styles.compareLeft}>
                <span className={styles.compareDot} />
                <span>
                  내 계좌 잔액 <strong>70,000원</strong> 대비 충분함
                </span>
              </span>
              <span className={styles.surplus}>+11,100원 여유</span>
            </div>
          </div>

          <div className={styles.gauge}>
            <div className={styles.gaugeTrack}>
              <div
                className={styles.gaugeFill}
                style={{ width: `${GAUGE_RATIO * 100}%` }}
              />
            </div>
            <div className={styles.gaugeLegend}>
              <span>현재 사용 84%</span>
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

        {/* 지난달 브리핑 */}
        <section className={styles.briefing}>
          <div className={styles.briefingLeft}>
            <div className={styles.briefingIcon}>
              <img src={briefingIcon} width="15" height="16.667" alt="" />
            </div>
            <div>
              <h2 className={styles.briefingTitle}>9월 브리핑</h2>
              <p className={styles.briefingDesc}>
                61,500원 사용 · 결제일에 완납했어요
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

        {/* 신용 성장 기록 */}
        <section className={styles.growth}>
          <p className={styles.growthLabel}>내 신용 성장 기록</p>
          <div className={styles.growthChips}>
            <span className={styles.growthChip}>
              6개월 연속 결제일 완납
              <span className={styles.growthDot} />
            </span>
            <span className={styles.growthChip}>
              확인서 발급까지 D-19
              <span className={styles.growthDot} />
            </span>
          </div>
        </section>

        {/* 보너스 팁 */}
        <section className={styles.bonus}>
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
      </div>
    </PhoneShell>
  )
}
