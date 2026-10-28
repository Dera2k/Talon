import { DeleteAccountDialog } from "@/components/settings/delete-account-dialog";
import { SettingsSection } from "@/components/settings/settings-section";

export function DangerZone() {
  return (
    <SettingsSection title="Danger zone" tone="danger">
      <div className="rounded-xl border border-destructive/30 bg-destructive/5 p-4">
        <p className="font-display font-semibold text-foreground">Delete account</p>
        <p className="mt-1 text-sm text-muted-foreground">
          Your account will be scheduled for deletion. Your data is permanently deleted after 30
          days.
        </p>
        <DeleteAccountDialog />
      </div>
    </SettingsSection>
  );
}
