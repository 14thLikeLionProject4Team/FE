import type { ReactNode } from 'react'
import { Toast } from '../Toast/Toast'
import styles from './PhoneShell.module.css'

type PhoneShellProps = {
  /** 본문 위에 고정되는 상단 바 */
  header?: ReactNode
  /** 본문 아래에 고정되는 탭바 · 액션 버튼 */
  footer?: ReactNode
  children: ReactNode
}

/**
 * 모든 화면이 공유하는 고정 크기 셸(390×844).
 * header/footer 는 스크롤과 무관하게 고정되고, 넘치는 본문만 세로로 스크롤된다.
 */
export function PhoneShell({ header, footer, children }: PhoneShellProps) {
  return (
    <div className={styles.stage}>
      <div className={styles.phone}>
        {header}
        <div className={styles.body}>{children}</div>
        {footer}
        <Toast />
      </div>
    </div>
  )
}
