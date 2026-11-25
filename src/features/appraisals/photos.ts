import type {
  AppraisalPhoto,
  AppraisalUpload,
  AppraisalPhotoInput,
} from "@features/appraisals/types";
import type { RequestOptions, ResolvedOptions } from "@shared/configuration/options";

import { isUpload } from "@features/appraisals/response";
import { validatePhotoInput } from "@features/appraisals/validation";
import { isRecord } from "@shared/api/response";
import { OrimetricsError } from "@shared/api/error";
import { withDeadline } from "@shared/api/deadline";

export const requireUpload = (photo: AppraisalPhoto): AppraisalUpload => {
  if (!isRecord(photo) || photo.state !== "upload_available" || !isUpload(photo.upload)) {
    throw new TypeError("This photo has no available upload.");
  }

  return photo.upload;
};

export const validateExpiry = (value: string): void => {
  const expiresAt = Date.parse(value);

  if (!Number.isFinite(expiresAt) || expiresAt <= Date.now()) {
    throw new TypeError("The photo upload window is invalid or expired.");
  }
};

export const uploadPhoto = async (
  config: ResolvedOptions,
  photo: AppraisalPhoto,
  file: Blob,
  declared: AppraisalPhotoInput,
  options: RequestOptions = {},
): Promise<void> => {
  const upload = requireUpload(photo);
  validatePhotoInput(declared);
  validateExpiry(upload.expiresAt);

  if (
    upload.method !== "PUT" ||
    !(file instanceof Blob) ||
    file.size !== declared.byteSize ||
    file.type !== declared.contentType
  ) {
    throw new TypeError("Photo body must match the declared size and content type and use PUT.");
  }

  let url: URL;

  try {
    url = new URL(upload.url);
  } catch {
    throw new TypeError("Invalid photo upload URL.");
  }

  if (url.protocol !== "https:" || url.username || url.password || url.hash) {
    throw new TypeError("Photo upload URL must use HTTPS without credentials or a fragment.");
  }

  let headers: Headers;

  try {
    headers = new Headers(upload.headers);
  } catch {
    throw new TypeError("Invalid photo upload headers.");
  }

  if (
    headers.has("authorization") ||
    headers.has("cookie") ||
    headers.has("proxy-authorization") ||
    headers.get("content-type") !== declared.contentType ||
    headers.get("if-none-match") !== "*"
  ) {
    throw new TypeError("Invalid photo upload headers.");
  }

  if (headers.has("content-length") && headers.get("content-length") !== String(file.size)) {
    throw new TypeError("Photo upload length does not match the file.");
  }

  // Browsers supply Content-Length from the raw Blob; it is a forbidden request header.
  headers.delete("content-length");

  await withDeadline(
    async (signal) => {
      const init: RequestInit = {
        method: "PUT",
        body: file,
        headers,
        signal,
        credentials: "omit",
        cache: "no-store",
        redirect: "error",
        referrerPolicy: "no-referrer",
      };
      let response: Response;

      try {
        response = await config.fetch(new Request(url, init), init);
      } catch {
        throw new OrimetricsError({ kind: "network" });
      }

      // Storage error bodies can contain signed URL data. Never parse or expose them.
      await response.body?.cancel().catch(() => undefined);

      if (!response.ok) {
        throw new OrimetricsError({ kind: "http", status: response.status });
      }
    },
    options,
    config.timeoutMs,
  );
};
