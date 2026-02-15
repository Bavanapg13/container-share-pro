export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.1"
  }
  public: {
    Tables: {
      bookings: {
        Row: {
          container_id: string
          created_at: string
          id: string
          payment_id: string | null
          provider_id: string
          service_fee: number
          space_booked: number
          status: Database["public"]["Enums"]["booking_status"]
          total_price: number
          trader_id: string
          updated_at: string
        }
        Insert: {
          container_id: string
          created_at?: string
          id?: string
          payment_id?: string | null
          provider_id: string
          service_fee: number
          space_booked: number
          status?: Database["public"]["Enums"]["booking_status"]
          total_price: number
          trader_id: string
          updated_at?: string
        }
        Update: {
          container_id?: string
          created_at?: string
          id?: string
          payment_id?: string | null
          provider_id?: string
          service_fee?: number
          space_booked?: number
          status?: Database["public"]["Enums"]["booking_status"]
          total_price?: number
          trader_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "bookings_container_id_fkey"
            columns: ["container_id"]
            isOneToOne: false
            referencedRelation: "containers"
            referencedColumns: ["id"]
          },
        ]
      }
      containers: {
        Row: {
          arrival_date: string
          available_capacity: number
          container_type: string
          created_at: string
          currency: string
          departure_date: string
          description: string | null
          destination: string
          id: string
          is_active: boolean
          origin: string
          price_per_cubic_meter: number
          provider_id: string
          total_capacity: number
          transport_mode: Database["public"]["Enums"]["transport_mode"]
          updated_at: string
        }
        Insert: {
          arrival_date: string
          available_capacity: number
          container_type: string
          created_at?: string
          currency?: string
          departure_date: string
          description?: string | null
          destination: string
          id?: string
          is_active?: boolean
          origin: string
          price_per_cubic_meter: number
          provider_id: string
          total_capacity: number
          transport_mode: Database["public"]["Enums"]["transport_mode"]
          updated_at?: string
        }
        Update: {
          arrival_date?: string
          available_capacity?: number
          container_type?: string
          created_at?: string
          currency?: string
          departure_date?: string
          description?: string | null
          destination?: string
          id?: string
          is_active?: boolean
          origin?: string
          price_per_cubic_meter?: number
          provider_id?: string
          total_capacity?: number
          transport_mode?: Database["public"]["Enums"]["transport_mode"]
          updated_at?: string
        }
        Relationships: []
      }
      conversations: {
        Row: {
          created_at: string
          id: string
          participant_1: string
          participant_2: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          participant_1: string
          participant_2: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          participant_1?: string
          participant_2?: string
          updated_at?: string
        }
        Relationships: []
      }
      messages: {
        Row: {
          content: string
          conversation_id: string
          created_at: string
          id: string
          read: boolean
          sender_id: string
        }
        Insert: {
          content: string
          conversation_id: string
          created_at?: string
          id?: string
          read?: boolean
          sender_id: string
        }
        Update: {
          content?: string
          conversation_id?: string
          created_at?: string
          id?: string
          read?: boolean
          sender_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "messages_conversation_id_fkey"
            columns: ["conversation_id"]
            isOneToOne: false
            referencedRelation: "conversations"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          company_name: string | null
          created_at: string
          description: string | null
          email: string
          id: string
          license_number: string | null
          name: string
          phone: string | null
          provider_status: Database["public"]["Enums"]["provider_status"] | null
          rating: number | null
          review_count: number | null
          transport_modes:
            | Database["public"]["Enums"]["transport_mode"][]
            | null
          updated_at: string
          user_id: string
        }
        Insert: {
          company_name?: string | null
          created_at?: string
          description?: string | null
          email: string
          id?: string
          license_number?: string | null
          name: string
          phone?: string | null
          provider_status?:
            | Database["public"]["Enums"]["provider_status"]
            | null
          rating?: number | null
          review_count?: number | null
          transport_modes?:
            | Database["public"]["Enums"]["transport_mode"][]
            | null
          updated_at?: string
          user_id: string
        }
        Update: {
          company_name?: string | null
          created_at?: string
          description?: string | null
          email?: string
          id?: string
          license_number?: string | null
          name?: string
          phone?: string | null
          provider_status?:
            | Database["public"]["Enums"]["provider_status"]
            | null
          rating?: number | null
          review_count?: number | null
          transport_modes?:
            | Database["public"]["Enums"]["transport_mode"][]
            | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin" | "trader" | "provider"
      booking_status: "pending" | "confirmed" | "cancelled" | "completed"
      provider_status: "pending" | "approved" | "rejected"
      transport_mode: "rail" | "road" | "ship" | "air"
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
      app_role: ["admin", "trader", "provider"],
      booking_status: ["pending", "confirmed", "cancelled", "completed"],
      provider_status: ["pending", "approved", "rejected"],
      transport_mode: ["rail", "road", "ship", "air"],
    },
  },
} as const
