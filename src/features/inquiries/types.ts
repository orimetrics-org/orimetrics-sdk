import type { RequestOptions } from "@shared/configuration/options";

export type InquiryContact =
  | {
      readonly kind: "phone";
      readonly value: string;
      readonly countryCode?: string | null;
      readonly label?: string | null;
    }
  | { readonly kind: "email"; readonly value: string; readonly label?: string | null };

export interface InquiryCustomer {
  readonly displayName: string;
  readonly contacts: InquiryContact[];
  readonly preferredContactChannel?: "phone" | "email" | "whatsapp" | null;
}

export interface InquirySubmission {
  readonly customer: InquiryCustomer;
  readonly message?: string | null;
  readonly privacyVersion: string;
  readonly privacyAcknowledged: true;
  readonly turnstileToken: string;
}

export interface InquiryLimits {
  readonly nameMaxCharacters: number;
  readonly messageMaxCharacters: number;
  readonly maxPhones: number;
  readonly maxEmails: number;
}

export interface EnabledInquiryForm {
  readonly enabled: true;
  readonly privacyNotice: { readonly url: string; readonly version: string };
  readonly turnstile: { readonly siteKey: string; readonly action: string };
  readonly limits: InquiryLimits;
}

export type InquiryForm =
  | EnabledInquiryForm
  | {
      readonly enabled: false;
      readonly privacyNotice?: never;
      readonly turnstile?: never;
      readonly limits?: never;
    };

export interface InquiryReceipt {
  readonly accepted: true;
}

export interface InquirySubmitOptions extends RequestOptions {
  /** UUID identifying one logical inquiry. Retain it for uncertain retries. */
  readonly idempotencyKey: string;
}

export interface InquiriesApi {
  readonly getForm: (listingSlug: string, options?: RequestOptions) => Promise<InquiryForm>;
  readonly submit: (
    listingSlug: string,
    submission: InquirySubmission,
    options: InquirySubmitOptions,
  ) => Promise<InquiryReceipt>;
}
