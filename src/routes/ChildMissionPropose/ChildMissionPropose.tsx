import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import cameraSmallIcon from '../../assets/icons/camera-small.svg'
import checkMarkIcon from '../../assets/icons/check-mark.svg'
import checkMarkIdleIcon from '../../assets/icons/check-mark-idle.svg'
import guideIcon from '../../assets/icons/guide.svg'
import minusIcon from '../../assets/icons/minus.svg'
import plusStepperIcon from '../../assets/icons/plus-stepper.svg'
import previewEyeIcon from '../../assets/icons/preview-eye.svg'
import questFlagIcon from '../../assets/icons/quest-flag.svg'
import sendIcon from '../../assets/icons/send.svg'
import thumbsupIcon from '../../assets/icons/thumbsup.svg'
import typeFinanceIcon from '../../assets/icons/type-finance.svg'
import typeHabitIcon from '../../assets/icons/type-habit.svg'
import typeHomeIcon from '../../assets/icons/type-home.svg'
import verifyEyeIcon from '../../assets/icons/verify-eye.svg'
import verifyPhotoIcon from '../../assets/icons/verify-photo.svg'
import { PhoneShell } from '../../components/PhoneShell/PhoneShell'
import { SubPageHeader } from '../../components/SubPageHeader/SubPageHeader'
import { useDemo } from '../../store/useDemo'
import styles from './ChildMissionPropose.module.css'

const TAGS = ['설거지', '분리수거', '장보기 돕기', '가격 비교', '영수증 정리']

const TYPES = [
  { id: 'home', label: '집안일 돕기', icon: typeHomeIcon, w: 10.667, h: 12 },
  { id: 'finance', label: '금융 배우기', icon: typeFinanceIcon, w: 13.333, h: 12.667 },
  { id: 'habit', label: '습관 만들기', icon: typeHabitIcon, w: 15.067, h: 15.067 },
] as const

const FREQUENCIES = ['한 번', '매주', '매일'] as const

