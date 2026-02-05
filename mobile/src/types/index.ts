export interface BaseEntity {
  id: string;
  created_at: string;
  updated_at: string;
  deleted_at?: string | null;
}

export interface TenantEntity extends BaseEntity {
  tenant_id: string;
}

export interface Role {
  id: string;
  type: 'SUPER_ADMIN' | 'NUCLEO_NCK' | 'AGENTE_NCK' | 'CLIENTE' | 'FORNECEDOR' | 'INVESTIDOR';
  name: string;
  permissions: string[];
}

export interface User {
  id: string;
  tenant_id: string;
  email: string;
  name: string;
  avatar_url?: string | null;
  status: 'PENDING' | 'ACTIVE' | 'INACTIVE' | 'BLOCKED';
  role: Role;
  last_login_at?: string | null;
  created_at: string;
  updated_at: string;
}

export interface Tenant {
  id: string;
  name: string;
  slug: string;
  domain?: string | null;
  logo_url?: string | null;
  status: 'ACTIVE' | 'SUSPENDED' | 'TRIAL';
  timezone: string;
}

export interface Project {
  id: string;
  tenant_id: string;
  name: string;
  slug: string;
  description?: string | null;
  status: 'PLANNING' | 'ACTIVE' | 'PAUSED' | 'COMPLETED' | 'ARCHIVED';
  work_mode: 'SCRUM' | 'KANBAN' | 'SIMPLE';
  color?: string | null;
  start_date?: string | null;
  end_date?: string | null;
  created_at: string;
  updated_at: string;
}

export interface ProjectMember {
  id: string;
  project_id: string;
  user_id: string;
  role: 'OWNER' | 'ADMIN' | 'MEMBER' | 'VIEWER';
  user: User;
  joined_at: string;
}

export interface Task {
  id: string;
  tenant_id: string;
  project_id: string;
  sprint_id?: string | null;
  assignee_id?: string | null;
  title: string;
  description?: string | null;
  status: 'BACKLOG' | 'TODO' | 'IN_PROGRESS' | 'IN_REVIEW' | 'DONE' | 'CANCELLED';
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
  order_index: number;
  estimated_hours?: number | null;
  actual_hours?: number | null;
  deadline?: string | null;
  completed_at?: string | null;
  assignee?: User | null;
  attachments?: Attachment[];
  created_at: string;
  updated_at: string;
}

export interface Sprint {
  id: string;
  tenant_id: string;
  project_id: string;
  name: string;
  goal?: string | null;
  status: 'PLANNING' | 'PLANNED' | 'ACTIVE' | 'COMPLETED' | 'CANCELLED';
  order_index: number;
  start_date?: string | null;
  end_date?: string | null;
  tasks?: Task[];
  created_at: string;
  updated_at: string;
}

export interface Note {
  id: string;
  tenant_id: string;
  project_id?: string | null;
  task_id?: string | null;
  folder_id?: string | null;
  author_id: string;
  title: string;
  content: string;
  version: number;
  is_pinned: boolean;
  accent_color?: string | null;
  highlight_style: 'DEFAULT' | 'BOLD' | 'CALLOUT' | 'UNDERLINE';
  visibility: 'ALL_COMPANY' | 'FILTERED' | 'SPECIFIC_USERS';
  author: User;
  folder?: NoteFolder | null;
  attachments?: Attachment[];
  created_at: string;
  updated_at: string;
}

export interface NoteFolder {
  id: string;
  tenant_id: string;
  parent_id?: string | null;
  name: string;
  accent_color?: string | null;
  children?: NoteFolder[];
  notes_count?: number;
  created_at: string;
  updated_at: string;
}

export interface NoteVersion {
  id: string;
  note_id: string;
  content: string;
  version: number;
  created_by: string;
  created_at: string;
}

export interface Event {
  id: string;
  tenant_id: string;
  project_id?: string | null;
  title: string;
  description?: string | null;
  type: 'MEETING' | 'DEADLINE' | 'MILESTONE' | 'REMINDER' | 'DELIVERY' | 'OTHER';
  location?: string | null;
  meeting_url?: string | null;
  color?: string | null;
  start_at: string;
  end_at: string;
  timezone: string;
  is_all_day: boolean;
  recurrence_rule?: string | null;
  attendees?: EventAttendee[];
  created_at: string;
  updated_at: string;
}

export interface EventAttendee {
  id: string;
  event_id: string;
  user_id: string;
  status: 'PENDING' | 'ACCEPTED' | 'DECLINED' | 'TENTATIVE';
  user: User;
  responded_at?: string | null;
}

