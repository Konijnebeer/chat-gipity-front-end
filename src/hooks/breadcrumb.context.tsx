import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react"

type BreadcrumbEntityType = "agent" | "chat"

type BreadcrumbEntity = {
  type: BreadcrumbEntityType
  id: string
  name: string
}

type HeaderRightSlot = {
  key: string
  node: ReactNode
}

type BreadcrumbContextValue = {
  entity: BreadcrumbEntity | null
  headerRight: HeaderRightSlot | null
  setEntity: (entity: BreadcrumbEntity) => void
  clearEntity: (type?: BreadcrumbEntityType) => void
  setHeaderRight: (slot: HeaderRightSlot) => void
  clearHeaderRight: (key?: string) => void
}

const BreadcrumbContext = createContext<BreadcrumbContextValue | null>(null)

function BreadcrumbProvider({ children }: { children: React.ReactNode }) {
  const [entity, setEntityState] = useState<BreadcrumbEntity | null>(null)
  const [headerRight, setHeaderRightState] = useState<HeaderRightSlot | null>(
    null
  )

  const setEntity = useCallback((nextEntity: BreadcrumbEntity) => {
    setEntityState(nextEntity)
  }, [])

  const clearEntity = useCallback((type?: BreadcrumbEntityType) => {
    setEntityState((prev) => {
      if (!prev) {
        return prev
      }

      if (!type) {
        return null
      }

      return prev.type === type ? null : prev
    })
  }, [])

  const setHeaderRight = useCallback((slot: HeaderRightSlot) => {
    setHeaderRightState((prev) => {
      if (prev?.key === slot.key) {
        return prev
      }

      return slot
    })
  }, [])

  const clearHeaderRight = useCallback((key?: string) => {
    setHeaderRightState((prev) => {
      if (!prev) {
        return prev
      }

      if (!key) {
        return null
      }

      return prev.key === key ? null : prev
    })
  }, [])

  const value = useMemo<BreadcrumbContextValue>(
    () => ({
      entity,
      headerRight,
      setEntity,
      clearEntity,
      setHeaderRight,
      clearHeaderRight,
    }),
    [
      clearEntity,
      clearHeaderRight,
      entity,
      headerRight,
      setEntity,
      setHeaderRight,
    ]
  )

  return (
    <BreadcrumbContext.Provider value={value}>
      {children}
    </BreadcrumbContext.Provider>
  )
}

function useBreadcrumbContext() {
  const context = useContext(BreadcrumbContext)
  if (!context) {
    throw new Error(
      "useBreadcrumbContext must be used within BreadcrumbProvider"
    )
  }

  return context
}

export { BreadcrumbProvider, useBreadcrumbContext }
