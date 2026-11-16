import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import backArrowParent from '../../assets/icons/back-arrow-parent.svg'
import { PhoneShell } from '../../components/PhoneShell/PhoneShell'
import { useDemo } from '../../store/useDemo'
import styles from './ParentMissionCreate.module.css'

const TAGS = ['설거지', '분리수거', '장보기 돕기', '가격 비교', '영수증 정리']
const TYPES = ['집안일 돕기', '금융 배우기', '습관 만들기']
const FREQUENCIES = ['한 번', '매주', '매일']

export function ParentMissionCreate() {
  const navigate = useNavigate()
  const { accountId } = useParams()
  const { openMission } = useDemo()
  const [name, setName] = useState('베란다 화분 물 주기')
  const [criteria, setCriteria] = useState(
    '일주일에 두 번, 물 준 날 사진으로 인증하기',
  )
  const [type, setType] = useState(TYPES[0])
  const [reward, setReward] = useState(3000)
  const [frequency, setFrequency] = useState(FREQUENCIES[0])
  const [verifyByPhoto, setVerifyByPhoto] = useState(true)

  const handleOpen = () => {
    if (!name.trim()) return
    openMission({
      name: name.trim(),
      type,
      amount: reward,
      criteria: criteria.trim(),
      note: criteria.trim(),
    })
    navigate(`/parent/${accountId}/mission`)
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
          <span className={styles.targetChip}>하늘에게</span>
        </div>
      }
      footer={
        <div className={styles.bottomBar}>
          <button
            type="button"
            className={styles.ctaButton}
            disabled={!name.trim()}
            onClick={handleOpen}
          >
            미션 열기
          </button>
          <p className={styles.ctaNote}>열면 하늘이에게 바로 알림이 가요</p>
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
            onChange={(e) => setCriteria(e.target.value)}
          />
        </section>

        {/* 유형 */}
        <section className={styles.section}>
          <span className={styles.label}>유형</span>
          <div className={styles.segmented}>
            {TYPES.map((item) => (
              <button
                key={item}
                type="button"
                className={type === item ? styles.segmentActive : styles.segment}
                onClick={() => setType(item)}
              >
                {item}
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

          <div className={styles.guideBox}>
            <span className={styles.guideTitle}>첫단추 기준 2,100 ~ 5,600원</span>
            <p className={styles.guideDesc}>
              용돈 70,000원 × 3~8%, 난이도와 걸리는 시간에 따라. 이번 달 남은
              한도 18,000원.
            </p>
          </div>
        </section>

        {/* 기간 */}
        <section className={styles.section}>
          <span className={styles.label}>기간</span>

          <div className={styles.dateRow}>
            <div className={styles.dateBox}>
              <span className={styles.dateLabel}>시작</span>
              <span className={styles.dateValue}>10월 19일 (월)</span>
            </div>
            <div className={styles.dateBox}>
              <span className={styles.dateLabel}>마감</span>
              <span className={styles.dateValue}>11월 15일 (일)</span>
            </div>
          </div>

          <div className={styles.segmented}>
            {FREQUENCIES.map((item) => (
              <button
                key={item}
                type="button"
                className={
                  frequency === item ? styles.segmentActive : styles.segment
                }
                onClick={() => setFrequency(item)}
              >
                {item}
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
                하늘이가 사진으로 인증
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
          <span className={styles.previewLabel}>하늘이에게 이렇게 보여요</span>
          <div className={styles.previewOuter}>
            <div className={styles.previewCard}>
              <div>
                <div className={styles.previewTitleRow}>
                  <span className={styles.previewTitle}>{name}</span>
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
