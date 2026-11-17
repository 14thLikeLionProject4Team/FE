import type { Account } from '../../data/accounts'
import { Chip } from '../Chip/Chip'
import styles from './PersonCard.module.css'

type PersonCardProps = {
  account: Account
  onSelect: (account: Account) => void
}

export function PersonCard({ account, onSelect }: PersonCardProps) {
  return (
    <button
      type="button"
      className={styles.card}
      onClick={() => onSelect(account)}
    >
      <img className={styles.avatar} src={account.avatar} alt="" />

      <span className={styles.info}>
        <span className={styles.nameRow}>
          <span className={styles.name}>{account.name}</span>
          <Chip tone={account.role === 'parent' ? 'gray' : 'violet'} size="sm">
            {account.badge}
          </Chip>
        </span>

        <span className={styles.caption}>{account.caption}</span>

        <span className={styles.status}>
          <Chip
            tone={account.statusHighlighted ? 'solid' : 'gray'}
            size="status"
            dot
          >
            {account.status}
          </Chip>
        </span>
      </span>

      <span className={styles.arrow} aria-hidden="true">
        ›
      </span>
    </button>
  )
}
