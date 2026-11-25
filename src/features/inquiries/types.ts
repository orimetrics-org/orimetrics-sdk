import type { PublicSubmission as InquirySubmission } from "@shared/submissions/types";
import type { RequestOptions } from "@shared/configuration/options";

export type {
  SubmissionContact as InquiryContact,
  SubmissionCustomer as InquiryCustomer,
  PublicSubmission as InquirySubmission,
} from "@shared/submissions/types";

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
