import { useNavigate, useParams } from 'react-router-dom'
import cartIcon from '../../assets/icons/cart.svg'
import chevronDown12 from '../../assets/icons/chevron-down-12.svg'
import dishIcon from '../../assets/icons/dish.svg'
import photoPlaceholderIcon from '../../assets/icons/photo-placeholder.svg'
import recycleParentIcon from '../../assets/icons/recycle-parent.svg'
import reviewWeekIcon from '../../assets/icons/review-week.svg'
import { BottomNav } from '../../components/BottomNav/BottomNav'
import type { NavTab } from '../../components/BottomNav/BottomNav'
import { PhoneShell } from '../../components/PhoneShell/PhoneShell'
import { useDemo } from '../../store/useDemo'
import styles from './ParentMissions.module.css'

const PARENT_TABS: NavTab[] = ['home', 'mission', 'my']

/** 한 달 미션 보상 상한 — 용돈의 30% */
const MISSION_CAP = 21000

export function ParentMissions() {
  const navigate = useNavigate()
  const { accountId } = useParams()
  const { missions, approveMission, rejectMission, openMission } = useDemo()

  const pending = missions.filter((m) => m.status === 'pending')
  const proposed = missions.filter((m) => m.status === 'proposed')
  const active = missions.filter((m) => m.status === 'active')
  const paidTotal = missions
    .filter((m) => m.status === 'done')
    .reduce((sum, m) => sum + m.amount, 3000)

  const handleNavigate = (tab: NavTab) => {
    navigate(
      tab === 'home' ? `/parent/${accountId}` : `/parent/${accountId}/${tab}`,
    )
  }

  return (
    <PhoneShell
      header={
        <div className={styles.topBar}>
          <h1 className={styles.pageTitle}>미션</h1>
          <div className={styles.topActions}>
            <button type="button" className={styles.childPicker}>
              하늘
              <img src={chevronDown12} width="12" height="12" alt="" />
            </button>
            <button
              type="button"
              className={styles.createButton}
              onClick={() => navigate(`/parent/${accountId}/mission/create`)}
            >
              + 미션 만들기
            </button>
          </div>
        </div>
      }
      footer={
        <BottomNav
          active="mission"
          tabs={PARENT_TABS}
          onNavigate={handleNavigate}
        />
      }
    >
      <div className={styles.content}>
        {/* 이번 달 보상 */}
        <section className={styles.budget}>
          <div className={styles.budgetTop}>
            <span className={styles.budgetLabel}>이번 달 보낸 보상</span>
            <span className={styles.budgetValue}>
              {paidTotal.toLocaleString()}원
              <em> / {MISSION_CAP.toLocaleString()}원</em>
            </span>
          </div>
          <div className={styles.budgetTrack}>
            <div
              className={styles.budgetFill}
              style={{
                width: `${Math.min(100, (paidTotal / MISSION_CAP) * 100)}%`,
              }}
            />
          </div>
          <p className={styles.budgetNote}>
            한 달 상한 21,000원 (용돈의 30%) · <em>설정에서 바꾸기</em>
          </p>
        </section>

        {/* 확인 기다리는 미션 */}
        {pending.length > 0 && (
        <section className={styles.section}>
          <div className={styles.sectionHead}>
            <div className={styles.sectionTitleGroup}>
              <h2 className={styles.sectionTitle}>확인 기다리는 미션</h2>
              <span className={styles.countBubbleGreen}>{pending.length}</span>
            </div>
          </div>

          <article className={styles.cardBordered}>
            <div className={styles.cardTop}>
              <div>
                <h3 className={styles.cardTitle}>{pending[0]?.name}</h3>
                <p className={styles.cardMeta}>어제 저녁 제출 · 사진 2장</p>
              </div>
              <span className={styles.cardAmount}>
                +{(pending[0]?.amount ?? 0).toLocaleString()}원
              </span>
            </div>

            <div className={styles.proofs}>
              <div className={styles.proof}>
                <img
                  src={photoPlaceholderIcon}
                  width="24"
                  height="24"
                  alt=""
                />
              </div>
              <div className={styles.proof}>
                <img
                  src={photoPlaceholderIcon}
                  width="24"
                  height="24"
                  alt=""
                />
              </div>
            </div>

            <div className={styles.actions}>
              <button
                type="button"
                className={styles.primaryButton}
                onClick={() => pending[0] && approveMission(pending[0].id)}
              >
                확인하고 {(pending[0]?.amount ?? 3000).toLocaleString()}원 보내기
              </button>
              <button
                type="button"
                className={styles.secondaryButton}
                onClick={() => pending[0] && rejectMission(pending[0].id)}
              >
                거절하기
              </button>
            </div>
          </article>
        </section>
        )}

        {/* 하늘이가 제안한 미션 */}
        {proposed.length > 0 && (
        <section className={styles.section}>
          <div className={styles.sectionHead}>
            <div className={styles.sectionTitleGroup}>
              <h2 className={styles.sectionTitle}>하늘이가 제안한 미션</h2>
              <span className={styles.countBubble}>{proposed.length}</span>
            </div>
          </div>

          <article className={styles.card}>
            <h3 className={styles.cardTitle}>{proposed[0]?.name}</h3>
            <p className={styles.cardDesc}>
              하늘이가 바라는 보상{' '}
              <em>{(proposed[0]?.amount ?? 0).toLocaleString()}원</em>
            </p>
            <div className={styles.actionsSpaced}>
              <button
                type="button"
                className={styles.primaryButton}
                onClick={() => {
                  const m = proposed[0]
                  if (!m) return
                  rejectMission(m.id)
                  openMission({
                    name: m.name,
                    type: m.type,
                    amount: m.amount,
                    note: m.criteria ?? m.note,
                  })
                }}
              >
                금액 정해서 열기
              </button>
              <button
                type="button"
                className={styles.secondaryButton}
                onClick={() => proposed[0] && rejectMission(proposed[0].id)}
              >
                다음에
              </button>
            </div>
          </article>
        </section>
        )}

        {/* 진행 중인 미션 */}
        <section className={styles.section}>
          <div className={styles.sectionHead}>
            <div className={styles.sectionTitleGroup}>
              <h2 className={styles.sectionTitle}>진행 중인 미션</h2>
              <span className={styles.countPlain}>{active.length}</span>
            </div>
          </div>

          <div className={styles.rowList}>
            <button type="button" className={styles.row}>
              <span className={styles.rowLeft}>
                <span className={styles.rowIcon}>
                  <img
                    src={recycleParentIcon}
                    width="21.027"
                    height="21"
                    alt=""
                  />
                </span>
                <span>
                  <span className={styles.rowTitle}>분리수거 한 달 맡기</span>
                  <br />
                  <span className={styles.rowNote}>
                    진행 중 80%<em> · 일요일 인증 예정</em>
                  </span>
                </span>
              </span>
              <span className={styles.rowAmount}>+3,000원 &gt;</span>
            </button>

            <button type="button" className={styles.row}>
              <span className={styles.rowLeft}>
                <span className={styles.rowIcon}>
                  <img src={dishIcon} width="20" height="20" alt="" />
                </span>
                <span>
                  <span className={styles.rowTitle}>설거지 일주일</span>
                  <br />
                  <span className={styles.rowNoteGreen}>
                    오늘 열었어요<em> · 10월 25일까지</em>
                  </span>
                </span>
              </span>
              <span className={styles.rowAmount}>+3,000원 &gt;</span>
            </button>
          </div>
        </section>

        {/* 첫단추 추천 미션 */}
        <section className={styles.section}>
          <div className={styles.sectionHead}>
            <h2 className={styles.sectionTitle}>첫단추 추천 미션</h2>
            <button type="button" className={styles.sectionLink}>
              더보기
            </button>
          </div>

          <div className={styles.rowList}>
            <div className={styles.row}>
              <span className={styles.rowLeft}>
                <span className={styles.rowIconGray}>
                  <img src={cartIcon} width="20" height="20" alt="" />
                </span>
                <span>
                  <span className={styles.recoTitleRow}>
                    <span className={styles.rowTitle}>가격 비교 장보기</span>
                    <span className={styles.typeTag}>금융 배우기</span>
                  </span>
                  <span className={styles.recoAmount}>+3,500원</span>
                </span>
              </span>
              <button type="button" className={styles.openButton}>
                열기
              </button>
            </div>

            <div className={styles.row}>
              <span className={styles.rowLeft}>
                <span className={styles.rowIconGray}>
                  <img src={reviewWeekIcon} width="20" height="20" alt="" />
                </span>
                <span>
                  <span className={styles.recoTitleRow}>
                    <span className={styles.rowTitle}>일주일 결제 돌아보기</span>
                    <span className={styles.typeTagGray}>습관 만들기</span>
                  </span>
                  <span className={styles.recoAmount}>+2,500원</span>
                </span>
              </span>
              <button type="button" className={styles.openButton}>
                열기
              </button>
            </div>
          </div>
        </section>

        <button type="button" className={styles.pastLink}>
          지난 미션 보기 &gt;
        </button>
      </div>
    </PhoneShell>
  )
}
