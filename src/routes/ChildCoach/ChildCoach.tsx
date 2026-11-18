import { useEffect, useRef, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { getChildHome } from '../../api/child'
import { getConversationStarter, getMessages, sendMessage } from '../../api/common'
import { getSavingTip } from '../../api/missions'
import { errorMessage, optional, useApi } from '../../api/useApi'
import arrowRightSmIcon from '../../assets/icons/arrow-right-sm.svg'
import briefingLeafIcon from '../../assets/icons/briefing-leaf.svg'
import chatAttachIcon from '../../assets/icons/chat-attach.svg'
import chatSendIcon from '../../assets/icons/chat-send.svg'
import quickReplyIcon from '../../assets/icons/quick-reply.svg'
import logoMark from '../../assets/logo-mark.png'
import { AppHeader } from '../../components/AppHeader/AppHeader'
import { AsyncState } from '../../components/AsyncState/AsyncState'
import { BottomNav } from '../../components/BottomNav/BottomNav'
import type { NavTab } from '../../components/BottomNav/BottomNav'
import { PhoneShell } from '../../components/PhoneShell/PhoneShell'
import { useDemo } from '../../store/useDemo'
import { monthDayW, timeLabel, won } from '../../utils/format'
import styles from './ChildCoach.module.css'

type Message = {
  messageId: number
  sender: 'CHILD' | 'BOT'
  /** TEXT: 일반 대화 · RAG: 첫단추 안내 문서를 찾아서 답함 · NUMBER · RETROSPECT */
  cardType?: 'TEXT' | 'NUMBER' | 'RAG' | 'RETROSPECT'
  content: string
  payload?: { inScope?: boolean; sources?: { source?: string; title?: string }[] } | null
  createdAt: string
}

/** RAG 답변이면 어떤 안내 문서를 보고 답했는지 꺼내요 */
const sourcesOf = (msg: Message) =>
  msg.cardType === 'RAG'
    ? (msg.payload?.sources ?? [])
        .map((s) => [s.source, s.title].filter(Boolean).join(' · '))
        .filter(Boolean)
    : []

export function ChildCoach() {
  const navigate = useNavigate()
  const { accountId } = useParams()
  const { showToast } = useDemo()
  const [draft, setDraft] = useState('')
  const [messages, setMessages] = useState<Message[]>([])
  const [sending, setSending] = useState(false)
  const bottomRef = useRef<HTMLDivElement>(null)

  const { data, loading, error, reload } = useApi(
    () =>
      Promise.all([
        getConversationStarter(),
        optional(getMessages()),
        optional(getChildHome()),
        optional(getSavingTip()),
      ]).then(([starter, history, home, tip]) => ({ starter, history, home, tip })),
    [accountId],
  )

  // 지난 대화 기록을 불러오면 화면에 깔아요 (오래된 순서로)
  useEffect(() => {
    const list = (data?.history?.messages ?? []) as Message[]
    setMessages([...list].sort((a, b) => a.messageId - b.messageId))
  }, [data])

  // 새 메시지가 붙으면 아래로 따라 내려간다
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' })
  }, [messages])

  const handleNavigate = (tab: NavTab) => {
    navigate(tab === 'home' ? `/child/${accountId}` : `/child/${accountId}/${tab}`)
  }

  const send = async (text: string) => {
    const content = text.trim()
    if (!content || sending) return
    setDraft('')
    setSending(true)
    // 내 말은 바로 보여주고, 코치 답은 서버 응답이 오면 붙여요
    const mine: Message = {
      messageId: Date.now(),
      sender: 'CHILD',
      content,
      createdAt: new Date().toISOString(),
    }
    setMessages((prev) => [...prev, mine])
    try {
      const res = await sendMessage({ content })
      if (res?.reply) setMessages((prev) => [...prev, res.reply as Message])
      if (res?.childMessage) showToast('부모님께 전할 말로 담아뒀어요')
    } catch (e) {
      showToast(errorMessage(e))
      setMessages((prev) => prev.filter((m) => m !== mine))
      setDraft(content)
    } finally {
      setSending(false)
    }
  }

  const name: string = data?.home?.member?.name ?? ''
  const footer = (
    <>
      <div className={styles.inputDock}>
        <div className={styles.inputBar}>
          <button type="button" className={styles.attachButton} aria-label="첨부">
            <img src={chatAttachIcon} width="16.667" height="16.667" alt="" />
          </button>
          <input
            className={styles.chatInput}
            placeholder="단추 코치에게 물어보세요..."
            value={draft}
            disabled={sending}
            onChange={(e) => setDraft(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.nativeEvent.isComposing) send(draft)
            }}
          />
          <button
            type="button"
            className={styles.sendButton}
            aria-label="보내기"
            disabled={sending}
            onClick={() => send(draft)}
          >
            <img src={chatSendIcon} width="13.458" height="11.333" alt="" />
          </button>
        </div>
      </div>
      <BottomNav active="chat" onNavigate={handleNavigate} />
    </>
  )
  const header = <AppHeader role="자녀" subtitle={name ? `${name}의 지갑` : ''} />

  if (loading || error || !data)
    return (
      <PhoneShell header={header} footer={footer}>
        <AsyncState loading={loading} error={error} onRetry={reload} />
      </PhoneShell>
    )

  const { starter, home, tip } = data
  const st = home?.settlement
  const shortfall: number = st?.shortfallAmount ?? 0
  const chips: string[] = starter.chips ?? []

  return (
    <PhoneShell header={header} footer={footer}>
      <div className={styles.content}>
        <div className={styles.dateDivider}>
          <span className={styles.datePill}>
            <span className={styles.datePillDot} />
            {home?.today ? `${monthDayW(home.today)} · ` : ''}AI 금융 코치 단추
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
              {starter.greeting}
              {st && (
                <>
                  {' '}
                  현재 사용액은 <span className={styles.strong}>{won(st.billedAmount)}</span>이고
                  이번 달 용돈은 <span className={styles.strong}>{won(st.availableAmount)}</span>
                  이야.
                  {shortfall > 0 && (
                    <>
                      {' '}
                      약 <span className={styles.danger}>{won(shortfall)}</span>이 모자랄 수
                      있는데, 같이 계획을 세워볼까?
                    </>
                  )}
                </>
              )}
            </p>
            <span className={styles.time}>{starter.privacyNotice}</span>
          </div>
        </div>

        {/* 부족할 때 해결 방법 */}
        {shortfall > 0 && (
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
                    <span className={styles.solutionBadge}>+{won(shortfall)} 보충</span>
                  </div>
                  <p className={styles.solutionDesc}>
                    진행 중인 미션을 완료하면 용돈을 보충해 잔액 부족을 해결할 수 있어!
                  </p>
                  <button
                    type="button"
                    className={styles.solutionButton}
                    onClick={() => navigate(`/child/${accountId}/mission`)}
                  >
                    가능한 미션 보기
                    <img src={arrowRightSmIcon} width="10.667" height="10.667" alt="" />
                  </button>
                </div>

                {tip?.text && (
                  <div className={styles.solutionCardAlt}>
                    <h3 className={styles.solutionTitle}>🗓️ 아껴 쓰기</h3>
                    <p className={styles.solutionDesc}>{tip.text}</p>
                  </div>
                )}

                <div className={styles.briefingCard}>
                  <img src={briefingLeafIcon} width="12" height="17" alt="" />
                  <div>
                    <p className={styles.briefingTitle}>💡 부모님 안심 브리핑</p>
                    <p className={styles.briefingBody}>
                      부모님께는 개별 결제 내역 대신 <strong>'스스로 해결 중'</strong> 상태의
                      긍정적인 성장 리포트로 전달돼요.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 주고받은 메시지 */}
        {messages.map((msg) =>
          msg.sender === 'CHILD' ? (
            <div key={msg.messageId} className={styles.childRow}>
              <div className={styles.childGroup}>
                <p className={styles.childBubble}>{msg.content}</p>
                <span className={styles.timeRight}>{timeLabel(msg.createdAt)}</span>
              </div>
            </div>
          ) : (
            <div key={msg.messageId} className={styles.coachRow}>
              <div className={styles.avatar}>
                <img className={styles.avatarImage} src={logoMark} alt="" />
              </div>
              <div className={styles.bubbleGroup}>
                <span className={styles.sender}>단추 코치</span>
                <p className={styles.coachBubble}>{msg.content}</p>
                {sourcesOf(msg).length > 0 && (
                  <span className={styles.time}>📚 참고: {sourcesOf(msg).join(', ')}</span>
                )}
                <span className={styles.time}>{timeLabel(msg.createdAt)}</span>
              </div>
            </div>
          ),
        )}

        {sending && (
          <div className={styles.coachRow}>
            <div className={styles.avatar}>
              <img className={styles.avatarImage} src={logoMark} alt="" />
            </div>
            <div className={styles.bubbleGroup}>
              <span className={styles.sender}>단추 코치</span>
              <p className={styles.coachBubble}>생각하는 중...</p>
            </div>
          </div>
        )}

        {/* 빠른 답변 */}
        {chips.length > 0 && (
          <div className={styles.quickReplies}>
            <span className={styles.quickLabel}>
              <img src={quickReplyIcon} width="12.833" height="12.833" alt="" />
              빠른 답변 선택
            </span>
            <div className={styles.quickScroller}>
              {chips.map((chip, i) => (
                <button
                  key={chip}
                  type="button"
                  className={i === 0 ? styles.quickChipPrimary : styles.quickChip}
                  disabled={sending}
                  onClick={() => send(chip)}
                >
                  {chip}
                </button>
              ))}
            </div>
          </div>
        )}

        <div ref={bottomRef} />
      </div>
    </PhoneShell>
  )
}
