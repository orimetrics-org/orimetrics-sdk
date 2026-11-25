import type { InquiryForm, InquirySubmission } from "@features/inquiries/types";

import { decodeInquiryForm } from "@features/inquiries/response";
import { validateSubmission } from "@shared/submissions/validation";

export { validateSubmission, validateIdempotencyKey } from "@shared/submissions/validation";

const invalid: (field: string) => never = (field) => {
  throw new TypeError(`Invalid inquiry field: ${field}.`);
};

/** Validates without mutation or I/O. The server still owns contact normalization and admission. */
export const validateInquirySubmission = (
  submission: InquirySubmission,
  form: InquiryForm,
): void => {
  validateSubmission(submission);
  const current = decodeInquiryForm(form);

  if (!current.enabled) {
    invalid("form.enabled");
  }

  if (submission.privacyVersion !== current.privacyNotice.version) {
    invalid("privacyVersion");
  }

  if (submission.customer.displayName.trim().length > current.limits.nameMaxCharacters) {
    invalid("customer.displayName");
  }

  if (
    submission.message &&
    submission.message.trim().length > current.limits.messageMaxCharacters
  ) {
    invalid("message");
  }

  for (const kind of ["phone", "email"] as const) {
    const maximum = kind === "phone" ? current.limits.maxPhones : current.limits.maxEmails;

    if (submission.customer.contacts.filter((contact) => contact.kind === kind).length > maximum) {
      invalid("customer.contacts");
    }
  }
};
