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

/** 화면 M2 — 본인 마이 (가족 B · 만 19세 · 발급 가능) */
export function AdultMy() {
  const navigate = useNavigate()
  const { accountId } = useParams()

  const handleNavigate = (tab: NavTab) => {
    navigate(tab === 'home' ? `/child/${accountId}` : `/child/${accountId}/${tab}`)
  }

  return (
    <PhoneShell footer={<BottomNav active="my" onNavigate={handleNavigate} />}>
      <div className={styles.content}>
        <h1 className={styles.pageTitle}>마이페이지</h1>

        <div className={styles.banner}>
          <span className={styles.bannerIcon}>19</span>
          <p className={styles.bannerText}>
            만 19세가 되었어요. 이제 내 기록은 나만 볼 수 있어요.
          </p>
        </div>

        <ProfileCard
          avatar={pororo}
          name="뽀로로"
          meta="2007년 10월생 · 만 19세"
          chip="가족카드 연결됨"
        />

        {/* 확인서 — 발급 가능 */}
        <section className={styles.card}>
          <div className={styles.cardTitleRow}>
            <h2 className={styles.cardTitle}>금융행동 기록 확인서</h2>
            <span className={styles.solidChip}>발급 가능</span>
          </div>

          <Requirement
            done
            title="만 19세"
            note="10월 3일에 됐어요"
            value="완료"
          />
          <Requirement
            done
            title="검증된 결제일 정산 12회"
            note="27회 쌓였어요"
            value="완료"
          />

          <button type="button" className={styles.primaryButton}>
            확인서 발급하기
          </button>

          <p className={styles.cardHint}>
            본인 인증 후 바로 발급돼요. 90일 동안 유효하고, 카드 심사에 낼지는
            내가 정해요.
          </p>

          <button type="button" className={styles.link}>
            {'확인서 미리보기  ›'}
          </button>
        </section>

        {/* 확인서에 들어갈 기록 */}
        <section className={styles.card}>
          <div className={styles.cardTitleRow}>
            <h2 className={styles.cardTitle}>확인서에 들어갈 내 기록</h2>
            <span className={styles.cardMetaRight}>2024.7 ~ 2026.9</span>
          </div>
          <p className={styles.cardHint}>점수 없이 이 숫자만 그대로 들어가요</p>

          <StatRow label="결제일 완납" value="24 / 27개월" />
          <Divider />
          <StatRow label="최장 연속 완납" value="15개월" accent />
          <Divider />
          <StatRow label="결제일 여유율" value="평균 15%" />
          <Divider />
          <StatRow label="부족분 스스로 해소" value="3 / 3건" accent />
        </section>

        <ListCard
          rows={[
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
