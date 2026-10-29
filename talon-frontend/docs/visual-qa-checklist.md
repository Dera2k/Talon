# Visual QA checklist

## Run

1. Start the API (throttle relaxed) and run `pnpm test:visual`. Screenshots land in `tests/visual/output/<width>/`.
2. Capture the original at the same widths (390, 768, 1024, 1440).
3. Open each pair side by side. Record mismatches in the findings table.

Compare layout, spacing, type, radius, color and states. Don't compare numbers, names or dates.

## Intentional differences (not bugs)

- Primary is `#c8ff2e` (original used `#BAFF3F`).
- Analytics uses lime tints instead of indigo.
- No AI nudges pill, no email-verified badge, no light/system theme tiles.
- Habit form: Daily/Weekly only, weekly is multi-select of weekdays, 10 colors, name max 100.
- Delete removed; archived habits get Restore.
- Sidebar has Log out and collapses to mark only.

## Pages and states

perch, perch-skipped-open, habit-card-menu, notifications-drawer, perch-sidebar-collapsed, sidebar-mobile, habits-list, habits-archived, habit-new, habit-new-weekly, habit-detail, habit-edit, analytics, settings, dialog-change-password, dialog-delete-account, perch-empty, habits-empty, habits-archived-empty, analytics-empty, notifications-empty, plus public pages.

## Findings

| Page / state | Width | Original vs rebuild | Fix |
|---|---|---|---|
| | | | |
