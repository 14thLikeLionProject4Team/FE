import { Navigate, Route, Routes } from 'react-router-dom'
import { AccountSelect } from './routes/AccountSelect/AccountSelect'
import { AllowanceSettings } from './routes/AllowanceSettings/AllowanceSettings'
import { ChildCoach } from './routes/ChildCoach/ChildCoach'
import { ChildMissionPropose } from './routes/ChildMissionPropose/ChildMissionPropose'
import { ChildMissions } from './routes/ChildMissions/ChildMissions'
import { ParentMissionCreate } from './routes/ParentMissionCreate/ParentMissionCreate'
import { ParentMissions } from './routes/ParentMissions/ParentMissions'
import {
  ChildHomeRoute,
  ChildMyRoute,
  ParentHomeRoute,
  ParentMyRoute,
} from './routes/variants'

/**
 * 모든 화면 경로는 `:accountId` 를 가진다.
 * 파라미터가 없으면 하위 탭 이동이 `/child/undefined/...` 로 깨지기 때문.
 * 계정별 화면 분기는 routes/variants.tsx 에서 한다.
 */
function App() {
  return (
    <Routes>
      <Route path="/" element={<AccountSelect />} />

      {/* ── 자녀 ───────────────────────────────── */}
      <Route path="/child/:accountId" element={<ChildHomeRoute />} />
      <Route path="/child/:accountId/mission" element={<ChildMissions />} />
      <Route
        path="/child/:accountId/mission/propose"
        element={<ChildMissionPropose />}
      />
      <Route path="/child/:accountId/chat" element={<ChildCoach />} />
      <Route path="/child/:accountId/my" element={<ChildMyRoute />} />

      {/* ── 부모 ───────────────────────────────── */}
      <Route path="/parent/:accountId" element={<ParentHomeRoute />} />
      <Route path="/parent/:accountId/mission" element={<ParentMissions />} />
      <Route
        path="/parent/:accountId/mission/create"
        element={<ParentMissionCreate />}
      />
      <Route path="/parent/:accountId/my" element={<ParentMyRoute />} />
      <Route
        path="/parent/:accountId/allowance"
        element={<AllowanceSettings />}
      />

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default App
