import { useNavigate, useParams } from 'react-router-dom'
import pororoMom from '../../assets/avatars/pororo-mom.png'
import dotViolet from '../../assets/dot-violet.svg'
import timelineDot from '../../assets/icons/timeline-dot.svg'
import timelineDotActive from '../../assets/icons/timeline-dot-active.svg'
import { BottomNav } from '../../components/BottomNav/BottomNav'
import type { NavTab } from '../../components/BottomNav/BottomNav'
import {
  Divider,
  ListCard,
  SettingRow,
  TimelineItem,
} from '../../components/MyPage/MyPageParts'
import styles from '../../components/MyPage/MyPage.module.css'
import { PhoneShell } from '../../components/PhoneShell/PhoneShell'

const PARENT_TABS: NavTab[] = ['home', 'mission', 'my']

/** 화면 M3 — 부모 마이 (가족 A) */
export function ParentMy() {
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

        {/* 프로필 */}
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

        {/* 하늘이와의 약속 */}
        <section className={styles.card}>
          <div className={styles.cardTitleRow}>
            <h2 className={styles.cardTitle}>하늘이와의 약속</h2>
            <span className={styles.statusChip}>
              <img src={dotViolet} width="6" height="6" alt="" />
              6개월 연속 완납
            </span>
          </div>

          <SettingRow
            label="월 용돈"
            value="70,000원 · 11월부터 73,000원"
            onClick={() => navigate(`/parent/${accountId}/allowance`)}
          />
          <Divider />
          <SettingRow label="용돈 보내는 날" value="매월 1일 · 자동이체" />
          <Divider />
          <SettingRow label="결제일" value="매월 25일" />
          <Divider />
          <SettingRow label="보는 범위" value="총액만" />
          <Divider />
          <SettingRow
            label="미션 상한"
            value="한 달 21,000원 (용돈의 30%)"
          />
          <Divider />
          <SettingRow
            label="카드 한도"
            value="월 10만 원 · 카드사에서 변경"
            muted
          />
        </section>

        {/* 약속 기록 */}
        <section className={styles.card}>
          <div className={styles.cardTitleRow}>
            <h2 className={styles.cardTitle}>약속 기록</h2>
            <button type="button" className={styles.link}>
              전체 보기 ›
            </button>
          </div>

          <TimelineItem
            dot={timelineDotActive}
            date="10월 1일"
            title="용돈 70,000 → 73,000원"
            note="물가 · AI 제안 적용 · 11월부터"
          />
          <TimelineItem
            dot={timelineDot}
            date="3월 1일"
            title="용돈 60,000 → 70,000원"
            note="대학 입학"
          />
        </section>

        <ListCard
          rows={[
            { label: '지난 브리핑', value: '9월까지 11개' },
            { label: '알림 설정', value: '부족 예상 알림 꺼짐' },
            { label: '연결 계좌 · 공동 보호자' },
            { label: '개인정보 · 동의 관리' },
            { label: '고객센터 · 로그아웃', onClick: () => navigate('/') },
          ]}
        />
      </div>
    </PhoneShell>
  )
}
