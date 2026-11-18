import { useState } from 'react'
import type { ReactNode } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { getLatestBriefing, updateChildMessage } from '../../api/common'
import { approveSubmission } from '../../api/missions'
import {
  getChildSpending,
  getDecisions,
  getParentHome,
  handleAllowanceSuggestion,
} from '../../api/parent'
import { errorMessage, optional, useApi } from '../../api/useApi'
import emptyCheckIcon from '../../assets/icons/empty-check.svg'
import { AsyncState } from '../../components/AsyncState/AsyncState'
import { BottomNav } from '../../components/BottomNav/BottomNav'
import type { NavTab } from '../../components/BottomNav/BottomNav'
import { ParentHeader } from '../../components/ParentHeader/ParentHeader'
import { PhoneShell } from '../../components/PhoneShell/PhoneShell'
import { useDemo } from '../../store/useDemo'
import { monthDayW, monthLabel, won } from '../../utils/format'
import styles from './ParentHome.module.css'

/** 부모는 대화 탭 없이 3탭 */
const PARENT_TABS: NavTab[] = ['home', 'mission', 'my']

type DecisionCard = {
  type: 'ALLOWANCE_SUGGESTION' | 'CHILD_MESSAGE' | 'MISSION_REVIEW'
  refId: number
  title: string
  body: string
  label: string
}