export interface MeetingRequest {
  id: string;
  tenant_id: string;
  project_id?: string | null;
  title: string;
  description?: string | null;
  location?: string | null;
  meeting_url?: string | null;
  proposed_start_at: string;
  proposed_end_at: string;
  status: 'PENDING' | 'ACCEPTED' | 'DECLINED' | 'RESCHEDULED';
  creator: User;
  recipients: MeetingRequestRecipient[];
  created_at: string;
  updated_at: string;
}

export interface MeetingRequestRecipient {
  id: string;
  meeting_request_id: string;
  user_id: string;
  user: User;
}

export interface Notification {
  id: string;
  tenant_id: string;
  user_id: string;
  project_id?: string | null;
  type: NotificationType;
  title: string;
  message: string;
  data?: Record<string, any> | null;
  status: 'UNREAD' | 'READ' | 'ARCHIVED';
  read_at?: string | null;
  created_at: string;
}

export type NotificationType =
  | 'TASK_CREATED'
  | 'TASK_UPDATED'
  | 'TASK_ASSIGNED'
  | 'NOTE_CREATED'
  | 'NOTE_UPDATED'
  | 'SPRINT_CREATED'
  | 'SPRINT_STARTED'
  | 'SPRINT_COMPLETED'
  | 'MEETING_REQUEST_CREATED'
  | 'MEETING_REQUEST_ACCEPTED'
  | 'MEETING_REQUEST_DECLINED'
  | 'MEETING_REQUEST_RESCHEDULED';

export interface BusinessModelCanvas {
  id: string;
  tenant_id: string;
  project_id: string;
  name: string;
  description?: string | null;
  blocks: CanvasBlocks;
  assumptions?: CanvasAssumption[];
  experiments?: CanvasExperiment[];
  last_analysis?: Record<string, any> | null;
  created_at: string;
  updated_at: string;
}

export interface CanvasBlocks {
  key_partners: string[];
  key_activities: string[];
  key_resources: string[];
  value_propositions: string[];
  customer_relationships: string[];
  channels: string[];
  customer_segments: string[];
  cost_structure: string[];
  revenue_streams: string[];
}

export interface CanvasAssumption {
  id: string;
  text: string;
  validated: boolean;
}

export interface CanvasExperiment {
  id: string;
  hypothesis: string;
  method: string;
  result?: string;
  status: 'pending' | 'running' | 'completed';
}

export interface DragonSettings {
  id: string;
  tenant_id: string;
  max_capacity_morning: number;
  max_capacity_afternoon: number;
  tickets_per_week: number;
  advance_days: number;
  enabled: boolean;
}

export interface DragonTicket {
  id: string;
  tenant_id: string;
  user_id: string;
  week_start: string;
  total_tickets: number;
  used_tickets: number;
  remaining_tickets: number;
}

export interface DragonReservation {
  id: string;
  tenant_id: string;
  user_id: string;
  date: string;
  period: 'MORNING' | 'AFTERNOON';
  status: 'CONFIRMED' | 'CANCELLED' | 'COMPLETED' | 'NO_SHOW';
  checked_in_at?: string | null;
  user: User;
  created_at: string;
}

export interface Attachment {
  id: string;
  tenant_id: string;
  entity_type: 'task' | 'note' | 'project';
  entity_id: string;
  filename: string;
  original_name: string;
  mime_type: string;
  size: number;
  url: string;
  uploaded_by: string;
  created_at: string;
}

export interface TimelineEntry {
  id: string;
  tenant_id: string;
  user_id: string;
  project_id?: string | null;
  entity_type: string;
  entity_id: string;
  action: TimelineAction;
  old_value?: Record<string, any> | null;
  new_value?: Record<string, any> | null;
  user: User;
  created_at: string;
}

export type TimelineAction =
  | 'CREATED'
  | 'UPDATED'
  | 'DELETED'
  | 'STATUS_CHANGED'
  | 'MEMBER_ADDED'
  | 'MEMBER_REMOVED'
  | 'ASSIGNED'
  | 'UNASSIGNED'
  | 'COMMENT_ADDED'
  | 'VERSION_CREATED';

export interface ApiResponse<T> {
  data: T;
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: {
    total: number;
    page: number;
    per_page: number;
    total_pages: number;
  };
}

export interface ApiError {
  statusCode: number;
  message: string;
  error?: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  access_token: string;
  refresh_token: string;
  user: User;
  tenant: Tenant;
}

export interface RefreshRequest {
  refresh_token: string;
}

export interface RefreshResponse {
  access_token: string;
  refresh_token: string;
}

export interface MagicLinkRequest {
  email: string;
}

export interface MagicLinkVerifyRequest {
  token: string;
}
