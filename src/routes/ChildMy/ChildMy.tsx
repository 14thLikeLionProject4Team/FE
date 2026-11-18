import { useNavigate, useParams } from 'react-router-dom'
import loopy from '../../assets/avatars/loopy.png'
import { AsyncState } from '../../components/AsyncState/AsyncState'
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
import { toMyView, useChildMyData } from '../../components/MyPage/useChildMyData'
import { PhoneShell } from '../../components/PhoneShell/PhoneShell'
import { findAccount } from '../../data/accounts'

/** 화면 M1 — 아이 마이 (가족 A · 만 18세 · 발급 전) */
export function ChildMy() {
  const navigate = useNavigate()
  const { accountId } = useParams()
  const { data, loading, error, reload, issue, openPdf, busy } = useChildMyData(accountId)

  const handleNavigate = (tab: NavTab) => {
    navigate(tab === 'home' ? `/child/${accountId}` : `/child/${accountId}/${tab}`)
  }

  const footer = <BottomNav active="my" onNavigate={handleNavigate} />

  if (loading || error || !data)
    return (
      <PhoneShell footer={footer}>
        <AsyncState loading={loading} error={error} onRetry={reload} />
      </PhoneShell>
    )

  const v = toMyView(data)

  return (
    <PhoneShell footer={footer}>
      <div className={styles.content}>
        <h1 className={styles.pageTitle}>마이페이지</h1>

        <ProfileCard
          avatar={findAccount(accountId)?.avatar ?? loopy}
          name={v.name}
          meta={v.meta}
          chip={v.cardChip}
        />

        {/* 확인서 */}
        <section className={styles.card}>
          <div className={styles.cardTitleRow}>
            <h2 className={styles.cardTitle}>금융행동 기록 확인서</h2>
            <span className={v.canIssue ? styles.solidChip : styles.grayChip}>
              {v.issued ? '발급 완료' : v.canIssue ? '발급 가능' : '발급 전'}
            </span>
          </div>

          <p className={styles.cardNote}>
            만 19세가 되고 검증된 결제일 정산이 12번 쌓이면, 직접 발급해서 카드
            심사에 낼 수 있어요.
          </p>

          <Requirement
            done={v.age.done}
            title="만 19세"
            note={v.age.note}
            value={v.age.value}
          />
          <Requirement
            done={v.settlement.done}
            title="검증된 결제일 정산 12회"
            note={v.settlement.note}
            value={v.settlement.value}
          />

          <div className={styles.progressTrack}>
            <div
              className={styles.progressFill}
              style={{ width: `${v.settlement.ratio * 100}%` }}
            />
          </div>

          {v.issued && v.certificateId ? (
            <button
              type="button"
              className={styles.primaryButton}
              onClick={() => openPdf(v.certificateId as number)}
            >
              확인서 보기 (PDF)
            </button>
          ) : v.canIssue ? (
            <button type="button" className={styles.primaryButton} disabled={busy} onClick={issue}>
              {busy ? '발급하는 중...' : '확인서 발급하기'}
            </button>
          ) : (
            <button type="button" className={styles.disabledButton} disabled>
              {v.availableFrom || '아직 발급할 수 없어요'}
            </button>
          )}

          {v.issued ? (
            <p className={styles.cardHint}>{v.issuedInfo}</p>
          ) : (
            <button
              type="button"
              className={styles.link}
              onClick={() =>
                document.getElementById('certificate-records')?.scrollIntoView({ behavior: 'smooth' })
              }
            >
              {'확인서 미리보기  ›'}
            </button>
          )}
        </section>

        {/* 확인서에 들어갈 기록 */}
        <section id="certificate-records" className={styles.card}>
          <h2 className={styles.cardTitle}>확인서에 들어갈 내 기록</h2>
          <p className={styles.cardHint}>점수 없이 이 숫자만 그대로 들어가요</p>

          <StatRow label="결제일 완납" value={v.stats.fullPaid} />
          <Divider />
          <StatRow label="최장 연속 완납" value={v.stats.maxStreak} accent />
          <Divider />
          <StatRow label="결제일 여유율" value={v.stats.margin} />
          <Divider />
          <StatRow
            label="부족분 스스로 해소"
            value={v.stats.selfResolved}
            accent={v.stats.allResolved}
          />
        </section>

        <ListCard
          rows={[
            { label: '부모님이 보는 범위', value: v.visibility },
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
