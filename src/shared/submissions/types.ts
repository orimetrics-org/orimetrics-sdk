export type SubmissionContact =
  | {
      readonly kind: "phone";
      readonly value: string;
      readonly countryCode?: string | null;
      readonly label?: string | null;
    }
  | { readonly kind: "email"; readonly value: string; readonly label?: string | null };

export interface SubmissionCustomer {
  readonly displayName: string;
  readonly contacts: SubmissionContact[];
  readonly preferredContactChannel?: "phone" | "email" | "whatsapp" | null;
}

export interface PublicSubmission {
  readonly customer: SubmissionCustomer;
  readonly message?: string | null;
  readonly privacyVersion: string;
  readonly privacyAcknowledged: true;
  readonly turnstileToken: string;
}
