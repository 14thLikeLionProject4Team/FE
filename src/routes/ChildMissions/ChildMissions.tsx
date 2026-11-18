import { useRef, useState } from 'react'
import type { ChangeEvent, ReactNode } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { getChildHome } from '../../api/child'
import { toImageUrl } from '../../api/client'
import { getMissionDetail, getMissions, remindSubmission, submitMission } from '../../api/missions'
import { errorMessage, optional, useApi } from '../../api/useApi'
import bellSmIcon from '../../assets/icons/bell-sm.svg'
import chevronDownSmIcon from '../../assets/icons/chevron-down-sm.svg'
import piggyIcon from '../../assets/icons/piggy.svg'
import plantIcon from '../../assets/icons/plant.svg'
import proposeIcon from '../../assets/icons/propose.svg'
import receiptDocIcon from '../../assets/icons/receipt-doc.svg'
import recycleMissionIcon from '../../assets/icons/recycle-mission.svg'
import reviewIcon from '../../assets/icons/review.svg'
import streakIcon from '../../assets/icons/streak.svg'
import { AppHeader } from '../../components/AppHeader/AppHeader'
import { AsyncState } from '../../components/AsyncState/AsyncState'
import { BottomNav } from '../../components/BottomNav/BottomNav'
import type { NavTab } from '../../components/BottomNav/BottomNav'
import { PhoneShell } from '../../components/PhoneShell/PhoneShell'
import { useDemo } from '../../store/useDemo'
import { toDate, won } from '../../utils/format'
import styles from './ChildMissions.module.css'

/** 미션 유형으로 아이콘을 골라요 */
const TYPE_ICON: Record<string, string> = {
  CHORE: recycleMissionIcon,
  FINANCE: receiptDocIcon,
  HABIT: piggyIcon,
}
const iconFor = (type: string) => TYPE_ICON[type] ?? plantIcon

type ListMission = {
  missionId: number
  title: string
  missionType: string
  status: 'NEW' | 'IN_PROGRESS' | 'SUBMITTED' | 'PROPOSED'
  rewardAmount?: number
  desiredReward?: number
  progress?: { done: number; target: number; rate: number }
  description?: string
  criteria?: string
  endDate?: string
}

type Submission = { submissionId: number; reviewStatus: string; photoUrls: string[] }

