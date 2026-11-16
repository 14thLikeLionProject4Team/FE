import { useNavigate, useParams } from 'react-router-dom'
import skyAvatar from '../../assets/avatars/sky.jpg'
import allowanceIcon from '../../assets/icons/allowance.svg'
import arrowRightIcon from '../../assets/icons/arrow-right.svg'
import deficitIcon from '../../assets/icons/deficit.svg'
import helpIcon from '../../assets/icons/help.svg'
import infoIcon from '../../assets/icons/info.svg'
import inspectionIcon from '../../assets/icons/inspection.svg'
import plusIcon from '../../assets/icons/plus.svg'
import receiptIcon from '../../assets/icons/receipt.svg'
import recycleIcon from '../../assets/icons/recycle.svg'
import spentIcon from '../../assets/icons/spent.svg'
import targetIcon from '../../assets/icons/target.svg'
import { AppHeader } from '../../components/AppHeader/AppHeader'
import { BottomNav } from '../../components/BottomNav/BottomNav'
import type { NavTab } from '../../components/BottomNav/BottomNav'
import { PhoneShell } from '../../components/PhoneShell/PhoneShell'
import styles from './ChildHome.module.css'

/** 게이지 — 용돈 한도 대비 109%라 초과분이 빨간 꼬리로 보인다 */
const GAUGE_FILL_RATIO = 277.84 / 304
const GAUGE_OVER_RATIO = 26.16 / 304

