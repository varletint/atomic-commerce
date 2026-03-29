import { useState } from 'react';
import { User, MapPin, ShieldCheck } from 'lucide-react';
import { SEO } from '@/components/SEO';
import { useAuthStore } from '@/store';
import { ProfileHeader } from '../components/ProfileHeader';
import { PersonalInfoTab } from '../components/PersonalInfoTab';
import { AddressTab } from '../components/AddressTab';
import { SecurityTab } from '../components/SecurityTab';

type TabId = 'personal' | 'address' | 'security';

const TABS: { id: TabId; label: string; icon: React.ReactNode }[] = [
  { id: 'personal', label: 'Personal Info', icon: <User size={16} /> },
  { id: 'address', label: 'Address', icon: <MapPin size={16} /> },
  { id: 'security', label: 'Security', icon: <ShieldCheck size={16} /> },
];

export function ProfilePage() {
  const user = useAuthStore((s) => s.user);
  const [activeTab, setActiveTab] = useState<TabId>('personal');

  if (!user) return null; // AuthGuard will prevent this

  return (
    <>
      <SEO title="My Account — Atomic Order" description="Manage your Atomic Order account." />

      <div className="bg-[var(--color-bg)] min-h-screen pt-8 pb-24">
        <div className="container max-w-3xl">
          {/* ── Header ── */}
          <ProfileHeader user={user} />

          {/* ── Tab Bar ── */}
          <div className="flex gap-0 mt-8 border-b border-[var(--color-border)] overflow-x-auto">
            {TABS.map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-5 py-3 text-xs font-bold uppercase tracking-widest transition-colors cursor-pointer whitespace-nowrap border-b-2 ${
                  activeTab === tab.id
                    ? 'border-[var(--color-text-heading)] text-[var(--color-text-heading)]'
                    : 'border-transparent text-[var(--color-text-muted)] hover:text-[var(--color-text-heading)]'
                }`}
              >
                {tab.icon}
                {tab.label}
              </button>
            ))}
          </div>

          {/* ── Tab Content ── */}
          <div className="mt-8">
            {activeTab === 'personal' && <PersonalInfoTab />}
            {activeTab === 'address' && <AddressTab />}
            {activeTab === 'security' && <SecurityTab />}
          </div>
        </div>
      </div>
    </>
  );
}
