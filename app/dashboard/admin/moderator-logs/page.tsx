"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { getModeratorActionLogs, type ModeratorActionLog } from "@/lib/supabase"
import { useAuth } from "@/lib/auth-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { format } from "date-fns"
import { CalendarIcon, Download, Loader2, Search } from "lucide-react"
import { Badge } from "@/components/ui/badge"

interface LogWithUser extends ModeratorActionLog {
  users: {
    id: string
    first_name: string
    last_name: string
    email: string
    user_role: string
    barangay?: string
  }
}

export default function ModeratorLogsPage() {
  const [logs, setLogs] = useState<LogWithUser[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [filters, setFilters] = useState({
    user_id: "",
    barangay_id: "",
    action_type: "",
    resource_type: "",
    from_date: "",
    to_date: "",
    search: "",
  })
  const [fromDate, setFromDate] = useState<Date | undefined>(undefined)
  const [toDate, setToDate] = useState<Date | undefined>(undefined)

  const router = useRouter()
  const { user } = useAuth()

  // Check if user is admin
  useEffect(() => {
    if (user && user.user_role !== "admin") {
      router.push("/dashboard")
    }
  }, [user, router])

  // Fetch logs
  useEffect(() => {
    const fetchLogs = async () => {
      try {
        setIsLoading(true)

        // Prepare filters
        const apiFilters: any = {}
        if (filters.user_id) apiFilters.user_id = filters.user_id
        if (filters.barangay_id) apiFilters.barangay_id = Number(filters.barangay_id)
        if (filters.action_type) apiFilters.action_type = filters.action_type
        if (filters.resource_type) apiFilters.resource_type = filters.resource_type
        if (fromDate) apiFilters.from_date = format(fromDate, "yyyy-MM-dd")
        if (toDate) apiFilters.to_date = format(toDate, "yyyy-MM-dd")

        const data = await getModeratorActionLogs(apiFilters)
        setLogs(data as LogWithUser[])
      } catch (error) {
        console.error("Error fetching logs:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchLogs()
  }, [filters, fromDate, toDate])

  // Filter logs by search term
  const filteredLogs = logs.filter((log) => {
    if (!filters.search) return true

    const searchTerm = filters.search.toLowerCase()
    return (
      log.users?.first_name?.toLowerCase().includes(searchTerm) ||
      log.users?.last_name?.toLowerCase().includes(searchTerm) ||
      log.users?.email?.toLowerCase().includes(searchTerm) ||
      log.barangay_name?.toLowerCase().includes(searchTerm) ||
      log.resource_name?.toLowerCase().includes(searchTerm) ||
      log.details?.toLowerCase().includes(searchTerm)
    )
  })

  // Export logs as CSV
  const exportCSV = () => {
    const headers = ["Timestamp", "User", "Role", "Barangay", "Action", "Resource Type", "Resource Name", "Details"]

    const rows = filteredLogs.map((log) => [
      log.timestamp || "",
      `${log.users?.first_name || ""} ${log.users?.last_name || ""}`,
      log.users?.user_role || "",
      log.users?.barangay || log.barangay_name || "",
      log.action_type,
      log.resource_type,
      log.resource_name,
      log.details,
    ])

    const csvContent = [
      headers.join(","),
      ...rows.map((row) => row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(",")),
    ].join("\n")

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.setAttribute("href", url)
    link.setAttribute("download", `moderator-logs-${format(new Date(), "yyyy-MM-dd")}.csv`)
    link.style.visibility = "hidden"
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  // Get action type badge color
  const getActionBadgeColor = (action: string) => {
    switch (action) {
      case "upload":
        return "bg-green-100 text-green-800"
      case "delete":
        return "bg-red-100 text-red-800"
      case "edit":
        return "bg-blue-100 text-blue-800"
      case "view":
        return "bg-gray-100 text-gray-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <div className="container mx-auto py-10 px-4">
      <h1 className="text-2xl font-bold mb-6">Moderator Action Logs</h1>

      {/* Filters */}
      <div className="bg-white p-4 rounded-lg shadow-sm mb-6">
        <h2 className="text-lg font-medium mb-4">Filters</h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          {/* Search */}
          <div>
            <Label htmlFor="search" className="mb-1 block">
              Search
            </Label>
            <div className="relative">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
              <Input
                id="search"
                placeholder="Search logs..."
                className="pl-8"
                value={filters.search}
                onChange={(e) => setFilters((prev) => ({ ...prev, search: e.target.value }))}
              />
            </div>
          </div>

          {/* Action Type */}
          <div>
            <Label htmlFor="action-type" className="mb-1 block">
              Action Type
            </Label>
            <Select
              value={filters.action_type}
              onValueChange={(value) => setFilters((prev) => ({ ...prev, action_type: value }))}
            >
              <SelectTrigger id="action-type">
                <SelectValue placeholder="All actions" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All actions</SelectItem>
                <SelectItem value="upload">Upload</SelectItem>
                <SelectItem value="delete">Delete</SelectItem>
                <SelectItem value="edit">Edit</SelectItem>
                <SelectItem value="view">View</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Resource Type */}
          <div>
            <Label htmlFor="resource-type" className="mb-1 block">
              Resource Type
            </Label>
            <Select
              value={filters.resource_type}
              onValueChange={(value) => setFilters((prev) => ({ ...prev, resource_type: value }))}
            >
              <SelectTrigger id="resource-type">
                <SelectValue placeholder="All resources" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All resources</SelectItem>
                <SelectItem value="general">General</SelectItem>
                <SelectItem value="barangay">Barangay</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* From Date */}
          <div>
            <Label className="mb-1 block">From Date</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="w-full justify-start text-left font-normal">
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {fromDate ? format(fromDate, "PPP") : "Select date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar mode="single" selected={fromDate} onSelect={setFromDate} initialFocus />
              </PopoverContent>
            </Popover>
          </div>

          {/* To Date */}
          <div>
            <Label className="mb-1 block">To Date</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="w-full justify-start text-left font-normal">
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {toDate ? format(toDate, "PPP") : "Select date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar mode="single" selected={toDate} onSelect={setToDate} initialFocus />
              </PopoverContent>
            </Popover>
          </div>

          {/* Export Button */}
          <div className="flex items-end">
            <Button onClick={exportCSV} className="w-full md:w-auto">
              <Download className="mr-2 h-4 w-4" /> Export Logs
            </Button>
          </div>
        </div>
      </div>

      {/* Logs Table */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        {isLoading ? (
          <div className="flex justify-center items-center h-40">
            <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
          </div>
        ) : filteredLogs.length === 0 ? (
          <div className="text-center py-10 text-gray-500">No logs found</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Timestamp
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    User
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Action
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Resource
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Details
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                      {log.timestamp ? new Date(log.timestamp).toLocaleString() : "N/A"}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {log.users?.first_name} {log.users?.last_name}
                      </div>
                      <div className="text-xs text-gray-500">
                        {log.users?.email}
                        {log.users?.barangay && (
                          <span className="ml-1">
                            ({log.users.user_role} - {log.users.barangay})
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <Badge className={getActionBadgeColor(log.action_type)}>
                        {log.action_type.charAt(0).toUpperCase() + log.action_type.slice(1)}
                      </Badge>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{log.resource_name}</div>
                      <div className="text-xs text-gray-500">
                        {log.resource_type === "barangay" ? (
                          <>
                            {log.barangay_name} - {log.month}
                          </>
                        ) : (
                          <>{log.folder_name}</>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-500">{log.details}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
