import { useEffect, useRef, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import arrowRightSmIcon from '../../assets/icons/arrow-right-sm.svg'
import briefingLeafIcon from '../../assets/icons/briefing-leaf.svg'
import chatAttachIcon from '../../assets/icons/chat-attach.svg'
import chatSendIcon from '../../assets/icons/chat-send.svg'
import quickReplyIcon from '../../assets/icons/quick-reply.svg'
import logoMark from '../../assets/logo-mark.png'
import { AppHeader } from '../../components/AppHeader/AppHeader'
import { BottomNav } from '../../components/BottomNav/BottomNav'
import type { NavTab } from '../../components/BottomNav/BottomNav'
import { PhoneShell } from '../../components/PhoneShell/PhoneShell'
import { useDemo } from '../../store/useDemo'
import styles from './ChildCoach.module.css'

const QUICK_REPLIES = [
  { label: '🎯 미션 해서 채울래요!', primary: true },
  { label: '엄마아빠한테 솔직히 말할게요', primary: false },
  { label: '절약 팁 알려줘', primary: false },
]

export function ChildCoach() {
  const navigate = useNavigate()
  const { accountId } = useParams()
  const { messages, sendMessage } = useDemo()
  const [draft, setDraft] = useState('')
  const bottomRef = useRef<HTMLDivElement>(null)

  // 새 메시지가 붙으면 아래로 따라 내려간다
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' })
  }, [messages])

  const handleNavigate = (tab: NavTab) => {
    navigate(tab === 'home' ? `/child/${accountId}` : `/child/${accountId}/${tab}`)
  }

  const handleSend = () => {
    if (!draft.trim()) return
    sendMessage(draft)
    setDraft('')
  }

  return (
    <PhoneShell
      header={<AppHeader role="자녀" subtitle="하늘의 지갑" />}
      footer={
        <>
          <div className={styles.inputDock}>
            <div className={styles.inputBar}>
              <button
                type="button"
                className={styles.attachButton}
                aria-label="첨부"
              >
                <img src={chatAttachIcon} width="16.667" height="16.667" alt="" />
              </button>
              <input
                className={styles.chatInput}
                placeholder="단추 코치에게 물어보세요..."
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleSend()
                }}
              />
              <button
                type="button"
                className={styles.sendButton}
                aria-label="보내기"
                onClick={handleSend}
              >
                <img src={chatSendIcon} width="13.458" height="11.333" alt="" />
              </button>
            </div>
          </div>
          <BottomNav active="chat" onNavigate={handleNavigate} />
        </>
      }
    >
      <div className={styles.content}>
        <div className={styles.dateDivider}>
          <span className={styles.datePill}>
            <span className={styles.datePillDot} />
            10월 20일 (화) · AI 금융 코치 단추
          </span>
        </div>

        {/* 코치 인사 */}
        <div className={styles.coachRow}>
          <div className={styles.avatar}>
            <img className={styles.avatarImage} src={logoMark} alt="" />
          </div>
          <div className={styles.bubbleGroup}>
            <span className={styles.sender}>단추 코치</span>
            <p className={styles.coachBubble}>
              하늘아 안녕! 👋 이번 달 결제일까지{' '}
              <span className={styles.accent}>5일</span> 남았어. 현재 사용액은{' '}
              <span className={styles.strong}>79,500</span>원이고 계좌 잔액은{' '}
              <span className={styles.strong}>72,700</span>원이야. 약{' '}
              <span className={styles.danger}>6,800</span>원이 모자랄 수 있는데,
              같이 계획을 세워볼까?
            </p>
            <span className={styles.time}>오후 3:12</span>
          </div>
        </div>

        {/* 자녀 답변 */}
        <div className={styles.childRow}>
          <div className={styles.childGroup}>
            <p className={styles.childBubble}>
              이번 주에 친구 생일 선물 사느라 돈을 좀 더 썼어요 ㅠㅠ 어떡하죠?
            </p>
            <span className={styles.timeRight}>오후 3:14</span>
          </div>
        </div>

        {/* 코치 해결책 */}
        <div className={styles.coachRow}>
          <div className={styles.avatar}>
            <img className={styles.avatarImage} src={logoMark} alt="" />
          </div>
          <div className={styles.bubbleGroup}>
            <span className={styles.sender}>단추 코치</span>

            <div className={styles.solutionBubble}>
              <p>
                걱정하지 마! 벌칙은 없고, 해결할 수 있는 방법이{' '}
                <span className={styles.accent}>2가지</span> 있어:
              </p>

              <div className={styles.solutionCard}>
                <div className={styles.solutionHead}>
                  <h3 className={styles.solutionTitle}>🎯 미션으로 채우기</h3>
                  <span className={styles.solutionBadge}>+6,800원 보충</span>
                </div>
                <p className={styles.solutionDesc}>
                  보너스 미션 2개를 완료하면 즉시 용돈을 보충해 잔액 부족을
                  해결할 수 있어!
                </p>
                <button
                  type="button"
                  className={styles.solutionButton}
                  onClick={() => navigate(`/child/${accountId}/mission`)}
                >
                  가능한 미션 보기
                  <img
                    src={arrowRightSmIcon}
                    width="10.667"
                    height="10.667"
                    alt=""
                  />
                </button>
              </div>

              <div className={styles.solutionCardAlt}>
                <h3 className={styles.solutionTitle}>
                  🗓️ 다음 주 용돈 앞당기기 / 절약하기
                </h3>
                <p className={styles.solutionDesc}>
                  하루 1,000원씩 편의점 간식을 조절하거나 남은 5일 동안 지출
                  목표를 맞춰볼 수 있어.
                </p>
              </div>

              <div className={styles.briefingCard}>
                <img src={briefingLeafIcon} width="12" height="17" alt="" />
                <div>
                  <p className={styles.briefingTitle}>💡 부모님 안심 브리핑</p>
                  <p className={styles.briefingBody}>
                    부모님께는 개별 결제 내역 대신 <strong>'스스로 해결 중'</strong>{' '}
                    상태의 긍정적인 성장 리포트로 전달돼요.
                  </p>
                </div>
              </div>
            </div>

            <span className={styles.time}>오후 3:15</span>
          </div>
        </div>

        {/* 주고받은 메시지 */}
        {messages.map((msg) =>
          msg.role === 'child' ? (
            <div key={msg.id} className={styles.childRow}>
              <div className={styles.childGroup}>
                <p className={styles.childBubble}>{msg.text}</p>
                <span className={styles.timeRight}>{msg.time}</span>
              </div>
            </div>
          ) : (
            <div key={msg.id} className={styles.coachRow}>
              <div className={styles.avatar}>
                <img className={styles.avatarImage} src={logoMark} alt="" />
              </div>
              <div className={styles.bubbleGroup}>
                <span className={styles.sender}>단추 코치</span>
                <p className={styles.coachBubble}>{msg.text}</p>
                <span className={styles.time}>{msg.time}</span>
              </div>
            </div>
          ),
        )}

        {/* 빠른 답변 */}
        <div className={styles.quickReplies}>
          <span className={styles.quickLabel}>
            <img src={quickReplyIcon} width="12.833" height="12.833" alt="" />
            빠른 답변 선택
          </span>
          <div className={styles.quickScroller}>
            {QUICK_REPLIES.map((reply) => (
              <button
                key={reply.label}
                type="button"
                className={
                  reply.primary ? styles.quickChipPrimary : styles.quickChip
                }
                onClick={() => sendMessage(reply.label)}
              >
                {reply.label}
              </button>
            ))}
          </div>
        </div>

        <div ref={bottomRef} />
      </div>
    </PhoneShell>
  )
}
