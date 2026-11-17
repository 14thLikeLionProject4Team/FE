import navHomeActive from '../../assets/icons/nav-home-active.svg'
import navHomeIdle from '../../assets/icons/nav-home-idle.svg'
import navCheckActive from '../../assets/icons/nav-check-active.svg'
import navCheckIdle from '../../assets/icons/nav-check-idle.svg'
import navChatIdle from '../../assets/icons/nav-chat-idle.svg'
import navPersonActive from '../../assets/icons/nav-person-active.svg'
import navPersonIdle from '../../assets/icons/nav-person-idle.svg'
import styles from './BottomNav.module.css'

export type NavTab = 'home' | 'mission' | 'chat' | 'my'

/**
 * Figma에서 받은 아이콘은 활성/비활성 색이 파일에 박혀 있어 상태별로 따로 받는다.
 * 아직 받지 못한 상태는 가진 쪽으로 대체하고,
 * 해당 탭이 활성인 화면을 구현할 때 그 화면에서 내려받아 채운다.
 */
const ICONS: Record<NavTab, { idle: string; active: string }> = {
  home: { idle: navHomeIdle, active: navHomeActive },
  mission: { idle: navCheckIdle, active: navCheckActive },
  chat: { idle: navChatIdle, active: navChatIdle },
  my: { idle: navPersonIdle, active: navPersonActive },
}

const LABELS: Record<NavTab, string> = {
  home: '홈',
  mission: '미션',
  chat: '대화',
  my: '마이',
}

type BottomNavProps = {
  active: NavTab
  /** 자녀는 4탭, 부모는 대화 없이 3탭 */
  tabs?: NavTab[]
  onNavigate?: (tab: NavTab) => void
}

export function BottomNav({
  active,
  tabs = ['home', 'mission', 'chat', 'my'],
  onNavigate,
}: BottomNavProps) {
  return (
    <div className={styles.wrap}>
      <nav className={styles.nav}>
        {tabs.map((tab) => {
          const isActive = tab === active
          return (
            <button
              key={tab}
              type="button"
              className={`${styles.tab} ${isActive ? styles.active : ''}`}
              aria-current={isActive ? 'page' : undefined}
              onClick={() => onNavigate?.(tab)}
            >
              <img
                className={styles.icon}
                src={isActive ? ICONS[tab].active : ICONS[tab].idle}
                width="20"
                height="20"
                alt=""
              />
              {LABELS[tab]}
            </button>
          )
        })}
      </nav>
    </div>
  )
}
