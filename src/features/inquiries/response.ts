import type { InquiryForm, InquiryReceipt } from "@features/inquiries/types";

import { OrimetricsError } from "@shared/api/error";
import { isRecord } from "@shared/api/response";

const nonemptyString = (value: unknown): value is string =>
  typeof value === "string" && value.trim().length > 0;
const limit = (value: unknown): value is number =>
  typeof value === "number" && Number.isSafeInteger(value) && value >= 0;

const isForm = (value: unknown): value is InquiryForm => {
  if (!isRecord(value)) {
    return false;
  }

  if (value.enabled === false) {
    return (
      value.privacyNotice === undefined &&
      value.turnstile === undefined &&
      value.limits === undefined
    );
  }

  if (
    value.enabled !== true ||
    !isRecord(value.privacyNotice) ||
    !isRecord(value.turnstile) ||
    !isRecord(value.limits)
  ) {
    return false;
  }

  return (
    nonemptyString(value.privacyNotice.url) &&
    nonemptyString(value.privacyNotice.version) &&
    nonemptyString(value.turnstile.siteKey) &&
    nonemptyString(value.turnstile.action) &&
    limit(value.limits.nameMaxCharacters) &&
    value.limits.nameMaxCharacters > 0 &&
    limit(value.limits.messageMaxCharacters) &&
    limit(value.limits.maxPhones) &&
    limit(value.limits.maxEmails)
  );
};

export const decodeInquiryForm = (value: unknown): InquiryForm => {
  if (!isForm(value)) {
    throw new OrimetricsError({ kind: "protocol" });
  }

  return value;
};

export const decodeInquiryReceipt = (value: unknown): InquiryReceipt => {
  if (!isRecord(value) || value.accepted !== true) {
    throw new OrimetricsError({ kind: "protocol" });
  }

  return { accepted: true };
};
