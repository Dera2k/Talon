import { SettingsSection } from "@/components/settings/settings-section";
import { Label } from "@/components/ui/label";

export function AppearanceSection() {
  return (
    <SettingsSection title="Appearance">
      <div className="space-y-3">
        <Label>Theme</Label>
        <div className="grid grid-cols-3 gap-2">
          <div
            aria-current="true"
            className="rounded-lg border border-primary bg-primary/10 p-3 text-center text-sm"
          >
            Dark
          </div>
        </div>
        <p className="text-xs text-muted-foreground">
          Dark is the only theme for now. Light and system themes aren’t available yet.
        </p>
      </div>
    </SettingsSection>
  );
}
