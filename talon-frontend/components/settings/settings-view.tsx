"use client";

import { AppearanceSection } from "@/components/settings/appearance-section";
import { DangerZone } from "@/components/settings/danger-zone";
import { ProfileSection } from "@/components/settings/profile-section";
import { SecuritySection } from "@/components/settings/security-section";
import { TimezoneSection } from "@/components/settings/timezone-section";
import { PageHeader } from "@/components/shared/page-header";
import { SettingsSkeleton } from "@/components/settings/settings-skeleton";
import { QueryError } from "@/components/shared/query-error";
import { useMe } from "@/hooks/queries/use-me";
import { useSettings } from "@/hooks/queries/use-settings";

export function SettingsView() {
  const me = useMe();
  const settings = useSettings();

  if (me.isPending || settings.isPending) return <SettingsSkeleton />;

  if (me.isError || settings.isError) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-8">
        <QueryError
          message="Couldn’t load your settings."
          onRetry={() => {
            void me.refetch();
            void settings.refetch();
          }}
        />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl space-y-8 px-4 py-8">
      <PageHeader title="Settings" description="Manage your profile, preferences, and account." />
      <ProfileSection user={me.data} />
      <AppearanceSection />
      <TimezoneSection timezone={settings.data.timezone} />
      <SecuritySection />
      <DangerZone />
    </div>
  );
}
