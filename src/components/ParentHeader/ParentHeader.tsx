import chevronDown12 from '../../assets/icons/chevron-down-12.svg'
import parentProfileIcon from '../../assets/icons/parent-profile.svg'
import privacyEyeIcon from '../../assets/icons/privacy-eye.svg'
import logoMark from '../../assets/logo-mark.png'
import styles from './ParentHeader.module.css'

type ParentHeaderProps = {
  /** 우측 상단 자녀 선택 칩 */
  childName: string
  date: string
  /** 하단 프라이버시 안내 문구 */
  privacyNote: string
}

/** 자녀 AppHeader 와 같은 구성. 역할 배지와 보조 문구만 부모용으로 바뀐다. */
export function ParentHeader({
  childName,
  date,
  privacyNote,
}: ParentHeaderProps) {
  return (
    <header className={styles.header}>
      <div className={styles.mainRow}>
        <div className={styles.brand}>
          <div className={styles.mark}>
            <img className={styles.markImage} src={logoMark} alt="" />
          </div>

          <div>
            <div className={styles.titleRow}>
              <span className={styles.title}>첫단추</span>
              <span className={styles.roleChip}>부모</span>
            </div>
            <p className={styles.subtitle}>{date}</p>
          </div>
        </div>

        <div className={styles.actions}>
          <button type="button" className={styles.childPicker}>
            {childName}
            <img src={chevronDown12} width="12" height="12" alt="" />
          </button>
          <button type="button" className={styles.profile} aria-label="프로필">
            <img src={parentProfileIcon} width="16" height="16" alt="" />
          </button>
        </div>
      </div>

      <p className={styles.privacy}>
        <img src={privacyEyeIcon} width="12" height="12" alt="" />
        {privacyNote}
      </p>
    </header>
  )
}
