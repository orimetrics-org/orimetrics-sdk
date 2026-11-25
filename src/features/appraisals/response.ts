import type { AppraisalForm, AppraisalReceipt, AppraisalUpload } from "@features/appraisals/types";

import { isRecord } from "@shared/api/response";
import { OrimetricsError } from "@shared/api/error";

export const CONTENT_TYPES = ["image/jpeg", "image/png", "image/webp", "image/heic"] as const;
const text = (value: unknown): value is string => typeof value === "string";
const nullableText = (value: unknown): boolean => value === null || text(value);
const integer = (value: unknown): boolean =>
  typeof value === "number" && Number.isSafeInteger(value) && value >= 0;
const identity = (value: unknown): boolean =>
  isRecord(value) && text(value.slug) && text(value.name);

const isForm = (value: unknown): value is AppraisalForm => {
  if (!isRecord(value)) {
    return false;
  }

  if (value.enabled === false) {
    return ["company", "dealership", "privacyNotice", "turnstile", "limits", "photos"].every(
      (key) => value[key] === undefined,
    );
  }

  if (
    value.enabled !== true ||
    !isRecord(value.privacyNotice) ||
    !isRecord(value.turnstile) ||
    !isRecord(value.limits) ||
    !isRecord(value.photos)
  ) {
    return false;
  }

  const limits = value.limits;
  const photos = value.photos;

  return (
    identity(value.company) &&
    identity(value.dealership) &&
    nullableText(value.privacyNotice.url) &&
    nullableText(value.privacyNotice.version) &&
    text(value.turnstile.siteKey) &&
    text(value.turnstile.action) &&
    ["nameMaxCharacters", "messageMaxCharacters", "maxPhones", "maxEmails"].every((key) =>
      integer(limits[key]),
    ) &&
    Array.isArray(photos.contentTypes) &&
    photos.contentTypes.every((entry: unknown) => CONTENT_TYPES.some((type) => type === entry)) &&
    ((photos.enabled === false &&
      ["maxPhotos", "maxUploadBytes", "uploadSeconds"].every((key) => photos[key] === undefined)) ||
      (photos.enabled === true &&
        ["maxPhotos", "maxUploadBytes", "uploadSeconds"].every((key) => integer(photos[key]))))
  );
};

export const isUpload = (value: unknown): value is AppraisalUpload => {
  if (!isRecord(value) || !isRecord(value.headers)) {
    return false;
  }

  return (
    ["url", "expiresAt", "completePath", "completionToken", "completionExpiresAt"].every((key) =>
      text(value[key]),
    ) &&
    (value.method === "GET" || value.method === "PUT") &&
    Object.values(value.headers).every(text)
  );
};

const isReceipt = (value: unknown): value is AppraisalReceipt =>
  isRecord(value) &&
  value.accepted === true &&
  text(value.reference) &&
  Array.isArray(value.photos) &&
  value.photos.every(
    (photo: unknown) =>
      isRecord(photo) &&
      text(photo.slug) &&
      ((photo.state === "upload_available" && isUpload(photo.upload)) ||
        (["upload_closed", "temporarily_unavailable", "completion_accepted"].some(
          (state) => state === photo.state,
        ) &&
          photo.upload === null)),
  );

export const decodeAppraisalForm = (value: unknown): AppraisalForm => {
  if (!isForm(value)) {
    throw new OrimetricsError({ kind: "protocol" });
  }

  return value;
};
export const decodeAppraisalReceipt = (value: unknown): AppraisalReceipt => {
  if (!isReceipt(value)) {
    throw new OrimetricsError({ kind: "protocol" });
  }

  return value;
};
