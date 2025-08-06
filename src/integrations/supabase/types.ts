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
      access_requests: {
        Row: {
          approved_at: string | null
          approved_by: string | null
          created_at: string | null
          id: string
          purpose: string
          requested_area: string
          requested_for: string
          status: string | null
          user_id: string
        }
        Insert: {
          approved_at?: string | null
          approved_by?: string | null
          created_at?: string | null
          id?: string
          purpose: string
          requested_area: string
          requested_for: string
          status?: string | null
          user_id: string
        }
        Update: {
          approved_at?: string | null
          approved_by?: string | null
          created_at?: string | null
          id?: string
          purpose?: string
          requested_area?: string
          requested_for?: string
          status?: string | null
          user_id?: string
        }
        Relationships: []
      }
      alerts: {
        Row: {
          assigned_nurse_id: string | null
          created_at: string | null
          id: string
          is_resolved: boolean | null
          location: string | null
          message: string
          resolved_at: string | null
          severity: Database["public"]["Enums"]["alert_severity"]
          user_id: string
          vitals_data: Json | null
        }
        Insert: {
          assigned_nurse_id?: string | null
          created_at?: string | null
          id?: string
          is_resolved?: boolean | null
          location?: string | null
          message: string
          resolved_at?: string | null
          severity: Database["public"]["Enums"]["alert_severity"]
          user_id: string
          vitals_data?: Json | null
        }
        Update: {
          assigned_nurse_id?: string | null
          created_at?: string | null
          id?: string
          is_resolved?: boolean | null
          location?: string | null
          message?: string
          resolved_at?: string | null
          severity?: Database["public"]["Enums"]["alert_severity"]
          user_id?: string
          vitals_data?: Json | null
        }
        Relationships: []
      }
      incident_logs: {
        Row: {
          created_at: string | null
          description: string
          id: string
          incident_type: string
          location: string | null
          reported_by: string
          resolved_at: string | null
          severity: Database["public"]["Enums"]["alert_severity"]
          status: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          description: string
          id?: string
          incident_type: string
          location?: string | null
          reported_by: string
          resolved_at?: string | null
          severity: Database["public"]["Enums"]["alert_severity"]
          status?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          description?: string
          id?: string
          incident_type?: string
          location?: string | null
          reported_by?: string
          resolved_at?: string | null
          severity?: Database["public"]["Enums"]["alert_severity"]
          status?: string | null
          user_id?: string
        }
        Relationships: []
      }
      locations: {
        Row: {
          coordinates: Json | null
          created_at: string | null
          floor_number: number
          id: string
          last_seen: string | null
          room_number: string | null
          user_id: string
        }
        Insert: {
          coordinates?: Json | null
          created_at?: string | null
          floor_number: number
          id?: string
          last_seen?: string | null
          room_number?: string | null
          user_id: string
        }
        Update: {
          coordinates?: Json | null
          created_at?: string | null
          floor_number?: number
          id?: string
          last_seen?: string | null
          room_number?: string | null
          user_id?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          created_at: string | null
          department: string
          email: string
          emergency_contact: string | null
          employee_id: string
          floor_number: number
          full_name: string
          id: string
          is_active: boolean | null
          office_location: string
          phone: string | null
          privacy_settings: Json | null
          role: Database["public"]["Enums"]["user_role"]
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          department: string
          email: string
          emergency_contact?: string | null
          employee_id: string
          floor_number: number
          full_name: string
          id?: string
          is_active?: boolean | null
          office_location: string
          phone?: string | null
          privacy_settings?: Json | null
          role: Database["public"]["Enums"]["user_role"]
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          department?: string
          email?: string
          emergency_contact?: string | null
          employee_id?: string
          floor_number?: number
          full_name?: string
          id?: string
          is_active?: boolean | null
          office_location?: string
          phone?: string | null
          privacy_settings?: Json | null
          role?: Database["public"]["Enums"]["user_role"]
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      vitals: {
        Row: {
          blood_pressure_diastolic: number | null
          blood_pressure_systolic: number | null
          created_at: string | null
          heart_rate: number | null
          id: string
          oxygen_saturation: number | null
          recorded_at: string | null
          stress_level: number | null
          temperature: number | null
          user_id: string
        }
        Insert: {
          blood_pressure_diastolic?: number | null
          blood_pressure_systolic?: number | null
          created_at?: string | null
          heart_rate?: number | null
          id?: string
          oxygen_saturation?: number | null
          recorded_at?: string | null
          stress_level?: number | null
          temperature?: number | null
          user_id: string
        }
        Update: {
          blood_pressure_diastolic?: number | null
          blood_pressure_systolic?: number | null
          created_at?: string | null
          heart_rate?: number | null
          id?: string
          oxygen_saturation?: number | null
          recorded_at?: string | null
          stress_level?: number | null
          temperature?: number | null
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_current_user_role: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      setup_demo_users: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
    }
    Enums: {
      alert_severity: "mild" | "moderate" | "emergency"
      user_role: "admin" | "employee" | "hexanurse" | "security"
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
      alert_severity: ["mild", "moderate", "emergency"],
      user_role: ["admin", "employee", "hexanurse", "security"],
    },
  },
} as const