export function ChildHome() {
  const navigate = useNavigate()
  const { accountId } = useParams()

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
        {/* 정산 디데이 · 잔액 허브 */}
        <section className={styles.hub}>
          <div className={styles.hubTop}>
            <div>
              <div className={styles.ddayLabelRow}>
                <span className={styles.caption}>정산 디데이</span>
                <span className={styles.liveChip}>
                  <span className={styles.liveDot} />
                  실시간 연동중
                </span>
              </div>
              <h2 className={styles.ddayTitle}>10월 25일 결제일 정산</h2>
            </div>

            <div className={styles.ddayRight}>
              <span className={styles.ddayCount}>D-6</span>
              <p className={styles.ddayWhen}>
                토요일 오후
                <br />
                6시
              </p>
            </div>
          </div>

          <div className={styles.balances}>
            <div className={styles.balance}>
              <span className={styles.balanceLabel}>
                <img src={spentIcon} width="10.5" height="11.667" alt="" />
                이번 달 쓴 돈
              </span>
              <span className={styles.balanceValue}>79,500원</span>
            </div>
            <div className={styles.balance}>
              <span className={styles.balanceLabel}>
                <img src={allowanceIcon} width="11.083" height="10.5" alt="" />
                이번 달 용돈
              </span>
              <span className={styles.balanceValueAccent}>72,700원</span>
            </div>
          </div>

          <div className={styles.gauge}>
            <div className={styles.gaugeTop}>
              <span className={styles.gaugeRatio}>용돈 한도 대비 109%</span>
              <span className={styles.gaugeDeficit}>
                <img src={deficitIcon} width="12.833" height="11.083" alt="" />
                6,800원 부족 예상
              </span>
            </div>

            <div className={styles.gaugeTrack}>
              <div
                className={styles.gaugeFill}
                style={{ width: `${GAUGE_FILL_RATIO * 100}%` }}
              />
              <div
                className={styles.gaugeOver}
                style={{ width: `${GAUGE_OVER_RATIO * 100}%` }}
              />
            </div>

            <p className={styles.gaugeNote}>
              다음 주 토요일 오후 6시에 정산돼요
            </p>
          </div>
        </section>

        {/* 결제일 전 점검 */}
        <section className={styles.inspection}>
          <div className={styles.inspectionHead}>
            <img src={inspectionIcon} width="12.5" height="16.667" alt="" />
            <h2 className={styles.sectionTitle}>결제일 전 점검</h2>
            <span className={styles.warnChip}>주의 필요</span>
          </div>

          <div className={styles.inspectionBody}>
            <p className={styles.inspectionLead}>
              지금 속도면 결제일에 <strong>6,800원</strong>이 모자랄 것 같아요.
            </p>

            <p className={styles.inspectionNote}>
              <img src={infoIcon} width="15" height="15" alt="" />
              <span>
                모자라면 결제일 뒤 7일 안에 내 돈으로 보내면 돼요.{' '}
                <strong>벌칙은 없어요.</strong>
              </span>
            </p>
          </div>

          <div className={styles.actions}>
            <button
              type="button"
              className={styles.primaryButton}
              onClick={() => navigate(`/child/${accountId}/chat`)}
            >
              남은 6일 아껴 쓰기
              <img src={arrowRightIcon} width="12" height="12" alt="" />
            </button>
            <button
              type="button"
              className={styles.secondaryButton}
              onClick={() => navigate(`/child/${accountId}/chat`)}
            >
              <img src={helpIcon} width="13.333" height="13.333" alt="" />
              부족하면 보내는 법
            </button>
          </div>
        </section>

        {/* 미션으로 용돈 채우기 */}
        <section className={styles.missions}>
          <div className={styles.missionsHead}>
            <div className={styles.missionsTitle}>
              <h2 className={styles.sectionTitle}>미션으로 용돈 채우기</h2>
              <span className={styles.sectionTitle}>🎯</span>
            </div>
            <button
              type="button"
              className={styles.newMission}
              onClick={() => navigate(`/child/${accountId}/mission/propose`)}
            >
              <img src={plusIcon} width="9.333" height="9.333" alt="" />새 미션
            </button>
          </div>

          <div className={styles.callout}>
            <div className={styles.calloutIcon}>
              <img src={targetIcon} width="13.333" height="16.667" alt="" />
            </div>
            <div>
              <p className={styles.calloutTitle}>부족한 6,800원 해결 팁</p>
              <p className={styles.calloutDesc}>미션으로 즉시 보충 가능해요!</p>
            </div>
          </div>

          <div className={styles.questList}>
            <article className={styles.quest}>
              <div className={styles.questMain}>
                <div className={styles.questIcon}>
                  <img src={recycleIcon} width="21.027" height="21" alt="" />
                </div>
                <div className={styles.questInfo}>
                  <h3 className={styles.questTitle}>분리수거 한 달 맡기</h3>
                  <span className={styles.questStatus}>80% 진행중</span>
                  <p className={styles.questDesc}>남은 6일 중 4회 완수</p>
                </div>
              </div>
              <div className={styles.questReward}>
                <span className={styles.questAmount}>+3,000원</span>
                <span className={styles.questMeta}>자동 승인</span>
              </div>
            </article>

            <article className={styles.quest}>
              <div className={styles.questMain}>
                <div className={styles.questIcon}>
                  <img src={receiptIcon} width="18" height="20" alt="" />
                </div>
                <div className={styles.questInfo}>
                  <h3 className={styles.questTitle}>이번 주 영수증 정리</h3>
                  <span className={styles.questStatusReview}>
                    확인 기다려요
                  </span>
                  <p className={styles.questDesc}>부모님 인증 대기중</p>
                </div>
              </div>
              <div className={styles.questReward}>
                <span className={styles.questAmount}>+3,000원</span>
                <span className={styles.questMetaReview}>검토중</span>
              </div>
            </article>
          </div>
        </section>

        {/* 주간 응원 */}
        <section className={styles.encourage}>
          <img className={styles.encourageAvatar} src={skyAvatar} alt="" />
          <div>
            <p className={styles.encourageLabel}>하늘이의 완납 챌린지</p>
            <p className={styles.encourageQuote}>
              "이번 달도 무사히 완납하면 연속 14개월 달성 배지가 열려요!"
            </p>
          </div>
        </section>
      </div>
    </PhoneShell>
  )
}
