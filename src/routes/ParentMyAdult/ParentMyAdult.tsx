import { useNavigate, useParams } from 'react-router-dom'
import pororoMom from '../../assets/avatars/pororo-mom.png'
import { BottomNav } from '../../components/BottomNav/BottomNav'
import type { NavTab } from '../../components/BottomNav/BottomNav'
import {
  ListCard,
} from '../../components/MyPage/MyPageParts'
import styles from '../../components/MyPage/MyPage.module.css'
import { PhoneShell } from '../../components/PhoneShell/PhoneShell'

const PARENT_TABS: NavTab[] = ['home', 'mission', 'my']

/** 화면 M4 — 부모 마이 (가족 B · 자녀 성년 전환 완료) */
export function ParentMyAdult() {
  const navigate = useNavigate()
  const { accountId } = useParams()

  const handleNavigate = (tab: NavTab) => {
    navigate(
      tab === 'home' ? `/parent/${accountId}` : `/parent/${accountId}/${tab}`,
    )
  }

  return (
    <PhoneShell
      footer={
        <BottomNav active="my" tabs={PARENT_TABS} onNavigate={handleNavigate} />
      }
    >
      <div className={styles.content}>
        <div className={styles.headerRow}>
          <h1 className={styles.headerTitle}>마이페이지</h1>
          <button type="button" className={styles.childChip}>
            뽀로로
          </button>
        </div>

        <section className={styles.card}>
          <div className={styles.profileRow}>
            <img className={styles.avatar} src={pororoMom} alt="" />
            <div>
              <p className={styles.profileName}>뽀로로 엄마</p>
              <p className={styles.profileMeta}>
                뽀로로 보호자 · 가족카드 본인회원
              </p>
            </div>
          </div>
        </section>

        {/* 성년 전환 카드 */}
        <section className={styles.transitionCard}>
          <span className={styles.transitionIcon}>19</span>
          <h2 className={styles.transitionTitle}>
            바다는 만 19세가 되어 기록이 본인에게 넘어갔어요
          </h2>
          <p className={styles.transitionDesc}>
            10월 3일 성년 전환 · 이제 첫단추 기록과 지난 브리핑은 바다만 볼 수
            있어요.
          </p>

          <div className={styles.counterBox}>
            <span className={styles.counterLabel}>함께한 결제일</span>
            <span className={styles.counterValue}>27번</span>
          </div>

          <button type="button" className={styles.disabledButton}>
            가족카드 이후 안내 보기
          </button>
        </section>

        <ListCard
          rows={[
            { label: '아이 추가' },
            { label: '알림 설정' },
            { label: '연결 계좌 · 개인정보' },
            { label: '고객센터 · 로그아웃', onClick: () => navigate('/') },
          ]}
        />
      </div>
    </PhoneShell>
  )
}