export function ParentHome() {
  const navigate = useNavigate()
  const { accountId } = useParams()
  const { showToast } = useDemo()
  const [busy, setBusy] = useState(false)

  const { data, loading, error, reload } = useApi(
    () =>
      Promise.all([
        getParentHome(),
        optional(getDecisions()),
        optional(getChildSpending()),
        optional(getLatestBriefing()),
      ]).then(([home, decisions, spending, briefing]) => ({
        home,
        decisions,
        spending,
        briefing,
      })),
    [accountId],
  )

  const handleNavigate = (tab: NavTab) => {
    if (tab === 'home') return
    navigate(`/parent/${accountId}/${tab}`)
  }

  /** 결정 카드 버튼 — API 를 부르고, 끝나면 목록을 다시 불러와요 */
  const resolve = async (action: () => Promise<unknown>, message: string) => {
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

  const { spending, briefing } = data
  const cards: DecisionCard[] = data.decisions?.cards ?? []
  const childName: string = home.childName

  return shell(
    <div className={styles.content}>
      {/* 정산 기간 요약 */}
      {spending && (
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
            {spending.allowance && (
              <span className={styles.transfer}>
                <span className={styles.transferDot} />
                {monthLabel(spending.allowance.month)} 용돈 {won(spending.allowance.amount)}{' '}
                {spending.allowance.sent ? '보냄' : '보낼 예정'}
                {spending.allowance.autoTransfer ? ' (자동이체)' : ''}
              </span>
            )}
          </div>

          <p className={styles.summaryNote}>{spending.notice}</p>
        </section>
      )}

      {/* 결정할 것 — 처리한 카드는 목록에서 빠진다 */}
      <section className={styles.decisions}>
        <div className={styles.sectionHead}>
          <h2 className={styles.sectionTitle}>결정할 것</h2>
          {cards.length > 0 && <span className={styles.countBubble}>{cards.length}</span>}
        </div>

        {cards.length === 0 ? (
          <div className={styles.empty}>
            <div className={styles.emptyIcon}>
              <img src={emptyCheckIcon} width="24" height="24" alt="" />
            </div>
            <h3 className={styles.emptyTitle}>지금 정할 건 없어요</h3>
            <p className={styles.emptyDesc}>새로 생기면 여기에 떠요</p>
          </div>
        ) : (
          <div className={styles.decisionList}>
            {cards.map((card) => {
              if (card.type === 'ALLOWANCE_SUGGESTION')
                return (
                  <article key={`${card.type}-${card.refId}`} className={styles.cardAi}>
                    <div className={styles.cardHead}>
                      <span className={styles.tag}>{card.label}</span>
                      <span className={styles.cardMeta}>분기 첫 용돈일</span>
                    </div>
                    <h3 className={styles.cardTitle}>{card.title}</h3>
                    <p className={styles.cardDesc}>{card.body}</p>
                    <button
                      type="button"
                      className={styles.link}
                      onClick={() => navigate(`/parent/${accountId}/allowance`)}
                    >
                      근거 보기 &gt;
                    </button>
                    <div className={styles.actionsDivided}>
                      <button
                        type="button"
                        className={styles.primaryButton}
                        disabled={busy}
                        onClick={() =>
                          resolve(
                            () => handleAllowanceSuggestion(card.refId, { status: 'APPLIED' }),
                            '다음 달부터 적용했어요',
                          )
                        }
                      >
                        다음 달부터 적용
                      </button>
                      <button
                        type="button"
                        className={styles.secondaryButton}
                        disabled={busy}
                        onClick={() =>
                          resolve(
                            () => handleAllowanceSuggestion(card.refId, { status: 'KEPT' }),
                            '용돈을 그대로 유지해요',
                          )
                        }
                      >
                        유지
                      </button>
                    </div>
                  </article>
                )

              if (card.type === 'CHILD_MESSAGE')
                return (
                  <article key={`${card.type}-${card.refId}`} className={styles.card}>
                    <div className={styles.cardHead}>
                      <span className={styles.tagBlue}>{childName}가 전하는 말</span>
                      <span className={styles.cardMeta}>{card.label}</span>
                    </div>
                    <p className={styles.quote}>"{card.title}"</p>
                    <p className={styles.quoteNote}>{card.body}</p>
                    <div className={styles.actions}>
                      <button
                        type="button"
                        className={styles.primaryButton}
                        disabled={busy}
                        onClick={() =>
                          resolve(
                            () => updateChildMessage(card.refId, { status: 'DISCUSS' }),
                            `${childName}와 이야기하기로 했어요`,
                          )
                        }
                      >
                        같이 이야기하기
                      </button>
                      <button
                        type="button"
                        className={styles.secondaryButton}
                        disabled={busy}
                        onClick={() =>
                          resolve(
                            () => updateChildMessage(card.refId, { status: 'ACKNOWLEDGED' }),
                            '확인 표시를 남겼어요',
                          )
                        }
                      >
                        확인했어요
                      </button>
                    </div>
                  </article>
                )

              // MISSION_REVIEW — refId 는 제출(submission) ID
              const reward = card.body.replace('+', '')
              return (
                <article key={`${card.type}-${card.refId}`} className={styles.card}>
                  <div className={styles.cardHead}>
                    <span className={styles.tagGreen}>미션 완료 확인</span>
                    <span className={styles.cardMeta}>{card.label}</span>
                  </div>
                  <h3 className={styles.missionTitle}>{card.title}</h3>
                  <div className={styles.actions}>
                    <button
                      type="button"
                      className={styles.primaryButton}
                      disabled={busy}
                      onClick={() =>
                        resolve(() => approveSubmission(card.refId), `${reward}을 보냈어요`)
                      }
                    >
                      확인하고 {reward} 보내기
                    </button>
                  </div>
                </article>
              )
            })}
          </div>
        )}
      </section>

      {/* 지난달 브리핑 */}
      {briefing && (
        <section className={styles.briefing}>
          <div className={styles.briefingHead}>
            <div className={styles.sectionHead}>
              <h2 className={styles.sectionTitle}>{monthLabel(briefing.targetMonth)} 브리핑</h2>
              {briefing.isNew && <span className={styles.newChip}>새로 도착</span>}
            </div>
            <button type="button" className={styles.briefingLink}>
              지난 브리핑 보기 &gt;
            </button>
          </div>

          <div className={styles.briefingRows}>
            <div className={styles.briefingRowFirst}>
              <span className={styles.rowLabel}>사용</span>
              <span className={styles.rowValue}>{briefing.lines?.spent}</span>
            </div>
            <div className={styles.briefingRow}>
              <span className={styles.rowLabel}>남긴 돈</span>
              <span className={styles.rowValue}>{briefing.lines?.saved}</span>
            </div>
            <div className={styles.briefingRow}>
              <span className={styles.rowLabel}>달라진 점</span>
              <span className={styles.rowValue}>{briefing.lines?.changed}</span>
            </div>
            <div className={styles.briefingRow}>
              <span className={styles.rowLabel}>잘한 점</span>
              <span className={styles.rowValueAccent}>{briefing.lines?.good}</span>
            </div>
            <div className={styles.briefingRow}>
              <span className={styles.rowLabel}>같이 볼 점</span>
              <span className={styles.rowValue}>{briefing.lines?.together}</span>
            </div>
          </div>
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
