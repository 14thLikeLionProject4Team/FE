import { useNavigate, useParams } from 'react-router-dom'
import bellSmIcon from '../../assets/icons/bell-sm.svg'
import chevronDownSmIcon from '../../assets/icons/chevron-down-sm.svg'
import piggyIcon from '../../assets/icons/piggy.svg'
import plantIcon from '../../assets/icons/plant.svg'
import proposeIcon from '../../assets/icons/propose.svg'
import receiptDocIcon from '../../assets/icons/receipt-doc.svg'
import recycleMissionIcon from '../../assets/icons/recycle-mission.svg'
import reviewIcon from '../../assets/icons/review.svg'
import streakIcon from '../../assets/icons/streak.svg'
import receipt1 from '../../assets/photos/receipt-1.png'
import receipt2 from '../../assets/photos/receipt-2.png'
import { AppHeader } from '../../components/AppHeader/AppHeader'
import { BottomNav } from '../../components/BottomNav/BottomNav'
import type { NavTab } from '../../components/BottomNav/BottomNav'
import { PhoneShell } from '../../components/PhoneShell/PhoneShell'
import { useDemo } from '../../store/useDemo'
import type { Mission } from '../../store/demoContext'
import styles from './ChildMissions.module.css'

/** 미션 이름으로 아이콘을 고른다. 새로 제안한 미션은 유형 기본 아이콘. */
function iconFor(mission: Mission) {
  if (mission.name.includes('영수증')) return receiptDocIcon
  if (mission.name.includes('분리수거')) return recycleMissionIcon
  if (mission.name.includes('저축') || mission.name.includes('저금'))
    return piggyIcon
  return plantIcon
}

