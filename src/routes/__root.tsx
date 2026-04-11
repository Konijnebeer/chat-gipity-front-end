import {
  HeadContent,
  Link,
  Outlet,
  createRootRoute,
  redirect,
  useLocation,
} from "@tanstack/react-router"
import { Fragment, useMemo } from "react"
import { TanStackRouterDevtoolsPanel } from "@tanstack/react-router-devtools"
import { TanStackDevtools } from "@tanstack/react-devtools"
import { AppSidebar } from "@/components/app-sidebar"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"

import "../styles.css"
import { Toaster } from "#/components/ui/sonner"
import { ThemeProvider } from "#/components/theme-provider"
import { ModeToggle } from "#/components/mode-toggle"
import {
  BreadcrumbProvider,
  useBreadcrumbContext,
} from "#/hooks/breadcrumb.context"
import { getAccessToken, setAccessToken } from "#/lib/tokens"

export const Route = createRootRoute({
  beforeLoad: async () => {
    console.log("Checking authentication...")
    if (!getAccessToken()) {
      console.log("No access token, attempting refresh...")
      try {
        const res = await fetch("/api/auth/refresh", {
          method: "POST",
          credentials: "include",
        })
        if (res.ok) {
          const { accessToken } = await res.json()
          setAccessToken(accessToken)
        }
        if (!res.ok) {
          throw new Error("Failed to refresh token")
        }
      } catch {
        console.log("Failed to refresh token, redirecting to login")
        // no valid refresh token, user needs to log in
        // check if not already on login page to avoid redirect loop
        if (window.location.pathname !== "/login" && window.location.pathname !== "/register") {
          throw redirect({ to: "/login", search: { from: window.location.pathname } })
        }
      }
    }
  },
  component: RootComponent,
})

type Crumb = {
  label: string
  isSegment?: boolean
  to?: string
}

function buildCrumbs(
  pathname: string,
  entity: { id: string; name: string } | null
) {
  const segments = pathname.split("/").filter(Boolean)
  const crumbs: Crumb[] = [{ label: "home", to: "/", isSegment: true }]
  let currentPath = ""

  segments.forEach((segment, index) => {
    currentPath += `/${segment}`
    const isEntityId = index === 1 && entity?.id === segment

    if (isEntityId) {
      crumbs.push({
        label: entity.name,
        to: currentPath,
      })
      return
    }

    crumbs.push({
      label: segment,
      to: currentPath,
      isSegment: true,
    })
  })

  return crumbs
}

function RootComponent() {
  return (
    <>
      <HeadContent />
      <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
        <BreadcrumbProvider>
          <RootLayout />
        </BreadcrumbProvider>
        <Toaster />
      </ThemeProvider>
      <TanStackDevtools
        config={{
          position: "bottom-right",
        }}
        plugins={[
          {
            name: "TanStack Router",
            render: <TanStackRouterDevtoolsPanel />,
          },
          // {
          //   ...formDevtoolsPlugin(),
          // },
        ]}
      />
    </>
  )
}

function RootLayout() {
  const location = useLocation()
  const { entity, headerRight } = useBreadcrumbContext()
  const crumbs = useMemo(
    () => buildCrumbs(location.pathname, entity),
    [entity, location.pathname]
  )

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 bg-sidebar transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
          <div className="flex w-full items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
            <Breadcrumb>
              <BreadcrumbList>
                {crumbs.map((crumb, index) => {
                  const isLast = index === crumbs.length - 1

                  return (
                    <Fragment key={`${crumb.label}-${index}`}>
                      <BreadcrumbItem>
                        {isLast ? (
                          <BreadcrumbPage
                            className={crumb.isSegment ? "capitalize" : undefined}
                          >
                            {crumb.label}
                          </BreadcrumbPage>
                        ) : (
                          <BreadcrumbLink
                            asChild
                            className={crumb.isSegment ? "capitalize" : undefined}
                          >
                            <Link to={crumb.to || "/"}>{crumb.label}</Link>
                          </BreadcrumbLink>
                        )}
                      </BreadcrumbItem>
                      {!isLast && <BreadcrumbSeparator />}
                    </Fragment>
                  )
                })}
              </BreadcrumbList>
            </Breadcrumb>
            <div className="ml-auto flex items-center gap-2">
              {headerRight?.node}
              <ModeToggle />
            </div>
          </div>
        </header>
        <Outlet />
      </SidebarInset>
    </SidebarProvider>
  )
}
