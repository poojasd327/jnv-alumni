export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type ApprovalStatus = "pending" | "approved" | "rejected"
export type UserRole = "alumni" | "admin"
export type ListingStatus = "active" | "sold" | "inactive" | "deleted"
export type ListingCondition = "new" | "like_new" | "good" | "fair"

export type JobType = "full_time" | "part_time" | "contract" | "internship" | "freelance"
export type JobStatus = "open" | "closed" | "filled"
export type ApplicationStatus = "applied" | "under_review" | "interview" | "selected" | "rejected"
export type EventStatus = "upcoming" | "ongoing" | "completed" | "cancelled"
export type AnnouncementType = "general" | "achievement" | "opportunity" | "update"
export type MentorshipStatus = "pending" | "accepted" | "active" | "completed" | "declined"
export type NotificationType = "mention" | "reply" | "like" | "follow" | "event_reminder" | "job_match" | "approval" | "announcement" | "mentorship" | "system"
export type ReportContentType = "forum_post" | "forum_comment" | "marketplace_listing" | "job" | "event" | "business" | "media" | "profile" | "announcement"
export type ReportReason = "spam" | "harassment" | "inappropriate" | "misinformation" | "fraud" | "other"
export type ReportStatus = "pending" | "reviewed" | "action_taken" | "dismissed"

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          full_name: string
          email: string
          mobile: string
          batch_start_year: number
          passing_year: number
          jnv_school: string
          jnv_state: string
          city: string | null
          state: string | null
          profession: string | null
          company: string | null
          industry: string | null
          skills: string[]
          linkedin_url: string | null
          portfolio_url: string | null
          whatsapp_number: string | null
          bio: string | null
          avatar_url: string | null
          role: UserRole
          approval_status: ApprovalStatus
          approved_by: string | null
          approved_at: string | null
          is_profile_complete: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          full_name: string
          email: string
          mobile: string
          batch_start_year: number
          passing_year: number
          jnv_school: string
          jnv_state: string
          city?: string | null
          state?: string | null
          profession?: string | null
          company?: string | null
          industry?: string | null
          skills?: string[]
          linkedin_url?: string | null
          portfolio_url?: string | null
          whatsapp_number?: string | null
          bio?: string | null
          avatar_url?: string | null
          role?: UserRole
          approval_status?: ApprovalStatus
          approved_by?: string | null
          approved_at?: string | null
          is_profile_complete?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          full_name?: string
          email?: string
          mobile?: string
          batch_start_year?: number
          passing_year?: number
          jnv_school?: string
          jnv_state?: string
          city?: string | null
          state?: string | null
          profession?: string | null
          company?: string | null
          industry?: string | null
          skills?: string[]
          linkedin_url?: string | null
          portfolio_url?: string | null
          whatsapp_number?: string | null
          bio?: string | null
          avatar_url?: string | null
          role?: UserRole
          approval_status?: ApprovalStatus
          approved_by?: string | null
          approved_at?: string | null
          is_profile_complete?: boolean
          updated_at?: string
        }
        Relationships: []
      }
      marketplace_categories: {
        Row: {
          id: string
          name: string
          slug: string
          icon: string | null
          sort_order: number
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          slug: string
          icon?: string | null
          sort_order?: number
          created_at?: string
        }
        Update: {
          name?: string
          slug?: string
          icon?: string | null
          sort_order?: number
        }
        Relationships: []
      }
      marketplace_subcategories: {
        Row: {
          id: string
          category_id: string
          name: string
          slug: string
          sort_order: number
          created_at: string
        }
        Insert: {
          id?: string
          category_id: string
          name: string
          slug: string
          sort_order?: number
          created_at?: string
        }
        Update: {
          category_id?: string
          name?: string
          slug?: string
          sort_order?: number
        }
        Relationships: [
          {
            foreignKeyName: "marketplace_subcategories_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "marketplace_categories"
            referencedColumns: ["id"]
          },
        ]
      }
      marketplace_listings: {
        Row: {
          id: string
          seller_id: string
          category_id: string
          subcategory_id: string | null
          title: string
          description: string
          price: number
          price_negotiable: boolean
          condition: ListingCondition
          location_city: string
          location_state: string
          images: string[]
          status: ListingStatus
          seller_name: string
          seller_avatar_url: string | null
          view_count: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          seller_id: string
          category_id: string
          subcategory_id?: string | null
          title: string
          description: string
          price: number
          price_negotiable?: boolean
          condition?: ListingCondition
          location_city: string
          location_state: string
          images?: string[]
          status?: ListingStatus
          seller_name: string
          seller_avatar_url?: string | null
          view_count?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          seller_id?: string
          category_id?: string
          subcategory_id?: string | null
          title?: string
          description?: string
          price?: number
          price_negotiable?: boolean
          condition?: ListingCondition
          location_city?: string
          location_state?: string
          images?: string[]
          status?: ListingStatus
          seller_name?: string
          seller_avatar_url?: string | null
          view_count?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "marketplace_listings_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "marketplace_categories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "marketplace_listings_subcategory_id_fkey"
            columns: ["subcategory_id"]
            isOneToOne: false
            referencedRelation: "marketplace_subcategories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "marketplace_listings_seller_id_fkey"
            columns: ["seller_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      wishlists: {
        Row: {
          id: string
          user_id: string
          listing_id: string
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          listing_id: string
          created_at?: string
        }
        Update: {
          user_id?: string
          listing_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "wishlists_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "wishlists_listing_id_fkey"
            columns: ["listing_id"]
            isOneToOne: false
            referencedRelation: "marketplace_listings"
            referencedColumns: ["id"]
          },
        ]
      }
      jobs: {
        Row: {
          id: string
          posted_by: string
          title: string
          company: string
          description: string
          location_city: string | null
          location_state: string | null
          job_type: JobType
          experience_min: number | null
          experience_max: number | null
          salary_min: number | null
          salary_max: number | null
          skills_required: string[]
          referral_available: boolean
          contact_email: string | null
          apply_url: string | null
          status: JobStatus
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          posted_by: string
          title: string
          company: string
          description: string
          location_city?: string | null
          location_state?: string | null
          job_type: JobType
          experience_min?: number | null
          experience_max?: number | null
          salary_min?: number | null
          salary_max?: number | null
          skills_required?: string[]
          referral_available?: boolean
          contact_email?: string | null
          apply_url?: string | null
          status?: JobStatus
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          posted_by?: string
          title?: string
          company?: string
          description?: string
          location_city?: string | null
          location_state?: string | null
          job_type?: JobType
          experience_min?: number | null
          experience_max?: number | null
          salary_min?: number | null
          salary_max?: number | null
          skills_required?: string[]
          referral_available?: boolean
          contact_email?: string | null
          apply_url?: string | null
          status?: JobStatus
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "jobs_posted_by_fkey"
            columns: ["posted_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      job_applications: {
        Row: {
          id: string
          job_id: string
          applicant_id: string
          resume_url: string | null
          cover_note: string | null
          status: ApplicationStatus
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          job_id: string
          applicant_id: string
          resume_url?: string | null
          cover_note?: string | null
          status?: ApplicationStatus
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          job_id?: string
          applicant_id?: string
          resume_url?: string | null
          cover_note?: string | null
          status?: ApplicationStatus
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "job_applications_job_id_fkey"
            columns: ["job_id"]
            isOneToOne: false
            referencedRelation: "jobs"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "job_applications_applicant_id_fkey"
            columns: ["applicant_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      events: {
        Row: {
          id: string
          organizer_id: string
          title: string
          description: string
          event_date: string
          end_date: string | null
          venue: string | null
          location_city: string | null
          location_state: string | null
          is_online: boolean
          meeting_url: string | null
          images: string[]
          max_attendees: number | null
          status: EventStatus
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          organizer_id: string
          title: string
          description: string
          event_date: string
          end_date?: string | null
          venue?: string | null
          location_city?: string | null
          location_state?: string | null
          is_online?: boolean
          meeting_url?: string | null
          images?: string[]
          max_attendees?: number | null
          status?: EventStatus
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          organizer_id?: string
          title?: string
          description?: string
          event_date?: string
          end_date?: string | null
          venue?: string | null
          location_city?: string | null
          location_state?: string | null
          is_online?: boolean
          meeting_url?: string | null
          images?: string[]
          max_attendees?: number | null
          status?: EventStatus
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "events_organizer_id_fkey"
            columns: ["organizer_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      event_registrations: {
        Row: {
          id: string
          event_id: string
          user_id: string
          status: string
          created_at: string
        }
        Insert: {
          id?: string
          event_id: string
          user_id: string
          status?: string
          created_at?: string
        }
        Update: {
          id?: string
          event_id?: string
          user_id?: string
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: "event_registrations_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "events"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "event_registrations_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      announcements: {
        Row: {
          id: string
          author_id: string
          title: string
          content: string
          type: AnnouncementType
          is_pinned: boolean
          images: string[]
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          author_id: string
          title: string
          content: string
          type?: AnnouncementType
          is_pinned?: boolean
          images?: string[]
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          author_id?: string
          title?: string
          content?: string
          type?: AnnouncementType
          is_pinned?: boolean
          images?: string[]
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "announcements_author_id_fkey"
            columns: ["author_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      businesses: {
        Row: {
          id: string
          owner_id: string
          name: string
          description: string
          category: string | null
          services: string[]
          location_city: string | null
          location_state: string | null
          website: string | null
          phone: string | null
          email: string | null
          logo_url: string | null
          is_verified: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          owner_id: string
          name: string
          description: string
          category?: string | null
          services?: string[]
          location_city?: string | null
          location_state?: string | null
          website?: string | null
          phone?: string | null
          email?: string | null
          logo_url?: string | null
          is_verified?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          owner_id?: string
          name?: string
          description?: string
          category?: string | null
          services?: string[]
          location_city?: string | null
          location_state?: string | null
          website?: string | null
          phone?: string | null
          email?: string | null
          logo_url?: string | null
          is_verified?: boolean
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "businesses_owner_id_fkey"
            columns: ["owner_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      forum_categories: {
        Row: {
          id: string
          name: string
          slug: string
          description: string | null
          icon: string | null
          sort_order: number
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          slug: string
          description?: string | null
          icon?: string | null
          sort_order?: number
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          slug?: string
          description?: string | null
          icon?: string | null
          sort_order?: number
        }
        Relationships: []
      }
      forum_posts: {
        Row: {
          id: string
          category_id: string
          author_id: string
          title: string
          content: string
          is_pinned: boolean
          view_count: number
          likes_count: number
          comments_count: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          category_id: string
          author_id: string
          title: string
          content: string
          is_pinned?: boolean
          view_count?: number
          likes_count?: number
          comments_count?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          category_id?: string
          author_id?: string
          title?: string
          content?: string
          is_pinned?: boolean
          view_count?: number
          likes_count?: number
          comments_count?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "forum_posts_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "forum_categories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "forum_posts_author_id_fkey"
            columns: ["author_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      forum_comments: {
        Row: {
          id: string
          post_id: string
          author_id: string
          content: string
          parent_id: string | null
          likes_count: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          post_id: string
          author_id: string
          content: string
          parent_id?: string | null
          likes_count?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          post_id?: string
          author_id?: string
          content?: string
          parent_id?: string | null
          likes_count?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "forum_comments_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "forum_posts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "forum_comments_author_id_fkey"
            columns: ["author_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "forum_comments_parent_id_fkey"
            columns: ["parent_id"]
            isOneToOne: false
            referencedRelation: "forum_comments"
            referencedColumns: ["id"]
          },
        ]
      }
      forum_likes: {
        Row: {
          id: string
          user_id: string
          post_id: string | null
          comment_id: string | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          post_id?: string | null
          comment_id?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          post_id?: string | null
          comment_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "forum_likes_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "forum_likes_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "forum_posts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "forum_likes_comment_id_fkey"
            columns: ["comment_id"]
            isOneToOne: false
            referencedRelation: "forum_comments"
            referencedColumns: ["id"]
          },
        ]
      }
      media: {
        Row: {
          id: string
          uploaded_by: string
          title: string
          description: string | null
          file_url: string
          file_type: string
          category: string | null
          batch_year: number | null
          event_id: string | null
          tags: string[]
          created_at: string
        }
        Insert: {
          id?: string
          uploaded_by: string
          title: string
          description?: string | null
          file_url: string
          file_type: string
          category?: string | null
          batch_year?: number | null
          event_id?: string | null
          tags?: string[]
          created_at?: string
        }
        Update: {
          id?: string
          uploaded_by?: string
          title?: string
          description?: string | null
          file_url?: string
          file_type?: string
          category?: string | null
          batch_year?: number | null
          event_id?: string | null
          tags?: string[]
        }
        Relationships: [
          {
            foreignKeyName: "media_uploaded_by_fkey"
            columns: ["uploaded_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "media_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "events"
            referencedColumns: ["id"]
          },
        ]
      }
      mentorship_requests: {
        Row: {
          id: string
          mentor_id: string
          mentee_id: string
          area: string
          message: string | null
          status: MentorshipStatus
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          mentor_id: string
          mentee_id: string
          area: string
          message?: string | null
          status?: MentorshipStatus
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          mentor_id?: string
          mentee_id?: string
          area?: string
          message?: string | null
          status?: MentorshipStatus
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "mentorship_requests_mentor_id_fkey"
            columns: ["mentor_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "mentorship_requests_mentee_id_fkey"
            columns: ["mentee_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      notifications: {
        Row: {
          id: string
          user_id: string
          type: NotificationType
          title: string
          message: string
          link: string | null
          is_read: boolean
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          type: NotificationType
          title: string
          message: string
          link?: string | null
          is_read?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          type?: NotificationType
          title?: string
          message?: string
          link?: string | null
          is_read?: boolean
        }
        Relationships: [
          {
            foreignKeyName: "notifications_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      conversations: {
        Row: {
          id: string
          participant_1: string
          participant_2: string
          last_message_at: string
          created_at: string
        }
        Insert: {
          id?: string
          participant_1: string
          participant_2: string
          last_message_at?: string
          created_at?: string
        }
        Update: {
          id?: string
          participant_1?: string
          participant_2?: string
          last_message_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "conversations_participant_1_fkey"
            columns: ["participant_1"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "conversations_participant_2_fkey"
            columns: ["participant_2"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      messages: {
        Row: {
          id: string
          conversation_id: string
          sender_id: string
          content: string
          is_read: boolean
          created_at: string
        }
        Insert: {
          id?: string
          conversation_id: string
          sender_id: string
          content: string
          is_read?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          conversation_id?: string
          sender_id?: string
          content?: string
          is_read?: boolean
        }
        Relationships: [
          {
            foreignKeyName: "messages_conversation_id_fkey"
            columns: ["conversation_id"]
            isOneToOne: false
            referencedRelation: "conversations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "messages_sender_id_fkey"
            columns: ["sender_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      reports: {
        Row: {
          id: string
          reporter_id: string
          content_type: ReportContentType
          content_id: string
          reason: ReportReason
          description: string | null
          status: ReportStatus
          reviewed_by: string | null
          reviewed_at: string | null
          admin_notes: string | null
          created_at: string
        }
        Insert: {
          id?: string
          reporter_id: string
          content_type: ReportContentType
          content_id: string
          reason: ReportReason
          description?: string | null
          status?: ReportStatus
          reviewed_by?: string | null
          reviewed_at?: string | null
          admin_notes?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          reporter_id?: string
          content_type?: ReportContentType
          content_id?: string
          reason?: ReportReason
          description?: string | null
          status?: ReportStatus
          reviewed_by?: string | null
          reviewed_at?: string | null
          admin_notes?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "reports_reporter_id_fkey"
            columns: ["reporter_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      approval_status: ApprovalStatus
      user_role: UserRole
      listing_status: ListingStatus
      listing_condition: ListingCondition
      job_type: JobType
      job_status: JobStatus
      application_status: ApplicationStatus
      event_status: EventStatus
      announcement_type: AnnouncementType
      mentorship_status: MentorshipStatus
      notification_type: NotificationType
      report_content_type: ReportContentType
      report_reason: ReportReason
      report_status: ReportStatus
    }
  }
}

// Convenience types
export type Profile = Database["public"]["Tables"]["profiles"]["Row"]
export type ProfileInsert = Database["public"]["Tables"]["profiles"]["Insert"]
export type ProfileUpdate = Database["public"]["Tables"]["profiles"]["Update"]

export type MarketplaceCategory = Database["public"]["Tables"]["marketplace_categories"]["Row"]
export type MarketplaceSubcategory = Database["public"]["Tables"]["marketplace_subcategories"]["Row"]

export type MarketplaceListing = Database["public"]["Tables"]["marketplace_listings"]["Row"]
export type MarketplaceListingInsert = Database["public"]["Tables"]["marketplace_listings"]["Insert"]
export type MarketplaceListingUpdate = Database["public"]["Tables"]["marketplace_listings"]["Update"]

export type Wishlist = Database["public"]["Tables"]["wishlists"]["Row"]

export type Job = Database["public"]["Tables"]["jobs"]["Row"]
export type JobInsert = Database["public"]["Tables"]["jobs"]["Insert"]
export type JobApplication = Database["public"]["Tables"]["job_applications"]["Row"]
export type Event = Database["public"]["Tables"]["events"]["Row"]
export type EventRegistration = Database["public"]["Tables"]["event_registrations"]["Row"]
export type Announcement = Database["public"]["Tables"]["announcements"]["Row"]
export type Business = Database["public"]["Tables"]["businesses"]["Row"]
export type ForumCategory = Database["public"]["Tables"]["forum_categories"]["Row"]
export type ForumPost = Database["public"]["Tables"]["forum_posts"]["Row"]
export type ForumComment = Database["public"]["Tables"]["forum_comments"]["Row"]
export type Media = Database["public"]["Tables"]["media"]["Row"]
export type MentorshipRequest = Database["public"]["Tables"]["mentorship_requests"]["Row"]
export type Notification = Database["public"]["Tables"]["notifications"]["Row"]
export type Report = Database["public"]["Tables"]["reports"]["Row"]
export type Conversation = Database["public"]["Tables"]["conversations"]["Row"]
export type Message = Database["public"]["Tables"]["messages"]["Row"]
