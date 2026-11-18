import { useNavigate } from 'react-router-dom'
import { setPersonaId } from '../../api/client'
import { getPersonas } from '../../api/common'
import { optional, useApi } from '../../api/useApi'
import logo from '../../assets/logo.png'
import { Chip } from '../../components/Chip/Chip'
import { PersonCard } from '../../components/PersonCard/PersonCard'
import { PhoneShell } from '../../components/PhoneShell/PhoneShell'
import { DEMO_DATE_LABEL, families } from '../../data/accounts'
import { monthDayW } from '../../utils/format'
import type { Account } from '../../data/accounts'
import styles from './AccountSelect.module.css'

export function AccountSelect() {
  const navigate = useNavigate()

  // 이름·상태 칩·가족 설명은 백엔드(/personas) 값을 쓰고,
  // 사진·생일 설명처럼 백엔드에 없는 건 data/accounts.ts 값을 써요.
  const { data } = useApi(() => optional(getPersonas()), [])
  type ApiMember = { memberId: number; name: string; statusChip: string }
  type ApiFamily = { familyId: number; name: string; description: string; members: ApiMember[] }
  const apiFamilies: ApiFamily[] = data?.families ?? []
  const apiMember = (id: string) =>
    apiFamilies.flatMap((f) => f.members).find((m) => String(m.memberId) === id)
  const apiFamily = (memberIds: string[]) =>
    apiFamilies.find((f) => f.members.some((m) => memberIds.includes(String(m.memberId))))
  const demoDateLabel = data?.demoDate
    ? `오늘은 ${data.demoDate.slice(0, 4)}년 ${monthDayW(data.demoDate)}로 보여요`
    : DEMO_DATE_LABEL

  const handleSelect = (account: Account) => {
    setPersonaId(account.id) // 이후 API 요청에 X-Persona-Id 로 붙어요
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

        {families.map((family) => {
          const remote = apiFamily(family.members.map((m) => m.id))
          return (
            <section key={family.id} className={styles.family}>
              <div className={styles.familyTitle}>
                <h2 className={styles.familyName}>{remote?.name ?? family.title}</h2>
                <Chip tone="violet">{remote?.description ?? family.note}</Chip>
              </div>

              {family.members.map((member) => {
                const m = apiMember(member.id)
                return (
                  <PersonCard
                    key={member.id}
                    account={m ? { ...member, name: m.name, status: m.statusChip } : member}
                    onSelect={handleSelect}
                  />
                )
              })}
            </section>
          )
        })}

        <footer className={styles.footer}>
          <div className={styles.demoDate}>
            <span className={styles.calendarIcon} aria-hidden="true" />
            <span>{demoDateLabel}</span>
          </div>
          <p className={styles.hint}>
            다른 사람으로 바꾸려면 마이 맨 아래 "계정 바꾸기"
          </p>
        </footer>
      </div>
    </PhoneShell>
  )
}
