import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy — Talon",
  description: "Talon Privacy Policy",
};

export default function PrivacyPage() {
  return (
    <main className="mx-auto max-w-3xl px-4 py-12 text-sm leading-relaxed">
      <h1 className="font-display text-3xl font-semibold">Privacy Policy</h1>
      <p className="mt-2 text-muted-foreground">Effective date: [Insert date] · Last updated: [Insert date]</p>
      <p className="mt-6">
        Talon is a habit-tracking application that helps you create habits, track your progress, maintain streaks, and review
        your activity over time. This Privacy Policy explains what information Talon may collect, how it is used, who may
        process it, and what choices you have regarding your information.
      </p>
      <p className="mt-4">
        In this policy, "Talon," "we," "us," and "our" refer to [legal name of the person or entity operating Talon]. "You"
        refers to anyone who uses Talon.
      </p>
      <h2 className="mt-8 font-display text-xl font-semibold">1. Information We Collect</h2>
      <p className="mt-2">
        Account information: email address, name/display name, password hash, account settings. Habit and activity
        information: habit names, descriptions, colors, icons, schedules, reminder preferences, completion records,
        streaks, progress summaries, timezone and account settings. Authentication and security information: tokens,
        refresh-token records, password-reset records, session info. Technical information: IP addresses, request metadata,
        timestamps, error records, logs.
      </p>
      <h2 className="mt-8 font-display text-xl font-semibold">2. How We Use Information</h2>
      <p className="mt-2">
        To create and manage accounts, authenticate and maintain sessions, create/edit/schedule/track habits, record
        completions and calculate streaks, generate dashboard summaries and analytics, create/display notifications and
        reminders, send account-related emails, respond to support, detect abuse and troubleshoot, maintain and improve
        reliability, and meet legal obligations.
      </p>
      <h2 className="mt-8 font-display text-xl font-semibold">3. Legal Grounds for Processing</h2>
      <p className="mt-2">
        Performance of a contract, legitimate interests, consent, or legal obligations as applicable. Consent may be
        withdrawn where relied upon.
      </p>
      <h2 className="mt-8 font-display text-xl font-semibold">4. How We Share Information</h2>
      <p className="mt-2">
        We do not sell personal information. We may share with service providers (Supabase, hosting, email,
        infrastructure) under appropriate arrangements, and when required by law or to protect users and the service.
      </p>
      <h2 className="mt-8 font-display text-xl font-semibold">5. Database Hosting and International Transfers</h2>
      <p className="mt-2">
        Talon is intended to use Supabase. The production database location and other providers must be verified;
        information may be processed in a different country, with required legal grounds and safeguards.
      </p>
      <h2 className="mt-8 font-display text-xl font-semibold">6. Cookies and Local Storage</h2>
      <p className="mt-2">
        Talon may use cookies, browser storage, or similar technologies to support authentication, maintain sessions,
        remember preferences, and operate the application.
      </p>
      <h2 className="mt-8 font-display text-xl font-semibold">7. How We Protect Information</h2>
      <p className="mt-2">
        Technical and organisational measures including password hashing, authentication controls, protected sessions,
        access restrictions, secure transport, and security monitoring. No online service can guarantee absolute security.
      </p>
      <h2 className="mt-8 font-display text-xl font-semibold">8. Data Retention</h2>
      <p className="mt-2">
        We retain information as long as reasonably necessary to provide Talon, maintain account functionality, protect the
        service, resolve disputes, and meet legal obligations. Specific retention periods must be established and verified
        before publication.
      </p>
      <h2 className="mt-8 font-display text-xl font-semibold">9. Account Deletion</h2>
      <p className="mt-2">
        Talon is intended to provide account deletion in settings. We intend to delete or de-identify personal information
        associated with the account where appropriate, and revoke relevant sessions. Some information may remain
        temporarily in backups where necessary and lawful.
      </p>
      <h2 className="mt-8 font-display text-xl font-semibold">10. Your Privacy Rights</h2>
      <p className="mt-2">
        Depending on your location and applicable law, you may have rights to access, correct, delete, object to or restrict
        processing, data portability, withdraw consent, and complain to a data protection authority. Contact:
        [privacy contact email]. If you are in Nigeria, you may also have rights under the Nigeria Data Protection Act 2023
        (https://ndpc.gov.ng/).
      </p>
      <h2 className="mt-8 font-display text-xl font-semibold">11. Children's Privacy</h2>
      <p className="mt-2">
        Talon may be accessible to people under 18. We will only process children's personal information where permitted by
        applicable law with required safeguards. Contact [privacy contact email] if you believe a child has provided
        personal information in circumstances not permitted.
      </p>
      <h2 className="mt-8 font-display text-xl font-semibold">12. Third-Party Services and External Links</h2>
      <p className="mt-2">
        Talon may rely on third-party infrastructure or contain links to external websites. This policy does not govern
        independent services; their own privacy notices apply.
      </p>
      <h2 className="mt-8 font-display text-xl font-semibold">13. Changes to This Policy</h2>
      <p className="mt-2">
        We may update this policy. We will update the "Last updated" date; material changes get additional notice where
        required.
      </p>
      <h2 className="mt-8 font-display text-xl font-semibold">14. Contact Us</h2>
      <p className="mt-2">
        Talon privacy contact: [Insert monitored privacy email]. Operator: [Insert legal name]. Address: [Insert, if
        applicable]. Do not include passwords or authentication secrets in privacy requests.
      </p>
      <p className="mt-8 text-muted-foreground italic">
        This document is a draft for review. Complete and check against actual data practices before publication.
      </p>
    </main>
  );
}
