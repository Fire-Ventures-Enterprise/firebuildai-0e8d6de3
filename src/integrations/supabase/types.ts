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
    PostgrestVersion: "13.0.4"
  }
  public: {
    Tables: {
      admin_users: {
        Row: {
          created_at: string
          created_by: string | null
          id: string
          permissions: Json | null
          role: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          id?: string
          permissions?: Json | null
          role?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          created_by?: string | null
          id?: string
          permissions?: Json | null
          role?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      billing_milestones: {
        Row: {
          amount: number | null
          created_at: string
          depends_on_task_codes: string[] | null
          due_date: string | null
          estimate_id: string | null
          id: string
          invoice_id: string | null
          name: string
          paid_date: string | null
          percentage: number
          sort_order: number | null
          status: string | null
          template_id: string | null
          trigger_type: string
          updated_at: string
        }
        Insert: {
          amount?: number | null
          created_at?: string
          depends_on_task_codes?: string[] | null
          due_date?: string | null
          estimate_id?: string | null
          id?: string
          invoice_id?: string | null
          name: string
          paid_date?: string | null
          percentage: number
          sort_order?: number | null
          status?: string | null
          template_id?: string | null
          trigger_type: string
          updated_at?: string
        }
        Update: {
          amount?: number | null
          created_at?: string
          depends_on_task_codes?: string[] | null
          due_date?: string | null
          estimate_id?: string | null
          id?: string
          invoice_id?: string | null
          name?: string
          paid_date?: string | null
          percentage?: number
          sort_order?: number | null
          status?: string | null
          template_id?: string | null
          trigger_type?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "billing_milestones_template_id_fkey"
            columns: ["template_id"]
            isOneToOne: false
            referencedRelation: "templates"
            referencedColumns: ["id"]
          },
        ]
      }
      blackout_windows: {
        Row: {
          created_at: string
          end_date: string
          id: string
          location_id: string | null
          reason: string | null
          start_date: string
          user_id: string
        }
        Insert: {
          created_at?: string
          end_date: string
          id?: string
          location_id?: string | null
          reason?: string | null
          start_date: string
          user_id: string
        }
        Update: {
          created_at?: string
          end_date?: string
          id?: string
          location_id?: string | null
          reason?: string | null
          start_date?: string
          user_id?: string
        }
        Relationships: []
      }
      calendar_event_attendees: {
        Row: {
          created_at: string | null
          email: string
          event_id: string
          id: string
          name: string | null
          response_status: string | null
          role: string | null
        }
        Insert: {
          created_at?: string | null
          email: string
          event_id: string
          id?: string
          name?: string | null
          response_status?: string | null
          role?: string | null
        }
        Update: {
          created_at?: string | null
          email?: string
          event_id?: string
          id?: string
          name?: string | null
          response_status?: string | null
          role?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "calendar_event_attendees_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "calendar_events"
            referencedColumns: ["id"]
          },
        ]
      }
      calendar_events: {
        Row: {
          created_at: string | null
          ends_at: string
          external_calendar_id: string | null
          external_event_id: string | null
          external_provider: string | null
          id: string
          location: string | null
          source: string
          source_id: string
          starts_at: string
          sync_error: string | null
          sync_state: string | null
          team_id: string | null
          title: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          ends_at: string
          external_calendar_id?: string | null
          external_event_id?: string | null
          external_provider?: string | null
          id?: string
          location?: string | null
          source: string
          source_id: string
          starts_at: string
          sync_error?: string | null
          sync_state?: string | null
          team_id?: string | null
          title: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          ends_at?: string
          external_calendar_id?: string | null
          external_event_id?: string | null
          external_provider?: string | null
          id?: string
          location?: string | null
          source?: string
          source_id?: string
          starts_at?: string
          sync_error?: string | null
          sync_state?: string | null
          team_id?: string | null
          title?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      change_orders: {
        Row: {
          amount: number
          approved_at: string | null
          approved_by: string | null
          created_at: string
          customer_id: string | null
          description: string
          id: string
          invoice_id: string | null
          order_number: string
          original_invoice_amount: number | null
          reason: string | null
          signature_data: string | null
          signature_required: boolean | null
          signed_at: string | null
          status: string
          tax_amount: number
          total: number
          updated_at: string
          user_id: string
        }
        Insert: {
          amount?: number
          approved_at?: string | null
          approved_by?: string | null
          created_at?: string
          customer_id?: string | null
          description: string
          id?: string
          invoice_id?: string | null
          order_number: string
          original_invoice_amount?: number | null
          reason?: string | null
          signature_data?: string | null
          signature_required?: boolean | null
          signed_at?: string | null
          status?: string
          tax_amount?: number
          total?: number
          updated_at?: string
          user_id: string
        }
        Update: {
          amount?: number
          approved_at?: string | null
          approved_by?: string | null
          created_at?: string
          customer_id?: string | null
          description?: string
          id?: string
          invoice_id?: string | null
          order_number?: string
          original_invoice_amount?: number | null
          reason?: string | null
          signature_data?: string | null
          signature_required?: boolean | null
          signed_at?: string | null
          status?: string
          tax_amount?: number
          total?: number
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "change_orders_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "customers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "change_orders_invoice_id_fkey"
            columns: ["invoice_id"]
            isOneToOne: false
            referencedRelation: "invoices"
            referencedColumns: ["id"]
          },
        ]
      }
      chat_messages: {
        Row: {
          attachments: Json | null
          created_at: string
          edited: boolean | null
          edited_at: string | null
          id: string
          message: string
          room_id: string
          sender_id: string
        }
        Insert: {
          attachments?: Json | null
          created_at?: string
          edited?: boolean | null
          edited_at?: string | null
          id?: string
          message: string
          room_id: string
          sender_id: string
        }
        Update: {
          attachments?: Json | null
          created_at?: string
          edited?: boolean | null
          edited_at?: string | null
          id?: string
          message?: string
          room_id?: string
          sender_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "chat_messages_room_id_fkey"
            columns: ["room_id"]
            isOneToOne: false
            referencedRelation: "job_chat_rooms"
            referencedColumns: ["id"]
          },
        ]
      }
      chat_room_members: {
        Row: {
          id: string
          invited_by: string | null
          joined_at: string
          role: string
          room_id: string
          user_id: string
        }
        Insert: {
          id?: string
          invited_by?: string | null
          joined_at?: string
          role?: string
          room_id: string
          user_id: string
        }
        Update: {
          id?: string
          invited_by?: string | null
          joined_at?: string
          role?: string
          room_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "chat_room_members_room_id_fkey"
            columns: ["room_id"]
            isOneToOne: false
            referencedRelation: "job_chat_rooms"
            referencedColumns: ["id"]
          },
        ]
      }
      client_companies: {
        Row: {
          active: boolean | null
          company_name: string
          contact_email: string | null
          created_at: string
          id: string
          subscriber_id: string | null
          updated_at: string
        }
        Insert: {
          active?: boolean | null
          company_name: string
          contact_email?: string | null
          created_at?: string
          id?: string
          subscriber_id?: string | null
          updated_at?: string
        }
        Update: {
          active?: boolean | null
          company_name?: string
          contact_email?: string | null
          created_at?: string
          id?: string
          subscriber_id?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "client_companies_subscriber_id_fkey"
            columns: ["subscriber_id"]
            isOneToOne: false
            referencedRelation: "subscribers"
            referencedColumns: ["id"]
          },
        ]
      }
      company_details: {
        Row: {
          address: string | null
          city: string | null
          company_name: string | null
          country: string | null
          created_at: string
          default_work_hours: Json | null
          email: string | null
          enable_capacity_planning: boolean | null
          frozen_zone_days: number | null
          id: string
          logo_url: string | null
          payment_settings: Json | null
          phone: string | null
          postal_code: string | null
          state: string | null
          updated_at: string
          user_id: string
          website: string | null
        }
        Insert: {
          address?: string | null
          city?: string | null
          company_name?: string | null
          country?: string | null
          created_at?: string
          default_work_hours?: Json | null
          email?: string | null
          enable_capacity_planning?: boolean | null
          frozen_zone_days?: number | null
          id?: string
          logo_url?: string | null
          payment_settings?: Json | null
          phone?: string | null
          postal_code?: string | null
          state?: string | null
          updated_at?: string
          user_id: string
          website?: string | null
        }
        Update: {
          address?: string | null
          city?: string | null
          company_name?: string | null
          country?: string | null
          created_at?: string
          default_work_hours?: Json | null
          email?: string | null
          enable_capacity_planning?: boolean | null
          frozen_zone_days?: number | null
          id?: string
          logo_url?: string | null
          payment_settings?: Json | null
          phone?: string | null
          postal_code?: string | null
          state?: string | null
          updated_at?: string
          user_id?: string
          website?: string | null
        }
        Relationships: []
      }
      company_holidays: {
        Row: {
          created_at: string
          holiday_date: string
          id: string
          name: string | null
          user_id: string
        }
        Insert: {
          created_at?: string
          holiday_date: string
          id?: string
          name?: string | null
          user_id: string
        }
        Update: {
          created_at?: string
          holiday_date?: string
          id?: string
          name?: string | null
          user_id?: string
        }
        Relationships: []
      }
      company_working_hours: {
        Row: {
          created_at: string
          day_of_week: number
          end_time: string
          id: string
          is_working_day: boolean | null
          start_time: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          day_of_week: number
          end_time: string
          id?: string
          is_working_day?: boolean | null
          start_time: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          day_of_week?: number
          end_time?: string
          id?: string
          is_working_day?: boolean | null
          start_time?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      consultation_bookings: {
        Row: {
          company_name: string | null
          confirmation_token: string | null
          created_at: string
          email: string
          id: string
          message: string | null
          name: string
          phone: string | null
          public_token: string
          slot_id: string | null
          status: string | null
          updated_at: string
        }
        Insert: {
          company_name?: string | null
          confirmation_token?: string | null
          created_at?: string
          email: string
          id?: string
          message?: string | null
          name: string
          phone?: string | null
          public_token?: string
          slot_id?: string | null
          status?: string | null
          updated_at?: string
        }
        Update: {
          company_name?: string | null
          confirmation_token?: string | null
          created_at?: string
          email?: string
          id?: string
          message?: string | null
          name?: string
          phone?: string | null
          public_token?: string
          slot_id?: string | null
          status?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "consultation_bookings_slot_id_fkey"
            columns: ["slot_id"]
            isOneToOne: false
            referencedRelation: "consultation_slots"
            referencedColumns: ["id"]
          },
        ]
      }
      consultation_slots: {
        Row: {
          created_at: string
          current_bookings: number | null
          duration_minutes: number | null
          id: string
          is_available: boolean | null
          max_bookings: number | null
          slot_date: string
          slot_time: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          current_bookings?: number | null
          duration_minutes?: number | null
          id?: string
          is_available?: boolean | null
          max_bookings?: number | null
          slot_date: string
          slot_time: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          current_bookings?: number | null
          duration_minutes?: number | null
          id?: string
          is_available?: boolean | null
          max_bookings?: number | null
          slot_date?: string
          slot_time?: string
          updated_at?: string
        }
        Relationships: []
      }
      customers: {
        Row: {
          address: string | null
          city: string | null
          company_name: string | null
          created_at: string
          email: string | null
          first_name: string | null
          id: string
          last_name: string | null
          notes: string | null
          phone: string | null
          postal_code: string | null
          province: string | null
          stripe_customer_id: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          address?: string | null
          city?: string | null
          company_name?: string | null
          created_at?: string
          email?: string | null
          first_name?: string | null
          id?: string
          last_name?: string | null
          notes?: string | null
          phone?: string | null
          postal_code?: string | null
          province?: string | null
          stripe_customer_id?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          address?: string | null
          city?: string | null
          company_name?: string | null
          created_at?: string
          email?: string | null
          first_name?: string | null
          id?: string
          last_name?: string | null
          notes?: string | null
          phone?: string | null
          postal_code?: string | null
          province?: string | null
          stripe_customer_id?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      device_pairings: {
        Row: {
          action_link: string
          created_at: string
          device_meta: Json | null
          email: string
          expires_at: string
          id: string
          pairing_token: string
          used_at: string | null
          user_id: string
        }
        Insert: {
          action_link: string
          created_at?: string
          device_meta?: Json | null
          email: string
          expires_at: string
          id?: string
          pairing_token: string
          used_at?: string | null
          user_id: string
        }
        Update: {
          action_link?: string
          created_at?: string
          device_meta?: Json | null
          email?: string
          expires_at?: string
          id?: string
          pairing_token?: string
          used_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      device_sessions: {
        Row: {
          created_at: string
          device_name: string | null
          device_type: string | null
          id: string
          ip_address: string | null
          last_active: string
          revoked_at: string | null
          revoked_by: string | null
          user_agent: string | null
          user_id: string
        }
        Insert: {
          created_at?: string
          device_name?: string | null
          device_type?: string | null
          id?: string
          ip_address?: string | null
          last_active?: string
          revoked_at?: string | null
          revoked_by?: string | null
          user_agent?: string | null
          user_id: string
        }
        Update: {
          created_at?: string
          device_name?: string | null
          device_type?: string | null
          id?: string
          ip_address?: string | null
          last_active?: string
          revoked_at?: string | null
          revoked_by?: string | null
          user_agent?: string | null
          user_id?: string
        }
        Relationships: []
      }
      email_events: {
        Row: {
          created_at: string | null
          event: string
          id: number
          meta: Json | null
          provider_id: string | null
          subject: string | null
          to_email: string | null
        }
        Insert: {
          created_at?: string | null
          event: string
          id?: number
          meta?: Json | null
          provider_id?: string | null
          subject?: string | null
          to_email?: string | null
        }
        Update: {
          created_at?: string | null
          event?: string
          id?: number
          meta?: Json | null
          provider_id?: string | null
          subject?: string | null
          to_email?: string | null
        }
        Relationships: []
      }
      email_leads: {
        Row: {
          accepted_terms: boolean
          created_at: string
          email: string
          id: string
          ip_address: string | null
          marketing_consent: boolean | null
          source_page: string | null
          user_agent: string | null
        }
        Insert: {
          accepted_terms?: boolean
          created_at?: string
          email: string
          id?: string
          ip_address?: string | null
          marketing_consent?: boolean | null
          source_page?: string | null
          user_agent?: string | null
        }
        Update: {
          accepted_terms?: boolean
          created_at?: string
          email?: string
          id?: string
          ip_address?: string | null
          marketing_consent?: boolean | null
          source_page?: string | null
          user_agent?: string | null
        }
        Relationships: []
      }
      email_outbox: {
        Row: {
          bcc: string[] | null
          cc: string[] | null
          created_at: string | null
          error: string | null
          id: string
          next_retry_at: string | null
          payload: Json
          provider_id: string | null
          ref_id: string | null
          retry_count: number | null
          sent_at: string | null
          status: string
          subject: string
          template: string
          to_email: string
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          bcc?: string[] | null
          cc?: string[] | null
          created_at?: string | null
          error?: string | null
          id?: string
          next_retry_at?: string | null
          payload: Json
          provider_id?: string | null
          ref_id?: string | null
          retry_count?: number | null
          sent_at?: string | null
          status?: string
          subject: string
          template: string
          to_email: string
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          bcc?: string[] | null
          cc?: string[] | null
          created_at?: string | null
          error?: string | null
          id?: string
          next_retry_at?: string | null
          payload?: Json
          provider_id?: string | null
          ref_id?: string | null
          retry_count?: number | null
          sent_at?: string | null
          status?: string
          subject?: string
          template?: string
          to_email?: string
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      email_rate_limits: {
        Row: {
          count: number | null
          email: string
          window_start: string
        }
        Insert: {
          count?: number | null
          email: string
          window_start: string
        }
        Update: {
          count?: number | null
          email?: string
          window_start?: string
        }
        Relationships: []
      }
      email_suppressions: {
        Row: {
          created_at: string | null
          email: string
          id: string
          meta: Json | null
          reason: string
        }
        Insert: {
          created_at?: string | null
          email: string
          id?: string
          meta?: Json | null
          reason: string
        }
        Update: {
          created_at?: string | null
          email?: string
          id?: string
          meta?: Json | null
          reason?: string
        }
        Relationships: []
      }
      estimate_items: {
        Row: {
          amount: number
          created_at: string
          description: string
          estimate_id: string
          id: string
          quantity: number
          rate: number
          sort_order: number | null
        }
        Insert: {
          amount: number
          created_at?: string
          description: string
          estimate_id: string
          id?: string
          quantity?: number
          rate: number
          sort_order?: number | null
        }
        Update: {
          amount?: number
          created_at?: string
          description?: string
          estimate_id?: string
          id?: string
          quantity?: number
          rate?: number
          sort_order?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "estimate_items_estimate_id_fkey"
            columns: ["estimate_id"]
            isOneToOne: false
            referencedRelation: "estimates"
            referencedColumns: ["id"]
          },
        ]
      }
      estimate_views: {
        Row: {
          estimate_id: string
          id: string
          ip: unknown | null
          user_agent: string | null
          viewed_at: string
        }
        Insert: {
          estimate_id: string
          id?: string
          ip?: unknown | null
          user_agent?: string | null
          viewed_at?: string
        }
        Update: {
          estimate_id?: string
          id?: string
          ip?: unknown | null
          user_agent?: string | null
          viewed_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "estimate_views_estimate_id_fkey"
            columns: ["estimate_id"]
            isOneToOne: false
            referencedRelation: "estimates"
            referencedColumns: ["id"]
          },
        ]
      }
      estimates: {
        Row: {
          accepted_at: string | null
          accepted_by_email: string | null
          accepted_by_name: string | null
          accepted_ip: string | null
          contract_attached: boolean | null
          converted_to_invoice: boolean | null
          created_at: string
          customer_id: string
          deposit_amount: number | null
          deposit_percentage: number | null
          estimate_number: string
          expiration_date: string | null
          id: string
          invoice_id: string | null
          issue_date: string
          last_sent_to: string | null
          notes: string | null
          public_token: string | null
          public_token_hash: string | null
          scope_of_work: string | null
          sent_at: string | null
          sent_by: string | null
          sent_count: number | null
          service_address: string | null
          service_city: string | null
          service_postal_code: string | null
          service_province: string | null
          signature_data: string | null
          signature_ip: string | null
          signature_required: boolean | null
          signed_at: string | null
          signed_by_email: string | null
          signed_by_name: string | null
          status: string
          subtotal: number
          tax_amount: number
          tax_rate: number | null
          terms_conditions: string | null
          total: number
          updated_at: string
          user_id: string
          viewed_at: string | null
        }
        Insert: {
          accepted_at?: string | null
          accepted_by_email?: string | null
          accepted_by_name?: string | null
          accepted_ip?: string | null
          contract_attached?: boolean | null
          converted_to_invoice?: boolean | null
          created_at?: string
          customer_id: string
          deposit_amount?: number | null
          deposit_percentage?: number | null
          estimate_number: string
          expiration_date?: string | null
          id?: string
          invoice_id?: string | null
          issue_date?: string
          last_sent_to?: string | null
          notes?: string | null
          public_token?: string | null
          public_token_hash?: string | null
          scope_of_work?: string | null
          sent_at?: string | null
          sent_by?: string | null
          sent_count?: number | null
          service_address?: string | null
          service_city?: string | null
          service_postal_code?: string | null
          service_province?: string | null
          signature_data?: string | null
          signature_ip?: string | null
          signature_required?: boolean | null
          signed_at?: string | null
          signed_by_email?: string | null
          signed_by_name?: string | null
          status?: string
          subtotal?: number
          tax_amount?: number
          tax_rate?: number | null
          terms_conditions?: string | null
          total?: number
          updated_at?: string
          user_id: string
          viewed_at?: string | null
        }
        Update: {
          accepted_at?: string | null
          accepted_by_email?: string | null
          accepted_by_name?: string | null
          accepted_ip?: string | null
          contract_attached?: boolean | null
          converted_to_invoice?: boolean | null
          created_at?: string
          customer_id?: string
          deposit_amount?: number | null
          deposit_percentage?: number | null
          estimate_number?: string
          expiration_date?: string | null
          id?: string
          invoice_id?: string | null
          issue_date?: string
          last_sent_to?: string | null
          notes?: string | null
          public_token?: string | null
          public_token_hash?: string | null
          scope_of_work?: string | null
          sent_at?: string | null
          sent_by?: string | null
          sent_count?: number | null
          service_address?: string | null
          service_city?: string | null
          service_postal_code?: string | null
          service_province?: string | null
          signature_data?: string | null
          signature_ip?: string | null
          signature_required?: boolean | null
          signed_at?: string | null
          signed_by_email?: string | null
          signed_by_name?: string | null
          status?: string
          subtotal?: number
          tax_amount?: number
          tax_rate?: number | null
          terms_conditions?: string | null
          total?: number
          updated_at?: string
          user_id?: string
          viewed_at?: string | null
        }
        Relationships: []
      }
      expense_categories: {
        Row: {
          created_at: string
          id: string
          is_fuel: boolean
          is_mileage: boolean
          name: string
          slug: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          is_fuel?: boolean
          is_mileage?: boolean
          name: string
          slug: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          is_fuel?: boolean
          is_mileage?: boolean
          name?: string
          slug?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      expense_job_allocations: {
        Row: {
          amount: number | null
          cost_code: string | null
          created_at: string
          expense_id: string
          id: string
          job_id: string | null
          percent: number | null
        }
        Insert: {
          amount?: number | null
          cost_code?: string | null
          created_at?: string
          expense_id: string
          id?: string
          job_id?: string | null
          percent?: number | null
        }
        Update: {
          amount?: number | null
          cost_code?: string | null
          created_at?: string
          expense_id?: string
          id?: string
          job_id?: string | null
          percent?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "expense_job_allocations_expense_id_fkey"
            columns: ["expense_id"]
            isOneToOne: false
            referencedRelation: "expenses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "expense_job_allocations_job_id_fkey"
            columns: ["job_id"]
            isOneToOne: false
            referencedRelation: "jobs"
            referencedColumns: ["id"]
          },
        ]
      }
      expense_receipts: {
        Row: {
          created_at: string
          expense_id: string
          id: string
          mime: string
          ocr_json: Json | null
          parsed: Json | null
          storage_path: string
        }
        Insert: {
          created_at?: string
          expense_id: string
          id?: string
          mime: string
          ocr_json?: Json | null
          parsed?: Json | null
          storage_path: string
        }
        Update: {
          created_at?: string
          expense_id?: string
          id?: string
          mime?: string
          ocr_json?: Json | null
          parsed?: Json | null
          storage_path?: string
        }
        Relationships: [
          {
            foreignKeyName: "expense_receipts_expense_id_fkey"
            columns: ["expense_id"]
            isOneToOne: false
            referencedRelation: "expenses"
            referencedColumns: ["id"]
          },
        ]
      }
      expenses: {
        Row: {
          category_id: string
          created_at: string
          created_by: string
          currency: string
          id: string
          invoice_id: string | null
          job_locked: boolean
          notes: string | null
          paid_at: string | null
          payment_method: string | null
          po_id: string | null
          status: string
          subtotal: number
          tax: number
          total: number | null
          txn_date: string
          updated_at: string
          user_id: string
          vendor_id: string | null
        }
        Insert: {
          category_id: string
          created_at?: string
          created_by: string
          currency?: string
          id?: string
          invoice_id?: string | null
          job_locked?: boolean
          notes?: string | null
          paid_at?: string | null
          payment_method?: string | null
          po_id?: string | null
          status?: string
          subtotal?: number
          tax?: number
          total?: number | null
          txn_date?: string
          updated_at?: string
          user_id: string
          vendor_id?: string | null
        }
        Update: {
          category_id?: string
          created_at?: string
          created_by?: string
          currency?: string
          id?: string
          invoice_id?: string | null
          job_locked?: boolean
          notes?: string | null
          paid_at?: string | null
          payment_method?: string | null
          po_id?: string | null
          status?: string
          subtotal?: number
          tax?: number
          total?: number | null
          txn_date?: string
          updated_at?: string
          user_id?: string
          vendor_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "expenses_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "expense_categories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "expenses_invoice_id_fkey"
            columns: ["invoice_id"]
            isOneToOne: false
            referencedRelation: "invoices_due_view"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "expenses_invoice_id_fkey"
            columns: ["invoice_id"]
            isOneToOne: false
            referencedRelation: "invoices_enhanced"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "expenses_po_id_fkey"
            columns: ["po_id"]
            isOneToOne: false
            referencedRelation: "po_payment_totals"
            referencedColumns: ["po_id"]
          },
          {
            foreignKeyName: "expenses_po_id_fkey"
            columns: ["po_id"]
            isOneToOne: false
            referencedRelation: "purchase_orders"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "expenses_vendor_id_fkey"
            columns: ["vendor_id"]
            isOneToOne: false
            referencedRelation: "vendors"
            referencedColumns: ["id"]
          },
        ]
      }
      google_accounts: {
        Row: {
          access_token: string | null
          created_at: string | null
          email: string
          id: string
          refresh_token: string
          scope: string[] | null
          token_expiry: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          access_token?: string | null
          created_at?: string | null
          email: string
          id?: string
          refresh_token: string
          scope?: string[] | null
          token_expiry?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          access_token?: string | null
          created_at?: string | null
          email?: string
          id?: string
          refresh_token?: string
          scope?: string[] | null
          token_expiry?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      google_calendars: {
        Row: {
          account_id: string
          calendar_id: string
          created_at: string | null
          id: string
          is_primary: boolean | null
          is_selected: boolean | null
          summary: string | null
        }
        Insert: {
          account_id: string
          calendar_id: string
          created_at?: string | null
          id?: string
          is_primary?: boolean | null
          is_selected?: boolean | null
          summary?: string | null
        }
        Update: {
          account_id?: string
          calendar_id?: string
          created_at?: string | null
          id?: string
          is_primary?: boolean | null
          is_selected?: boolean | null
          summary?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "google_calendars_account_id_fkey"
            columns: ["account_id"]
            isOneToOne: false
            referencedRelation: "google_accounts"
            referencedColumns: ["id"]
          },
        ]
      }
      invoice_adjustments: {
        Row: {
          created_at: string | null
          id: string
          invoice_id: string
          items: Json
          source: string
          source_id: string | null
          status: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          invoice_id: string
          items: Json
          source?: string
          source_id?: string | null
          status?: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          invoice_id?: string
          items?: Json
          source?: string
          source_id?: string | null
          status?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "invoice_adjustments_invoice_id_fkey"
            columns: ["invoice_id"]
            isOneToOne: false
            referencedRelation: "invoices_due_view"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "invoice_adjustments_invoice_id_fkey"
            columns: ["invoice_id"]
            isOneToOne: false
            referencedRelation: "invoices_enhanced"
            referencedColumns: ["id"]
          },
        ]
      }
      invoice_attachments: {
        Row: {
          id: string
          invoice_id: string
          name: string
          size: number | null
          type: string | null
          uploaded_at: string
          url: string
        }
        Insert: {
          id?: string
          invoice_id: string
          name: string
          size?: number | null
          type?: string | null
          uploaded_at?: string
          url: string
        }
        Update: {
          id?: string
          invoice_id?: string
          name?: string
          size?: number | null
          type?: string | null
          uploaded_at?: string
          url?: string
        }
        Relationships: [
          {
            foreignKeyName: "invoice_attachments_invoice_id_fkey"
            columns: ["invoice_id"]
            isOneToOne: false
            referencedRelation: "invoices_due_view"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "invoice_attachments_invoice_id_fkey"
            columns: ["invoice_id"]
            isOneToOne: false
            referencedRelation: "invoices_enhanced"
            referencedColumns: ["id"]
          },
        ]
      }
      invoice_change_log: {
        Row: {
          change_order_id: string | null
          change_type: string
          created_at: string
          description: string
          id: string
          invoice_id: string
          new_value: Json | null
          old_value: Json | null
          override_used: boolean | null
          user_id: string
        }
        Insert: {
          change_order_id?: string | null
          change_type: string
          created_at?: string
          description: string
          id?: string
          invoice_id: string
          new_value?: Json | null
          old_value?: Json | null
          override_used?: boolean | null
          user_id: string
        }
        Update: {
          change_order_id?: string | null
          change_type?: string
          created_at?: string
          description?: string
          id?: string
          invoice_id?: string
          new_value?: Json | null
          old_value?: Json | null
          override_used?: boolean | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "invoice_change_log_change_order_id_fkey"
            columns: ["change_order_id"]
            isOneToOne: false
            referencedRelation: "change_orders"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "invoice_change_log_invoice_id_fkey"
            columns: ["invoice_id"]
            isOneToOne: false
            referencedRelation: "invoices"
            referencedColumns: ["id"]
          },
        ]
      }
      invoice_items: {
        Row: {
          amount: number
          created_at: string
          description: string
          id: string
          invoice_id: string
          quantity: number
          rate: number
          sort_order: number | null
        }
        Insert: {
          amount: number
          created_at?: string
          description: string
          id?: string
          invoice_id: string
          quantity?: number
          rate: number
          sort_order?: number | null
        }
        Update: {
          amount?: number
          created_at?: string
          description?: string
          id?: string
          invoice_id?: string
          quantity?: number
          rate?: number
          sort_order?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "invoice_items_invoice_id_fkey"
            columns: ["invoice_id"]
            isOneToOne: false
            referencedRelation: "invoices"
            referencedColumns: ["id"]
          },
        ]
      }
      invoice_items_enhanced: {
        Row: {
          amount: number
          created_at: string
          description: string | null
          id: string
          invoice_id: string
          item_name: string
          markup: number | null
          markup_amount: number | null
          markup_type: string | null
          quantity: number
          rate: number
          sort_order: number | null
          tax: boolean | null
        }
        Insert: {
          amount: number
          created_at?: string
          description?: string | null
          id?: string
          invoice_id: string
          item_name: string
          markup?: number | null
          markup_amount?: number | null
          markup_type?: string | null
          quantity?: number
          rate: number
          sort_order?: number | null
          tax?: boolean | null
        }
        Update: {
          amount?: number
          created_at?: string
          description?: string | null
          id?: string
          invoice_id?: string
          item_name?: string
          markup?: number | null
          markup_amount?: number | null
          markup_type?: string | null
          quantity?: number
          rate?: number
          sort_order?: number | null
          tax?: boolean | null
        }
        Relationships: [
          {
            foreignKeyName: "invoice_items_enhanced_invoice_id_fkey"
            columns: ["invoice_id"]
            isOneToOne: false
            referencedRelation: "invoices_due_view"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "invoice_items_enhanced_invoice_id_fkey"
            columns: ["invoice_id"]
            isOneToOne: false
            referencedRelation: "invoices_enhanced"
            referencedColumns: ["id"]
          },
        ]
      }
      invoice_payment_schedule: {
        Row: {
          amount: number
          created_at: string
          description: string
          due_date: string | null
          id: string
          invoice_id: string
          paid_date: string | null
          percentage: number | null
          status: string | null
        }
        Insert: {
          amount: number
          created_at?: string
          description: string
          due_date?: string | null
          id?: string
          invoice_id: string
          paid_date?: string | null
          percentage?: number | null
          status?: string | null
        }
        Update: {
          amount?: number
          created_at?: string
          description?: string
          due_date?: string | null
          id?: string
          invoice_id?: string
          paid_date?: string | null
          percentage?: number | null
          status?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "invoice_payment_schedule_invoice_id_fkey"
            columns: ["invoice_id"]
            isOneToOne: false
            referencedRelation: "invoices_due_view"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "invoice_payment_schedule_invoice_id_fkey"
            columns: ["invoice_id"]
            isOneToOne: false
            referencedRelation: "invoices_enhanced"
            referencedColumns: ["id"]
          },
        ]
      }
      invoice_payments: {
        Row: {
          amount: number
          created_at: string
          id: string
          invoice_id: string
          notes: string | null
          payment_date: string
          payment_method: string
          status: string
          transaction_id: string | null
          updated_at: string
        }
        Insert: {
          amount: number
          created_at?: string
          id?: string
          invoice_id: string
          notes?: string | null
          payment_date?: string
          payment_method: string
          status?: string
          transaction_id?: string | null
          updated_at?: string
        }
        Update: {
          amount?: number
          created_at?: string
          id?: string
          invoice_id?: string
          notes?: string | null
          payment_date?: string
          payment_method?: string
          status?: string
          transaction_id?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "invoice_payments_invoice_id_fkey"
            columns: ["invoice_id"]
            isOneToOne: false
            referencedRelation: "invoices_due_view"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "invoice_payments_invoice_id_fkey"
            columns: ["invoice_id"]
            isOneToOne: false
            referencedRelation: "invoices_enhanced"
            referencedColumns: ["id"]
          },
        ]
      }
      invoice_photos: {
        Row: {
          caption: string | null
          id: string
          invoice_id: string
          uploaded_at: string
          url: string
        }
        Insert: {
          caption?: string | null
          id?: string
          invoice_id: string
          uploaded_at?: string
          url: string
        }
        Update: {
          caption?: string | null
          id?: string
          invoice_id?: string
          uploaded_at?: string
          url?: string
        }
        Relationships: [
          {
            foreignKeyName: "invoice_photos_invoice_id_fkey"
            columns: ["invoice_id"]
            isOneToOne: false
            referencedRelation: "invoices_due_view"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "invoice_photos_invoice_id_fkey"
            columns: ["invoice_id"]
            isOneToOne: false
            referencedRelation: "invoices_enhanced"
            referencedColumns: ["id"]
          },
        ]
      }
      invoice_scheduling: {
        Row: {
          created_at: string
          ends_at: string
          id: string
          invoice_id: string
          notes: string | null
          starts_at: string
          status: string
          team_id: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          ends_at: string
          id?: string
          invoice_id: string
          notes?: string | null
          starts_at: string
          status?: string
          team_id?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          ends_at?: string
          id?: string
          invoice_id?: string
          notes?: string | null
          starts_at?: string
          status?: string
          team_id?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      invoice_signatures: {
        Row: {
          id: string
          invoice_id: string
          ip_address: string | null
          name: string
          signature_data: string | null
          signature_required: boolean | null
          signed_at: string | null
          type: string
        }
        Insert: {
          id?: string
          invoice_id: string
          ip_address?: string | null
          name: string
          signature_data?: string | null
          signature_required?: boolean | null
          signed_at?: string | null
          type: string
        }
        Update: {
          id?: string
          invoice_id?: string
          ip_address?: string | null
          name?: string
          signature_data?: string | null
          signature_required?: boolean | null
          signed_at?: string | null
          type?: string
        }
        Relationships: [
          {
            foreignKeyName: "invoice_signatures_invoice_id_fkey"
            columns: ["invoice_id"]
            isOneToOne: false
            referencedRelation: "invoices_due_view"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "invoice_signatures_invoice_id_fkey"
            columns: ["invoice_id"]
            isOneToOne: false
            referencedRelation: "invoices_enhanced"
            referencedColumns: ["id"]
          },
        ]
      }
      invoices: {
        Row: {
          balance: number
          contract_accepted: boolean | null
          contract_accepted_at: string | null
          contract_attached: boolean | null
          created_at: string
          customer_id: string
          due_date: string | null
          estimate_id: string | null
          id: string
          invoice_number: string
          is_locked: boolean | null
          issue_date: string
          last_override_at: string | null
          last_override_by: string | null
          lock_reason: string | null
          notes: string | null
          override_password: string | null
          paid_amount: number | null
          status: string
          subtotal: number
          tax_amount: number
          tax_rate: number | null
          terms_conditions: string | null
          total: number
          updated_at: string
          user_id: string
        }
        Insert: {
          balance?: number
          contract_accepted?: boolean | null
          contract_accepted_at?: string | null
          contract_attached?: boolean | null
          created_at?: string
          customer_id: string
          due_date?: string | null
          estimate_id?: string | null
          id?: string
          invoice_number: string
          is_locked?: boolean | null
          issue_date?: string
          last_override_at?: string | null
          last_override_by?: string | null
          lock_reason?: string | null
          notes?: string | null
          override_password?: string | null
          paid_amount?: number | null
          status?: string
          subtotal?: number
          tax_amount?: number
          tax_rate?: number | null
          terms_conditions?: string | null
          total?: number
          updated_at?: string
          user_id: string
        }
        Update: {
          balance?: number
          contract_accepted?: boolean | null
          contract_accepted_at?: string | null
          contract_attached?: boolean | null
          created_at?: string
          customer_id?: string
          due_date?: string | null
          estimate_id?: string | null
          id?: string
          invoice_number?: string
          is_locked?: boolean | null
          issue_date?: string
          last_override_at?: string | null
          last_override_by?: string | null
          lock_reason?: string | null
          notes?: string | null
          override_password?: string | null
          paid_amount?: number | null
          status?: string
          subtotal?: number
          tax_amount?: number
          tax_rate?: number | null
          terms_conditions?: string | null
          total?: number
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "invoices_estimate_id_fkey"
            columns: ["estimate_id"]
            isOneToOne: false
            referencedRelation: "estimates"
            referencedColumns: ["id"]
          },
        ]
      }
      invoices_enhanced: {
        Row: {
          accept_online_payments: boolean | null
          attachments: Json | null
          balance: number | null
          contract_required: boolean | null
          contract_text: string | null
          contract_url: string | null
          cover_processing_fee: boolean | null
          created_at: string
          customer_address: string | null
          customer_city: string | null
          customer_email: string | null
          customer_id: string | null
          customer_name: string | null
          customer_phone: string | null
          customer_postal_code: string | null
          customer_province: string | null
          days_to_payment: number | null
          deposit_amount: number | null
          deposit_request: number | null
          deposit_type: string | null
          discount: number | null
          discount_amount: number | null
          discount_type: string | null
          due_date: string | null
          gross_profit: number | null
          id: string
          invoice_number: string
          issue_date: string
          last_sent_to: string | null
          markup_total: number | null
          net_profit: number | null
          notes: string | null
          overhead_percentage: number | null
          paid_amount: number | null
          photos: Json | null
          po_number: string | null
          private_notes: string | null
          profit_margin: number | null
          public_token: string | null
          public_token_hash: string | null
          sent_at: string | null
          sent_by: string | null
          sent_count: number | null
          service_address: string | null
          service_city: string | null
          service_postal_code: string | null
          service_province: string | null
          signatures: Json | null
          status: string
          subtotal: number
          tax_amount: number
          tax_rate: number | null
          total: number
          total_expenses: number | null
          updated_at: string
          user_id: string
        }
        Insert: {
          accept_online_payments?: boolean | null
          attachments?: Json | null
          balance?: number | null
          contract_required?: boolean | null
          contract_text?: string | null
          contract_url?: string | null
          cover_processing_fee?: boolean | null
          created_at?: string
          customer_address?: string | null
          customer_city?: string | null
          customer_email?: string | null
          customer_id?: string | null
          customer_name?: string | null
          customer_phone?: string | null
          customer_postal_code?: string | null
          customer_province?: string | null
          days_to_payment?: number | null
          deposit_amount?: number | null
          deposit_request?: number | null
          deposit_type?: string | null
          discount?: number | null
          discount_amount?: number | null
          discount_type?: string | null
          due_date?: string | null
          gross_profit?: number | null
          id?: string
          invoice_number: string
          issue_date?: string
          last_sent_to?: string | null
          markup_total?: number | null
          net_profit?: number | null
          notes?: string | null
          overhead_percentage?: number | null
          paid_amount?: number | null
          photos?: Json | null
          po_number?: string | null
          private_notes?: string | null
          profit_margin?: number | null
          public_token?: string | null
          public_token_hash?: string | null
          sent_at?: string | null
          sent_by?: string | null
          sent_count?: number | null
          service_address?: string | null
          service_city?: string | null
          service_postal_code?: string | null
          service_province?: string | null
          signatures?: Json | null
          status?: string
          subtotal?: number
          tax_amount?: number
          tax_rate?: number | null
          total?: number
          total_expenses?: number | null
          updated_at?: string
          user_id: string
        }
        Update: {
          accept_online_payments?: boolean | null
          attachments?: Json | null
          balance?: number | null
          contract_required?: boolean | null
          contract_text?: string | null
          contract_url?: string | null
          cover_processing_fee?: boolean | null
          created_at?: string
          customer_address?: string | null
          customer_city?: string | null
          customer_email?: string | null
          customer_id?: string | null
          customer_name?: string | null
          customer_phone?: string | null
          customer_postal_code?: string | null
          customer_province?: string | null
          days_to_payment?: number | null
          deposit_amount?: number | null
          deposit_request?: number | null
          deposit_type?: string | null
          discount?: number | null
          discount_amount?: number | null
          discount_type?: string | null
          due_date?: string | null
          gross_profit?: number | null
          id?: string
          invoice_number?: string
          issue_date?: string
          last_sent_to?: string | null
          markup_total?: number | null
          net_profit?: number | null
          notes?: string | null
          overhead_percentage?: number | null
          paid_amount?: number | null
          photos?: Json | null
          po_number?: string | null
          private_notes?: string | null
          profit_margin?: number | null
          public_token?: string | null
          public_token_hash?: string | null
          sent_at?: string | null
          sent_by?: string | null
          sent_count?: number | null
          service_address?: string | null
          service_city?: string | null
          service_postal_code?: string | null
          service_province?: string | null
          signatures?: Json | null
          status?: string
          subtotal?: number
          tax_amount?: number
          tax_rate?: number | null
          total?: number
          total_expenses?: number | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "invoices_enhanced_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "customers"
            referencedColumns: ["id"]
          },
        ]
      }
      job_chat_members: {
        Row: {
          added_at: string
          added_by: string | null
          chat_id: string
          id: string
          role: Database["public"]["Enums"]["chat_role"]
          user_id: string
        }
        Insert: {
          added_at?: string
          added_by?: string | null
          chat_id: string
          id?: string
          role?: Database["public"]["Enums"]["chat_role"]
          user_id: string
        }
        Update: {
          added_at?: string
          added_by?: string | null
          chat_id?: string
          id?: string
          role?: Database["public"]["Enums"]["chat_role"]
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "job_chat_members_chat_id_fkey"
            columns: ["chat_id"]
            isOneToOne: false
            referencedRelation: "job_chats"
            referencedColumns: ["id"]
          },
        ]
      }
      job_chat_messages: {
        Row: {
          attachments: Json | null
          chat_id: string
          created_at: string
          edited: boolean | null
          edited_at: string | null
          id: string
          message: string
          user_id: string
        }
        Insert: {
          attachments?: Json | null
          chat_id: string
          created_at?: string
          edited?: boolean | null
          edited_at?: string | null
          id?: string
          message: string
          user_id: string
        }
        Update: {
          attachments?: Json | null
          chat_id?: string
          created_at?: string
          edited?: boolean | null
          edited_at?: string | null
          id?: string
          message?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "job_chat_messages_chat_id_fkey"
            columns: ["chat_id"]
            isOneToOne: false
            referencedRelation: "job_chats"
            referencedColumns: ["id"]
          },
        ]
      }
      job_chat_rooms: {
        Row: {
          created_at: string
          created_by: string
          id: string
          job_id: string
          name: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          created_by: string
          id?: string
          job_id: string
          name: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          created_by?: string
          id?: string
          job_id?: string
          name?: string
          updated_at?: string
        }
        Relationships: []
      }
      job_chats: {
        Row: {
          created_at: string
          created_by: string
          description: string | null
          id: string
          job_id: string
          name: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          created_by?: string
          description?: string | null
          id?: string
          job_id: string
          name?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          created_by?: string
          description?: string | null
          id?: string
          job_id?: string
          name?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "job_chats_job_id_fkey"
            columns: ["job_id"]
            isOneToOne: true
            referencedRelation: "jobs"
            referencedColumns: ["id"]
          },
        ]
      }
      jobs: {
        Row: {
          actual_cost: number | null
          budget: number | null
          created_at: string
          customer_id: string | null
          description: string | null
          end_date: string | null
          id: string
          location: string | null
          notes: string | null
          priority: string | null
          progress: number | null
          start_date: string | null
          status: string | null
          title: string
          updated_at: string
          user_id: string
        }
        Insert: {
          actual_cost?: number | null
          budget?: number | null
          created_at?: string
          customer_id?: string | null
          description?: string | null
          end_date?: string | null
          id?: string
          location?: string | null
          notes?: string | null
          priority?: string | null
          progress?: number | null
          start_date?: string | null
          status?: string | null
          title: string
          updated_at?: string
          user_id: string
        }
        Update: {
          actual_cost?: number | null
          budget?: number | null
          created_at?: string
          customer_id?: string | null
          description?: string | null
          end_date?: string | null
          id?: string
          location?: string | null
          notes?: string | null
          priority?: string | null
          progress?: number | null
          start_date?: string | null
          status?: string | null
          title?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      mileage_logs: {
        Row: {
          amount: number | null
          created_at: string
          distance_km: number | null
          end_odometer: number | null
          expense_id: string
          id: string
          rate_per_km: number
          start_odometer: number | null
          vehicle_name: string | null
        }
        Insert: {
          amount?: number | null
          created_at?: string
          distance_km?: number | null
          end_odometer?: number | null
          expense_id: string
          id?: string
          rate_per_km?: number
          start_odometer?: number | null
          vehicle_name?: string | null
        }
        Update: {
          amount?: number | null
          created_at?: string
          distance_km?: number | null
          end_odometer?: number | null
          expense_id?: string
          id?: string
          rate_per_km?: number
          start_odometer?: number | null
          vehicle_name?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "mileage_logs_expense_id_fkey"
            columns: ["expense_id"]
            isOneToOne: false
            referencedRelation: "expenses"
            referencedColumns: ["id"]
          },
        ]
      }
      notification_preferences: {
        Row: {
          browser_notifications: boolean | null
          created_at: string
          email: string | null
          email_reminders: boolean | null
          id: string
          sms_notifications: boolean | null
          source_page: string | null
          user_agent: string | null
        }
        Insert: {
          browser_notifications?: boolean | null
          created_at?: string
          email?: string | null
          email_reminders?: boolean | null
          id?: string
          sms_notifications?: boolean | null
          source_page?: string | null
          user_agent?: string | null
        }
        Update: {
          browser_notifications?: boolean | null
          created_at?: string
          email?: string | null
          email_reminders?: boolean | null
          id?: string
          sms_notifications?: boolean | null
          source_page?: string | null
          user_agent?: string | null
        }
        Relationships: []
      }
      payment_history: {
        Row: {
          amount: number
          created_at: string
          currency: string | null
          description: string | null
          id: string
          payment_date: string
          status: string
          stripe_invoice_id: string | null
          stripe_payment_intent_id: string | null
          subscriber_id: string | null
        }
        Insert: {
          amount: number
          created_at?: string
          currency?: string | null
          description?: string | null
          id?: string
          payment_date?: string
          status: string
          stripe_invoice_id?: string | null
          stripe_payment_intent_id?: string | null
          subscriber_id?: string | null
        }
        Update: {
          amount?: number
          created_at?: string
          currency?: string | null
          description?: string | null
          id?: string
          payment_date?: string
          status?: string
          stripe_invoice_id?: string | null
          stripe_payment_intent_id?: string | null
          subscriber_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "payment_history_subscriber_id_fkey"
            columns: ["subscriber_id"]
            isOneToOne: false
            referencedRelation: "subscribers"
            referencedColumns: ["id"]
          },
        ]
      }
      payment_stages: {
        Row: {
          amount: number | null
          created_at: string
          description: string
          due_date: string | null
          estimate_id: string | null
          id: string
          invoice_id: string | null
          milestone: string | null
          paid_at: string | null
          percentage: number | null
          stage_number: number
          status: string | null
          stripe_payment_intent_id: string | null
        }
        Insert: {
          amount?: number | null
          created_at?: string
          description: string
          due_date?: string | null
          estimate_id?: string | null
          id?: string
          invoice_id?: string | null
          milestone?: string | null
          paid_at?: string | null
          percentage?: number | null
          stage_number: number
          status?: string | null
          stripe_payment_intent_id?: string | null
        }
        Update: {
          amount?: number | null
          created_at?: string
          description?: string
          due_date?: string | null
          estimate_id?: string | null
          id?: string
          invoice_id?: string | null
          milestone?: string | null
          paid_at?: string | null
          percentage?: number | null
          stage_number?: number
          status?: string | null
          stripe_payment_intent_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "payment_stages_estimate_id_fkey"
            columns: ["estimate_id"]
            isOneToOne: false
            referencedRelation: "estimates"
            referencedColumns: ["id"]
          },
        ]
      }
      po_payments: {
        Row: {
          amount: number
          created_at: string
          id: string
          method: string
          paid_at: string
          po_id: string
          receipt_url: string | null
          reference: string | null
          updated_at: string
        }
        Insert: {
          amount: number
          created_at?: string
          id?: string
          method: string
          paid_at?: string
          po_id: string
          receipt_url?: string | null
          reference?: string | null
          updated_at?: string
        }
        Update: {
          amount?: number
          created_at?: string
          id?: string
          method?: string
          paid_at?: string
          po_id?: string
          receipt_url?: string | null
          reference?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "po_payments_po_id_fkey"
            columns: ["po_id"]
            isOneToOne: false
            referencedRelation: "po_payment_totals"
            referencedColumns: ["po_id"]
          },
          {
            foreignKeyName: "po_payments_po_id_fkey"
            columns: ["po_id"]
            isOneToOne: false
            referencedRelation: "purchase_orders"
            referencedColumns: ["id"]
          },
        ]
      }
      portal_access_tokens: {
        Row: {
          created_at: string
          created_by: string | null
          expires_at: string | null
          id: string
          resource_id: string
          resource_type: string
          single_use: boolean | null
          token_hash: string
          used_at: string | null
          used_by_ip: string | null
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          expires_at?: string | null
          id?: string
          resource_id: string
          resource_type: string
          single_use?: boolean | null
          token_hash: string
          used_at?: string | null
          used_by_ip?: string | null
        }
        Update: {
          created_at?: string
          created_by?: string | null
          expires_at?: string | null
          id?: string
          resource_id?: string
          resource_type?: string
          single_use?: boolean | null
          token_hash?: string
          used_at?: string | null
          used_by_ip?: string | null
        }
        Relationships: []
      }
      portal_rate_limiter: {
        Row: {
          bucket_start: string
          cnt: number
          ip: unknown
          token_hash: string
        }
        Insert: {
          bucket_start: string
          cnt?: number
          ip: unknown
          token_hash: string
        }
        Update: {
          bucket_start?: string
          cnt?: number
          ip?: unknown
          token_hash?: string
        }
        Relationships: []
      }
      preset_metrics: {
        Row: {
          created_at: string
          default_value: number | null
          id: string
          label: string
          max_value: number | null
          metric_key: string
          min_value: number | null
          required: boolean | null
          sort_order: number | null
          template_id: string
          unit: string | null
        }
        Insert: {
          created_at?: string
          default_value?: number | null
          id?: string
          label: string
          max_value?: number | null
          metric_key: string
          min_value?: number | null
          required?: boolean | null
          sort_order?: number | null
          template_id: string
          unit?: string | null
        }
        Update: {
          created_at?: string
          default_value?: number | null
          id?: string
          label?: string
          max_value?: number | null
          metric_key?: string
          min_value?: number | null
          required?: boolean | null
          sort_order?: number | null
          template_id?: string
          unit?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "preset_metrics_template_id_fkey"
            columns: ["template_id"]
            isOneToOne: false
            referencedRelation: "templates"
            referencedColumns: ["id"]
          },
        ]
      }
      preset_options: {
        Row: {
          created_at: string
          default_value: Json | null
          id: string
          label: string
          option_key: string
          option_type: string
          options: Json | null
          sort_order: number | null
          template_id: string
        }
        Insert: {
          created_at?: string
          default_value?: Json | null
          id?: string
          label: string
          option_key: string
          option_type?: string
          options?: Json | null
          sort_order?: number | null
          template_id: string
        }
        Update: {
          created_at?: string
          default_value?: Json | null
          id?: string
          label?: string
          option_key?: string
          option_type?: string
          options?: Json | null
          sort_order?: number | null
          template_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "preset_options_template_id_fkey"
            columns: ["template_id"]
            isOneToOne: false
            referencedRelation: "templates"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          company_name: string | null
          created_at: string
          data_retention_until: string | null
          email: string
          full_name: string | null
          id: string
          is_subscribed: boolean
          notify_on_change_order: boolean | null
          notify_on_invoice_override: boolean | null
          subscription_status: string | null
          trial_ends_at: string
          trial_starts_at: string
          trial_status: string
          updated_at: string
        }
        Insert: {
          company_name?: string | null
          created_at?: string
          data_retention_until?: string | null
          email: string
          full_name?: string | null
          id: string
          is_subscribed?: boolean
          notify_on_change_order?: boolean | null
          notify_on_invoice_override?: boolean | null
          subscription_status?: string | null
          trial_ends_at?: string
          trial_starts_at?: string
          trial_status?: string
          updated_at?: string
        }
        Update: {
          company_name?: string | null
          created_at?: string
          data_retention_until?: string | null
          email?: string
          full_name?: string | null
          id?: string
          is_subscribed?: boolean
          notify_on_change_order?: boolean | null
          notify_on_invoice_override?: boolean | null
          subscription_status?: string | null
          trial_ends_at?: string
          trial_starts_at?: string
          trial_status?: string
          updated_at?: string
        }
        Relationships: []
      }
      project_task_items: {
        Row: {
          created_at: string
          estimate_item_id: string | null
          id: string
          invoice_item_id: string | null
          project_task_id: string
        }
        Insert: {
          created_at?: string
          estimate_item_id?: string | null
          id?: string
          invoice_item_id?: string | null
          project_task_id: string
        }
        Update: {
          created_at?: string
          estimate_item_id?: string | null
          id?: string
          invoice_item_id?: string | null
          project_task_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "project_task_items_project_task_id_fkey"
            columns: ["project_task_id"]
            isOneToOne: false
            referencedRelation: "project_tasks"
            referencedColumns: ["id"]
          },
        ]
      }
      project_tasks: {
        Row: {
          actual_end: string | null
          actual_start: string | null
          code: string
          created_at: string
          crew_assigned: string[] | null
          depends_on_codes: string[] | null
          duration_days: number | null
          estimate_id: string | null
          id: string
          invoice_id: string | null
          label: string
          notes: string | null
          purchase_order_id: string | null
          quantity: number | null
          rate_per_unit: number | null
          scheduled_end: string | null
          scheduled_start: string | null
          status: string | null
          team_id: string | null
          template_id: string | null
          total_amount: number | null
          trade: string
          unit_of_measure: string | null
          updated_at: string
          vendor_id: string | null
          work_order_id: string | null
        }
        Insert: {
          actual_end?: string | null
          actual_start?: string | null
          code: string
          created_at?: string
          crew_assigned?: string[] | null
          depends_on_codes?: string[] | null
          duration_days?: number | null
          estimate_id?: string | null
          id?: string
          invoice_id?: string | null
          label: string
          notes?: string | null
          purchase_order_id?: string | null
          quantity?: number | null
          rate_per_unit?: number | null
          scheduled_end?: string | null
          scheduled_start?: string | null
          status?: string | null
          team_id?: string | null
          template_id?: string | null
          total_amount?: number | null
          trade: string
          unit_of_measure?: string | null
          updated_at?: string
          vendor_id?: string | null
          work_order_id?: string | null
        }
        Update: {
          actual_end?: string | null
          actual_start?: string | null
          code?: string
          created_at?: string
          crew_assigned?: string[] | null
          depends_on_codes?: string[] | null
          duration_days?: number | null
          estimate_id?: string | null
          id?: string
          invoice_id?: string | null
          label?: string
          notes?: string | null
          purchase_order_id?: string | null
          quantity?: number | null
          rate_per_unit?: number | null
          scheduled_end?: string | null
          scheduled_start?: string | null
          status?: string | null
          team_id?: string | null
          template_id?: string | null
          total_amount?: number | null
          trade?: string
          unit_of_measure?: string | null
          updated_at?: string
          vendor_id?: string | null
          work_order_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "project_tasks_team_id_fkey"
            columns: ["team_id"]
            isOneToOne: false
            referencedRelation: "teams"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "project_tasks_template_id_fkey"
            columns: ["template_id"]
            isOneToOne: false
            referencedRelation: "templates"
            referencedColumns: ["id"]
          },
        ]
      }
      proposals: {
        Row: {
          content: string | null
          converted_to_invoice: boolean | null
          created_at: string
          customer_id: string | null
          deposit_amount: number | null
          expiration_date: string | null
          id: string
          invoice_id: string | null
          issue_date: string
          notes: string | null
          proposal_number: string
          signature_data: string | null
          signature_required: boolean | null
          signed_at: string | null
          signed_by_name: string | null
          status: string
          subtotal: number
          tax_amount: number
          tax_rate: number | null
          total: number
          updated_at: string
          user_id: string
        }
        Insert: {
          content?: string | null
          converted_to_invoice?: boolean | null
          created_at?: string
          customer_id?: string | null
          deposit_amount?: number | null
          expiration_date?: string | null
          id?: string
          invoice_id?: string | null
          issue_date?: string
          notes?: string | null
          proposal_number: string
          signature_data?: string | null
          signature_required?: boolean | null
          signed_at?: string | null
          signed_by_name?: string | null
          status?: string
          subtotal?: number
          tax_amount?: number
          tax_rate?: number | null
          total?: number
          updated_at?: string
          user_id: string
        }
        Update: {
          content?: string | null
          converted_to_invoice?: boolean | null
          created_at?: string
          customer_id?: string | null
          deposit_amount?: number | null
          expiration_date?: string | null
          id?: string
          invoice_id?: string | null
          issue_date?: string
          notes?: string | null
          proposal_number?: string
          signature_data?: string | null
          signature_required?: boolean | null
          signed_at?: string | null
          signed_by_name?: string | null
          status?: string
          subtotal?: number
          tax_amount?: number
          tax_rate?: number | null
          total?: number
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "proposals_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "customers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "proposals_invoice_id_fkey"
            columns: ["invoice_id"]
            isOneToOne: false
            referencedRelation: "invoices"
            referencedColumns: ["id"]
          },
        ]
      }
      purchase_order_items: {
        Row: {
          amount: number
          created_at: string
          description: string
          id: string
          purchase_order_id: string
          quantity: number
          rate: number
        }
        Insert: {
          amount: number
          created_at?: string
          description: string
          id?: string
          purchase_order_id: string
          quantity?: number
          rate: number
        }
        Update: {
          amount?: number
          created_at?: string
          description?: string
          id?: string
          purchase_order_id?: string
          quantity?: number
          rate?: number
        }
        Relationships: []
      }
      purchase_orders: {
        Row: {
          approval_status: string | null
          approved_at: string | null
          approved_by: string | null
          attachments: Json | null
          category: string | null
          created_at: string
          due_date: string | null
          expected_delivery: string | null
          id: string
          invoice_id: string | null
          job_id: string | null
          notes: string | null
          paid_amount: number | null
          payment_method: string | null
          payment_status: string | null
          payment_terms: string | null
          po_number: string
          status: string
          subtotal: number
          tax_amount: number
          total: number
          updated_at: string
          user_id: string
          vendor_email: string | null
          vendor_id: string | null
          vendor_name: string
        }
        Insert: {
          approval_status?: string | null
          approved_at?: string | null
          approved_by?: string | null
          attachments?: Json | null
          category?: string | null
          created_at?: string
          due_date?: string | null
          expected_delivery?: string | null
          id?: string
          invoice_id?: string | null
          job_id?: string | null
          notes?: string | null
          paid_amount?: number | null
          payment_method?: string | null
          payment_status?: string | null
          payment_terms?: string | null
          po_number: string
          status?: string
          subtotal?: number
          tax_amount?: number
          total?: number
          updated_at?: string
          user_id: string
          vendor_email?: string | null
          vendor_id?: string | null
          vendor_name: string
        }
        Update: {
          approval_status?: string | null
          approved_at?: string | null
          approved_by?: string | null
          attachments?: Json | null
          category?: string | null
          created_at?: string
          due_date?: string | null
          expected_delivery?: string | null
          id?: string
          invoice_id?: string | null
          job_id?: string | null
          notes?: string | null
          paid_amount?: number | null
          payment_method?: string | null
          payment_status?: string | null
          payment_terms?: string | null
          po_number?: string
          status?: string
          subtotal?: number
          tax_amount?: number
          total?: number
          updated_at?: string
          user_id?: string
          vendor_email?: string | null
          vendor_id?: string | null
          vendor_name?: string
        }
        Relationships: [
          {
            foreignKeyName: "purchase_orders_vendor_id_fkey"
            columns: ["vendor_id"]
            isOneToOne: false
            referencedRelation: "vendors"
            referencedColumns: ["id"]
          },
        ]
      }
      rate_limit_tracking: {
        Row: {
          created_at: string
          endpoint: string
          id: string
          identifier: string
          request_count: number | null
          window_start: string
        }
        Insert: {
          created_at?: string
          endpoint: string
          id?: string
          identifier: string
          request_count?: number | null
          window_start?: string
        }
        Update: {
          created_at?: string
          endpoint?: string
          id?: string
          identifier?: string
          request_count?: number | null
          window_start?: string
        }
        Relationships: []
      }
      review_platforms: {
        Row: {
          auto_send_after_payment: boolean | null
          created_at: string
          custom_platform_name: string | null
          custom_platform_url: string | null
          default_message: string | null
          facebook_page_url: string | null
          google_business_url: string | null
          id: string
          updated_at: string
          user_id: string
          yelp_business_url: string | null
        }
        Insert: {
          auto_send_after_payment?: boolean | null
          created_at?: string
          custom_platform_name?: string | null
          custom_platform_url?: string | null
          default_message?: string | null
          facebook_page_url?: string | null
          google_business_url?: string | null
          id?: string
          updated_at?: string
          user_id: string
          yelp_business_url?: string | null
        }
        Update: {
          auto_send_after_payment?: boolean | null
          created_at?: string
          custom_platform_name?: string | null
          custom_platform_url?: string | null
          default_message?: string | null
          facebook_page_url?: string | null
          google_business_url?: string | null
          id?: string
          updated_at?: string
          user_id?: string
          yelp_business_url?: string | null
        }
        Relationships: []
      }
      review_requests: {
        Row: {
          created_at: string
          custom_review_url: string | null
          customer_email: string
          customer_id: string | null
          customer_name: string
          facebook_review_url: string | null
          google_review_url: string | null
          id: string
          invoice_id: string | null
          rating: number | null
          review_platform: string | null
          review_text: string | null
          reviewed_at: string | null
          sent_at: string | null
          status: string
          updated_at: string
          user_id: string
          yelp_review_url: string | null
        }
        Insert: {
          created_at?: string
          custom_review_url?: string | null
          customer_email: string
          customer_id?: string | null
          customer_name: string
          facebook_review_url?: string | null
          google_review_url?: string | null
          id?: string
          invoice_id?: string | null
          rating?: number | null
          review_platform?: string | null
          review_text?: string | null
          reviewed_at?: string | null
          sent_at?: string | null
          status?: string
          updated_at?: string
          user_id: string
          yelp_review_url?: string | null
        }
        Update: {
          created_at?: string
          custom_review_url?: string | null
          customer_email?: string
          customer_id?: string | null
          customer_name?: string
          facebook_review_url?: string | null
          google_review_url?: string | null
          id?: string
          invoice_id?: string | null
          rating?: number | null
          review_platform?: string | null
          review_text?: string | null
          reviewed_at?: string | null
          sent_at?: string | null
          status?: string
          updated_at?: string
          user_id?: string
          yelp_review_url?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "review_requests_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "customers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "review_requests_invoice_id_fkey"
            columns: ["invoice_id"]
            isOneToOne: false
            referencedRelation: "invoices_due_view"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "review_requests_invoice_id_fkey"
            columns: ["invoice_id"]
            isOneToOne: false
            referencedRelation: "invoices_enhanced"
            referencedColumns: ["id"]
          },
        ]
      }
      schedules: {
        Row: {
          all_day: boolean | null
          assigned_to: string | null
          color: string | null
          created_at: string
          description: string | null
          end_time: string
          id: string
          job_id: string | null
          location: string | null
          start_time: string
          status: string | null
          title: string
          updated_at: string
          user_id: string
        }
        Insert: {
          all_day?: boolean | null
          assigned_to?: string | null
          color?: string | null
          created_at?: string
          description?: string | null
          end_time: string
          id?: string
          job_id?: string | null
          location?: string | null
          start_time: string
          status?: string | null
          title: string
          updated_at?: string
          user_id: string
        }
        Update: {
          all_day?: boolean | null
          assigned_to?: string | null
          color?: string | null
          created_at?: string
          description?: string | null
          end_time?: string
          id?: string
          job_id?: string | null
          location?: string | null
          start_time?: string
          status?: string | null
          title?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "schedules_assigned_to_fkey"
            columns: ["assigned_to"]
            isOneToOne: false
            referencedRelation: "team_members"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "schedules_job_id_fkey"
            columns: ["job_id"]
            isOneToOne: false
            referencedRelation: "jobs"
            referencedColumns: ["id"]
          },
        ]
      }
      security_audit_log: {
        Row: {
          created_at: string
          event_description: string | null
          event_type: string
          id: string
          ip_address: string | null
          metadata: Json | null
          user_agent: string | null
          user_email: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string
          event_description?: string | null
          event_type: string
          id?: string
          ip_address?: string | null
          metadata?: Json | null
          user_agent?: string | null
          user_email?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string
          event_description?: string | null
          event_type?: string
          id?: string
          ip_address?: string | null
          metadata?: Json | null
          user_agent?: string | null
          user_email?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      subscribers: {
        Row: {
          cancel_at_period_end: boolean | null
          canceled_at: string | null
          company_count: number | null
          created_at: string
          current_period_end: string | null
          current_period_start: string | null
          email: string
          id: string
          status: string | null
          stripe_customer_id: string | null
          stripe_subscription_id: string | null
          subscribed: boolean
          subscription_end: string | null
          subscription_tier: string | null
          subscription_type: string | null
          trial_end: string | null
          trial_start: string | null
          updated_at: string
          user_id: string | null
        }
        Insert: {
          cancel_at_period_end?: boolean | null
          canceled_at?: string | null
          company_count?: number | null
          created_at?: string
          current_period_end?: string | null
          current_period_start?: string | null
          email: string
          id?: string
          status?: string | null
          stripe_customer_id?: string | null
          stripe_subscription_id?: string | null
          subscribed?: boolean
          subscription_end?: string | null
          subscription_tier?: string | null
          subscription_type?: string | null
          trial_end?: string | null
          trial_start?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          cancel_at_period_end?: boolean | null
          canceled_at?: string | null
          company_count?: number | null
          created_at?: string
          current_period_end?: string | null
          current_period_start?: string | null
          email?: string
          id?: string
          status?: string | null
          stripe_customer_id?: string | null
          stripe_subscription_id?: string | null
          subscribed?: boolean
          subscription_end?: string | null
          subscription_tier?: string | null
          subscription_type?: string | null
          trial_end?: string | null
          trial_start?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Relationships: []
      }
      team_capacity: {
        Row: {
          created_at: string
          date: string
          id: string
          team_id: string
          total_slots: number
          updated_at: string
          used_slots: number
        }
        Insert: {
          created_at?: string
          date: string
          id?: string
          team_id: string
          total_slots?: number
          updated_at?: string
          used_slots?: number
        }
        Update: {
          created_at?: string
          date?: string
          id?: string
          team_id?: string
          total_slots?: number
          updated_at?: string
          used_slots?: number
        }
        Relationships: [
          {
            foreignKeyName: "team_capacity_team_id_fkey"
            columns: ["team_id"]
            isOneToOne: false
            referencedRelation: "teams"
            referencedColumns: ["id"]
          },
        ]
      }
      team_members: {
        Row: {
          active: boolean | null
          added_by: string | null
          created_at: string
          email: string
          id: string
          name: string
          phone: string | null
          role: string | null
          specialty: string | null
          user_id: string
        }
        Insert: {
          active?: boolean | null
          added_by?: string | null
          created_at?: string
          email: string
          id?: string
          name: string
          phone?: string | null
          role?: string | null
          specialty?: string | null
          user_id: string
        }
        Update: {
          active?: boolean | null
          added_by?: string | null
          created_at?: string
          email?: string
          id?: string
          name?: string
          phone?: string | null
          role?: string | null
          specialty?: string | null
          user_id?: string
        }
        Relationships: []
      }
      teams: {
        Row: {
          color: string | null
          created_at: string
          default_capacity: number | null
          email: string | null
          id: string
          is_active: boolean | null
          lead_name: string | null
          name: string
          phone: string | null
          trade: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          color?: string | null
          created_at?: string
          default_capacity?: number | null
          email?: string | null
          id?: string
          is_active?: boolean | null
          lead_name?: string | null
          name: string
          phone?: string | null
          trade?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          color?: string | null
          created_at?: string
          default_capacity?: number | null
          email?: string | null
          id?: string
          is_active?: boolean | null
          lead_name?: string | null
          name?: string
          phone?: string | null
          trade?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      template_dependencies: {
        Row: {
          created_at: string
          depends_on_code: string
          id: string
          template_task_id: string
        }
        Insert: {
          created_at?: string
          depends_on_code: string
          id?: string
          template_task_id: string
        }
        Update: {
          created_at?: string
          depends_on_code?: string
          id?: string
          template_task_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "template_dependencies_template_task_id_fkey"
            columns: ["template_task_id"]
            isOneToOne: false
            referencedRelation: "template_tasks"
            referencedColumns: ["id"]
          },
        ]
      }
      template_tasks: {
        Row: {
          code: string
          created_at: string
          crew_role: string | null
          default_qty_formula: string | null
          duration_days: number | null
          enabled_condition: string | null
          id: string
          is_lead_time: boolean | null
          label: string
          options_json: Json | null
          rate_per_unit: number | null
          requires_inspection: boolean | null
          requires_permit: boolean | null
          sort_order: number | null
          template_id: string
          trade: string
          unit_of_measure: string | null
          vendor_category: string | null
        }
        Insert: {
          code: string
          created_at?: string
          crew_role?: string | null
          default_qty_formula?: string | null
          duration_days?: number | null
          enabled_condition?: string | null
          id?: string
          is_lead_time?: boolean | null
          label: string
          options_json?: Json | null
          rate_per_unit?: number | null
          requires_inspection?: boolean | null
          requires_permit?: boolean | null
          sort_order?: number | null
          template_id: string
          trade: string
          unit_of_measure?: string | null
          vendor_category?: string | null
        }
        Update: {
          code?: string
          created_at?: string
          crew_role?: string | null
          default_qty_formula?: string | null
          duration_days?: number | null
          enabled_condition?: string | null
          id?: string
          is_lead_time?: boolean | null
          label?: string
          options_json?: Json | null
          rate_per_unit?: number | null
          requires_inspection?: boolean | null
          requires_permit?: boolean | null
          sort_order?: number | null
          template_id?: string
          trade?: string
          unit_of_measure?: string | null
          vendor_category?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "template_tasks_template_id_fkey"
            columns: ["template_id"]
            isOneToOne: false
            referencedRelation: "templates"
            referencedColumns: ["id"]
          },
        ]
      }
      templates: {
        Row: {
          category: string
          created_at: string
          description: string | null
          display_order: number | null
          icon: string | null
          id: string
          industry: string | null
          is_active: boolean | null
          name: string
          options_schema: Json | null
          params_schema: Json | null
          updated_at: string
          user_id: string
          version: string | null
        }
        Insert: {
          category?: string
          created_at?: string
          description?: string | null
          display_order?: number | null
          icon?: string | null
          id?: string
          industry?: string | null
          is_active?: boolean | null
          name: string
          options_schema?: Json | null
          params_schema?: Json | null
          updated_at?: string
          user_id: string
          version?: string | null
        }
        Update: {
          category?: string
          created_at?: string
          description?: string | null
          display_order?: number | null
          icon?: string | null
          id?: string
          industry?: string | null
          is_active?: boolean | null
          name?: string
          options_schema?: Json | null
          params_schema?: Json | null
          updated_at?: string
          user_id?: string
          version?: string | null
        }
        Relationships: []
      }
      vendors: {
        Row: {
          active: boolean | null
          address: string | null
          city: string | null
          company_name: string
          contact_person: string | null
          created_at: string
          default_category: string | null
          email: string | null
          id: string
          notes: string | null
          payment_terms: string | null
          phone: string | null
          postal_code: string | null
          province: string | null
          tax_rate: number | null
          updated_at: string
          user_id: string
        }
        Insert: {
          active?: boolean | null
          address?: string | null
          city?: string | null
          company_name: string
          contact_person?: string | null
          created_at?: string
          default_category?: string | null
          email?: string | null
          id?: string
          notes?: string | null
          payment_terms?: string | null
          phone?: string | null
          postal_code?: string | null
          province?: string | null
          tax_rate?: number | null
          updated_at?: string
          user_id: string
        }
        Update: {
          active?: boolean | null
          address?: string | null
          city?: string | null
          company_name?: string
          contact_person?: string | null
          created_at?: string
          default_category?: string | null
          email?: string | null
          id?: string
          notes?: string | null
          payment_terms?: string | null
          phone?: string | null
          postal_code?: string | null
          province?: string | null
          tax_rate?: number | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      work_order_assignees: {
        Row: {
          id: string
          user_id: string
          work_order_id: string
        }
        Insert: {
          id?: string
          user_id: string
          work_order_id: string
        }
        Update: {
          id?: string
          user_id?: string
          work_order_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "work_order_assignees_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "work_order_assignees_work_order_id_fkey"
            columns: ["work_order_id"]
            isOneToOne: false
            referencedRelation: "work_orders"
            referencedColumns: ["id"]
          },
        ]
      }
      work_order_items: {
        Row: {
          description: string
          id: string
          internal_notes: string | null
          kind: string
          quantity: number | null
          required_by: string | null
          sort_order: number | null
          source_invoice_item_id: string | null
          unit: string | null
          work_order_id: string
        }
        Insert: {
          description: string
          id?: string
          internal_notes?: string | null
          kind?: string
          quantity?: number | null
          required_by?: string | null
          sort_order?: number | null
          source_invoice_item_id?: string | null
          unit?: string | null
          work_order_id: string
        }
        Update: {
          description?: string
          id?: string
          internal_notes?: string | null
          kind?: string
          quantity?: number | null
          required_by?: string | null
          sort_order?: number | null
          source_invoice_item_id?: string | null
          unit?: string | null
          work_order_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "work_order_items_source_invoice_item_id_fkey"
            columns: ["source_invoice_item_id"]
            isOneToOne: false
            referencedRelation: "invoice_items_enhanced"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "work_order_items_work_order_id_fkey"
            columns: ["work_order_id"]
            isOneToOne: false
            referencedRelation: "work_orders"
            referencedColumns: ["id"]
          },
        ]
      }
      work_order_reports: {
        Row: {
          completed_at: string | null
          completed_by: string | null
          created_at: string | null
          id: string
          labor_hours: number | null
          materials_used: Json | null
          notes: string | null
          photos: Json | null
          signatures: Json | null
          updated_at: string | null
          work_order_id: string
        }
        Insert: {
          completed_at?: string | null
          completed_by?: string | null
          created_at?: string | null
          id?: string
          labor_hours?: number | null
          materials_used?: Json | null
          notes?: string | null
          photos?: Json | null
          signatures?: Json | null
          updated_at?: string | null
          work_order_id: string
        }
        Update: {
          completed_at?: string | null
          completed_by?: string | null
          created_at?: string | null
          id?: string
          labor_hours?: number | null
          materials_used?: Json | null
          notes?: string | null
          photos?: Json | null
          signatures?: Json | null
          updated_at?: string | null
          work_order_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "work_order_reports_completed_by_fkey"
            columns: ["completed_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "work_order_reports_work_order_id_fkey"
            columns: ["work_order_id"]
            isOneToOne: true
            referencedRelation: "work_orders"
            referencedColumns: ["id"]
          },
        ]
      }
      work_order_tokens: {
        Row: {
          created_at: string | null
          expires_at: string
          id: string
          token_hash: string
          work_order_id: string
        }
        Insert: {
          created_at?: string | null
          expires_at: string
          id?: string
          token_hash: string
          work_order_id: string
        }
        Update: {
          created_at?: string | null
          expires_at?: string
          id?: string
          token_hash?: string
          work_order_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "work_order_tokens_work_order_id_fkey"
            columns: ["work_order_id"]
            isOneToOne: false
            referencedRelation: "work_orders"
            referencedColumns: ["id"]
          },
        ]
      }
      work_orders: {
        Row: {
          created_at: string | null
          created_by: string
          ends_at: string
          id: string
          instructions: string | null
          invoice_id: string | null
          job_id: string | null
          schedule_id: string | null
          service_address: string | null
          starts_at: string
          status: string
          team_id: string | null
          title: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          created_by: string
          ends_at: string
          id?: string
          instructions?: string | null
          invoice_id?: string | null
          job_id?: string | null
          schedule_id?: string | null
          service_address?: string | null
          starts_at: string
          status?: string
          team_id?: string | null
          title: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          created_by?: string
          ends_at?: string
          id?: string
          instructions?: string | null
          invoice_id?: string | null
          job_id?: string | null
          schedule_id?: string | null
          service_address?: string | null
          starts_at?: string
          status?: string
          team_id?: string | null
          title?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "work_orders_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "work_orders_invoice_id_fkey"
            columns: ["invoice_id"]
            isOneToOne: true
            referencedRelation: "invoices_due_view"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "work_orders_invoice_id_fkey"
            columns: ["invoice_id"]
            isOneToOne: true
            referencedRelation: "invoices_enhanced"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "work_orders_job_id_fkey"
            columns: ["job_id"]
            isOneToOne: false
            referencedRelation: "jobs"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "work_orders_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      invoices_due_view: {
        Row: {
          currency: string | null
          customer_email: string | null
          due_cents: number | null
          id: string | null
          number: string | null
          public_token: string | null
        }
        Insert: {
          currency?: never
          customer_email?: string | null
          due_cents?: never
          id?: string | null
          number?: string | null
          public_token?: string | null
        }
        Update: {
          currency?: never
          customer_email?: string | null
          due_cents?: never
          id?: string | null
          number?: string | null
          public_token?: string | null
        }
        Relationships: []
      }
      po_payment_totals: {
        Row: {
          last_paid_at: string | null
          outstanding: number | null
          paid_to_date: number | null
          po_id: string | null
          po_total: number | null
        }
        Relationships: []
      }
    }
    Functions: {
      accept_estimate: {
        Args: { p_email?: string; p_name?: string; p_token: string }
        Returns: undefined
      }
      accept_estimate_secure: {
        Args: {
          p_email?: string
          p_ip?: unknown
          p_name?: string
          p_signature?: string
          p_token: string
          p_user_agent?: string
        }
        Returns: boolean
      }
      approve_invoice_adjustments: {
        Args: { p_adjustment_id: string }
        Returns: undefined
      }
      can_edit_invoice: {
        Args: { invoice_id_param: string; override_phrase?: string }
        Returns: boolean
      }
      check_email_rate_limit: {
        Args: { p_email: string; p_limit?: number; p_window_minutes?: number }
        Returns: boolean
      }
      check_trial_status: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      cleanup_expired_pairings: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      cleanup_portal_rate_limits: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      cleanup_rate_limits: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      create_work_order_from_invoice: {
        Args: { p_invoice_id: string }
        Returns: string
      }
      create_work_order_token: {
        Args: { p_ttl_hours?: number; p_work_order_id: string }
        Returns: string
      }
      generate_po_number: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      get_admin_role: {
        Args: { check_user_id?: string }
        Returns: string
      }
      get_booking_confirmation: {
        Args: { p_token: string }
        Returns: {
          appointment_date: string
          appointment_time: string
          booking_name: string
          booking_status: string
        }[]
      }
      get_consultation_booking_by_token: {
        Args: { p_token: string }
        Returns: {
          company_name: string
          confirmation_token: string
          created_at: string
          email: string
          id: string
          message: string
          name: string
          phone: string
          public_token: string
          slot_id: string
          status: string
          updated_at: string
        }[]
      }
      get_consultation_by_token: {
        Args: { p_token: string }
        Returns: {
          company_name: string | null
          confirmation_token: string | null
          created_at: string
          email: string
          id: string
          message: string | null
          name: string
          phone: string | null
          public_token: string
          slot_id: string | null
          status: string | null
          updated_at: string
        }[]
      }
      get_consultation_confirmation: {
        Args: { p_token: string }
        Returns: {
          created_at: string
          id: string
          name: string
          slot_date: string
          slot_time: string
          status: string
        }[]
      }
      get_estimate_bundle_by_token: {
        Args: { p_ip?: unknown; p_token: string; p_user_agent?: string }
        Returns: {
          estimate: Json
          items: Json
        }[]
      }
      get_estimate_by_token: {
        Args: { p_token: string }
        Returns: {
          accepted_at: string
          accepted_by_name: string
          contract_attached: boolean
          customer_email: string
          customer_name: string
          customer_phone: string
          deposit_amount: number
          deposit_percentage: number
          estimate_number: string
          expiration_date: string
          id: string
          issue_date: string
          notes: string
          public_token: string
          scope_of_work: string
          sent_at: string
          service_address: string
          service_city: string
          service_postal_code: string
          service_province: string
          signature_data: string
          signature_required: boolean
          signed_at: string
          signed_by_name: string
          status: string
          subtotal: number
          tax_amount: number
          tax_rate: number
          terms_conditions: string
          total: number
          viewed_at: string
        }[]
      }
      get_estimate_items_by_token: {
        Args: { p_token: string }
        Returns: {
          amount: number
          description: string
          id: string
          quantity: number
          rate: number
          sort_order: number
        }[]
      }
      get_invoice_bundle_by_token: {
        Args: { p_ip?: unknown; p_token: string; p_user_agent?: string }
        Returns: {
          invoice: Json
          items: Json
          payments: Json
        }[]
      }
      get_invoice_by_token: {
        Args: { p_token: string }
        Returns: {
          balance: number
          customer_address: string
          customer_city: string
          customer_email: string
          customer_name: string
          customer_phone: string
          customer_postal_code: string
          customer_province: string
          deposit_amount: number
          deposit_request: number
          due_date: string
          id: string
          invoice_number: string
          issue_date: string
          notes: string
          paid_amount: number
          private_notes: string
          public_token: string
          service_address: string
          service_city: string
          service_postal_code: string
          service_province: string
          status: string
          subtotal: number
          tax_amount: number
          tax_rate: number
          total: number
        }[]
      }
      get_invoice_items_by_token: {
        Args: { p_token: string }
        Returns: {
          amount: number
          description: string
          id: string
          item_name: string
          quantity: number
          rate: number
          sort_order: number
          tax: boolean
        }[]
      }
      get_invoice_payments_by_token: {
        Args: { p_token: string }
        Returns: {
          amount: number
          created_at: string
          id: string
          invoice_id: string
          notes: string | null
          payment_date: string
          payment_method: string
          status: string
          transaction_id: string | null
          updated_at: string
        }[]
      }
      get_work_order_by_token: {
        Args: { p_token: string }
        Returns: Json
      }
      is_admin: {
        Args: { check_user_id?: string }
        Returns: boolean
      }
      is_email_suppressed: {
        Args: { p_email: string }
        Returns: boolean
      }
      log_security_event: {
        Args: {
          p_event_description: string
          p_event_type: string
          p_metadata?: Json
        }
        Returns: undefined
      }
      mark_estimate_viewed: {
        Args: { p_token: string }
        Returns: undefined
      }
      portal_rate_limit: {
        Args: {
          p_ip: unknown
          p_limit?: number
          p_token: string
          p_window_secs?: number
        }
        Returns: boolean
      }
      process_email_bounce: {
        Args: { p_email: string; p_provider_id: string; p_reason: string }
        Returns: undefined
      }
      record_invoice_card_payment: {
        Args: {
          p_amount_cents: number
          p_invoice_id: string
          p_provider: string
          p_reference: string
        }
        Returns: undefined
      }
      regenerate_wo_token: {
        Args: { p_wo_id: string }
        Returns: string
      }
      reject_invoice_adjustments: {
        Args: { p_adjustment_id: string }
        Returns: undefined
      }
      revoke_device_session: {
        Args: { p_session_id: string }
        Returns: undefined
      }
      seed_expense_categories_for_user: {
        Args: { p_user_id: string }
        Returns: undefined
      }
      submit_work_order_report: {
        Args: {
          p_labor_hours: number
          p_materials_used: Json
          p_notes: string
          p_photos: Json
          p_signatures: Json
          p_token: string
        }
        Returns: boolean
      }
      submit_work_order_report_by_token: {
        Args: {
          p_labor_hours: number
          p_materials_used: Json
          p_notes: string
          p_photos: Json
          p_signatures: Json
          p_token: string
        }
        Returns: boolean
      }
      sync_invoice_schedule_to_calendar: {
        Args: { p_invoice_id: string }
        Returns: undefined
      }
      track_device_session: {
        Args: {
          p_device_name: string
          p_device_type: string
          p_ip_address: string
          p_user_agent: string
        }
        Returns: string
      }
      update_trial_and_subscription_status: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
    }
    Enums: {
      chat_role: "member" | "manager" | "owner"
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
      chat_role: ["member", "manager", "owner"],
    },
  },
} as const
