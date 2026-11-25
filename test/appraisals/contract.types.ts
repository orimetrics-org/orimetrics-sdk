import type { AppraisalSubmission, AppraisalReceipt, AppraisalForm } from "@sdk";
import type { paths } from "@shared/api/generated/schema";

type Post = paths["/public/o/{organizationSlug}/d/{dealershipSlug}/appraisal-requests"]["post"];
type Body = Post["requestBody"]["content"]["application/json"];
type Receipt = Post["responses"][202]["content"]["application/json"];
type Form =
  paths["/public/o/{organizationSlug}/d/{dealershipSlug}/appraisal-requests/form"]["get"]["responses"][200]["content"]["application/json"];
type Assert<T extends true> = T;
export type BodyContract = Assert<
  Body extends AppraisalSubmission ? (AppraisalSubmission extends Body ? true : false) : false
>;
export type ReceiptContract = Assert<
  Receipt extends AppraisalReceipt ? (AppraisalReceipt extends Receipt ? true : false) : false
>;
export type FormContract = Assert<AppraisalForm extends Form ? true : false>;
// The wire snapshot uses boolean for enabled; the decoder validates the documented branches.
export type EnabledFields = Assert<
  Omit<Extract<Form, { company: object }>, "enabled"> extends Omit<
    Extract<AppraisalForm, { enabled: true }>,
    "enabled"
  >
    ? true
    : false
>;
