import { useNavigate, useParams } from 'react-router-dom'
import { PhoneShell } from '../../components/PhoneShell/PhoneShell'
import { families } from '../../data/accounts'
import styles from './Placeholder.module.css'

type PlaceholderProps = {
  /** 아직 구현 전인 화면 이름 */
  title: string
}

/** 계정 선택 이후 화면들이 붙기 전까지 쓰는 임시 화면 */
export function Placeholder({ title }: PlaceholderProps) {
  const navigate = useNavigate()
  const { accountId } = useParams()

  const account = families
    .flatMap((family) => family.members)
    .find((member) => member.id === accountId)

  return (
    <PhoneShell>
      <div className={styles.wrap}>
        <h1 className={styles.title}>{title}</h1>
        <p className={styles.desc}>
          {account ? `${account.name}(으)로 둘러보는 중` : '알 수 없는 계정'}
          <br />이 화면은 아직 구현 전이에요.
        </p>
        <button type="button" className={styles.back} onClick={() => navigate('/')}>
          계정 바꾸기
        </button>
      </div>
    </PhoneShell>
  )
}
