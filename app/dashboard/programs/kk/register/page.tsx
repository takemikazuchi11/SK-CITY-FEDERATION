"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { format, parse, isValid } from "date-fns"
import { CalendarIcon, CheckCircle2, Info } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Checkbox } from "@/components/ui/checkbox"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { supabase } from "@/lib/supabase"

// Define the form schema with validation
const formSchema = z.object({
  firstName: z.string().min(2, { message: "First name must be at least 2 characters." }),
  middleName: z.string().optional(),
  lastName: z.string().min(2, { message: "Last name must be at least 2 characters." }),
  birthDate: z
    .date({
      required_error: "Birth date is required.",
    })
    .refine(
      (date) => {
        const today = new Date()
        const age = today.getFullYear() - date.getFullYear()
        const monthDiff = today.getMonth() - date.getMonth()
        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < date.getDate())) {
          return age - 1 >= 15 && age - 1 <= 30
        }
        return age >= 15 && age <= 30
      },
      { message: "You must be between 15 and 30 years old to register." },
    ),
  birthDateInput: z.string().optional(),
  gender: z.enum(["male", "female", "other"], {
    required_error: "Please select your gender.",
  }),
  email: z.string().email({ message: "Please enter a valid email address." }),
  phone: z.string().min(10, { message: "Phone number must be at least 10 digits." }),
  address: z.string().min(5, { message: "Address must be at least 5 characters." }),
  barangay: z.string({
    required_error: "Please select your barangay.",
  }),
  residencyLength: z.enum(["lessThan6Months", "6MonthsOrMore"], {
    required_error: "Please select your length of residency.",
  }),
  educationLevel: z.string({
    required_error: "Please select your education level.",
  }),
  reasonForJoining: z.string().min(10, { message: "Please provide a reason with at least 10 characters." }),
  termsAgreed: z.literal(true, {
    errorMap: () => ({ message: "You must agree to the terms and conditions." }),
  }),
  dataPrivacyConsent: z.literal(true, {
    errorMap: () => ({ message: "You must consent to the data privacy policy." }),
  }),
})

// Define the barangay options (replace with actual barangays)
const barangayOptions = [
  "​Balingayan", "​Balite", "​Baruyan", "​Batino", "​Bayanan I", "​Bayanan II", "Biga", "​Bondoc", "​Bucayao", "​Buhuan", "​Bulusan", "​Calero", "​Camansihan", "​Camilmil", "​Canubing I", "​Canubing II", "​Comunal", "​Guinobatan", "​Gulod", "​Gutad", "​Ibaba East", "​Ibaba West", "​Ilaya", "​Lalud", "​Lazareto", "​Libis", "​Lumangbayan", "​Mahal Na Pangalan", "​Maidlang", "​Malad", "​Malamig", "​Managpi", "​Masipit", "​Nag-Iba I", "​Nag-Iba II", "​Navotas", "​Pachoca", "​Palhi", "​Panggalaan", "​Parang", "​Patas", "​Personas", "​Puting Tubig", "​San Antonio", "​San Raphael", "​San Vicente Central", "​San Vicente East", "​San Vicente North", "​San Vicente South", "​San Vicente West", "​Santa Cruz", "​Santa Isabel", "​Santa Maria Village", "​Santa Rita", "​Santo Niño", "​Sapul", "​Silonay", "​Suqui", "​Tawagan", "​Tawiran", "​Tibag", "Wawa",
]

// Define education level options
const educationLevelOptions = [
  "Elementary",
  "High School",
  "Senior High School",
  "Vocational/Technical",
  "College Undergraduate",
  "College Graduate",
  "Post-Graduate",
  "Not in School",
]

