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
    PostgrestVersion: "12.2.3 (519615d)"
  }
  public: {
    Tables: {
      clients: {
        Row: {
          company_name: string
          company_url: string
          created_at: string
          email: string
          id: string
          name: string
          updated_at: string
          user_id: string
        }
        Insert: {
          company_name: string
          company_url: string
          created_at?: string
          email: string
          id?: string
          name: string
          updated_at?: string
          user_id: string
        }
        Update: {
          company_name?: string
          company_url?: string
          created_at?: string
          email?: string
          id?: string
          name?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      projects: {
        Row: {
          client_id: string
          created_at: string
          current_testers: number | null
          description: string | null
          id: string
          launch_date: string | null
          name: string
          screening_config: Json | null
          status: string
          survey_config: Json | null
          target_testers: number | null
          updated_at: string
        }
        Insert: {
          client_id: string
          created_at?: string
          current_testers?: number | null
          description?: string | null
          id?: string
          launch_date?: string | null
          name: string
          screening_config?: Json | null
          status?: string
          survey_config?: Json | null
          target_testers?: number | null
          updated_at?: string
        }
        Update: {
          client_id?: string
          created_at?: string
          current_testers?: number | null
          description?: string | null
          id?: string
          launch_date?: string | null
          name?: string
          screening_config?: Json | null
          status?: string
          survey_config?: Json | null
          target_testers?: number | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "fk_projects_client_id"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
        ]
      }
      user_devices: {
        Row: {
          created_at: string
          device_type: string
          id: string
          manufacturer: string
          model: string | null
          operating_system: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          device_type: string
          id?: string
          manufacturer: string
          model?: string | null
          operating_system: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          device_type?: string
          id?: string
          manufacturer?: string
          model?: string | null
          operating_system?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_devices_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "user_profiles"
            referencedColumns: ["user_id"]
          },
        ]
      }
      user_profiles: {
        Row: {
          age: number
          ai_familiarity: string
          ai_interests: string[]
          ai_models_used: string[]
          ai_tools_discovery: string | null
          cell_phone_network: string | null
          company_size: string | null
          country: string
          created_at: string
          education_level: string
          email_clients: string[] | null
          employment_industry: string | null
          first_name: string
          gender: string
          has_projects: boolean | null
          household_income: string | null
          id: string
          is_parent: boolean | null
          job_function: string | null
          languages_spoken: string[] | null
          last_active_tab: string | null
          last_name: string
          linkedin_url: string | null
          music_subscriptions: string[] | null
          password_hash: string | null
          phone_number: string | null
          portfolio_url: string | null
          primary_area_of_study: string | null
          primary_work_role: string | null
          profile_pic_url: string | null
          programming_languages: string[]
          public_testimonials_ok: boolean | null
          social_media_hours: string | null
          social_networks: string[]
          specific_skills: string[] | null
          state: string | null
          streaming_subscriptions: string[] | null
          technical_experience: string
          timezone: string
          twitter_url: string | null
          updated_at: string
          user_id: string
          zip_code: string | null
        }
        Insert: {
          age: number
          ai_familiarity: string
          ai_interests: string[]
          ai_models_used: string[]
          ai_tools_discovery?: string | null
          cell_phone_network?: string | null
          company_size?: string | null
          country: string
          created_at?: string
          education_level: string
          email_clients?: string[] | null
          employment_industry?: string | null
          first_name: string
          gender: string
          has_projects?: boolean | null
          household_income?: string | null
          id?: string
          is_parent?: boolean | null
          job_function?: string | null
          languages_spoken?: string[] | null
          last_active_tab?: string | null
          last_name: string
          linkedin_url?: string | null
          music_subscriptions?: string[] | null
          password_hash?: string | null
          phone_number?: string | null
          portfolio_url?: string | null
          primary_area_of_study?: string | null
          primary_work_role?: string | null
          profile_pic_url?: string | null
          programming_languages: string[]
          public_testimonials_ok?: boolean | null
          social_media_hours?: string | null
          social_networks: string[]
          specific_skills?: string[] | null
          state?: string | null
          streaming_subscriptions?: string[] | null
          technical_experience: string
          timezone: string
          twitter_url?: string | null
          updated_at?: string
          user_id: string
          zip_code?: string | null
        }
        Update: {
          age?: number
          ai_familiarity?: string
          ai_interests?: string[]
          ai_models_used?: string[]
          ai_tools_discovery?: string | null
          cell_phone_network?: string | null
          company_size?: string | null
          country?: string
          created_at?: string
          education_level?: string
          email_clients?: string[] | null
          employment_industry?: string | null
          first_name?: string
          gender?: string
          has_projects?: boolean | null
          household_income?: string | null
          id?: string
          is_parent?: boolean | null
          job_function?: string | null
          languages_spoken?: string[] | null
          last_active_tab?: string | null
          last_name?: string
          linkedin_url?: string | null
          music_subscriptions?: string[] | null
          password_hash?: string | null
          phone_number?: string | null
          portfolio_url?: string | null
          primary_area_of_study?: string | null
          primary_work_role?: string | null
          profile_pic_url?: string | null
          programming_languages?: string[]
          public_testimonials_ok?: boolean | null
          social_media_hours?: string | null
          social_networks?: string[]
          specific_skills?: string[] | null
          state?: string | null
          streaming_subscriptions?: string[] | null
          technical_experience?: string
          timezone?: string
          twitter_url?: string | null
          updated_at?: string
          user_id?: string
          zip_code?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
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
    Enums: {},
  },
} as const
