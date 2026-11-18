import type { ReactNode } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { getAdultTransition, getParentMy } from '../../api/parent'
import { optional, useApi } from '../../api/useApi'
import pororoMom from '../../assets/avatars/pororo-mom.png'
import { AsyncState } from '../../components/AsyncState/AsyncState'
import { BottomNav } from '../../components/BottomNav/BottomNav'
import type { NavTab } from '../../components/BottomNav/BottomNav'
import { ListCard } from '../../components/MyPage/MyPageParts'
import styles from '../../components/MyPage/MyPage.module.css'
import { PhoneShell } from '../../components/PhoneShell/PhoneShell'
import { findAccount } from '../../data/accounts'
import { monthDay } from '../../utils/format'

const PARENT_TABS: NavTab[] = ['home', 'mission', 'my']

/** 화면 M4 — 부모 마이 (가족 B · 자녀 성년 전환 완료) */
export function ParentMyAdult() {
  const navigate = useNavigate()
  const { accountId } = useParams()

  const { data, loading, error, reload } = useApi(
    () =>
      Promise.all([getParentMy(), optional(getAdultTransition())]).then(([my, transition]) => ({
        my,
        transition,
      })),
    [accountId],
  )

  const handleNavigate = (tab: NavTab) => {
    navigate(tab === 'home' ? `/parent/${accountId}` : `/parent/${accountId}/${tab}`)
  }

  const shell = (children: ReactNode) => (
    <PhoneShell footer={<BottomNav active="my" tabs={PARENT_TABS} onNavigate={handleNavigate} />}>
      {children}
    </PhoneShell>
  )

  if (loading || error || !data)
    return shell(<AsyncState loading={loading} error={error} onRetry={reload} />)

  const { my, transition: t } = data
  const childName: string = my.children?.[0]?.name ?? ''

  return shell(
    <div className={styles.content}>
      <div className={styles.headerRow}>
        <h1 className={styles.headerTitle}>마이페이지</h1>
        <button type="button" className={styles.childChip}>
          {childName}
        </button>
      </div>

      <section className={styles.card}>
        <div className={styles.profileRow}>
          <img className={styles.avatar} src={findAccount(accountId)?.avatar ?? pororoMom} alt="" />
          <div>
            <p className={styles.profileName}>{my.name}</p>
            <p className={styles.profileMeta}>
              {my.relation}
              {my.cardHolder ? ' · 가족카드 본인회원' : ''}
            </p>
          </div>
        </div>
      </section>

      {/* 성년 전환 카드 */}
      {t?.transitioned && (
        <section className={styles.transitionCard}>
          <span className={styles.transitionIcon}>19</span>
          <h2 className={styles.transitionTitle}>
            {childName}는 만 19세가 되어 기록이 본인에게 넘어갔어요
          </h2>
          <p className={styles.transitionDesc}>
            {t.at ? `${monthDay(t.at)} 성년 전환 · ` : ''}이제 첫단추 기록과 지난 브리핑은{' '}
            {childName}만 볼 수 있어요.
          </p>

          <div className={styles.counterBox}>
            <span className={styles.counterLabel}>함께한 결제일</span>
            <span className={styles.counterValue}>{t.togetherCount ?? 0}번</span>
          </div>

          <button type="button" className={styles.disabledButton}>
            가족카드 이후 안내 보기
          </button>
        </section>
      )}

      <ListCard
        rows={[
          { label: '아이 추가' },
          { label: '알림 설정' },
          { label: '연결 계좌 · 개인정보' },
          { label: '고객센터 · 로그아웃', onClick: () => navigate('/') },
        ]}
      />
    </div>,
  )
}