export function ChildMissions() {
  const navigate = useNavigate()
  const { accountId } = useParams()
  const { showToast } = useDemo()
  const fileInput = useRef<HTMLInputElement>(null)
  const [uploadFor, setUploadFor] = useState<number | null>(null)
  const [busy, setBusy] = useState(false)

  const { data, loading, error, reload } = useApi(async () => {
    const [home, active, proposed] = await Promise.all([
      optional(getChildHome()),
      getMissions('active'),
      getMissions('PROPOSED'),
    ])
    const list: ListMission[] = active?.missions ?? []
    // 확인 기다리는 미션은 상세를 불러서 제출 ID·사진을 가져와요
    const submitted = await Promise.all(
      list
        .filter((m) => m.status === 'SUBMITTED')
        .map((m) =>
          optional(getMissionDetail(m.missionId)).then((detail) => ({
            mission: m,
            submission: (detail?.submissions as Submission[] | undefined)?.find(
              (s) => s.reviewStatus === 'PENDING',
            ),
          })),
        ),
    )
    return {
      name: (home?.member?.name as string) ?? '',
      today: (home?.today as string) ?? new Date().toISOString().slice(0, 10),
      pending: submitted,
      proposed: (proposed?.missions ?? []) as ListMission[],
      active: list.filter((m) => m.status !== 'SUBMITTED'),
    }
  }, [accountId])

  const handleNavigate = (tab: NavTab) => {
    navigate(tab === 'home' ? `/child/${accountId}` : `/child/${accountId}/${tab}`)
  }

  const run = async (action: () => Promise<unknown>, message: string) => {
    if (busy) return
    setBusy(true)
    try {
      await action()
      showToast(message)
      await reload()
    } catch (e) {
      showToast(errorMessage(e))
    } finally {
      setBusy(false)
    }
  }

  /** "인증 등록" → 사진 고르기 → 업로드 */
  const pickPhotos = (missionId: number) => {
    setUploadFor(missionId)
    fileInput.current?.click()
  }

  const onFiles = (e: ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? [])
    e.target.value = ''
    if (!uploadFor || files.length === 0) return
    const form = new FormData()
    files.forEach((file) => form.append('photos', file))
    run(() => submitMission(uploadFor, form), '인증을 보냈어요')
  }

  const name = data?.name ?? ''
  const shell = (children: ReactNode) => (
    <PhoneShell
      header={<AppHeader role="자녀" subtitle={name ? `${name}의 지갑` : ''} />}
      footer={<BottomNav active="mission" onNavigate={handleNavigate} />}
    >
      {children}
    </PhoneShell>
  )

  if (loading || error || !data)
    return shell(<AsyncState loading={loading} error={error} onRetry={reload} />)

  const { pending, proposed, active, today } = data
  const activeTotal = active.reduce((sum, m) => sum + (m.rewardAmount ?? 0), 0)
  const dDay = (end?: string) =>
    end ? Math.max(0, Math.round((toDate(end).getTime() - toDate(today).getTime()) / 86400000)) : null

  return shell(
    <div className={styles.content}>
      <input
        ref={fileInput}
        type="file"
        accept="image/*"
        multiple
        hidden
        onChange={onFiles}
      />

      <div className={styles.actionBar}>
        <div className={styles.actionLeft}>
          <h1 className={styles.pageTitle}>미션</h1>
          <button type="button" className={styles.childPicker}>
            {name}
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

      {pending.length + proposed.length + active.length === 0 && (
        <p className={styles.cardDesc}>아직 미션이 없어요. 새 미션을 제안해 보세요!</p>
      )}

      {/* 확인 기다리는 미션 */}
      {pending.length > 0 && (
        <section className={styles.section}>
          <div className={styles.sectionHead}>
            <div className={styles.sectionTitleGroup}>
              <h2 className={styles.sectionTitle}>확인 기다리는 미션</h2>
              <span className={styles.countBadge}>{pending.length}</span>
            </div>
            <span className={styles.sectionNote}>엄마·아빠가 검토 중이에요</span>
          </div>

          {pending.map(({ mission, submission }) => (
            <article key={mission.missionId} className={styles.card}>
              <div className={styles.cardTop}>
                <div className={styles.cardMain}>
                  <div className={styles.cardIcon}>
                    <img src={iconFor(mission.missionType)} width="16.5" height="18.333" alt="" />
                  </div>
                  <div>
                    <h3 className={styles.cardTitle}>{mission.title}</h3>
                    {mission.description && (
                      <p className={styles.cardDesc}>{mission.description}</p>
                    )}
                  </div>
                </div>
                <span className={styles.cardAmount}>+{won(mission.rewardAmount)}</span>
              </div>

              {submission && submission.photoUrls.length > 0 && (
                <div className={styles.photos}>
                  {submission.photoUrls.map((url, i) => (
                    <div key={url} className={styles.photo}>
                      <img className={styles.photoImage} src={toImageUrl(url)} alt="" />
                      <span className={styles.photoLabel}>사진 {i + 1}</span>
                    </div>
                  ))}
                </div>
              )}

              <div className={styles.cardFoot}>
                <span className={styles.waitChip}>
                  <span className={styles.waitDot} />
                  부모님 확인 대기중
                </span>
                {submission && (
                  <button
                    type="button"
                    className={styles.ghostButton}
                    disabled={busy}
                    onClick={() =>
                      run(() => remindSubmission(submission.submissionId), '부모님께 다시 알렸어요')
                    }
                  >
                    <img src={bellSmIcon} width="10.667" height="13.333" alt="" />
                    다시 알림 보내기
                  </button>
                )}
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
            <article key={mission.missionId} className={styles.card}>
              <div className={styles.cardTop}>
                <div className={styles.cardMain}>
                  <div className={styles.cardIcon}>
                    <img src={iconFor(mission.missionType)} width="16.5" height="18.333" alt="" />
                  </div>
                  <div>
                    <h3 className={styles.cardTitle}>{mission.title}</h3>
                    <span className={styles.statusChip}>제안 완료</span>
                    <p className={styles.cardDesc}>
                      내가 바라는 보상 {won(mission.desiredReward)}
                    </p>
                  </div>
                </div>
                <span className={styles.cardAmount}>+{won(mission.desiredReward)}</span>
              </div>

              <div className={styles.infoBar}>
                <span className={styles.infoBarLeft}>
                  <img src={reviewIcon} width="12" height="15" alt="" />
                  부모님 확인 중
                </span>
                <span className={styles.infoBarNote}>승인 시 진행 탭으로 이동해요</span>
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
            <span className={styles.sectionNoteAccent}>완료하면 +{won(activeTotal)}</span>
          </div>

          {active.map((mission) => {
            const p = mission.progress
            const started = Boolean(p && p.done > 0)
            const left = p ? p.target - p.done : 0
            const d = dDay(mission.endDate)
            return (
              <article key={mission.missionId} className={styles.card}>
                <div className={styles.cardTop}>
                  <div className={styles.cardMain}>
                    <div className={styles.cardIcon}>
                      <img src={iconFor(mission.missionType)} width="19.275" height="19.25" alt="" />
                    </div>
                    <div>
                      <h3 className={styles.cardTitle}>{mission.title}</h3>
                      <span className={started ? styles.statusChipProgress : styles.statusChip}>
                        {started ? `진행 ${p?.rate}%` : mission.status === 'NEW' ? '새 미션' : '도전 중'}
                      </span>
                      {mission.description && (
                        <p className={styles.cardDesc}>{mission.description}</p>
                      )}
                    </div>
                  </div>
                  <span className={styles.cardAmount}>+{won(mission.rewardAmount)}</span>
                </div>

                {started ? (
                  <div className={styles.progressTrack}>
                    <div className={styles.progressFill} style={{ width: `${p?.rate}%` }} />
                  </div>
                ) : (
                  <div className={styles.infoBar}>
                    <span className={styles.infoBarLeft}>
                      <img src={streakIcon} width="13.5" height="15" alt="" />
                      {p ? `${p.target}번 인증하면 완료돼요` : '인증하면 완료돼요'}
                    </span>
                    {d !== null && <span className={styles.infoBarAccent}>D-{d}</span>}
                  </div>
                )}

                <div className={styles.progressFoot}>
                  <span className={styles.progressNote}>
                    {left > 0 ? `완료까지 앞으로 ${left}회 남았어요!` : '마지막 인증을 남겨 주세요!'}
                  </span>
                  <button
                    type="button"
                    className={styles.solidButton}
                    disabled={busy}
                    onClick={() => pickPhotos(mission.missionId)}
                  >
                    인증 등록
                  </button>
                </div>
              </article>
            )
          })}
        </section>
      )}
    </div>,
  )
}
