import type { User } from "./auth-context"

// Define permission types with more granular control
export type Permission =
  | "create:announcement"
  | "edit:announcement"
  | "delete:announcement"
  | "create:event"
  | "edit:event"
  | "delete:event"
  | "manage:users"
  | "view:analytics"
  | "upload:resources"
  | "delete:resources"
  | "send:notifications"
  | "edit:federation_officials" // New permission
  | "edit:barangay_officials" // New permission
  | "edit:sk_content" // New permission
  | "edit:own_barangay" // New permission for moderators
  | "manage:barangay_resources" // New permission for barangay resource management
  | "view:barangay_resources" // New permission for viewing barangay resources
  | "manage:legislative_documents" // New permission for managing legislative documents

// Role-based permissions mapping
const rolePermissions: Record<string, Permission[]> = {
  admin: [
    "create:announcement",
    "edit:announcement",
    "delete:announcement",
    "create:event",
    "edit:event",
    "delete:event",
    "manage:users",
    "view:analytics",
    "upload:resources",
    "delete:resources",
    "send:notifications",
    "edit:federation_officials",
    "edit:barangay_officials",
    "edit:sk_content",
    "manage:barangay_resources",
    "view:barangay_resources", // Add to admin
    "manage:legislative_documents", // Add to admin
  ],
  moderator: [
    "create:announcement",
    "edit:announcement",
    "create:event",
    "edit:event",
    "edit:own_barangay",
    "edit:sk_content",
    "manage:barangay_resources",
    "view:barangay_resources", // Add to moderator
  ],
  editor: [
    "create:announcement",
    "edit:announcement",
    "create:event",
    "edit:event",
    "upload:resources",
    "edit:sk_content",
    "view:barangay_resources", // Add to editor
  ],
  user: [
    "view:barangay_resources", // Add to regular users
  ],
}

/**
 * Check if a user has a specific permission
 */
export function hasPermission(user: User | null, permission: Permission): boolean {
  if (!user) return false

  const userRole = user.user_role
  const permissions = rolePermissions[userRole] || []

  return permissions.includes(permission)
}

/**
 * Check if a user has any of the specified permissions
 */
export function hasAnyPermission(user: User | null, permissions: Permission[]): boolean {
  if (!user) return false

  return permissions.some((permission) => hasPermission(user, permission))
}

/**
 * Check if a user has all of the specified permissions
 */
export function hasAllPermissions(user: User | null, permissions: Permission[]): boolean {
  if (!user) return false

  return permissions.every((permission) => hasPermission(user, permission))
}

/**
 * Check if a user can edit a specific barangay
 * Admins can edit any barangay, moderators can only edit their assigned barangay
 */
export function canEditBarangay(user: User | null, barangayName: string): boolean {
  if (!user) return false

  // Admins can edit any barangay
  if (user.user_role === "admin") return true

  // Moderators can only edit their assigned barangay
  if (user.user_role === "moderator" && hasPermission(user, "manage:barangay_resources")) {
    return user.barangay?.toLowerCase() === barangayName.toLowerCase()
  }

  return false
}
