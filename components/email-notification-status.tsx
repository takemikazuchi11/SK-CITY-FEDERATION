"use client"

import { CheckCircle, AlertCircle, Mail, User } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

interface EmailNotificationStatusProps {
  status: "idle" | "sending" | "success" | "error"
  recipients?: string[]
  failed?: string[]
  message?: string
  onDismiss?: () => void
}

export function EmailNotificationStatus({
  status,
  recipients = [],
  failed = [],
  message,
  onDismiss,
}: EmailNotificationStatusProps) {
  if (status === "idle") return null

  return (
    <div
      className={cn(
        "mt-4 rounded-lg border p-4 transition-all duration-300",
        status === "sending" && "bg-muted border-muted-foreground/20",
        status === "success" && "bg-green-50 border-green-200 dark:bg-green-950/20 dark:border-green-900",
        status === "error" && "bg-red-50 border-red-200 dark:bg-red-950/20 dark:border-red-900",
      )}
    >
      <div className="flex items-start gap-3">
        <div
          className={cn(
            "mt-0.5 flex h-8 w-8 items-center justify-center rounded-full",
            status === "sending" && "bg-muted-foreground/20",
            status === "success" && "bg-green-100 dark:bg-green-900/30",
            status === "error" && "bg-red-100 dark:bg-red-900/30",
          )}
        >
          {status === "sending" && <Mail className="h-4 w-4 text-muted-foreground animate-pulse" />}
          {status === "success" && <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400" />}
          {status === "error" && <AlertCircle className="h-4 w-4 text-red-600 dark:text-red-400" />}
        </div>

        <div className="flex-1">
          <h4
            className={cn(
              "text-sm font-medium",
              status === "sending" && "text-muted-foreground",
              status === "success" && "text-green-800 dark:text-green-300",
              status === "error" && "text-red-800 dark:text-red-300",
            )}
          >
            {status === "sending" && "Sending email notifications..."}
            {status === "success" && "Email notifications sent successfully"}
            {status === "error" && "Failed to send email notifications"}
          </h4>

          {message && (
            <p
              className={cn(
                "mt-1 text-sm",
                status === "sending" && "text-muted-foreground",
                status === "success" && "text-green-700 dark:text-green-400",
                status === "error" && "text-red-700 dark:text-red-400",
              )}
            >
              {message}
            </p>
          )}

          {status === "success" && recipients.length > 0 && (
            <div className="mt-3 space-y-2">
              <p className="text-xs font-medium text-green-700 dark:text-green-400">Notifications sent to:</p>
              <div className="grid gap-2 max-h-40 overflow-y-auto">
                {recipients.map((email, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-2 text-sm text-green-700 dark:text-green-400 bg-green-100 dark:bg-green-900/30 px-3 py-1.5 rounded-md"
                  >
                    <User className="h-3.5 w-3.5" />
                    <span className="text-xs">{email}</span>
                    <span className="ml-auto flex h-5 w-5 items-center justify-center rounded-full bg-green-200 dark:bg-green-800">
                      <CheckCircle className="h-3 w-3 text-green-700 dark:text-green-300" />
                    </span>
                  </div>
                ))}
              </div>

              <p className="text-xs text-green-700 dark:text-green-400 mt-2">
                Check the browser console for detailed sending logs.
              </p>
            </div>
          )}

          {status === "error" && failed && failed.length > 0 && (
            <div className="mt-3 space-y-2">
              <p className="text-xs font-medium text-red-700 dark:text-red-400">Failed to send to:</p>
              <div className="grid gap-2 max-h-40 overflow-y-auto">
                {failed.map((email, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-2 text-sm text-red-700 dark:text-red-400 bg-red-100 dark:bg-red-900/30 px-3 py-1.5 rounded-md"
                  >
                    <User className="h-3.5 w-3.5" />
                    <span className="text-xs">{email}</span>
                    <span className="ml-auto flex h-5 w-5 items-center justify-center rounded-full bg-red-200 dark:bg-red-800">
                      <AlertCircle className="h-3 w-3 text-red-700 dark:text-red-300" />
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {onDismiss && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onDismiss}
            className={cn(
              "h-8 px-2 text-xs",
              status === "success" && "hover:bg-green-200 dark:hover:bg-green-900/50",
              status === "error" && "hover:bg-red-200 dark:hover:bg-red-900/50",
            )}
          >
            Dismiss
          </Button>
        )}
      </div>
    </div>
  )
}

