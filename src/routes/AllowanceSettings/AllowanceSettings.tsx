import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import appIcon from '../../assets/icons/app-icon.svg'
import { Divider, SettingRow } from '../../components/MyPage/MyPageParts'
import { PhoneShell } from '../../components/PhoneShell/PhoneShell'
import { useDemo } from '../../store/useDemo'
import styles from './AllowanceSettings.module.css'

const CURRENT_ALLOWANCE = 70000
const REASONS = ['물가', '진학', '다시 약속', '기타']

/** 화면 M5 — 부모가 자녀 용돈을 정하는 서브 화면 */
export function AllowanceSettings() {
  const navigate = useNavigate()
  const { allowance, setAllowance } = useDemo()
  const [amount, setAmount] = useState(allowance)
  const [reason, setReason] = useState('물가')

  const delta = amount - CURRENT_ALLOWANCE

  return (
    <PhoneShell
      header={
        <div className={styles.topBar}>
          <button
            type="button"
            className={styles.back}
            aria-label="뒤로"
            onClick={() => navigate(-1)}
          >
            ‹
          </button>
          <h1 className={styles.title}>뽀로로 용돈 정하기</h1>
        </div>
      }
      footer={
        <div className={styles.bottomBar}>
          <button
            type="button"
            className={styles.saveButton}
            onClick={() => {
              setAllowance(amount)
              navigate(-1)
            }}
          >
            저장하기
          </button>
        </div>
      }
    >
      <div className={styles.content}>
        {/* AI 제안 */}
        <section className={styles.aiBanner}>
          <div className={styles.aiBody}>
            <div className={styles.aiTitleRow}>
              <span className={styles.aiChip}>AI 제안</span>
              <span className={styles.aiAmount}>73,000원</span>
            </div>
            <p className={styles.aiDesc}>
              하늘이 결제 품목 물가가 4.2% 올랐어요
            </p>
          </div>
          <button type="button" className={styles.aiLink}>
            근거 ›
          </button>
        </section>

        {/* 한 달 용돈 */}
        <section className={styles.card}>
          <p className={styles.cardLabel}>한 달 용돈</p>

          <div className={styles.stepper}>
            <button
              type="button"
              className={styles.stepperMinus}
              aria-label="용돈 줄이기"
              onClick={() => setAmount((v) => Math.max(0, v - 1000))}
            >
              −
            </button>
            <span className={styles.amountBox}>
              {amount.toLocaleString()}원
            </span>
            <button
              type="button"
              className={styles.stepperPlus}
              aria-label="용돈 늘리기"
              onClick={() => setAmount((v) => v + 1000)}
            >
              +
            </button>
          </div>

          <div className={styles.quickRow}>
            <button
              type="button"
              className={styles.quickChip}
              onClick={() => setAmount((v) => Math.max(0, v - 1000))}
            >
              −1,000원
            </button>
            <button
              type="button"
              className={styles.quickChip}
              onClick={() => setAmount((v) => v + 1000)}
            >
              +1,000원
            </button>
            <button
              type="button"
              className={styles.quickChip}
              onClick={() => setAmount((v) => v + 5000)}
            >
              +5,000원
            </button>
          </div>

          <div className={styles.deltaRow}>
            <span className={styles.deltaFrom}>
              지금 {CURRENT_ALLOWANCE.toLocaleString()}원
            </span>
            <span className={styles.deltaValue}>
              {delta >= 0 ? '+' : '−'}
              {Math.abs(delta).toLocaleString()}원
            </span>
          </div>

          <div className={styles.refBox}>
            <span className={styles.refTitle}>참고 70,000 ~ 75,000원</span>
            <p className={styles.refDesc}>
              하늘이가 실제로 결제한 항목 × 품목별 물가로 계산. 기록이 없는
              처음엔 참고 없이 정해요.
            </p>
          </div>
        </section>

        {/* 보내는 날 · 결제일 */}
        <section className={styles.card}>
          <SettingRow label="용돈 보내는 날" value="매월 1일 · 자동이체" />
          <Divider />
          <SettingRow label="결제일" value="매월 25일 · 카드 결제일과 같게" />
        </section>

        {/* 적용 */}
        <section className={styles.applyCard}>
          <div className={styles.applyRow}>
            <span className={styles.applyLabel}>적용</span>
            <span className={styles.applyValue}>11월 1일부터</span>
          </div>
          <p className={styles.applyNote}>
            정산 기간 중간에는 바꾸지 않아요. 처음 시작할 때만 이번 달부터.
          </p>
        </section>

        {/* 바꾸는 이유 */}
        <section className={styles.reasonCard}>
          <p className={styles.cardLabel}>바꾸는 이유 (선택)</p>
          <div className={styles.reasonChips}>
            {REASONS.map((item) => (
              <button
                key={item}
                type="button"
                className={
                  reason === item ? styles.reasonChipActive : styles.reasonChip
                }
                onClick={() => setReason(item)}
              >
                {item}
              </button>
            ))}
          </div>
          <p className={styles.reasonNote}>약속 기록에 남아요</p>
        </section>

        {/* 알림 미리보기 */}
        <section className={styles.notifyCard}>
          <p className={styles.notifyLabel}>하늘이에게 이렇게 알려요</p>
          <div className={styles.notify}>
            <img className={styles.notifyIcon} src={appIcon} alt="" />
            <p className={styles.notifyText}>
              11월부터 용돈이 {amount.toLocaleString()}원이 돼요. 물가가 올라서
              부모님이 올렸어요.
            </p>
          </div>
        </section>
      </div>
    </PhoneShell>
  )
}