export function ChildMissionPropose() {
  const navigate = useNavigate()
  const { accountId } = useParams()
  const { proposeMission } = useDemo()
  const [name, setName] = useState('베란다 화분 물 주기')
  const [criteria, setCriteria] = useState(
    '일주일에 두 번, 물 준 날 사진으로 인증하기',
  )
  const [type, setType] = useState<string>('home')
  const [reward, setReward] = useState(3000)
  const [frequency, setFrequency] = useState<string>('한 번')
  const [verifyBySelf, setVerifyBySelf] = useState(true)

  const typeLabel = TYPES.find((t) => t.id === type)?.label ?? ''

  const handleSubmit = () => {
    if (!name.trim()) return
    proposeMission({
      name: name.trim(),
      type: typeLabel,
      amount: reward,
      criteria: criteria.trim(),
      note: `내가 바라는 보상 ${reward.toLocaleString()}원`,
    })
    navigate(`/child/${accountId}/mission`)
  }

  return (
    <PhoneShell header={<SubPageHeader title="미션 제안하기" />}>
      <div className={styles.content}>
        <div className={styles.subheader}>
          <span className={styles.subheaderLeft}>
            <img src={questFlagIcon} width="9.813" height="16.667" alt="" />
            스스로 실천할 퀘스트를 제안해요
          </span>
          <span className={styles.targetChip}>부모님께</span>
        </div>

        {/* 1. 미션 이름 */}
        <section className={styles.section}>
          <div className={styles.sectionHead}>
            <span className={styles.label}>
              1. 미션 이름 <span className={styles.required}>*</span>
            </span>
            <span className={styles.hint}>자유롭게 입력</span>
          </div>

          <input
            className={styles.input}
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="미션 이름을 입력하세요"
          />

          <div className={styles.tagGroup}>
            <span className={styles.hint}>추천 태그로 빠르게 채우기</span>
            <div className={styles.tagScroller}>
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
          </div>
        </section>

        {/* 2. 완료 기준 */}
        <section className={styles.sectionTight}>
          <div className={styles.sectionHead}>
            <span className={styles.label}>2. 완료 기준</span>
            <span className={styles.hint}>선택</span>
          </div>
          <p className={styles.helper}>
            어떻게 끝낼지 구체적으로 적으면 부모님이 더 쉽게 수락해요!
          </p>
          <textarea
            className={styles.textarea}
            value={criteria}
            onChange={(e) => setCriteria(e.target.value)}
            placeholder="완료 기준을 적어주세요"
          />
        </section>

        {/* 3. 유형 선택 */}
        <section className={styles.section}>
          <span className={styles.label}>3. 유형 선택</span>
          <div className={styles.segmented}>
            {TYPES.map((item) => (
              <button
                key={item.id}
                type="button"
                className={
                  type === item.id ? styles.segmentActive : styles.segment
                }
                onClick={() => setType(item.id)}
              >
                <img
                  src={item.icon}
                  width={item.w}
                  height={item.h}
                  alt=""
                />
                {item.label}
              </button>
            ))}
          </div>
        </section>

        {/* 4. 희망 보상 금액 */}
        <section className={styles.section}>
          <div className={styles.sectionHead}>
            <span className={styles.label}>4. 희망 보상 금액</span>
            <span className={styles.hint}>성공 시 즉시 적립</span>
          </div>

          <div className={styles.stepper}>
            <button
              type="button"
              className={styles.stepperButton}
              aria-label="보상 줄이기"
              onClick={() => setReward((v) => Math.max(0, v - 500))}
            >
              <img src={minusIcon} width="11.667" height="1.667" alt="" />
            </button>
            <span className={styles.stepperValue}>
              {reward.toLocaleString()}
              <span className={styles.stepperUnit}>원</span>
            </span>
            <button
              type="button"
              className={styles.stepperButton}
              aria-label="보상 늘리기"
              onClick={() => setReward((v) => v + 500)}
            >
              <img src={plusStepperIcon} width="11.667" height="11.667" alt="" />
            </button>
          </div>

          <div className={styles.quickAmounts}>
            {[500, 1000, 3000].map((step) => (
              <button
                key={step}
                type="button"
                className={styles.quickAmount}
                onClick={() => setReward((v) => v + step)}
              >
                +{step.toLocaleString()}원
              </button>
            ))}
          </div>

          <div className={styles.guideBox}>
            <span className={styles.guideTitle}>
              <img src={guideIcon} width="11.25" height="15" alt="" />
              첫단추 기준 2,100 ~ 5,600원
            </span>
            <p className={styles.guideDesc}>
              용돈 70,000원 × 3~8%, 난이도와 걸리는 시간에 따라. 이번 달 남은
              한도 18,000원.
            </p>
          </div>
        </section>

        {/* 5. 기간 설정 */}
        <section className={styles.section}>
          <span className={styles.label}>5. 기간 설정</span>

          <div className={styles.dateRow}>
            <div className={styles.dateBox}>
              <span className={styles.dateLabel}>시작일</span>
              <span className={styles.dateValue}>10월 19일 (월)</span>
            </div>
            <div className={styles.dateBox}>
              <span className={styles.dateLabel}>마감일</span>
              <span className={styles.dateValue}>11월 15일 (일)</span>
            </div>
          </div>

          <div className={styles.frequency}>
            <span className={styles.dateLabel}>진행 빈도</span>
            <div className={styles.frequencyRow}>
              {FREQUENCIES.map((item) => (
                <button
                  key={item}
                  type="button"
                  className={
                    frequency === item
                      ? styles.freqButtonActive
                      : styles.freqButton
                  }
                  onClick={() => setFrequency(item)}
                >
                  {item}
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* 6. 인증 방법 */}
        <section className={styles.section}>
          <span className={styles.label}>6. 인증 방법 선택</span>

          <div className={styles.verifyList}>
            <button
              type="button"
              className={
                verifyBySelf ? styles.verifyOptionActive : styles.verifyOption
              }
              onClick={() => setVerifyBySelf(true)}
            >
              <span className={styles.verifyLeft}>
                <span
                  className={
                    verifyBySelf ? styles.verifyIconActive : styles.verifyIcon
                  }
                >
                  <img src={verifyPhotoIcon} width="16.667" height="15" alt="" />
                </span>
                <span>
                  <span className={styles.verifyTitle}>내가 사진으로 인증</span>
                  <br />
                  <span className={styles.verifyDesc}>
                    완료 후 찰칵 찍어 올릴게요
                  </span>
                </span>
              </span>
              <span className={verifyBySelf ? styles.radioActive : styles.radio}>
                <img
                  src={verifyBySelf ? checkMarkIcon : checkMarkIdleIcon}
                  width="10.867"
                  height="8.017"
                  alt=""
                />
              </span>
            </button>

            <button
              type="button"
              className={
                verifyBySelf ? styles.verifyOption : styles.verifyOptionActive
              }
              onClick={() => setVerifyBySelf(false)}
            >
              <span className={styles.verifyLeft}>
                <span
                  className={
                    verifyBySelf ? styles.verifyIcon : styles.verifyIconActive
                  }
                >
                  <img src={verifyEyeIcon} width="18.333" height="12.5" alt="" />
                </span>
                <span>
                  <span className={styles.verifyTitle}>
                    부모님이 직접 보고 확인
                  </span>
                  <br />
                  <span className={styles.verifyDesc}>
                    눈으로 확인 후 승인해주세요
                  </span>
                </span>
              </span>
              <span className={verifyBySelf ? styles.radio : styles.radioActive}>
                <img
                  src={verifyBySelf ? checkMarkIdleIcon : checkMarkIcon}
                  width="10.867"
                  height="8.017"
                  alt=""
                />
              </span>
            </button>
          </div>
        </section>

        {/* 부모님 미리보기 */}
        <section className={styles.previewWrap}>
          <span className={styles.previewLabel}>
            <img src={previewEyeIcon} width="16.5" height="11.25" alt="" />
            부모님에게 이렇게 보여요
          </span>

          <div className={styles.previewCard}>
            <div className={styles.previewTop}>
              <div>
                <div className={styles.previewChips}>
                  <span className={styles.previewChipNew}>새 제안</span>
                  <span className={styles.previewChipType}>{typeLabel}</span>
                </div>
                <h3 className={styles.previewTitle}>{name}</h3>
              </div>
              <div>
                <p className={styles.previewRewardLabel}>보상</p>
                <p className={styles.previewReward}>
                  +{reward.toLocaleString()}원
                </p>
              </div>
            </div>

            <p className={styles.previewFoot}>
              <img src={cameraSmallIcon} width="16.5" height="15.75" alt="" />
              {criteria}
            </p>
          </div>
        </section>

        {/* 동기 부여 */}
        <section className={styles.motivation}>
          <div className={styles.motivationIcon}>
            <img src={thumbsupIcon} width="19.25" height="18.333" alt="" />
          </div>
          <div>
            <p className={styles.motivationTitle}>
              스스로 약속을 지키면 보너스 신뢰도 UP!
            </p>
            <p className={styles.motivationDesc}>
              완료 시 다음 달 정기 용돈 협상에 유리해져요.
            </p>
          </div>
        </section>

        <div className={styles.cta}>
          <button
            type="button"
            className={styles.ctaButton}
            disabled={!name.trim()}
            onClick={handleSubmit}
          >
            <img src={sendIcon} width="15.833" height="13.333" alt="" />
            부모님께 미션 제안하기
          </button>
          <span className={styles.ctaNote}>
            제안하면 부모님에게 바로 알림이 가요
          </span>
        </div>
      </div>
    </PhoneShell>
  )
}
