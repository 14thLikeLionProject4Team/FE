import { useEffect } from 'react'
import { useDemo } from '../../store/useDemo'
import styles from './Toast.module.css'

/** 액션 결과를 잠깐 띄운다. PhoneShell 안에 절대 배치되어 폰 밖으로 나가지 않는다. */
export function Toast() {
  const { toast, clearToast } = useDemo()

  useEffect(() => {
    if (!toast) return
    const timer = window.setTimeout(clearToast, 1800)
    return () => window.clearTimeout(timer)
  }, [toast, clearToast])

  if (!toast) return null
  return <div className={styles.toast}>{toast}</div>
}
