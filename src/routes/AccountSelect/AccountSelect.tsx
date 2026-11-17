import { useNavigate } from 'react-router-dom'
import logo from '../../assets/logo.png'
import { Chip } from '../../components/Chip/Chip'
import { PersonCard } from '../../components/PersonCard/PersonCard'
import { PhoneShell } from '../../components/PhoneShell/PhoneShell'
import { DEMO_DATE_LABEL, families } from '../../data/accounts'
import type { Account } from '../../data/accounts'
import styles from './AccountSelect.module.css'

export function AccountSelect() {
  const navigate = useNavigate()

  const handleSelect = (account: Account) => {
    navigate(`/${account.role}/${account.id}`)
  }

  return (
    <PhoneShell>
      <div className={styles.content}>
        <section className={styles.brand}>
          <img className={styles.logo} src={logo} alt="" />

          <div className={styles.titleBlock}>
            <p className={styles.eyebrow}>결제일을 지키며 준비하는 첫 신용</p>
            <h1 className={styles.title}>첫단추</h1>
            <p className={styles.subtitle}>누구로 둘러볼까요?</p>
          </div>

          <div className={styles.demoChips}>
            <Chip tone="white">시연용 데이터</Chip>
            <Chip tone="white">실제 이체 없음</Chip>
          </div>
        </section>

        {families.map((family) => (
          <section key={family.id} className={styles.family}>
            <div className={styles.familyTitle}>
              <h2 className={styles.familyName}>{family.title}</h2>
              <Chip tone="violet">{family.note}</Chip>
            </div>

            {family.members.map((member) => (
              <PersonCard
                key={member.id}
                account={member}
                onSelect={handleSelect}
              />
            ))}
          </section>
        ))}

        <footer className={styles.footer}>
          <div className={styles.demoDate}>
            <span className={styles.calendarIcon} aria-hidden="true" />
            <span>{DEMO_DATE_LABEL}</span>
          </div>
          <p className={styles.hint}>
            다른 사람으로 바꾸려면 마이 맨 아래 "계정 바꾸기"
          </p>
        </footer>
      </div>
    </PhoneShell>
  )
}
