import type { EnabledInquiryForm, InquirySubmission } from "@sdk";

export const INQUIRY_KEY = "97c18d53-60b4-4b16-aad1-84cc66bf4df1" as const;

export const createInquiryForm = (): EnabledInquiryForm => ({
  enabled: true,
  privacyNotice: { url: "https://dealer.example/privacy", version: "2026-11-16" },
  turnstile: { siteKey: "public-site-key", action: "vehicle-inquiry" },
  limits: { nameMaxCharacters: 100, messageMaxCharacters: 2000, maxPhones: 1, maxEmails: 1 },
});

export const createInquiry = (): InquirySubmission => ({
  customer: {
    displayName: " Visitor Name ",
    contacts: [
      { kind: "phone", value: "099 123 4567", countryCode: "EC", label: null },
      { kind: "email", value: " Visitor@example.com " },
    ],
    preferredContactChannel: "whatsapp",
  },
  message: "I would like to arrange a visit.",
  privacyVersion: "2026-11-16",
  privacyAcknowledged: true,
  turnstileToken: "widget-token",
});
