import { useNavigate, useParams } from 'react-router-dom'
import emptyCheckIcon from '../../assets/icons/empty-check.svg'
import { BottomNav } from '../../components/BottomNav/BottomNav'
import type { NavTab } from '../../components/BottomNav/BottomNav'
import { ParentHeader } from '../../components/ParentHeader/ParentHeader'
import { PhoneShell } from '../../components/PhoneShell/PhoneShell'
import { useDemo } from '../../store/useDemo'
import styles from './ParentHome.module.css'

/** 부모는 대화 탭 없이 3탭 */
const PARENT_TABS: NavTab[] = ['home', 'mission', 'my']

export function ParentHome() {
  const navigate = useNavigate()
  const { accountId } = useParams()
  const { decisions, resolveDecision } = useDemo()

  const handleNavigate = (tab: NavTab) => {
    if (tab === 'home') return
    navigate(`/parent/${accountId}/${tab}`)
  }

  const has = (id: 'allowance' | 'message' | 'proof') => decisions.includes(id)

  return (
    <PhoneShell
      header={
        <ParentHeader
          childName="하늘"
          date="10월 1일 (목)"
          privacyNote="총액만 보는 중 · 하늘이에게도 이렇게 보여요"
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
        {/* 정산 기간 요약 */}
        <section className={styles.summary}>
          <div className={styles.summaryTop}>
            <span className={styles.summaryLabel}>이번 정산 기간</span>
            <span className={styles.dueChip}>10월 25일 (일) 결제일 · D-24</span>
          </div>

          <div className={styles.amountCard}>
            <span className={styles.amountLabel}>사용 총액</span>
            <span className={styles.amount}>12,600원</span>
            <span className={styles.transfer}>
              <span className={styles.transferDot} />
              10월 용돈 70,000원 보냄 (자동이체)
            </span>
          </div>

          <p className={styles.summaryNote}>결과는 결제일에 알려드려요</p>
        </section>

        {/* 결정할 것 — 처리한 카드는 목록에서 빠진다 */}
        <section className={styles.decisions}>
          <div className={styles.sectionHead}>
            <h2 className={styles.sectionTitle}>결정할 것</h2>
            {decisions.length > 0 && (
              <span className={styles.countBubble}>{decisions.length}</span>
            )}
          </div>

          {decisions.length === 0 ? (
            <div className={styles.empty}>
              <div className={styles.emptyIcon}>
                <img src={emptyCheckIcon} width="24" height="24" alt="" />
              </div>
              <h3 className={styles.emptyTitle}>지금 정할 건 없어요</h3>
              <p className={styles.emptyDesc}>새로 생기면 여기에 떠요</p>
            </div>
          ) : (
            <div className={styles.decisionList}>
              {/* AI 용돈 제안 */}
              {has('allowance') && (
                <article className={styles.cardAi}>
                  <div className={styles.cardHead}>
                    <span className={styles.tag}>AI 용돈 제안</span>
                    <span className={styles.cardMeta}>분기 첫 용돈일</span>
                  </div>
                  <h3 className={styles.cardTitle}>
                    하늘이 결제 품목 물가가 <em>4.2%</em> 올랐어요
                  </h3>
                  <p className={styles.cardDesc}>
                    월 70,000원 → 73,000원 (+3,000원)을 제안해요.
                  </p>
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
                      onClick={() =>
                        resolveDecision(
                          'allowance',
                          '11월부터 73,000원으로 적용했어요',
                        )
                      }
                    >
                      다음 달부터 적용
                    </button>
                    <button
                      type="button"
                      className={styles.secondaryButton}
                      onClick={() =>
                        resolveDecision('allowance', '용돈을 그대로 유지해요')
                      }
                    >
                      유지
                    </button>
                  </div>
                </article>
              )}

              {/* 자녀가 전하는 말 */}
              {has('message') && (
                <article className={styles.card}>
                  <div className={styles.cardHead}>
                    <span className={styles.tagBlue}>하늘이가 전하는 말</span>
                    <span className={styles.cardMeta}>
                      9월 정산 회고에서 보냄
                    </span>
                  </div>
                  <p className={styles.quote}>
                    "다음 달에 친구 생일이 있어서 선물비가 좀 들 것 같아요."
                  </p>
                  <p className={styles.quoteNote}>미리 말해두고 싶대요.</p>
                  <div className={styles.actions}>
                    <button
                      type="button"
                      className={styles.primaryButton}
                      onClick={() =>
                        resolveDecision('message', '하늘이에게 답장을 보냈어요')
                      }
                    >
                      같이 이야기하기
                    </button>
                    <button
                      type="button"
                      className={styles.secondaryButton}
                      onClick={() =>
                        resolveDecision('message', '확인 표시를 남겼어요')
                      }
                    >
                      확인했어요
                    </button>
                  </div>
                </article>
              )}

              {/* 미션 완료 확인 */}
              {has('proof') && (
                <article className={styles.card}>
                  <div className={styles.cardHead}>
                    <span className={styles.tagGreen}>미션 완료 확인</span>
                    <span className={styles.cardMeta}>어제 제출</span>
                  </div>
                  <h3 className={styles.missionTitle}>
                    분리수거 한 달 맡기 · 9월분 인증
                  </h3>
                  <div className={styles.actions}>
                    <button
                      type="button"
                      className={styles.primaryButton}
                      onClick={() =>
                        resolveDecision('proof', '3,000원을 보냈어요')
                      }
                    >
                      확인하고 3,000원 보내기
                    </button>
                    <button
                      type="button"
                      className={styles.secondaryButton}
                      onClick={() =>
                        resolveDecision('proof', '다시 부탁했어요')
                      }
                    >
                      다시 부탁하기
                    </button>
                  </div>
                </article>
              )}
            </div>
          )}
        </section>

        {/* 9월 브리핑 */}
        <section className={styles.briefing}>
          <div className={styles.briefingHead}>
            <div className={styles.sectionHead}>
              <h2 className={styles.sectionTitle}>9월 브리핑</h2>
              <span className={styles.newChip}>새로 도착</span>
            </div>
            <button type="button" className={styles.briefingLink}>
              지난 브리핑 보기 &gt;
            </button>
          </div>

          <div className={styles.briefingRows}>
            <div className={styles.briefingRowFirst}>
              <span className={styles.rowLabel}>사용</span>
              <span className={styles.rowValue}>
                61,500원 · <em>결제일에 완납했어요</em>
              </span>
            </div>
            <div className={styles.briefingRow}>
              <span className={styles.rowLabel}>남긴 돈</span>
              <span className={styles.rowValue}>결제일에 8,500원 남겼어요</span>
            </div>
            <div className={styles.briefingRow}>
              <span className={styles.rowLabel}>달라진 점</span>
              <span className={styles.rowValue}>
                카페 지출이 지난달보다 늘었어요
              </span>
            </div>
            <div className={styles.briefingRow}>
              <span className={styles.rowLabel}>잘한 점</span>
              <span className={styles.rowValueAccent}>
                6개월 연속 결제일 완납
              </span>
            </div>
            <div className={styles.briefingRow}>
              <span className={styles.rowLabel}>같이 볼 점</span>
              <span className={styles.rowValue}>다음 달 친구 생일 선물비</span>
            </div>
          </div>
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
              확인서 발급까지 D-32
            </span>
          </div>
        </section>
      </div>
    </PhoneShell>
  )
}
