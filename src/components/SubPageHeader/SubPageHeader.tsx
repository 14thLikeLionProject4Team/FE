import { useNavigate } from 'react-router-dom'
import backArrow from '../../assets/icons/back-arrow.svg'
import styles from './SubPageHeader.module.css'

type SubPageHeaderProps = {
  title: string
  /** 우측 배지 — 예: "하늘에게" */
  trailing?: string
  onBack?: () => void
}

/** 서브 화면(미션 제안하기 · 미션 만들기 등)의 뒤로가기 + 제목 바 */
export function SubPageHeader({ title, trailing, onBack }: SubPageHeaderProps) {
  const navigate = useNavigate()

  return (
    <header className={styles.header}>
      <div className={styles.left}>
        <button
          type="button"
          className={styles.back}
          aria-label="뒤로"
          onClick={onBack ?? (() => navigate(-1))}
        >
          <img src={backArrow} width="16" height="16" alt="" />
        </button>
        <h1 className={styles.title}>{title}</h1>
      </div>
      {trailing && <span className={styles.trailing}>{trailing}</span>}
    </header>
  )
}
