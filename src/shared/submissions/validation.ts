import type { PublicSubmission } from "@shared/submissions/types";

import { isRecord } from "@shared/api/response";

const invalid: (field: string) => never = (field) => {
  throw new TypeError(`Invalid submission field: ${field}.`);
};

const nonemptyString = (value: unknown): value is string =>
  typeof value === "string" && value.trim().length > 0;
const optionalString = (value: unknown): boolean =>
  value === undefined || value === null || typeof value === "string";

const onlyKeys = (value: Record<string, unknown>, keys: readonly string[], field: string): void => {
  if (Object.keys(value).some((key) => !keys.includes(key))) {
    invalid(field);
  }
};

export const validateIdempotencyKey = (key: string): void => {
  if (
    typeof key !== "string" ||
    !/^(?:[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}|00000000-0000-0000-0000-000000000000|ffffffff-ffff-ffff-ffff-ffffffffffff)$/iu.test(
      key,
    )
  ) {
    invalid("idempotencyKey");
  }
};

export const validateSubmission = (submission: PublicSubmission): void => {
  if (!isRecord(submission) || !isRecord(submission.customer)) {
    invalid("customer");
  }

  onlyKeys(
    submission,
    ["customer", "message", "privacyVersion", "privacyAcknowledged", "turnstileToken"],
    "submission",
  );
  const customer = submission.customer;
  onlyKeys(customer, ["displayName", "contacts", "preferredContactChannel"], "customer");

  if (!nonemptyString(customer.displayName)) {
    invalid("customer.displayName");
  }

  if (
    !Array.isArray(customer.contacts) ||
    customer.contacts.length < 1 ||
    customer.contacts.length > 2
  ) {
    invalid("customer.contacts");
  }

  const kinds = new Set<string>();

  for (const contact of customer.contacts) {
    if (
      !isRecord(contact) ||
      (contact.kind !== "phone" && contact.kind !== "email") ||
      !nonemptyString(contact.value) ||
      !optionalString(contact.label)
    ) {
      invalid("customer.contacts");
    }

    onlyKeys(
      contact,
      contact.kind === "phone"
        ? ["kind", "value", "label", "countryCode"]
        : ["kind", "value", "label"],
      "customer.contacts",
    );

    if (kinds.has(contact.kind)) {
      invalid("customer.contacts");
    }

    kinds.add(contact.kind);

    if (contact.kind === "phone") {
      if (
        contact.countryCode !== undefined &&
        contact.countryCode !== null &&
        (typeof contact.countryCode !== "string" || !/^[A-Za-z]{2}$/u.test(contact.countryCode))
      ) {
        invalid("customer.contacts.countryCode");
      }

      if (!contact.value.trim().startsWith("+") && !contact.countryCode) {
        invalid("customer.contacts.countryCode");
      }
    }
  }

  const preferred = customer.preferredContactChannel;

  if (preferred !== undefined && preferred !== null) {
    if (
      !["phone", "email", "whatsapp"].includes(preferred) ||
      !kinds.has(preferred === "whatsapp" ? "phone" : preferred)
    ) {
      invalid("customer.preferredContactChannel");
    }
  }

  if (!optionalString(submission.message)) {
    invalid("message");
  }

  if (!nonemptyString(submission.privacyVersion)) {
    invalid("privacyVersion");
  }

  if (submission.privacyAcknowledged !== true) {
    invalid("privacyAcknowledged");
  }

  if (!nonemptyString(submission.turnstileToken) || submission.turnstileToken.length > 2048) {
    invalid("turnstileToken");
  }
};
