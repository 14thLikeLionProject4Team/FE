import { useEffect, useState } from 'react'
import { useNavigate, useParams, useSearchParams } from 'react-router-dom'
import { createMission, getMissionDetail, getRewardGuide, openMission } from '../../api/missions'
import { getParentHome } from '../../api/parent'
import { errorMessage, optional, useApi } from '../../api/useApi'
import backArrowParent from '../../assets/icons/back-arrow-parent.svg'
import { PhoneShell } from '../../components/PhoneShell/PhoneShell'
import { useDemo } from '../../store/useDemo'
import { addDays, dateInputStyle, num, won } from '../../utils/format'
import styles from './ParentMissionCreate.module.css'

const TAGS = ['설거지', '분리수거', '장보기 돕기', '가격 비교', '영수증 정리']
const TYPES = [
  { id: 'CHORE', label: '집안일 돕기' },
  { id: 'FINANCE', label: '금융 배우기' },
  { id: 'HABIT', label: '습관 만들기' },
]
const FREQUENCIES = [
  { id: 'ONCE', label: '한 번' },
  { id: 'WEEKLY', label: '매주' },
  { id: 'DAILY', label: '매일' },
]

export function ParentMissionCreate() {
  const navigate = useNavigate()
  const { accountId } = useParams()
  const { showToast } = useDemo()
  // ?from=미션ID 면 자녀 제안·추천 미션을 채워서 열어요
  const [params] = useSearchParams()
  const fromId = params.get('from')

  const [name, setName] = useState('')
  const [criteria, setCriteria] = useState('')
  const [type, setType] = useState('CHORE')
  const [reward, setReward] = useState(3000)
  const [frequency, setFrequency] = useState('ONCE')
  const [verifyByPhoto, setVerifyByPhoto] = useState(true)
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [saving, setSaving] = useState(false)

  const { data } = useApi(
    () =>
      Promise.all([
        optional(getParentHome()),
        optional(getRewardGuide()),
        fromId ? optional(getMissionDetail(fromId)) : Promise.resolve(null),
      ]).then(([home, guide, source]) => ({
        childName: (home?.childName as string) ?? '',
        today: (home?.today as string) ?? '',
        guide,
        source,
      })),
    [accountId, fromId],
  )
  const childName = data?.childName ?? ''
  const guide = data?.guide

  // 처음 한 번: 날짜 기본값, 제안·추천 미션 내용 채우기
  useEffect(() => {
    if (!data) return
    const src = data.source
    if (data.today) {
      setStartDate((v) => v || src?.startDate || data.today)
      setEndDate((v) => v || src?.endDate || addDays(data.today, 27))
    }
    if (src) {
      setName(src.title ?? '')
      setCriteria(src.criteria ?? '')
      if (src.missionType) setType(src.missionType)
      setReward(src.desiredReward ?? src.rewardAmount ?? 3000)
      if (src.repeatType) setFrequency(src.repeatType)
      if (src.verifyMethod) setVerifyByPhoto(src.verifyMethod === 'PHOTO')
    }
  }, [data])

  const handleOpen = async () => {
    if (!name.trim() || saving) return
    setSaving(true)
    const body = {
      title: name.trim(),
      criteria: criteria.trim(),
      missionType: type,
      rewardAmount: reward,
      startDate,
      endDate,
      repeatType: frequency,
      verifyMethod: verifyByPhoto ? 'PHOTO' : 'DIRECT',
    }
    try {
      if (fromId) await openMission(fromId, body)
      else await createMission(body)
      showToast('미션을 열었어요')
      navigate(`/parent/${accountId}/mission`)
    } catch (e) {
      showToast(errorMessage(e))
    } finally {
      setSaving(false)
    }
  }

  return (
    <PhoneShell
      header={
        <div className={styles.topBar}>
          <div className={styles.topLeft}>
            <button
              type="button"
              className={styles.back}
              aria-label="뒤로"
              onClick={() => navigate(-1)}
            >
              <img src={backArrowParent} width="20" height="20" alt="" />
            </button>
            <h1 className={styles.pageTitle}>미션 만들기</h1>
          </div>
          <span className={styles.targetChip}>{childName}에게</span>
        </div>
      }
      footer={
        <div className={styles.bottomBar}>
          <button
            type="button"
            className={styles.ctaButton}
            disabled={!name.trim() || !startDate || !endDate || saving}
            onClick={handleOpen}
          >
            {saving ? '여는 중...' : '미션 열기'}
          </button>
          <p className={styles.ctaNote}>열면 {childName}에게 바로 알림이 가요</p>
        </div>
      }
    >
      <div className={styles.content}>
        {/* 미션 이름 */}
        <section className={styles.section}>
          <span className={styles.label}>미션 이름</span>
          <input
            className={styles.input}
            value={name}
            placeholder="미션 이름을 입력하세요"
            onChange={(e) => setName(e.target.value)}
          />
          <div className={styles.tags}>
            {TAGS.map((tag) => (
              <button
                key={tag}
                type="button"
                className={styles.tag}
                onClick={() => setName(tag)}
              >
                {tag}
              </button>
            ))}
          </div>
        </section>

        {/* 완료 기준 */}
        <section className={styles.section}>
          <span className={styles.label}>완료 기준 (선택)</span>
          <textarea
            className={styles.textarea}
            value={criteria}
            placeholder="어떻게 끝내면 되는지 적어주세요"
            onChange={(e) => setCriteria(e.target.value)}
          />
        </section>

        {/* 유형 */}
        <section className={styles.section}>
          <span className={styles.label}>유형</span>
          <div className={styles.segmented}>
            {TYPES.map((item) => (
              <button
                key={item.id}
                type="button"
                className={type === item.id ? styles.segmentActive : styles.segment}
                onClick={() => setType(item.id)}
              >
                {item.label}
              </button>
            ))}
          </div>
        </section>

        {/* 보상 금액 */}
        <section className={styles.section}>
          <span className={styles.label}>보상 금액</span>

          <div className={styles.stepper}>
            <button
              type="button"
              className={styles.stepperMinus}
              aria-label="보상 줄이기"
              onClick={() => setReward((v) => Math.max(0, v - 500))}
            >
              −
            </button>
            <span className={styles.stepperValue}>
              {reward.toLocaleString()}원
            </span>
            <button
              type="button"
              className={styles.stepperPlus}
              aria-label="보상 늘리기"
              onClick={() => setReward((v) => v + 500)}
            >
              +
            </button>
          </div>

          <div className={styles.quickAmounts}>
            <button
              type="button"
              className={styles.quickAmount}
              onClick={() => setReward((v) => v + 500)}
            >
              +500원
            </button>
            <button
              type="button"
              className={styles.quickAmount}
              onClick={() => setReward((v) => v + 1000)}
            >
              +1,000원
            </button>
            <button
              type="button"
              className={styles.quickAmountAccent}
              onClick={() => setReward((v) => v + 3000)}
            >
              +3,000원
            </button>
          </div>

          {guide && (
            <div className={styles.guideBox}>
              <span className={styles.guideTitle}>
                첫단추 기준 {num(guide.minReward)} ~ {won(guide.maxReward)}
              </span>
              <p className={styles.guideDesc}>
                용돈 {won(guide.allowanceAmount)} × {guide.minRate}~{guide.maxRate}%, 난이도와
                걸리는 시간에 따라. 이번 달 남은 한도 {won(guide.remainingCap)}.
              </p>
            </div>
          )}
        </section>

        {/* 기간 */}
        <section className={styles.section}>
          <span className={styles.label}>기간</span>

          <div className={styles.dateRow}>
            <div className={styles.dateBox}>
              <span className={styles.dateLabel}>시작</span>
              <input
                type="date"
                className={styles.dateValue}
                style={dateInputStyle}
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
              />
            </div>
            <div className={styles.dateBox}>
              <span className={styles.dateLabel}>마감</span>
              <input
                type="date"
                className={styles.dateValue}
                style={dateInputStyle}
                value={endDate}
                min={startDate}
                onChange={(e) => setEndDate(e.target.value)}
              />
            </div>
          </div>

          <div className={styles.segmented}>
            {FREQUENCIES.map((item) => (
              <button
                key={item.id}
                type="button"
                className={
                  frequency === item.id ? styles.segmentActive : styles.segment
                }
                onClick={() => setFrequency(item.id)}
              >
                {item.label}
              </button>
            ))}
          </div>
        </section>

        {/* 완료 확인 방법 */}
        <section className={styles.section}>
          <span className={styles.label}>완료 확인 방법</span>
          <div className={styles.radioList}>
            <button
              type="button"
              className={styles.radioRow}
              onClick={() => setVerifyByPhoto(true)}
            >
              <span
                className={verifyByPhoto ? styles.radioChecked : styles.radio}
              >
                {verifyByPhoto && <span className={styles.radioDot} />}
              </span>
              <span
                className={
                  verifyByPhoto ? styles.radioLabelActive : styles.radioLabel
                }
              >
                {childName}가 사진으로 인증
              </span>
            </button>

            <button
              type="button"
              className={styles.radioRow}
              onClick={() => setVerifyByPhoto(false)}
            >
              <span
                className={verifyByPhoto ? styles.radio : styles.radioChecked}
              >
                {!verifyByPhoto && <span className={styles.radioDot} />}
              </span>
              <span
                className={
                  verifyByPhoto ? styles.radioLabel : styles.radioLabelActive
                }
              >
                내가 직접 보고 확인
              </span>
            </button>
          </div>
        </section>

        {/* 미리보기 */}
        <section className={styles.previewWrap}>
          <span className={styles.previewLabel}>{childName}에게 이렇게 보여요</span>
          <div className={styles.previewOuter}>
            <div className={styles.previewCard}>
              <div>
                <div className={styles.previewTitleRow}>
                  <span className={styles.previewTitle}>{name || '미션 이름'}</span>
                  <span className={styles.previewBadge}>새 미션</span>
                </div>
                <p className={styles.previewDesc}>{criteria}</p>
              </div>
              <span className={styles.previewAmount}>
                +{reward.toLocaleString()}원
              </span>
            </div>
          </div>
        </section>
      </div>
    </PhoneShell>
  )
}
