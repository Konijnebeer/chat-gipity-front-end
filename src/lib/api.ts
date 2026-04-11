import { getAccessToken, setAccessToken } from "./tokens"
import { redirect } from "@tanstack/react-router"

async function fetchWithAuth(input: RequestInfo, init?: RequestInit) {
  let response = await fetch(input, {
    ...init,
    credentials: "include", // sends the httpOnly cookie automatically
    headers: {
      ...init?.headers,
      Authorization: `Bearer ${getAccessToken()}`,
    },
  })

  // access token expired — try to refresh once
  if (response.status === 401) {
    const refreshed = await fetch("/api/auth/refresh", {
      method: "POST",
      credentials: "include", // sends the refresh cookie
    })

    if (refreshed.ok) {
      const { accessToken } = await refreshed.json()
      setAccessToken(accessToken) // store new token in memory

      // retry the original request with new token
      response = await fetch(input, {
        ...init,
        credentials: "include",
        headers: {
          ...init?.headers,
          Authorization: `Bearer ${accessToken}`,
        },
      })
    } else {
      // refresh token also expired — send to login
      setAccessToken(null)
      redirect({ to: "/login", search: `?from=${encodeURIComponent(window.location.pathname)}` })
    }
  }

  return response
}

export { fetchWithAuth }
