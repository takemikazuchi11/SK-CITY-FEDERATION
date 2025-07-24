"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useAuth } from "@/lib/auth-context"
import { toast } from "sonner"
import Image from "next/image"
import Link from "next/link"
import { MailIcon, LockIcon, UserIcon, MapPinIcon, Eye, EyeOff } from "lucide-react"
import { supabase } from "@/lib/supabase"
import SK from "@/public/SK-Logo.jpg"
import { Select, SelectContent, SelectItem, SelectTrigger } from "@/components/ui/select"

// List of barangays in San Juan City
const BARANGAYS = [
  "​Balingayan",
  "​Balite",
  "​Baruyan",
  "​Batino",
  "​Bayanan I",
  "​Bayanan II",
  "Biga",
  "​Bondoc",
  "​Bucayao",
  "​Buhuan",
  "​Bulusan",
  "​Calero",
  "​Camansihan",
  "​Camilmil",
  "​Canubing I",
  "​Canubing II",
  "​Comunal",
  "​Guinobatan",
  "​Gulod",
  "​Gutad",
  "​Ibaba East",
  "​Ibaba West",
  "​Ilaya",
  "​Lalud",
  "​Lazareto",
  "​Libis",
  "​Lumangbayan",
  "​Mahal Na Pangalan",
  "​Maidlang",
  "​Malad",
  "​Malamig",
  "​Managpi",
  "​Masipit",
  "​Nag-Iba I",
  "​Nag-Iba II",
  "​Navotas",
  "​Pachoca",
  "​Palhi",
  "​Panggalaan",
  "​Parang",
  "​Patas",
  "​Personas",
  "​Puting Tubig",
  "​San Antonio",
  "​San Raphael",
  "​San Vicente Central",
  "​San Vicente East",
  "​San Vicente North",
  "​San Vicente South",
  "​San Vicente West",
  "​Santa Cruz",
  "​Santa Isabel",
  "​Santa Maria Village",
  "​Santa Rita",
  "​Santo Niño",
  "​Sapul",
  "​Silonay",
  "​Suqui",
  "​Tawagan",
  "​Tawiran",
  "​Tibag",
  "Wawa",
]

