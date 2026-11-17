import bellIcon from '../../assets/icons/bell.svg'
import profileIcon from '../../assets/icons/profile.svg'
import logoMark from '../../assets/logo-mark.png'
import styles from './AppHeader.module.css'

type AppHeaderProps = {
  /** 로고 옆 역할 배지 — 자녀 · 부모 */
  role: string
  /** 역할 아래 보조 문구 — 예: "하늘의 지갑" */
  subtitle: string
  onNotifications?: () => void
  onProfile?: () => void
}

export function AppHeader({
  role,
  subtitle,
  onNotifications,
  onProfile,
}: AppHeaderProps) {
  return (
    <header className={styles.header}>
      <div className={styles.brand}>
        <div className={styles.mark}>
          <img className={styles.markImage} src={logoMark} alt="" />
        </div>

        <div>
          <div className={styles.titleRow}>
            <span className={styles.title}>첫단추</span>
            <span className={styles.roleChip}>{role}</span>
          </div>
          <p className={styles.subtitle}>{subtitle}</p>
        </div>
      </div>

      <div className={styles.actions}>
        <button
          type="button"
          className={styles.bell}
          aria-label="알림"
          onClick={onNotifications}
        >
          <img src={bellIcon} width="16" height="20" alt="" />
        </button>
        <button
          type="button"
          className={styles.profile}
          aria-label="프로필"
          onClick={onProfile}
        >
          <img src={profileIcon} width="13.333" height="13.333" alt="" />
        </button>
      </div>
    </header>
  )
}
