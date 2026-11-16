import dotWhite from '../../assets/dot-white.svg'
import dotViolet from '../../assets/dot-violet.svg'
import styles from './Chip.module.css'

type ChipTone = 'white' | 'violet' | 'gray' | 'solid'
type ChipSize = 'sm' | 'md' | 'status'

type ChipProps = {
  tone?: ChipTone
  size?: ChipSize
  /** 앞에 붙는 점. 보라 배경에는 흰 점, 회색 배경에는 보라 점 */
  dot?: boolean
  children: React.ReactNode
}

export function Chip({
  tone = 'violet',
  size = 'md',
  dot = false,
  children,
}: ChipProps) {
  return (
    <span className={`${styles.chip} ${styles[size]} ${styles[tone]}`}>
      {dot && (
        <img
          className={styles.dot}
          src={tone === 'solid' ? dotWhite : dotViolet}
          width="6"
          height="6"
          alt=""
        />
      )}
      {children}
    </span>
  )
}
