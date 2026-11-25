import type { InquiryForm, InquirySubmission, InquiryReceipt } from "@sdk";
import type { paths } from "@shared/api/generated/schema";

type Post = paths["/public/o/{organizationSlug}/vehicles/{listingSlug}/interest-requests"]["post"];
type Body = Post["requestBody"]["content"]["application/json"];
type Receipt = Post["responses"][202]["content"]["application/json"];
type Form =
  paths["/public/o/{organizationSlug}/vehicles/{listingSlug}/interest-requests/form"]["get"]["responses"][200]["content"]["application/json"];
type Assert<T extends true> = T;
export type SubmissionContract = Assert<
  Body extends InquirySubmission ? (InquirySubmission extends Body ? true : false) : false
>;
export type ReceiptContract = Assert<
  Receipt extends InquiryReceipt ? (InquiryReceipt extends Receipt ? true : false) : false
>;
// The snapshot uses boolean rather than true/false for enabled. The decoder validates the documented branches.
export type FormContract = Assert<InquiryForm extends Form ? true : false>;
type WireEnabled = Extract<Form, { privacyNotice: object }>;
export type EnabledFieldsContract = Assert<
  Omit<WireEnabled, "enabled"> extends Omit<Extract<InquiryForm, { enabled: true }>, "enabled">
    ? true
    : false
>;