export function ChildMissions() {
  const navigate = useNavigate()
  const { accountId } = useParams()
  const { missions, submitProof } = useDemo()

  const pending = missions.filter((m) => m.status === 'pending')
  const proposed = missions.filter((m) => m.status === 'proposed')
  const active = missions.filter((m) => m.status === 'active')
  const activeTotal = active.reduce((sum, m) => sum + m.amount, 0)

  const handleNavigate = (tab: NavTab) => {
    navigate(tab === 'home' ? `/child/${accountId}` : `/child/${accountId}/${tab}`)
  }

  return (
    <PhoneShell
      header={<AppHeader role="자녀" subtitle="하늘의 지갑" />}
      footer={<BottomNav active="mission" onNavigate={handleNavigate} />}
    >
      <div className={styles.content}>
        <div className={styles.actionBar}>
          <div className={styles.actionLeft}>
            <h1 className={styles.pageTitle}>미션</h1>
            <button type="button" className={styles.childPicker}>
              하늘
              <img src={chevronDownSmIcon} width="8" height="4.933" alt="" />
            </button>
          </div>
          <button
            type="button"
            className={styles.proposeButton}
            onClick={() => navigate(`/child/${accountId}/mission/propose`)}
          >
            <img src={proposeIcon} width="15" height="15" alt="" />
            미션 제안하기
          </button>
        </div>

        {/* 확인 기다리는 미션 */}
        {pending.length > 0 && (
          <section className={styles.section}>
            <div className={styles.sectionHead}>
              <div className={styles.sectionTitleGroup}>
                <h2 className={styles.sectionTitle}>확인 기다리는 미션</h2>
                <span className={styles.countBadge}>{pending.length}</span>
              </div>
              <span className={styles.sectionNote}>
                엄마·아빠가 검토 중이에요
              </span>
            </div>

            {pending.map((mission) => (
              <article key={mission.id} className={styles.card}>
                <div className={styles.cardTop}>
                  <div className={styles.cardMain}>
                    <div className={styles.cardIcon}>
                      <img
                        src={iconFor(mission)}
                        width="16.5"
                        height="18.333"
                        alt=""
                      />
                    </div>
                    <div>
                      <h3 className={styles.cardTitle}>{mission.name}</h3>
                      {mission.note && (
                        <p className={styles.cardDesc}>{mission.note}</p>
                      )}
                    </div>
                  </div>
                  <span className={styles.cardAmount}>
                    +{mission.amount.toLocaleString()}원
                  </span>
                </div>

                {mission.name.includes('영수증') && (
                  <div className={styles.photos}>
                    <div className={styles.photo}>
                      <img className={styles.photoImage} src={receipt1} alt="" />
                      <span className={styles.photoLabel}>영수증 1</span>
                    </div>
                    <div className={styles.photo}>
                      <img className={styles.photoImage} src={receipt2} alt="" />
                      <span className={styles.photoLabel}>영수증 2</span>
                    </div>
                  </div>
                )}

                <div className={styles.cardFoot}>
                  <span className={styles.waitChip}>
                    <span className={styles.waitDot} />
                    부모님 확인 대기중
                  </span>
                  <button
                    type="button"
                    className={styles.ghostButton}
                    onClick={() => submitProof(mission.id)}
                  >
                    <img src={bellSmIcon} width="10.667" height="13.333" alt="" />
                    다시 알림 보내기
                  </button>
                </div>
              </article>
            ))}
          </section>
        )}

        {/* 내가 제안한 미션 */}
        {proposed.length > 0 && (
          <section className={styles.section}>
            <div className={styles.sectionTitleGroup}>
              <h2 className={styles.sectionTitle}>내가 제안한 미션</h2>
              <span className={styles.countBadgeAlt}>{proposed.length}</span>
            </div>

            {proposed.map((mission) => (
              <article key={mission.id} className={styles.card}>
                <div className={styles.cardTop}>
                  <div className={styles.cardMain}>
                    <div className={styles.cardIcon}>
                      <img
                        src={iconFor(mission)}
                        width="16.5"
                        height="18.333"
                        alt=""
                      />
                    </div>
                    <div>
                      <h3 className={styles.cardTitle}>{mission.name}</h3>
                      <span className={styles.statusChip}>제안 완료</span>
                      {mission.note && (
                        <p className={styles.cardDesc}>{mission.note}</p>
                      )}
                    </div>
                  </div>
                  <span className={styles.cardAmount}>
                    +{mission.amount.toLocaleString()}원
                  </span>
                </div>

                <div className={styles.infoBar}>
                  <span className={styles.infoBarLeft}>
                    <img src={reviewIcon} width="12" height="15" alt="" />
                    부모님 확인 중
                  </span>
                  <span className={styles.infoBarNote}>
                    승인 시 진행 탭으로 이동해요
                  </span>
                </div>
              </article>
            ))}
          </section>
        )}

        {/* 진행 중인 미션 */}
        {active.length > 0 && (
          <section className={styles.section}>
            <div className={styles.sectionHead}>
              <div className={styles.sectionTitleGroup}>
                <h2 className={styles.sectionTitle}>진행 중인 미션</h2>
                <span className={styles.countBadge}>{active.length}</span>
              </div>
              <span className={styles.sectionNoteAccent}>
                완료하면 +{activeTotal.toLocaleString()}원
              </span>
            </div>

            {active.map((mission) => (
              <article key={mission.id} className={styles.card}>
                <div className={styles.cardTop}>
                  <div className={styles.cardMain}>
                    <div className={styles.cardIcon}>
                      <img
                        src={iconFor(mission)}
                        width="19.275"
                        height="19.25"
                        alt=""
                      />
                    </div>
                    <div>
                      <h3 className={styles.cardTitle}>{mission.name}</h3>
                      <span
                        className={
                          mission.progress
                            ? styles.statusChipProgress
                            : styles.statusChip
                        }
                      >
                        {mission.progress ? `진행 ${mission.progress}%` : '도전 중'}
                      </span>
                      {mission.note && (
                        <p className={styles.cardDesc}>{mission.note}</p>
                      )}
                    </div>
                  </div>
                  <span className={styles.cardAmount}>
                    +{mission.amount.toLocaleString()}원
                  </span>
                </div>

                {mission.progress ? (
                  <>
                    <div className={styles.progressTrack}>
                      <div
                        className={styles.progressFill}
                        style={{ width: `${mission.progress}%` }}
                      />
                    </div>
                    <div className={styles.progressFoot}>
                      <span className={styles.progressNote}>
                        마지막 인증까지 앞으로 1회 남았어요!
                      </span>
                      <button
                        type="button"
                        className={styles.solidButton}
                        onClick={() => submitProof(mission.id)}
                      >
                        인증 등록
                      </button>
                    </div>
                  </>
                ) : (
                  <div className={styles.infoBar}>
                    <span className={styles.infoBarLeft}>
                      <img src={streakIcon} width="13.5" height="15" alt="" />
                      현재 14일차 연속 성공 중! 🔥
                    </span>
                    <span className={styles.infoBarAccent}>D-7</span>
                  </div>
                )}
              </article>
            ))}
          </section>
        )}
      </div>
    </PhoneShell>
  )
}
