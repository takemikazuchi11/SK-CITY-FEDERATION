export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instanciate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "12.2.12 (cd3cf9e)"
  }
  public: {
    Tables: {
      announcement_likes: {
        Row: {
          announcement_id: string
          created_at: string | null
          id: number
          user_id: string
        }
        Insert: {
          announcement_id: string
          created_at?: string | null
          id?: number
          user_id: string
        }
        Update: {
          announcement_id?: string
          created_at?: string | null
          id?: number
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "announcement_likes_announcement_id_fkey"
            columns: ["announcement_id"]
            isOneToOne: false
            referencedRelation: "announcements"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "announcement_likes_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      announcements: {
        Row: {
          author: string
          author_role: string
          category: string
          content: string
          created_at: string | null
          id: string
          likes: number | null
          title: string
          user_id: string | null
        }
        Insert: {
          author: string
          author_role: string
          category: string
          content: string
          created_at?: string | null
          id?: string
          likes?: number | null
          title: string
          user_id?: string | null
        }
        Update: {
          author?: string
          author_role?: string
          category?: string
          content?: string
          created_at?: string | null
          id?: string
          likes?: number | null
          title?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "announcements_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      barangay_resources: {
        Row: {
          barangay_id: number
          file_name: string
          file_path: string
          id: number
          month: string
          title: string | null
          type: string | null
          upload_timestamp: string | null
          uploaded_by_user_id: string
          url: string | null
        }
        Insert: {
          barangay_id: number
          file_name: string
          file_path: string
          id?: number
          month: string
          title?: string | null
          type?: string | null
          upload_timestamp?: string | null
          uploaded_by_user_id: string
          url?: string | null
        }
        Update: {
          barangay_id?: number
          file_name?: string
          file_path?: string
          id?: number
          month?: string
          title?: string | null
          type?: string | null
          upload_timestamp?: string | null
          uploaded_by_user_id?: string
          url?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "barangay_resources_barangay_id_fkey"
            columns: ["barangay_id"]
            isOneToOne: false
            referencedRelation: "barangays"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "barangay_resources_uploaded_by_user_id_fkey"
            columns: ["uploaded_by_user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      barangays: {
        Row: {
          created_at: string | null
          email: string | null
          history: string | null
          id: number
          logo_url: string | null
          name: string
          page: string | null
          phone: string | null
        }
        Insert: {
          created_at?: string | null
          email?: string | null
          history?: string | null
          id?: number
          logo_url?: string | null
          name: string
          page?: string | null
          phone?: string | null
        }
        Update: {
          created_at?: string | null
          email?: string | null
          history?: string | null
          id?: number
          logo_url?: string | null
          name?: string
          page?: string | null
          phone?: string | null
        }
        Relationships: []
      }
      comment_likes: {
        Row: {
          comment_id: string
          created_at: string | null
          id: number
          user_id: string
        }
        Insert: {
          comment_id: string
          created_at?: string | null
          id?: number
          user_id: string
        }
        Update: {
          comment_id?: string
          created_at?: string | null
          id?: number
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "comment_likes_comment_id_fkey"
            columns: ["comment_id"]
            isOneToOne: false
            referencedRelation: "comments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "comment_likes_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      comments: {
        Row: {
          announcement_id: string
          author: string
          author_role: string
          content: string
          created_at: string | null
          id: string
          likes: number | null
          user_id: string | null
        }
        Insert: {
          announcement_id: string
          author: string
          author_role: string
          content: string
          created_at?: string | null
          id?: string
          likes?: number | null
          user_id?: string | null
        }
        Update: {
          announcement_id?: string
          author?: string
          author_role?: string
          content?: string
          created_at?: string | null
          id?: string
          likes?: number | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "comments_announcement_id_fkey"
            columns: ["announcement_id"]
            isOneToOne: false
            referencedRelation: "announcements"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "comments_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      disclosure_urls: {
        Row: {
          description: string | null
          document_type: string
          id: number
          updated_at: string | null
          updated_by: string | null
          url: string
        }
        Insert: {
          description?: string | null
          document_type: string
          id?: number
          updated_at?: string | null
          updated_by?: string | null
          url: string
        }
        Update: {
          description?: string | null
          document_type?: string
          id?: number
          updated_at?: string | null
          updated_by?: string | null
          url?: string
        }
        Relationships: []
      }
      event_feedback: {
        Row: {
          comments: string | null
          created_at: string | null
          event_id: string
          id: number
          rating: number | null
          user_id: string
        }
        Insert: {
          comments?: string | null
          created_at?: string | null
          event_id: string
          id?: number
          rating?: number | null
          user_id: string
        }
        Update: {
          comments?: string | null
          created_at?: string | null
          event_id?: string
          id?: number
          rating?: number | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "event_feedback_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "events"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "event_feedback_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      event_participants: {
        Row: {
          event_id: string
          id: string
          registration_date: string | null
          status: string | null
          user_id: string
        }
        Insert: {
          event_id: string
          id?: string
          registration_date?: string | null
          status?: string | null
          user_id: string
        }
        Update: {
          event_id?: string
          id?: string
          registration_date?: string | null
          status?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "event_participants_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "events"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "event_participants_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      events: {
        Row: {
          capacity: string | null
          category: string | null
          created_at: string
          date: string | null
          description: string | null
          details: string | null
          id: string
          image: string | null
          location: string | null
          organizer: string | null
          status: string | null
          time: string | null
          title: string
        }
        Insert: {
          capacity?: string | null
          category?: string | null
          created_at?: string
          date?: string | null
          description?: string | null
          details?: string | null
          id?: string
          image?: string | null
          location?: string | null
          organizer?: string | null
          status?: string | null
          time?: string | null
          title: string
        }
        Update: {
          capacity?: string | null
          category?: string | null
          created_at?: string
          date?: string | null
          description?: string | null
          details?: string | null
          id?: string
          image?: string | null
          location?: string | null
          organizer?: string | null
          status?: string | null
          time?: string | null
          title?: string
        }
        Relationships: []
      }
      kk_registrations: {
        Row: {
          address: string
          barangay: string
          birth_date: string
          created_at: string | null
          data_privacy_consent: boolean
          education_level: string
          email: string
          first_name: string
          gender: string
          has_previous_sk_involvement: boolean | null
          id: string
          interests: string[]
          is_registered_voter: boolean | null
          last_name: string
          middle_name: string | null
          phone: string
          previous_sk_involvement: string | null
          reason_for_joining: string
          residency_length: string
          school_or_work: string
          skills: string | null
          status: string | null
          terms_agreed: boolean
          updated_at: string | null
        }
        Insert: {
          address: string
          barangay: string
          birth_date: string
          created_at?: string | null
          data_privacy_consent: boolean
          education_level: string
          email: string
          first_name: string
          gender: string
          has_previous_sk_involvement?: boolean | null
          id?: string
          interests: string[]
          is_registered_voter?: boolean | null
          last_name: string
          middle_name?: string | null
          phone: string
          previous_sk_involvement?: string | null
          reason_for_joining: string
          residency_length: string
          school_or_work: string
          skills?: string | null
          status?: string | null
          terms_agreed: boolean
          updated_at?: string | null
        }
        Update: {
          address?: string
          barangay?: string
          birth_date?: string
          created_at?: string | null
          data_privacy_consent?: boolean
          education_level?: string
          email?: string
          first_name?: string
          gender?: string
          has_previous_sk_involvement?: boolean | null
          id?: string
          interests?: string[]
          is_registered_voter?: boolean | null
          last_name?: string
          middle_name?: string | null
          phone?: string
          previous_sk_involvement?: string | null
          reason_for_joining?: string
          residency_length?: string
          school_or_work?: string
          skills?: string | null
          status?: string | null
          terms_agreed?: boolean
          updated_at?: string | null
        }
        Relationships: []
      }
      members: {
        Row: {
          barangay_id: string | null
          created_at: string
          email: string
          id: string
          name: string
          phone: string
          role: string
        }
        Insert: {
          barangay_id?: string | null
          created_at?: string
          email: string
          id?: string
          name: string
          phone: string
          role: string
        }
        Update: {
          barangay_id?: string | null
          created_at?: string
          email?: string
          id?: string
          name?: string
          phone?: string
          role?: string
        }
        Relationships: []
      }
      news: {
        Row: {
          author: string
          author_id: string | null
          category: string | null
          content: string
          created_at: string | null
          excerpt: string | null
          featured_image_url: string | null
          id: number
          published_at: string | null
          slug: string
          status: string | null
          title: string
          updated_at: string | null
        }
        Insert: {
          author: string
          author_id?: string | null
          category?: string | null
          content: string
          created_at?: string | null
          excerpt?: string | null
          featured_image_url?: string | null
          id?: number
          published_at?: string | null
          slug: string
          status?: string | null
          title: string
          updated_at?: string | null
        }
        Update: {
          author?: string
          author_id?: string | null
          category?: string | null
          content?: string
          created_at?: string | null
          excerpt?: string | null
          featured_image_url?: string | null
          id?: number
          published_at?: string | null
          slug?: string
          status?: string | null
          title?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "news_author_id_fkey"
            columns: ["author_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      notifications: {
        Row: {
          action_url: string | null
          content: string
          created_at: string | null
          id: string
          image_url: string | null
          read: boolean | null
          reference_id: string | null
          title: string
          type: string
          user_id: string
        }
        Insert: {
          action_url?: string | null
          content: string
          created_at?: string | null
          id?: string
          image_url?: string | null
          read?: boolean | null
          reference_id?: string | null
          title: string
          type: string
          user_id: string
        }
        Update: {
          action_url?: string | null
          content?: string
          created_at?: string | null
          id?: string
          image_url?: string | null
          read?: boolean | null
          reference_id?: string | null
          title?: string
          type?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "notifications_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      officials: {
        Row: {
          created_at: string
          id: number
          name: string | null
          photo_url: string | null
          position: string | null
        }
        Insert: {
          created_at?: string
          id?: number
          name?: string | null
          photo_url?: string | null
          position?: string | null
        }
        Update: {
          created_at?: string
          id?: number
          name?: string | null
          photo_url?: string | null
          position?: string | null
        }
        Relationships: []
      }
      ordinance: {
        Row: {
          author: string | null
          created_at: string | null
          date: string
          date_enact: string
          description: string | null
          id: number
          img: string | null
          ordinance_no: string
          pdf: string | null
          sponsors: string[] | null
          title: string
        }
        Insert: {
          author?: string | null
          created_at?: string | null
          date: string
          date_enact: string
          description?: string | null
          id?: number
          img?: string | null
          ordinance_no: string
          pdf?: string | null
          sponsors?: string[] | null
          title: string
        }
        Update: {
          author?: string | null
          created_at?: string | null
          date?: string
          date_enact?: string
          description?: string | null
          id?: number
          img?: string | null
          ordinance_no?: string
          pdf?: string | null
          sponsors?: string[] | null
          title?: string
        }
        Relationships: []
      }
      other_folder_files: {
        Row: {
          created_at: string | null
          folder_id: number | null
          id: number
          title: string
          type: string | null
          url: string
        }
        Insert: {
          created_at?: string | null
          folder_id?: number | null
          id?: number
          title: string
          type?: string | null
          url: string
        }
        Update: {
          created_at?: string | null
          folder_id?: number | null
          id?: number
          title?: string
          type?: string | null
          url?: string
        }
        Relationships: [
          {
            foreignKeyName: "other_folder_files_folder_id_fkey"
            columns: ["folder_id"]
            isOneToOne: false
            referencedRelation: "other_folders"
            referencedColumns: ["id"]
          },
        ]
      }
      other_folders: {
        Row: {
          id: number
          name: string
        }
        Insert: {
          id?: number
          name: string
        }
        Update: {
          id?: number
          name?: string
        }
        Relationships: []
      }
      poll_announcements: {
        Row: {
          announcement_id: string | null
          created_at: string | null
          id: string
          question: string
        }
        Insert: {
          announcement_id?: string | null
          created_at?: string | null
          id?: string
          question: string
        }
        Update: {
          announcement_id?: string | null
          created_at?: string | null
          id?: string
          question?: string
        }
        Relationships: [
          {
            foreignKeyName: "poll_announcements_announcement_id_fkey"
            columns: ["announcement_id"]
            isOneToOne: false
            referencedRelation: "announcements"
            referencedColumns: ["id"]
          },
        ]
      }
      poll_options: {
        Row: {
          id: string
          option_text: string
          poll_id: string | null
        }
        Insert: {
          id?: string
          option_text: string
          poll_id?: string | null
        }
        Update: {
          id?: string
          option_text?: string
          poll_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "poll_options_poll_id_fkey"
            columns: ["poll_id"]
            isOneToOne: false
            referencedRelation: "poll_announcements"
            referencedColumns: ["id"]
          },
        ]
      }
      poll_votes: {
        Row: {
          created_at: string | null
          id: string
          poll_option_id: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          poll_option_id?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          poll_option_id?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "poll_votes_poll_option_id_fkey"
            columns: ["poll_option_id"]
            isOneToOne: false
            referencedRelation: "poll_options"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "poll_votes_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          email: string
          full_name: string | null
          id: string
          password: string | null
          role: Database["public"]["Enums"]["user_role"] | null
          updated_at: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          email: string
          full_name?: string | null
          id: string
          password?: string | null
          role?: Database["public"]["Enums"]["user_role"] | null
          updated_at?: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          email?: string
          full_name?: string | null
          id?: string
          password?: string | null
          role?: Database["public"]["Enums"]["user_role"] | null
          updated_at?: string
        }
        Relationships: []
      }
      resolution: {
        Row: {
          author: string | null
          created_at: string | null
          date: string
          date_enact: string
          description: string | null
          id: number
          img: string | null
          pdf: string | null
          resolution_no: string
          sponsors: string[] | null
          title: string
        }
        Insert: {
          author?: string | null
          created_at?: string | null
          date: string
          date_enact: string
          description?: string | null
          id?: number
          img?: string | null
          pdf?: string | null
          resolution_no: string
          sponsors?: string[] | null
          title: string
        }
        Update: {
          author?: string | null
          created_at?: string | null
          date?: string
          date_enact?: string
          description?: string | null
          id?: number
          img?: string | null
          pdf?: string | null
          resolution_no?: string
          sponsors?: string[] | null
          title?: string
        }
        Relationships: []
      }
      resource_files: {
        Row: {
          created_at: string
          folder_id: number
          id: number
          title: string
          type: string
          url: string
        }
        Insert: {
          created_at?: string
          folder_id: number
          id?: number
          title: string
          type: string
          url: string
        }
        Update: {
          created_at?: string
          folder_id?: number
          id?: number
          title?: string
          type?: string
          url?: string
        }
        Relationships: [
          {
            foreignKeyName: "resource_files_folder_id_fkey"
            columns: ["folder_id"]
            isOneToOne: false
            referencedRelation: "resource_folders"
            referencedColumns: ["id"]
          },
        ]
      }
      resource_folders: {
        Row: {
          created_at: string
          id: number
          name: string
        }
        Insert: {
          created_at?: string
          id?: number
          name: string
        }
        Update: {
          created_at?: string
          id?: number
          name?: string
        }
        Relationships: []
      }
      sk_officials: {
        Row: {
          barangay_id: number
          created_at: string | null
          description: string | null
          email: string
          full_name: string
          id: number
          phone: string
          photo_url: string | null
          position: string
          position_order: number
          term_end: string | null
          term_start: string | null
        }
        Insert: {
          barangay_id: number
          created_at?: string | null
          description?: string | null
          email: string
          full_name: string
          id?: number
          phone: string
          photo_url?: string | null
          position: string
          position_order: number
          term_end?: string | null
          term_start?: string | null
        }
        Update: {
          barangay_id?: number
          created_at?: string | null
          description?: string | null
          email?: string
          full_name?: string
          id?: number
          phone?: string
          photo_url?: string | null
          position?: string
          position_order?: number
          term_end?: string | null
          term_start?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "sk_officials_barangay_id_fkey"
            columns: ["barangay_id"]
            isOneToOne: false
            referencedRelation: "barangays"
            referencedColumns: ["id"]
          },
        ]
      }
      users: {
        Row: {
          barangay: string | null
          created_at: string | null
          email: string
          first_name: string
          id: string
          last_name: string
          password: string
          phone: string | null
          photo_url: string | null
          user_role: string
        }
        Insert: {
          barangay?: string | null
          created_at?: string | null
          email: string
          first_name: string
          id?: string
          last_name: string
          password: string
          phone?: string | null
          photo_url?: string | null
          user_role: string
        }
        Update: {
          barangay?: string | null
          created_at?: string | null
          email?: string
          first_name?: string
          id?: string
          last_name?: string
          password?: string
          phone?: string | null
          photo_url?: string | null
          user_role?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      cleanup_old_notifications: {
        Args: Record<PropertyKey, never>
        Returns: number
      }
      generate_today_event_notifications: {
        Args: Record<PropertyKey, never>
        Returns: number
      }
      get_event_participants_count: {
        Args: { event_id_param: string }
        Returns: number
      }
      get_events_with_participant_counts: {
        Args: { limit_count?: number }
        Returns: {
          event_id: string
          title: string
          participant_count: number
        }[]
      }
      get_events_with_participants: {
        Args: { search_query: string; page_size: number; page_number: number }
        Returns: {
          id: string
          title: string
          date: string
          location: string
          capacity: number
          participant_count: number
          total_count: number
        }[]
      }
      increment_announcement_likes: {
        Args: { announcement_id: string }
        Returns: undefined
      }
      increment_comment_likes: {
        Args: { comment_id: string }
        Returns: undefined
      }
    }
    Enums: {
      user_role: "admin" | "user"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      user_role: ["admin", "user"],
    },
  },
} as const
