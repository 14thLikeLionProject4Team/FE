import { useMemo, useState } from 'react'
import type { ReactNode } from 'react'
import { DemoContext } from './demoContext'

export function DemoProvider({ children }: { children: ReactNode }) {
  const [toast, setToast] = useState<string | null>(null)

  const value = useMemo(
    () => ({
      toast,
      showToast: (message: string) => setToast(message),
      clearToast: () => setToast(null),
    }),
    [toast],
  )

  return <DemoContext.Provider value={value}>{children}</DemoContext.Provider>
}
