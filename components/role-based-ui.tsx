"use client"

import type { ReactNode } from "react"
import { useAuth } from "@/lib/auth-context"
import { hasPermission, type Permission } from "@/lib/role-based-access"

interface PermissionGuardProps {
  permission: Permission
  children: ReactNode
  fallback?: ReactNode
}

/**
 * Renders content only if the current user has the specified permission
 */
export function PermissionGuard({ permission, children, fallback = null }: PermissionGuardProps) {
  const { user } = useAuth()

  if (hasPermission(user, permission)) {
    return <>{children}</>
  }

  return <>{fallback}</>
}

interface AdminOnlyProps {
  children: ReactNode
  fallback?: ReactNode
}

/**
 * Renders content only if the current user is an admin
 */
export function AdminOnly({ children, fallback = null }: AdminOnlyProps) {
  const { user } = useAuth()

  if (user?.user_role === "admin") {
    return <>{children}</>
  }

  return <>{fallback}</>
}

interface ModeratorGuardProps {
  barangayName: string
  children: ReactNode
  fallback?: ReactNode
}

export function ModeratorGuard({ barangayName, children, fallback = null }: ModeratorGuardProps) {
  const { user } = useAuth()

  // Allow admins to access everything
  if (user?.user_role === "admin") {
    return <>{children}</>
  }

  // Allow moderators to access their assigned barangay
  if (user?.user_role === "moderator" && user.barangay?.toLowerCase() === barangayName.toLowerCase()) {
    return <>{children}</>
  }

  return <>{fallback}</>
}
