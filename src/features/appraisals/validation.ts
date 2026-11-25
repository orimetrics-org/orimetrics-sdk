import type {
  AppraisalForm,
  AppraisalSubmission,
  AppraisalPhotoInput,
} from "@features/appraisals/types";

import { validateSubmission } from "@shared/submissions/validation";
import { isRecord } from "@shared/api/response";
import { CONTENT_TYPES, decodeAppraisalForm } from "@features/appraisals/response";

const invalid: (field: string) => never = (field) => {
  throw new TypeError(`Invalid appraisal field: ${field}.`);
};
const text = (value: unknown, max: number): boolean =>
  typeof value === "string" && value.trim().length > 0 && value.trim().length <= max;
const keys = (value: Record<string, unknown>, allowed: string[]): boolean =>
  Object.keys(value).every((key) => allowed.includes(key));

export const validatePhotoInput = (photo: AppraisalPhotoInput): void => {
  if (
    !isRecord(photo) ||
    !keys(photo, ["filename", "contentType", "byteSize", "altText"]) ||
    !text(photo.filename, 255) ||
    !CONTENT_TYPES.some((type) => type === photo.contentType) ||
    !Number.isSafeInteger(photo.byteSize) ||
    photo.byteSize <= 0 ||
    (photo.altText !== undefined &&
      (typeof photo.altText !== "string" || photo.altText.trim().length > 500))
  ) {
    invalid("photos");
  }
};

export const validateAppraisalInput = (submission: AppraisalSubmission): void => {
  if (!isRecord(submission) || !isRecord(submission.vehicle)) {
    invalid("vehicle");
  }

  const { vehicle, photos, ...common } = submission;
  validateSubmission(common);

  if (
    !keys(vehicle, [
      "submittedBrand",
      "submittedModel",
      "modelYear",
      "submittedCity",
      "conditionDescription",
      "vin",
      "licensePlate",
      "odometerValue",
      "odometerUnit",
      "expectedPriceUsd",
    ])
  ) {
    invalid("vehicle");
  }

  for (const field of [
    "submittedBrand",
    "submittedModel",
    "submittedCity",
    "conditionDescription",
  ] as const) {
    if (!text(vehicle[field], 2000)) {
      invalid(`vehicle.${field}`);
    }
  }

  if (
    !Number.isInteger(vehicle.modelYear) ||
    vehicle.modelYear < 1886 ||
    vehicle.modelYear > 32767
  ) {
    invalid("vehicle.modelYear");
  }

  for (const field of ["vin", "licensePlate"] as const) {
    if (vehicle[field] !== null && vehicle[field] !== undefined && !text(vehicle[field], 100)) {
      invalid(`vehicle.${field}`);
    }
  }

  if (
    (vehicle.odometerValue === null || vehicle.odometerValue === undefined) !==
    (vehicle.odometerUnit === null || vehicle.odometerUnit === undefined)
  ) {
    invalid("vehicle.odometer");
  }

  if (
    vehicle.odometerValue !== null &&
    vehicle.odometerValue !== undefined &&
    (!Number.isInteger(vehicle.odometerValue) ||
      vehicle.odometerValue < 0 ||
      vehicle.odometerValue > 2147483647)
  ) {
    invalid("vehicle.odometerValue");
  }

  if (
    vehicle.odometerUnit !== null &&
    vehicle.odometerUnit !== undefined &&
    vehicle.odometerUnit !== "km" &&
    vehicle.odometerUnit !== "mi"
  ) {
    invalid("vehicle.odometerUnit");
  }

  if (
    vehicle.expectedPriceUsd !== null &&
    vehicle.expectedPriceUsd !== undefined &&
    (typeof vehicle.expectedPriceUsd !== "string" ||
      !/^(?:0|[1-9][0-9]{0,9})(?:\.[0-9]{1,2})?$/u.test(vehicle.expectedPriceUsd) ||
      Number(vehicle.expectedPriceUsd) <= 0)
  ) {
    invalid("vehicle.expectedPriceUsd");
  }

  if (submission.privacyVersion.trim().length > 150) {
    invalid("privacyVersion");
  }

  if (photos !== undefined) {
    if (!Array.isArray(photos) || photos.length > 12) {
      invalid("photos");
    }

    for (const photo of photos) {
      validatePhotoInput(photo);
    }
  }
};

export const validateAppraisalSubmission = (
  submission: AppraisalSubmission,
  form: AppraisalForm,
): void => {
  validateAppraisalInput(submission);
  const current = decodeAppraisalForm(form);

  if (!current.enabled || !current.privacyNotice.url || !current.privacyNotice.version) {
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
    if (
      submission.customer.contacts.filter((contact) => contact.kind === kind).length >
      (kind === "phone" ? current.limits.maxPhones : current.limits.maxEmails)
    ) {
      invalid("customer.contacts");
    }
  }

  const photos = submission.photos ?? [];

  if (photos.length > 0) {
    if (!current.photos.enabled || photos.length > current.photos.maxPhotos) {
      invalid("photos");
    }

    for (const photo of photos) {
      if (
        photo.byteSize > current.photos.maxUploadBytes ||
        !current.photos.contentTypes.includes(photo.contentType)
      ) {
        invalid("photos");
      }
    }
  }
};
