import { useState } from 'react'
import type { ReactNode } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { toImageUrl } from '../../api/client'
import {
  approveSubmission,
  getMissions,
  getRecommendations,
  getRewardsSummary,
  getSubmissions,
  holdMission,
} from '../../api/missions'
import { getParentHome } from '../../api/parent'
import { errorMessage, optional, useApi } from '../../api/useApi'
import cartIcon from '../../assets/icons/cart.svg'
import chevronDown12 from '../../assets/icons/chevron-down-12.svg'
import dishIcon from '../../assets/icons/dish.svg'
import photoPlaceholderIcon from '../../assets/icons/photo-placeholder.svg'
import recycleParentIcon from '../../assets/icons/recycle-parent.svg'
import reviewWeekIcon from '../../assets/icons/review-week.svg'
import { AsyncState } from '../../components/AsyncState/AsyncState'
import { BottomNav } from '../../components/BottomNav/BottomNav'
import type { NavTab } from '../../components/BottomNav/BottomNav'
import { PhoneShell } from '../../components/PhoneShell/PhoneShell'
import { useDemo } from '../../store/useDemo'
import { dateTime, MISSION_TYPE_LABEL, num, won } from '../../utils/format'
import styles from './ParentMissions.module.css'

const PARENT_TABS: NavTab[] = ['home', 'mission', 'my']

const TYPE_ICON: Record<string, string> = {
  CHORE: recycleParentIcon,
  FINANCE: cartIcon,
  HABIT: reviewWeekIcon,
}

type Mission = {
  missionId: number
  title: string
  missionType: string
  status: string
  rewardAmount?: number
  desiredReward?: number
  criteria?: string
  progress?: { done: number; target: number; rate: number }
  description?: string
}

type Submission = {
  submissionId: number
  missionId: number
  missionTitle: string
  rewardAmount: number
  photoUrls: string[]
  submittedAt: string
}

