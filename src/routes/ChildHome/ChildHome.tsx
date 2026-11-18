import type { ReactNode } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { getMissions, getSavingTip } from '../../api/missions'
import { checkCurrentSettlement } from '../../api/settlements'
import { getChildHome } from '../../api/child'
import { optional, useApi } from '../../api/useApi'
import { findAccount } from '../../data/accounts'
import { AsyncState } from '../../components/AsyncState/AsyncState'
import { monthDay, num, timeLabel, weekday, won } from '../../utils/format'
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

const QUEST_ICON: Record<string, { src: string; w: string; h: string }> = {
  CHORE: { src: recycleIcon, w: '21.027', h: '21' },
  FINANCE: { src: receiptIcon, w: '18', h: '20' },
  HABIT: { src: targetIcon, w: '13.333', h: '16.667' },
}

type Mission = {
  missionId: number
  title: string
  missionType: string
  status: string
  rewardAmount: number
  progress?: { done: number; target: number; rate: number }
  description?: string
}

export function ChildHome() {
  const navigate = useNavigate()
  const { accountId } = useParams()

  const { data, loading, error, reload } = useApi(
    () =>
      Promise.all([
        getChildHome(),
        optional(checkCurrentSettlement()),
        optional(getMissions('active')),
        optional(getSavingTip()),
      ]).then(([home, check, missions, tip]) => ({ home, check, missions, tip })),
    [accountId],
  )

  const handleNavigate = (tab: NavTab) => {
    if (tab === 'home') return
    navigate(`/child/${accountId}/${tab}`)
  }

  const name: string = data?.home?.member?.name ?? ''
  const avatar = findAccount(accountId)?.avatar ?? skyAvatar

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

  const { home, check, missions, tip } = data
  const st = home.settlement
  const billed: number = st?.billedAmount ?? 0
  const available: number = st?.availableAmount ?? 0
  const shortfall: number = st?.shortfallAmount ?? 0
  const ratio = available > 0 ? Math.round((billed / available) * 100) : 0
  /** 게이지 — 한도를 넘으면 넘은 만큼 빨간 꼬리로 보여요 */
  const fill = billed > available ? available / billed : available > 0 ? billed / available : 0
  const over = billed > available ? 1 - fill : 0
  const questList: Mission[] = missions?.missions ?? []

  return shell(
    <div className={styles.content}>
      {/* 정산 디데이 · 잔액 허브 */}
      {st ? (
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
              <h2 className={styles.ddayTitle}>{monthDay(st.dueAt)} 결제일 정산</h2>
            </div>

            <div className={styles.ddayRight}>
              <span className={styles.ddayCount}>D-{st.dDay}</span>
              <p className={styles.ddayWhen}>
                {weekday(st.dueAt)}요일
                <br />
                {timeLabel(st.dueAt)}
              </p>
            </div>
          </div>

          <div className={styles.balances}>
            <div className={styles.balance}>
              <span className={styles.balanceLabel}>
                <img src={spentIcon} width="10.5" height="11.667" alt="" />
                이번 달 쓴 돈
              </span>
              <span className={styles.balanceValue}>{won(billed)}</span>
            </div>
            <div className={styles.balance}>
              <span className={styles.balanceLabel}>
                <img src={allowanceIcon} width="11.083" height="10.5" alt="" />
                이번 달 용돈
              </span>
              <span className={styles.balanceValueAccent}>{won(available)}</span>
            </div>
          </div>

          <div className={styles.gauge}>
            <div className={styles.gaugeTop}>
              <span className={styles.gaugeRatio}>용돈 한도 대비 {ratio}%</span>
              {shortfall > 0 && (
                <span className={styles.gaugeDeficit}>
                  <img src={deficitIcon} width="12.833" height="11.083" alt="" />
                  {won(shortfall)} 부족 예상
                </span>
              )}
            </div>

            <div className={styles.gaugeTrack}>
              <div className={styles.gaugeFill} style={{ width: `${fill * 100}%` }} />
              {over > 0 && (
                <div className={styles.gaugeOver} style={{ width: `${over * 100}%` }} />
              )}
            </div>

            <p className={styles.gaugeNote}>
              {weekday(st.dueAt)}요일 {timeLabel(st.dueAt)}에 정산돼요
            </p>
          </div>
        </section>
      ) : (
        <section className={styles.hub}>
          <p className={styles.caption}>진행 중인 정산 기간이 없어요</p>
        </section>
      )}

      {/* 결제일 전 점검 — 부족이 예상될 때만 */}
      {home.shortfallCheckShow && check?.visible && (
        <section className={styles.inspection}>
          <div className={styles.inspectionHead}>
            <img src={inspectionIcon} width="12.5" height="16.667" alt="" />
            <h2 className={styles.sectionTitle}>결제일 전 점검</h2>
            <span className={styles.warnChip}>주의 필요</span>
          </div>

          <div className={styles.inspectionBody}>
            <p className={styles.inspectionLead}>
              지금 속도면 결제일에 <strong>{won(check.shortfallAmount)}</strong>이 모자랄 것
              같아요.
            </p>

            <p className={styles.inspectionNote}>
              <img src={infoIcon} width="15" height="15" alt="" />
              <span>
                {(check.guides as string[] | undefined)?.[0] ??
                  '모자라면 결제일 뒤 7일 안에 내 돈으로 보내면 돼요.'}{' '}
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
              남은 {check.dDay}일 아껴 쓰기
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
      )}

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

        {shortfall > 0 && (
          <div className={styles.callout}>
            <div className={styles.calloutIcon}>
              <img src={targetIcon} width="13.333" height="16.667" alt="" />
            </div>
            <div>
              <p className={styles.calloutTitle}>부족한 {won(shortfall)} 해결 팁</p>
              <p className={styles.calloutDesc}>
                {tip?.text ?? '미션으로 즉시 보충 가능해요!'}
              </p>
            </div>
          </div>
        )}

        <div className={styles.questList}>
          {questList.length === 0 && (
            <p className={styles.questDesc}>진행 중인 미션이 없어요</p>
          )}
          {questList.map((m) => {
            const icon = QUEST_ICON[m.missionType] ?? QUEST_ICON.CHORE
            const reviewing = m.status === 'SUBMITTED'
            return (
              <article
                key={m.missionId}
                className={styles.quest}
                onClick={() => navigate(`/child/${accountId}/mission`)}
              >
                <div className={styles.questMain}>
                  <div className={styles.questIcon}>
                    <img src={icon.src} width={icon.w} height={icon.h} alt="" />
                  </div>
                  <div className={styles.questInfo}>
                    <h3 className={styles.questTitle}>{m.title}</h3>
                    {reviewing ? (
                      <span className={styles.questStatusReview}>확인 기다려요</span>
                    ) : (
                      <span className={styles.questStatus}>
                        {m.status === 'NEW' ? '새 미션' : `${m.progress?.rate ?? 0}% 진행중`}
                      </span>
                    )}
                    <p className={styles.questDesc}>{m.description}</p>
                  </div>
                </div>
                <div className={styles.questReward}>
                  <span className={styles.questAmount}>+{won(m.rewardAmount)}</span>
                  {reviewing ? (
                    <span className={styles.questMetaReview}>검토중</span>
                  ) : (
                    <span className={styles.questMeta}>
                      {m.progress ? `${m.progress.done} / ${m.progress.target}회` : ''}
                    </span>
                  )}
                </div>
              </article>
            )
          })}
        </div>
      </section>

      {/* 주간 응원 */}
      <section className={styles.encourage}>
        <img className={styles.encourageAvatar} src={avatar} alt="" />
        <div>
          <p className={styles.encourageLabel}>{name}의 완납 챌린지</p>
          <p className={styles.encourageQuote}>
            "이번 달도 무사히 완납하면 연속 {num((home.chips?.streakMonths ?? 0) + 1)}개월 달성
            배지가 열려요!"
          </p>
        </div>
      </section>
    </div>,
  )
}
