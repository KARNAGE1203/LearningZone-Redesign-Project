export type NotificationType =
  | 'course'
  | 'university'
  | 'grade'
  | 'deadline'
  | 'system';

export type NotificationStatus = 'unread' | 'read' | 'archived';

export interface Notification {
  id:         string;
  type:       NotificationType;
  status:     NotificationStatus;
  title:      string;
  preview:    string;
  fullText:   string;
  source:     string;
  sourceType: 'course' | 'university' | 'admin';
  timestamp:  string;
  createdAt:  Date;
  actionUrl?: string;
}

export const NOTIF_TYPES: Record<
  NotificationType,
  { bg: string; text: string; border: string; label: string }
> = {
  course:     { bg: '#F3F0FF', text: '#5B21B6', border: '#5B21B6', label: 'Course'     },
  university: { bg: '#E8F5F3', text: '#00695C', border: '#00695C', label: 'University' },
  grade:      { bg: '#DCFCE7', text: '#166534', border: '#166534', label: 'Grade'      },
  deadline:   { bg: '#FEF3C7', text: '#D97706', border: '#D97706', label: 'Deadline'   },
  system:     { bg: '#F3F4F6', text: '#374151', border: '#374151', label: 'System'     },
};
