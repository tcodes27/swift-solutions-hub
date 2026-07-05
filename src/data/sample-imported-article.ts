import type { ImportedArticleRow } from "@/data/articles";

/**
 * A mock row as it would arrive from a Google Sheets / CSV import.
 * Used by the Admin preview mode to demonstrate the renderer without
 * connecting an external source.
 */
export const sampleImportedRow: ImportedArticleRow = {
  id: "imported-001",
  slug: "sample-imported-onboarding",
  title: "New hire laptop onboarding checklist",
  category: "new-employee",
  summary:
    "A structured walkthrough for setting up a brand-new company laptop on day one.",
  overview:
    "This guide walks new employees through the essential setup tasks required on their first day, from unboxing to full productivity.",
  symptoms: "Just received a new laptop, First day setup, Missing apps or access",
  difficulty: "Easy",
  estimated_time: "25 min",
  status: "in-review",
  owner: "IT Onboarding Team",
  source_type: "google-sheets",
  source_url: "https://docs.google.com/spreadsheets/example",
  tags: "onboarding, laptop, day-one, setup",
  last_updated: "2026-07-01",
  sections_json: JSON.stringify([
    { type: "heading", text: "Before you begin" },
    {
      type: "text",
      body: "Make sure you've received your welcome email with your work account credentials. If not, check with your manager before continuing.",
    },
    {
      type: "checklist",
      items: [
        { text: "Welcome email received", checked: true },
        { text: "Laptop unboxed and charging", checked: true },
        { text: "Phone available for MFA setup" },
        { text: "Backup 2FA method ready" },
      ],
    },
    { type: "subheading", text: "What you'll need" },
    {
      type: "bulletList",
      items: [
        "Your work email address",
        "Temporary password from IT",
        "A quiet workspace for about 25 minutes",
      ],
    },
    {
      type: "tip",
      title: "Quick tip",
      body: "Have your phone nearby — you'll set up multi-factor authentication in the first few steps.",
    },
    {
      type: "warning",
      title: "Do not skip",
      body: "Complete every step before joining team meetings. Skipping SSO setup will lock you out of shared tools.",
    },
    { type: "heading", text: "System requirements" },
    {
      type: "table",
      headers: ["Item", "Minimum", "Recommended"],
      rows: [
        ["macOS", "13 Ventura", "14 Sonoma"],
        ["Free disk space", "20 GB", "50 GB"],
        ["Network", "Office Wi-Fi", "Office Wi-Fi + hotspot"],
      ],
    },
    {
      type: "imagePlaceholder",
      label: "Setup screenshot",
      caption: "Your desktop should look like this after step 5.",
    },
    { type: "heading", text: "Common questions" },
    {
      type: "faq",
      items: [
        {
          q: "What if my temporary password doesn't work?",
          a: "Contact your onboarding buddy or open a ticket via the IT portal — do not attempt to reset it yourself before signing in.",
        },
        {
          q: "Can I install personal apps?",
          a: "Yes, on approved software only. See the Software Requests topic for the current allow list.",
        },
      ],
    },
    {
      type: "callout",
      title: "Almost done",
      body: "Once you've completed the checklist, mark this article as helpful — it feeds our onboarding metrics.",
    },
  ]),
  steps_json: JSON.stringify([
    {
      title: "Unbox and power on",
      body: "Plug the laptop in and press the power button.",
      description: "Plug the laptop in and press the power button.",
      details: "Let it charge for a few minutes before signing in.",
      estimatedTime: "2 min",
      tip: "Keep the box — you'll need it if the device is ever returned.",
    },
    {
      title: "Connect to Wi-Fi",
      body: "Join the corporate Wi-Fi network using the credentials in your welcome email.",
      estimatedTime: "3 min",
    },
    {
      title: "Sign in with your work account",
      body: "Use your temporary password. You'll be prompted to change it.",
      estimatedTime: "5 min",
      warning: "Never share your temporary password with anyone.",
    },
    {
      title: "Enroll in MFA",
      body: "Install the authenticator app on your phone and scan the QR code.",
      estimatedTime: "5 min",
    },
    {
      title: "Install core apps",
      body: "Open the company app catalog and install Slack, Zoom, and 1Password.",
      estimatedTime: "10 min",
    },
  ]),
};
