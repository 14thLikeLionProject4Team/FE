import { useEffect, useState } from 'react'
import type { ReactNode } from 'react'
import { getAllowanceSetup, getParentMy, previewAllowanceChange, saveAllowanceChange } from '../../api/parent'
import { errorMessage, optional, useApi } from '../../api/useApi'
import { AsyncState } from '../../components/AsyncState/AsyncState'
import { monthDay, num, won } from '../../utils/format'
import { useNavigate, useParams } from 'react-router-dom'
import appIcon from '../../assets/icons/app-icon.svg'
import { Divider, SettingRow } from '../../components/MyPage/MyPageParts'
import { PhoneShell } from '../../components/PhoneShell/PhoneShell'
import { useDemo } from '../../store/useDemo'
import styles from './AllowanceSettings.module.css'

type Reason = { code: string; label: string }

/** 화면 M5 — 부모가 자녀 용돈을 정하는 서브 화면 */
export function AllowanceSettings() {
  const navigate = useNavigate()
  const { accountId } = useParams()
  const { showToast } = useDemo()

  const { data, loading, error, reload } = useApi(
    () =>
      Promise.all([getAllowanceSetup(), optional(getParentMy())]).then(([setup, my]) => ({
        setup,
        my,
      })),
    [accountId],
  )

  const [amount, setAmount] = useState<number | null>(null)
  const [reason, setReason] = useState('INFLATION')
  const [preview, setPreview] = useState<{ message: string; effectiveFrom: string } | null>(null)
  const [saving, setSaving] = useState(false)

  const setup = data?.setup
  const current: number = setup?.currentAmount ?? 0
  const suggestion = setup?.pendingSuggestion
  const value = amount ?? suggestion?.suggestedAmount ?? current
  const usesSuggestion = Boolean(suggestion) && value === suggestion?.suggestedAmount

  // 금액·이유가 바뀌면 자녀에게 갈 알림 문구를 백엔드에서 미리 받아와요 (0.3초 늦게)
  useEffect(() => {
    if (!setup) return
    const timer = window.setTimeout(() => {
      previewAllowanceChange({
        amount: value,
        reason,
        ...(usesSuggestion ? { suggestionId: suggestion.suggestionId } : {}),
      })
        .then(setPreview)
        .catch(() => setPreview(null))
    }, 300)
    return () => window.clearTimeout(timer)
  }, [setup, value, reason, usesSuggestion, suggestion])

  const childName: string = data?.my?.children?.[0]?.name ?? ''

  const save = async () => {
    if (!setup || saving) return
    setSaving(true)
    try {
      await saveAllowanceChange({
        amount: value,
        reason,
        allowanceDay: setup.allowanceDay,
        autoTransfer: setup.autoTransfer,
        settlementDay: setup.settlementDay,
        ...(usesSuggestion ? { suggestionId: suggestion.suggestionId } : {}),
      })
      showToast(
        preview?.effectiveFrom
          ? `${monthDay(preview.effectiveFrom)}부터 ${won(value)}으로 바꿨어요`
          : `${won(value)}으로 바꿨어요`,
      )
      navigate(-1)
    } catch (e) {
      showToast(errorMessage(e))
    } finally {
      setSaving(false)
    }
  }

  const shell = (children: ReactNode) => (
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
          <h1 className={styles.title}>{childName} 용돈 정하기</h1>
        </div>
      }
      footer={
        <div className={styles.bottomBar}>
          <button
            type="button"
            className={styles.saveButton}
            disabled={!setup || saving || value === current}
            onClick={save}
          >
            {saving ? '저장 중...' : '저장하기'}
          </button>
        </div>
      }
    >
      {children}
    </PhoneShell>
  )

  if (loading || error || !data || !setup)
    return shell(<AsyncState loading={loading} error={error} onRetry={reload} />)

  const delta = value - current
  const reasons: Reason[] = setup.reasons ?? []
  const change = (diff: number) => setAmount(Math.max(0, value + diff))

  return shell(
    <div className={styles.content}>
      {/* AI 제안 */}
      {suggestion && (
        <section className={styles.aiBanner}>
          <div className={styles.aiBody}>
            <div className={styles.aiTitleRow}>
              <span className={styles.aiChip}>AI 제안</span>
              <span className={styles.aiAmount}>{won(suggestion.suggestedAmount)}</span>
            </div>
            <p className={styles.aiDesc}>{suggestion.explanation}</p>
          </div>
          <button
            type="button"
            className={styles.aiLink}
            onClick={() => setAmount(suggestion.suggestedAmount)}
          >
            적용 ›
          </button>
        </section>
      )}

      {/* 한 달 용돈 */}
      <section className={styles.card}>
        <p className={styles.cardLabel}>한 달 용돈</p>

        <div className={styles.stepper}>
          <button
            type="button"
            className={styles.stepperMinus}
            aria-label="용돈 줄이기"
            onClick={() => change(-1000)}
          >
            −
          </button>
          <span className={styles.amountBox}>{won(value)}</span>
          <button
            type="button"
            className={styles.stepperPlus}
            aria-label="용돈 늘리기"
            onClick={() => change(1000)}
          >
            +
          </button>
        </div>

        <div className={styles.quickRow}>
          <button type="button" className={styles.quickChip} onClick={() => change(-1000)}>
            −1,000원
          </button>
          <button type="button" className={styles.quickChip} onClick={() => change(1000)}>
            +1,000원
          </button>
          <button type="button" className={styles.quickChip} onClick={() => change(5000)}>
            +5,000원
          </button>
        </div>

        <div className={styles.deltaRow}>
          <span className={styles.deltaFrom}>지금 {won(current)}</span>
          <span className={styles.deltaValue}>
            {delta >= 0 ? '+' : '−'}
            {won(Math.abs(delta))}
          </span>
        </div>

        <div className={styles.refBox}>
          <span className={styles.refTitle}>
            {setup.referenceRange
              ? `참고 ${num(setup.referenceRange.min)} ~ ${won(setup.referenceRange.max)}`
              : '참고 범위 없음'}
          </span>
          <p className={styles.refDesc}>
            {childName}가 실제로 결제한 항목 × 품목별 물가로 계산. 기록이 없는
            처음엔 참고 없이 정해요.
          </p>
        </div>
      </section>

      {/* 보내는 날 · 결제일 */}
      <section className={styles.card}>
        <SettingRow
          label="용돈 보내는 날"
          value={`매월 ${setup.allowanceDay}일${setup.autoTransfer ? ' · 자동이체' : ''}`}
        />
        <Divider />
        <SettingRow label="결제일" value={`매월 ${setup.settlementDay}일 · 카드 결제일과 같게`} />
      </section>

      {/* 적용 */}
      <section className={styles.applyCard}>
        <div className={styles.applyRow}>
          <span className={styles.applyLabel}>적용</span>
          <span className={styles.applyValue}>
            {preview?.effectiveFrom ? `${monthDay(preview.effectiveFrom)}부터` : '다음 정산부터'}
          </span>
        </div>
        <p className={styles.applyNote}>
          정산 기간 중간에는 바꾸지 않아요. 처음 시작할 때만 이번 달부터.
        </p>
      </section>

      {/* 바꾸는 이유 */}
      <section className={styles.reasonCard}>
        <p className={styles.cardLabel}>바꾸는 이유 (선택)</p>
        <div className={styles.reasonChips}>
          {reasons.map((item) => (
            <button
              key={item.code}
              type="button"
              className={reason === item.code ? styles.reasonChipActive : styles.reasonChip}
              onClick={() => setReason(item.code)}
            >
              {item.label}
            </button>
          ))}
        </div>
        <p className={styles.reasonNote}>약속 기록에 남아요</p>
      </section>

      {/* 알림 미리보기 */}
      <section className={styles.notifyCard}>
        <p className={styles.notifyLabel}>{childName}에게 이렇게 알려요</p>
        <div className={styles.notify}>
          <img className={styles.notifyIcon} src={appIcon} alt="" />
          <p className={styles.notifyText}>{preview?.message ?? '...'}</p>
        </div>
      </section>
    </div>,
  )
}
