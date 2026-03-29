import { Shield, Mail, Calendar } from 'lucide-react';
import type { User } from '@/types';

interface ProfileHeaderProps {
  user: User;
}

const STATUS_STYLES: Record<string, { bg: string; text: string; label: string }> = {
  ACTIVE: { bg: 'rgba(22,163,74,0.1)', text: '#16a34a', label: 'Active' },
  UNVERIFIED: { bg: 'rgba(202,138,4,0.1)', text: '#ca8a04', label: 'Unverified' },
  SUSPENDED: { bg: 'rgba(220,38,38,0.1)', text: '#dc2626', label: 'Suspended' },
  DEACTIVATED: { bg: 'rgba(115,115,115,0.1)', text: '#737373', label: 'Deactivated' },
};

export function ProfileHeader({ user }: ProfileHeaderProps) {
  const initial = user.name?.charAt(0).toUpperCase() ?? '?';
  const statusStyle = STATUS_STYLES[user.status] ?? STATUS_STYLES.ACTIVE;
  const memberSince = new Date(user.createdAt).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
  });

  return (
    <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 pb-8 border-b border-[var(--color-border)]">
      {/* Avatar */}
      <div className="w-20 h-20 sm:w-24 sm:h-24 bg-[var(--color-text-heading)] text-[var(--color-bg)] flex items-center justify-center text-3xl sm:text-4xl font-black shrink-0">
        {initial}
      </div>

      {/* Info */}
      <div className="flex flex-col items-center sm:items-start gap-2 flex-1">
        <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-[var(--color-text-heading)] uppercase">
          {user.name}
        </h1>

        <div className="flex items-center gap-2 text-sm text-[var(--color-text-muted)]">
          <Mail size={14} />
          <span>{user.email}</span>
        </div>

        <div className="flex flex-wrap items-center gap-3 mt-1">
          {/* Status Badge */}
          <span
            className="inline-flex items-center gap-1.5 px-3 py-1 text-[0.6875rem] font-bold uppercase tracking-widest"
            style={{ backgroundColor: statusStyle.bg, color: statusStyle.text }}
          >
            <Shield size={12} />
            {statusStyle.label}
          </span>

          {/* Member since */}
          <span className="inline-flex items-center gap-1.5 text-xs text-[var(--color-text-muted)] font-medium">
            <Calendar size={12} />
            Member since {memberSince}
          </span>
        </div>
      </div>
    </div>
  );
}
