import { ChangePasswordDialog } from "@/components/settings/change-password-dialog";
import { SettingsSection } from "@/components/settings/settings-section";

export function SecuritySection() {
  return (
    <SettingsSection title="Security">
      <ChangePasswordDialog />
    </SettingsSection>
  );
}
