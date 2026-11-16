import { useNavigate, useParams } from 'react-router-dom'
import pororo from '../../assets/avatars/pororo.png'
import { BottomNav } from '../../components/BottomNav/BottomNav'
import type { NavTab } from '../../components/BottomNav/BottomNav'
import {
  Divider,
  ListCard,
  ProfileCard,
  Requirement,
  StatRow,
} from '../../components/MyPage/MyPageParts'
import styles from '../../components/MyPage/MyPage.module.css'
import { PhoneShell } from '../../components/PhoneShell/PhoneShell'

/** 11 / 12회 — 진행 막대 비율 */
const PROGRESS_RATIO = 292 / 318

/** 화면 M1 — 아이 마이 (가족 A · 만 18세 · 발급 전) */
export function ChildMy() {
  const navigate = useNavigate()
  const { accountId } = useParams()

  const handleNavigate = (tab: NavTab) => {
    navigate(tab === 'home' ? `/child/${accountId}` : `/child/${accountId}/${tab}`)
  }

  return (
    <PhoneShell
      footer={<BottomNav active="my" onNavigate={handleNavigate} />}
    >
      <div className={styles.content}>
        <h1 className={styles.pageTitle}>마이페이지</h1>

        <ProfileCard
          avatar={pororo}
          name="뽀로로"
          meta="2007년 11월생 · 만 18세"
          chip="가족카드 연결됨"
        />

        {/* 확인서 — 발급 전 */}
        <section className={styles.card}>
          <div className={styles.cardTitleRow}>
            <h2 className={styles.cardTitle}>금융행동 기록 확인서</h2>
            <span className={styles.grayChip}>발급 전</span>
          </div>

          <p className={styles.cardNote}>
            만 19세가 되고 검증된 결제일 정산이 12번 쌓이면, 직접 발급해서 카드
            심사에 낼 수 있어요.
          </p>

          <Requirement
            done={false}
            title="만 19세"
            note="11월 2일 생일"
            value="D-14"
          />
          <Requirement
            done={false}
            title="검증된 결제일 정산 12회"
            note="이번 결제일(10월 25일)에 12회가 돼요"
            value="11 / 12"
          />

          <div className={styles.progressTrack}>
            <div
              className={styles.progressFill}
              style={{ width: `${PROGRESS_RATIO * 100}%` }}
            />
          </div>

          <button type="button" className={styles.disabledButton} disabled>
            11월 2일부터 발급할 수 있어요
          </button>

          <button type="button" className={styles.link}>
            {'확인서 미리보기  ›'}
          </button>
        </section>

        {/* 확인서에 들어갈 기록 */}
        <section className={styles.card}>
          <h2 className={styles.cardTitle}>확인서에 들어갈 내 기록</h2>
          <p className={styles.cardHint}>점수 없이 이 숫자만 그대로 들어가요</p>

          <StatRow label="결제일 완납" value="10 / 11개월" />
          <Divider />
          <StatRow label="최장 연속 완납" value="6개월" accent />
          <Divider />
          <StatRow label="결제일 여유율" value="평균 7%" />
          <Divider />
          <StatRow label="부족분 스스로 해소" value="0 / 1건" />
        </section>

        <ListCard
          rows={[
            { label: '부모님이 보는 범위', value: '총액만 · 부모님이 정해요' },
            { label: '연결된 계좌' },
            { label: '알림 설정' },
            { label: '대화 기록 지우기' },
            { label: '개인정보 처리 안내' },
            { label: '계정변경', onClick: () => navigate('/') },
          ]}
        />
      </div>
    </PhoneShell>
  )
}