export function ParentMissions() {
  const navigate = useNavigate()
  const { accountId } = useParams()
  const { showToast } = useDemo()
  const [busy, setBusy] = useState(false)

  const { data, loading, error, reload } = useApi(
    () =>
      Promise.all([
        optional(getParentHome()),
        optional(getRewardsSummary()),
        optional(getSubmissions('PENDING')),
        optional(getMissions('PROPOSED')),
        optional(getMissions('active')),
        optional(getRecommendations('PARENT')),
      ]).then(([home, rewards, submissions, proposed, active, recos]) => ({
        childName: (home?.childName as string) ?? '',
        rewards,
        pending: (submissions?.submissions ?? []) as Submission[],
        proposed: (proposed?.missions ?? []) as Mission[],
        active: ((active?.missions ?? []) as Mission[]).filter((m) => m.status !== 'SUBMITTED'),
        recos: (recos?.recommendations ?? []) as Mission[],
      })),
    [accountId],
  )

  const handleNavigate = (tab: NavTab) => {
    navigate(tab === 'home' ? `/parent/${accountId}` : `/parent/${accountId}/${tab}`)
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

  /** 제안·추천 미션은 만들기 화면에서 내용을 채워서 열어요 */
  const openFrom = (missionId: number) =>
    navigate(`/parent/${accountId}/mission/create?from=${missionId}`)

  const childName = data?.childName ?? ''
  const shell = (children: ReactNode) => (
    <PhoneShell
      header={
        <div className={styles.topBar}>
          <h1 className={styles.pageTitle}>미션</h1>
          <div className={styles.topActions}>
            <button type="button" className={styles.childPicker}>
              {childName}
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
      footer={<BottomNav active="mission" tabs={PARENT_TABS} onNavigate={handleNavigate} />}
    >
      {children}
    </PhoneShell>
  )

  if (loading || error || !data)
    return shell(<AsyncState loading={loading} error={error} onRetry={reload} />)

  const { rewards, pending, proposed, active, recos } = data
  const paid: number = rewards?.paidAmount ?? 0
  const cap: number = rewards?.capAmount ?? 0

  return shell(
    <div className={styles.content}>
      {/* 이번 달 보상 */}
      {rewards && (
        <section className={styles.budget}>
          <div className={styles.budgetTop}>
            <span className={styles.budgetLabel}>이번 달 보낸 보상</span>
            <span className={styles.budgetValue}>
              {won(paid)}
              <em> / {won(cap)}</em>
            </span>
          </div>
          <div className={styles.budgetTrack}>
            <div
              className={styles.budgetFill}
              style={{ width: `${cap > 0 ? Math.min(100, (paid / cap) * 100) : 0}%` }}
            />
          </div>
          <p className={styles.budgetNote}>
            한 달 상한 {won(cap)} (용돈의 {rewards.capRate}%) · <em>설정에서 바꾸기</em>
          </p>
        </section>
      )}

      {/* 확인 기다리는 미션 */}
      {pending.length > 0 && (
        <section className={styles.section}>
          <div className={styles.sectionHead}>
            <div className={styles.sectionTitleGroup}>
              <h2 className={styles.sectionTitle}>확인 기다리는 미션</h2>
              <span className={styles.countBubbleGreen}>{pending.length}</span>
            </div>
          </div>

          {pending.map((s) => (
            <article key={s.submissionId} className={styles.cardBordered}>
              <div className={styles.cardTop}>
                <div>
                  <h3 className={styles.cardTitle}>{s.missionTitle}</h3>
                  <p className={styles.cardMeta}>
                    {dateTime(s.submittedAt)} 제출
                    {s.photoUrls.length > 0 ? ` · 사진 ${s.photoUrls.length}장` : ''}
                  </p>
                </div>
                <span className={styles.cardAmount}>+{won(s.rewardAmount)}</span>
              </div>

              <div className={styles.proofs}>
                {s.photoUrls.length > 0 ? (
                  s.photoUrls.map((url) => (
                    <div key={url} className={styles.proof}>
                      <img
                        src={toImageUrl(url)}
                        alt=""
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      />
                    </div>
                  ))
                ) : (
                  <div className={styles.proof}>
                    <img src={photoPlaceholderIcon} width="24" height="24" alt="" />
                  </div>
                )}
              </div>

              <div className={styles.actions}>
                <button
                  type="button"
                  className={styles.primaryButton}
                  disabled={busy}
                  onClick={() =>
                    run(() => approveSubmission(s.submissionId), `${won(s.rewardAmount)}을 보냈어요`)
                  }
                >
                  확인하고 {won(s.rewardAmount)} 보내기
                </button>
              </div>
            </article>
          ))}
        </section>
      )}

      {/* 자녀가 제안한 미션 */}
      {proposed.length > 0 && (
        <section className={styles.section}>
          <div className={styles.sectionHead}>
            <div className={styles.sectionTitleGroup}>
              <h2 className={styles.sectionTitle}>{childName}가 제안한 미션</h2>
              <span className={styles.countBubble}>{proposed.length}</span>
            </div>
          </div>

          {proposed.map((m) => (
            <article key={m.missionId} className={styles.card}>
              <h3 className={styles.cardTitle}>{m.title}</h3>
              <p className={styles.cardDesc}>
                {childName}가 바라는 보상 <em>{won(m.desiredReward)}</em>
              </p>
              <div className={styles.actionsSpaced}>
                <button
                  type="button"
                  className={styles.primaryButton}
                  disabled={busy}
                  onClick={() => openFrom(m.missionId)}
                >
                  금액 정해서 열기
                </button>
                <button
                  type="button"
                  className={styles.secondaryButton}
                  disabled={busy}
                  onClick={() => run(() => holdMission(m.missionId), '다음에 다시 볼게요')}
                >
                  다음에
                </button>
              </div>
            </article>
          ))}
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
          {active.length === 0 && <p className={styles.rowNote}>진행 중인 미션이 없어요</p>}
          {active.map((m) => {
            const isNew = m.status === 'NEW'
            return (
              <button key={m.missionId} type="button" className={styles.row}>
                <span className={styles.rowLeft}>
                  <span className={styles.rowIcon}>
                    <img
                      src={isNew ? dishIcon : (TYPE_ICON[m.missionType] ?? recycleParentIcon)}
                      width="20"
                      height="20"
                      alt=""
                    />
                  </span>
                  <span>
                    <span className={styles.rowTitle}>{m.title}</span>
                    <br />
                    {isNew ? (
                      <span className={styles.rowNoteGreen}>{m.description}</span>
                    ) : (
                      <span className={styles.rowNote}>
                        진행 중 {m.progress?.rate ?? 0}%<em> · {m.description}</em>
                      </span>
                    )}
                  </span>
                </span>
                <span className={styles.rowAmount}>+{won(m.rewardAmount)} &gt;</span>
              </button>
            )
          })}
        </div>
      </section>

      {/* 첫단추 추천 미션 */}
      {recos.length > 0 && (
        <section className={styles.section}>
          <div className={styles.sectionHead}>
            <h2 className={styles.sectionTitle}>첫단추 추천 미션</h2>
          </div>

          <div className={styles.rowList}>
            {recos.map((m) => (
              <div key={m.missionId} className={styles.row}>
                <span className={styles.rowLeft}>
                  <span className={styles.rowIconGray}>
                    <img src={TYPE_ICON[m.missionType] ?? cartIcon} width="20" height="20" alt="" />
                  </span>
                  <span>
                    <span className={styles.recoTitleRow}>
                      <span className={styles.rowTitle}>{m.title}</span>
                      <span
                        className={m.missionType === 'FINANCE' ? styles.typeTag : styles.typeTagGray}
                      >
                        {MISSION_TYPE_LABEL[m.missionType] ?? m.missionType}
                      </span>
                    </span>
                    <span className={styles.recoAmount}>+{num(m.rewardAmount)}원</span>
                  </span>
                </span>
                <button
                  type="button"
                  className={styles.openButton}
                  onClick={() => openFrom(m.missionId)}
                >
                  열기
                </button>
              </div>
            ))}
          </div>
        </section>
      )}

      <button type="button" className={styles.pastLink}>
        지난 미션 보기 &gt;
      </button>
    </div>,
  )
}