export default function AuthPage() {
  const searchParams = useSearchParams()
  const tabParam = searchParams.get("tab")
  const [activeTab, setActiveTab] = useState(tabParam === "register" ? "register" : "login")
  const [isLogin, setIsLogin] = useState(activeTab === "login")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")
  const [barangay, setBarangay] = useState("")
  const router = useRouter()
  const { login } = useAuth()
  const [showLoginPassword, setShowLoginPassword] = useState(false)
  const [showRegisterPassword, setShowRegisterPassword] = useState(false)

  useEffect(() => {
    // Update active tab when URL parameter changes
    setActiveTab(tabParam === "register" ? "register" : "login")
    setIsLogin(tabParam !== "register")
  }, [tabParam])

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      const result = await login(email, password)

      if (result.success) {
        toast.success("Login successful")
        router.push("/dashboard")
      } else {
        toast.error(result.error || "Invalid email or password")
      }
    } catch (error) {
      console.error("Error during login:", error)
      toast.error("An error occurred during login")
    }
  }

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!barangay) {
      toast.error("Please select your barangay")
      return
    }

    try {
      // Check if user already exists
      const { data: existingUser, error: checkError } = await supabase
        .from("users")
        .select("*")
        .eq("email", email)
        .single()

      if (existingUser) {
        toast.error("User with this email already exists")
        return
      }

      // Create new user
      const { data, error } = await supabase
        .from("users")
        .insert([
          {
            email,
            password,
            first_name: firstName,
            last_name: lastName,
            barangay: barangay, // Store the selected barangay
            user_role: "user", // Default role for new users
          },
        ])
        .select()

      if (error) {
        console.error("Error during registration:", error)
        toast.error("An error occurred during registration")
        return
      }

      toast.success("Registration successful! Please log in.")
      setActiveTab("login")
      setIsLogin(true)
      // Update URL without full page reload
      router.push("/login", { scroll: false })
    } catch (error) {
      console.error("Error during registration:", error)
      toast.error("An error occurred during registration")
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-gray-50 to-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <Card className="w-full max-w-md mx-auto shadow-xl">
        <CardHeader className="space-y-1 flex flex-col items-center">
          <Link href="/" className="w-32 h-32 relative mb-2 block">
            <Image src={SK || "/placeholder.svg"} alt="SK Logo" fill className="object-contain" priority />
          </Link>
          <CardTitle className="text-2xl font-bold text-center">Welcome back</CardTitle>
          <CardDescription className="text-center">
            {isLogin ? "Sign in to access your account" : "Create a new account"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs
            value={activeTab}
            className="w-full"
            onValueChange={(value) => {
              setActiveTab(value)
              setIsLogin(value === "login")
              // Update URL without full page reload
              router.push(value === "login" ? "/login" : "/login?tab=register", { scroll: false })
            }}
          >
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger value="login">Login</TabsTrigger>
              <TabsTrigger value="register">Register</TabsTrigger>
            </TabsList>

            <TabsContent value="login">
              <form onSubmit={handleLogin} className="space-y-4">
                <div className="space-y-2">
                  <label htmlFor="login-email" className="text-sm font-medium">
                    Email
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-400">
                      <MailIcon className="h-5 w-5" />
                    </div>
                    <Input
                      id="login-email"
                      type="email"
                      placeholder="name@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="pl-10"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label htmlFor="login-password" className="text-sm font-medium">
                      Password
                    </label>
                    <Link href="/forgot-password" className="text-sm text-blue-600 hover:text-blue-800">
                      Forgot password?
                    </Link>
                  </div>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-400">
                      <LockIcon className="h-5 w-5" />
                    </div>
                    <Input
                      id="login-password"
                      type={showLoginPassword ? "text" : "password"}
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="pl-10 pr-10"
                      required
                    />
                    <button
                      type="button"
                      className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600"
                      tabIndex={-1}
                      onClick={() => setShowLoginPassword((v) => !v)}
                    >
                      {showLoginPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                    </button>
                  </div>
                </div>

                <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700">
                  Sign in
                </Button>
              </form>
            </TabsContent>

            <TabsContent value="register">
              <form onSubmit={handleRegister} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label htmlFor="register-first-name" className="text-sm font-medium">
                      First Name
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-400">
                        <UserIcon className="h-5 w-5" />
                      </div>
                      <Input
                        id="register-first-name"
                        type="text"
                        placeholder="John"
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        className="pl-10"
                        required
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="register-last-name" className="text-sm font-medium">
                      Last Name
                    </label>
                    <Input
                      id="register-last-name"
                      type="text"
                      placeholder="Doe"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label htmlFor="register-email" className="text-sm font-medium">
                    Email
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-400">
                      <MailIcon className="h-5 w-5" />
                    </div>
                    <Input
                      id="register-email"
                      type="email"
                      placeholder="name@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="pl-10"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label htmlFor="register-barangay" className="text-sm font-medium">
                    Barangay
                  </label>
                  <div className="relative">
                    <Select value={barangay} onValueChange={setBarangay} required>
                      <SelectTrigger className="w-full">
                        <div className="flex items-center">
                          {barangay ? (
                            <>
                              <MapPinIcon className="h-4 w-4 mr-2 text-gray-400" />
                              <span>{barangay}</span>
                            </>
                          ) : (
                            <>
                              <MapPinIcon className="h-4 w-4 mr-2 text-gray-400" />
                              <span className="text-muted-foreground">Select your barangay</span>
                            </>
                          )}
                        </div>
                      </SelectTrigger>
                      <SelectContent>
                        {BARANGAYS.map((b) => (
                          <SelectItem key={b} value={b}>
                            {b}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <label htmlFor="register-password" className="text-sm font-medium">
                    Password
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-400">
                      <LockIcon className="h-5 w-5" />
                    </div>
                    <Input
                      id="register-password"
                      type={showRegisterPassword ? "text" : "password"}
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="pl-10 pr-10"
                      required
                    />
                    <button
                      type="button"
                      className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600"
                      tabIndex={-1}
                      onClick={() => setShowRegisterPassword((v) => !v)}
                    >
                      {showRegisterPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                    </button>
                  </div>
                </div>

                <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700">
                  Create account
                </Button>
              </form>
            </TabsContent>
          </Tabs>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-white px-2 text-gray-500">Or continue with</span>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4 mt-4">
              <Button variant="outline" className="w-full">
                Google
              </Button>
              <Button variant="outline" className="w-full">
                GitHub
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
