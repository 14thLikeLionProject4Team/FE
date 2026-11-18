import { useParams } from 'react-router-dom'
import { AdultMy } from './AdultMy/AdultMy'
import { ChildHome } from './ChildHome/ChildHome'
import { ChildHomeRelaxed } from './ChildHomeRelaxed/ChildHomeRelaxed'
import { ChildMy } from './ChildMy/ChildMy'
import { ParentHome } from './ParentHome/ParentHome'
import { ParentHomeRelaxed } from './ParentHomeRelaxed/ParentHomeRelaxed'
import { ParentMy } from './ParentMy/ParentMy'
import { ParentMyAdult } from './ParentMyAdult/ParentMyAdult'

/**
 * 같은 경로라도 계정에 따라 다른 화면이 걸린다.
 * 라우트를 `:accountId` 파라미터로 유지해야 하위 탭 이동이 동작하므로,
 * 분기는 경로가 아니라 여기서 한다.
 */
const ADULT_CHILD = '4' // 뽀로로 (만 19세)
const ADULT_PARENT = '3' // 뽀로로 엄마

export function ChildHomeRoute() {
  const { accountId } = useParams()
  return accountId === ADULT_CHILD ? <ChildHomeRelaxed /> : <ChildHome />
}

export function ChildMyRoute() {
  const { accountId } = useParams()
  return accountId === ADULT_CHILD ? <AdultMy /> : <ChildMy />
}

export function ParentHomeRoute() {
  const { accountId } = useParams()
  return accountId === ADULT_PARENT ? <ParentHomeRelaxed /> : <ParentHome />
}

export function ParentMyRoute() {
  const { accountId } = useParams()
  return accountId === ADULT_PARENT ? <ParentMyAdult /> : <ParentMy />
}