export default function KKRegistrationPage() {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [dateInputValue, setDateInputValue] = useState<string>("")

  // Generate years for the calendar (for people aged 15-30)
  const currentYear = new Date().getFullYear()
  const fromYear = currentYear - 30
  const toYear = currentYear - 15

  // Initialize the form
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: "",
      middleName: "",
      lastName: "",
      email: "",
      phone: "",
      address: "",
      reasonForJoining: "",
      
      birthDateInput: "",
    },
  })

  // Scroll to top when success state changes to true
  useEffect(() => {
    if (isSuccess) {
      // Scroll to the top of the page smoothly
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      })
    }
  }, [isSuccess])

  // Handle form submission
  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true)
    setErrorMessage(null)

    try {
      // Format the data for Supabase
      const formattedData = {
        first_name: values.firstName,
        middle_name: values.middleName || null,
        last_name: values.lastName,
        birth_date: values.birthDate.toISOString().split("T")[0], // Format as YYYY-MM-DD
        gender: values.gender,
        email: values.email,
        phone: values.phone,
        address: values.address,
        barangay: values.barangay,
        residency_length: values.residencyLength,
        education_level: values.educationLevel,
        school_or_work: "", // Simplified form doesn't collect this
        interests: [], // Simplified form doesn't collect this
        reason_for_joining: values.reasonForJoining,
        is_registered_voter: false, // Default value
        has_previous_sk_involvement: false, // Default value
        previous_sk_involvement: null,
        terms_agreed: values.termsAgreed,
        data_privacy_consent: values.dataPrivacyConsent,
        status: "pending",
      }

      // Insert data into Supabase
      const { error } = await supabase.from("kk_registrations").insert([formattedData])

      if (error) {
        console.error("Error submitting form:", error)
        throw new Error(error.message || "Failed to submit registration")
      }

      // Show success message
      setIsSuccess(true)
      form.reset()
      setDateInputValue("")
    } catch (error) {
      console.error("Error in form submission:", error)
      setErrorMessage(error instanceof Error ? error.message : "An unexpected error occurred. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  // Handle manual date input
  const handleDateInput = (e: React.ChangeEvent<HTMLInputElement>, field: any) => {
    const inputValue = e.target.value
    setDateInputValue(inputValue)

    // Try to parse the date
    if (inputValue) {
      try {
        // Try to parse with different formats
        let parsedDate: Date | null = null

        // Try dd/MM/yyyy format
        parsedDate = parse(inputValue, "dd/MM/yyyy", new Date())

        // If not valid, try other common formats
        if (!isValid(parsedDate)) {
          parsedDate = parse(inputValue, "MM/dd/yyyy", new Date())
        }

        if (!isValid(parsedDate)) {
          parsedDate = parse(inputValue, "yyyy-MM-dd", new Date())
        }

        // If we have a valid date, update the form
        if (isValid(parsedDate)) {
          // Check age requirement
          const today = new Date()
          const age = today.getFullYear() - parsedDate.getFullYear()
          const monthDiff = today.getMonth() - parsedDate.getMonth()
          let isValidAge = false

          if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < parsedDate.getDate())) {
            isValidAge = age - 1 >= 15 && age - 1 <= 30
          } else {
            isValidAge = age >= 15 && age <= 30
          }

          if (isValidAge) {
            field.onChange(parsedDate)
          }
        }
      } catch (error) {
        // Invalid date format, don't update the field
        console.log("Invalid date format")
      }
    } else {
      // Clear the date if input is empty
      field.onChange(undefined)
    }
  }

  if (isSuccess) {
    return (
      <div className="container mx-auto px-4 py-12 max-w-4xl">
        <Card className="border-green-200 bg-green-50">
          <CardHeader>
            <div className="flex items-center space-x-2">
              <CheckCircle2 className="h-6 w-6 text-green-600" />
              <CardTitle className="text-green-800">Registration Successful!</CardTitle>
            </div>
            <CardDescription className="text-green-700">
              Your Katipunan ng Kabataan registration has been submitted successfully.
            </CardDescription>
          </CardHeader>
          <CardContent className="text-green-700">
            <p className="mb-4">
              Thank you for registering with the Katipunan ng Kabataan. Your application will be reviewed by our team.
              You will receive a confirmation email with further instructions.
            </p>
            <p>If you have any questions, please contact your local SK office.</p>
          </CardContent>
          <CardFooter>
            <Button onClick={() => router.push("/dashboard/programs/kk")} className="bg-green-600 hover:bg-green-700">
              Return to KK Page
            </Button>
          </CardFooter>
        </Card>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold text-blue-800 mb-2">Katipunan ng Kabataan Registration</h1>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Join the Katipunan ng Kabataan and be part of youth governance in your community.
        </p>
      </div>

      <Alert className="mb-6 bg-blue-50 border-blue-200">
        <Info className="h-4 w-4 text-blue-600" />
        <AlertTitle className="text-blue-800">Eligibility Requirements</AlertTitle>
        <AlertDescription className="text-blue-700">
          To register for Katipunan ng Kabataan, you must be:
          <ul className="list-disc list-inside mt-2 space-y-1">
            <li>15 to 30 years old</li>
            <li>A resident of the barangay for at least 6 months</li>
            <li>A Filipino citizen</li>
          </ul>
        </AlertDescription>
      </Alert>

      {errorMessage && (
        <Alert className="mb-6 bg-red-50 border-red-200">
          <AlertTitle className="text-red-800">Error</AlertTitle>
          <AlertDescription className="text-red-700">{errorMessage}</AlertDescription>
        </Alert>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Registration Form</CardTitle>
          <CardDescription>Please provide your information to register for Katipunan ng Kabataan.</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              {/* Personal Information Section */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Personal Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <FormField
                    control={form.control}
                    name="firstName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>First Name*</FormLabel>
                        <FormControl>
                          <Input placeholder="Juan" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="middleName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Middle Name (Optional)</FormLabel>
                        <FormControl>
                          <Input placeholder="Dela" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="lastName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Last Name*</FormLabel>
                        <FormControl>
                          <Input placeholder="Cruz" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="birthDate"
                    render={({ field }) => (
                      <FormItem className="flex flex-col">
                        <FormLabel>Date of Birth*</FormLabel>
                        <div className="relative">
                          <Input
                            placeholder="dd/mm/yyyy"
                            value={dateInputValue || (field.value ? format(field.value, "dd/MM/yyyy") : "")}
                            onChange={(e) => handleDateInput(e, field)}
                            className="pr-10"
                          />
                          <Popover>
                            <PopoverTrigger asChild>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="absolute right-0 top-0 h-full px-3 py-2"
                                type="button"
                              >
                                <CalendarIcon className="h-4 w-4" />
                                <span className="sr-only">Open calendar</span>
                              </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0" align="end">
                              <Calendar
                                mode="single"
                                selected={field.value}
                                onSelect={(date) => {
                                  field.onChange(date)
                                  if (date) {
                                    setDateInputValue(format(date, "dd/MM/yyyy"))
                                  } else {
                                    setDateInputValue("")
                                  }
                                }}
                                disabled={(date) => {
                                  const today = new Date()
                                  const age = today.getFullYear() - date.getFullYear()
                                  return age < 15 || age > 30
                                }}
                                initialFocus
                              />
                            </PopoverContent>
                          </Popover>
                        </div>
                        <FormDescription>You must be between 15 and 30 years old.</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="gender"
                    render={({ field }) => (
                      <FormItem className="space-y-3">
                        <FormLabel>Gender*</FormLabel>
                        <FormControl>
                          <RadioGroup
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                            className="flex flex-col space-y-1"
                          >
                            <FormItem className="flex items-center space-x-3 space-y-0">
                              <FormControl>
                                <RadioGroupItem value="male" />
                              </FormControl>
                              <FormLabel className="font-normal">Male</FormLabel>
                            </FormItem>
                            <FormItem className="flex items-center space-x-3 space-y-0">
                              <FormControl>
                                <RadioGroupItem value="female" />
                              </FormControl>
                              <FormLabel className="font-normal">Female</FormLabel>
                            </FormItem>
                            <FormItem className="flex items-center space-x-3 space-y-0">
                              <FormControl>
                                <RadioGroupItem value="other" />
                              </FormControl>
                              <FormLabel className="font-normal">Other</FormLabel>
                            </FormItem>
                          </RadioGroup>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email Address*</FormLabel>
                        <FormControl>
                          <Input type="email" placeholder="juan.cruz@example.com" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="phone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Phone Number*</FormLabel>
                        <FormControl>
                          <Input type="tel" placeholder="09123456789" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              {/* Address Section */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Residence Information</h3>

                <FormField
                  control={form.control}
                  name="address"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Complete Address*</FormLabel>
                      <FormControl>
                        <Input placeholder="123 Main St., Purok 1" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="barangay"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Barangay*</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select your barangay" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {barangayOptions.map((barangay) => (
                              <SelectItem key={barangay} value={barangay}>
                                {barangay}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="residencyLength"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Length of Residency*</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select length of residency" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="lessThan6Months">Less than 6 months</SelectItem>
                            <SelectItem value="6MonthsOrMore">6 months or more</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormDescription>You must be a resident for at least 6 months to be eligible.</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              {/* Education Section */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Education</h3>

                <FormField
                  control={form.control}
                  name="educationLevel"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Highest Educational Attainment*</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select education level" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {educationLevelOptions.map((level) => (
                            <SelectItem key={level} value={level}>
                              {level}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Additional Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Additional Information</h3>

                <FormField
                  control={form.control}
                  name="reasonForJoining"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Why do you want to join Katipunan ng Kabataan?*</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Please share your reasons for wanting to join and how you hope to contribute to your community"
                          className="min-h-[100px]"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Terms and Consent */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Terms and Consent</h3>

                <FormField
                  control={form.control}
                  name="termsAgreed"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                      <FormControl>
                        <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel>Terms and Conditions*</FormLabel>
                        <FormDescription>
                          I agree to the terms and conditions of Katipunan ng Kabataan membership, including
                          participation in community activities and adherence to the organization's code of conduct.
                        </FormDescription>
                      </div>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="dataPrivacyConsent"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                      <FormControl>
                        <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel>Data Privacy Consent*</FormLabel>
                        <FormDescription>
                          I consent to the collection, processing, and storage of my personal information for the
                          purposes of Katipunan ng Kabataan membership and activities, in accordance with the Data
                          Privacy Act of 2012.
                        </FormDescription>
                      </div>
                    </FormItem>
                  )}
                />
              </div>

              <div className="pt-4">
                <Button type="submit" className="w-full" disabled={isSubmitting}>
                  {isSubmitting ? "Submitting..." : "Submit Registration"}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  )
}
