import { Fragment } from 'react'
import dotViolet from '../../assets/dot-violet.svg'
import styles from './MyPage.module.css'

/** 프로필 카드 — 아바타 + 이름 + 상태 칩 */
export function ProfileCard({
  avatar,
  name,
  meta,
  chip,
}: {
  avatar: string
  name: string
  meta?: string
  chip?: string
}) {
  return (
    <section className={styles.card}>
      <div className={styles.profileRow}>
        <img className={styles.avatar} src={avatar} alt="" />
        <div>
          <p className={styles.profileName}>{name}</p>
          {meta && <p className={styles.profileMeta}>{meta}</p>}
        </div>
      </div>
      {chip && (
        <div className={styles.chipRow}>
          <span className={styles.statusChip}>
            <img src={dotViolet} width="6" height="6" alt="" />
            {chip}
          </span>
        </div>
      )}
    </section>
  )
}

/** 라벨 · 값 한 줄 (구분선은 호출부에서 사이에 넣는다) */
export function StatRow({
  label,
  value,
  accent = false,
}: {
  label: string
  value: string
  accent?: boolean
}) {
  return (
    <div className={styles.statRow}>
      <span className={styles.statLabel}>{label}</span>
      <span className={accent ? styles.statValueAccent : styles.statValue}>
        {value}
      </span>
    </div>
  )
}

export function Divider() {
  return <div className={styles.divider} />
}

export type ListRowItem = {
  label: string
  value?: string
  onClick?: () => void
}

/** 설정 메뉴 묶음 — 행 사이에 구분선을 자동으로 넣는다 */
export function ListCard({ rows }: { rows: ListRowItem[] }) {
  return (
    <section className={styles.listCard}>
      {rows.map((row, index) => (
        <Fragment key={row.label}>
          {index > 0 && <Divider />}
          <button
            type="button"
            className={styles.listRow}
            onClick={row.onClick}
          >
            <span className={styles.listLabel}>{row.label}</span>
            {row.value && (
              <span className={styles.listValue}>{row.value}</span>
            )}
            <span className={styles.listArrow} aria-hidden="true">
              ›
            </span>
          </button>
        </Fragment>
      ))}
    </section>
  )
}

/** 부모 마이의 설정 행 — 라벨 왼쪽, 값 오른쪽 정렬 */
export function SettingRow({
  label,
  value,
  muted = false,
  onClick,
}: {
  label: string
  value?: string
  /** 변경 불가 항목(카드 한도 등)은 회색 + 화살표 없음 */
  muted?: boolean
  onClick?: () => void
}) {
  const body = (
    <>
      <span className={styles.settingLabel}>{label}</span>
      {value && <span className={styles.settingValue}>{value}</span>}
      {!muted && (
        <span className={styles.listArrow} aria-hidden="true">
          ›
        </span>
      )}
    </>
  )

  if (muted) {
    return <div className={styles.settingRowMuted}>{body}</div>
  }

  return (
    <button type="button" className={styles.settingRow} onClick={onClick}>
      {body}
    </button>
  )
}

/** 약속 기록 타임라인 한 줄 */
export function TimelineItem({
  dot,
  date,
  title,
  note,
}: {
  dot: string
  date: string
  title: string
  note: string
}) {
  return (
    <div className={styles.timelineItem}>
      <img className={styles.timelineDot} src={dot} width="8" height="13" alt="" />
      <div>
        <p className={styles.timelineDate}>{date}</p>
        <p className={styles.timelineTitle}>{title}</p>
        <p className={styles.timelineNote}>{note}</p>
      </div>
    </div>
  )
}

/** 확인서 발급 요건 한 줄 */
export function Requirement({
  done,
  title,
  note,
  value,
}: {
  done: boolean
  title: string
  note: string
  value: string
}) {
  return (
    <div className={styles.requirement}>
      <span className={done ? styles.checkCircleDone : styles.checkCircle}>
        {done ? '✓' : ''}
      </span>
      <span className={styles.requirementBody}>
        <span className={styles.requirementTitle}>{title}</span>
        <span className={styles.requirementNote}>{note}</span>
      </span>
      <span className={styles.requirementValue}>{value}</span>
    </div>
  )
}
