import type { AppraisalsApi } from "@features/appraisals/types";
import type { ResolvedOptions } from "@shared/configuration/options";
import type { Transport } from "@shared/api/transport";

import { validateSlug } from "@shared/configuration/urls";
import { validateIdempotencyKey } from "@shared/submissions/validation";
import { isRecord } from "@shared/api/response";
import { OrimetricsError } from "@shared/api/error";

import * as response from "@features/appraisals/response";
import * as validation from "@features/appraisals/validation";
import * as photos from "@features/appraisals/photos";

export type {
  AppraisalsApi,
  AppraisalCustomer,
  AppraisalContact,
  AppraisalVehicle,
  AppraisalPhotoContentType,
  AppraisalPhotoInput,
  AppraisalSubmission,
  AppraisalLimits,
  AppraisalPhotoPolicy,
  EnabledAppraisalForm,
  AppraisalForm,
  AppraisalUpload,
  AppraisalPhoto,
  AppraisalReceipt,
  AppraisalCompletionReceipt,
  AppraisalSubmitOptions,
} from "@features/appraisals/types";
export { validateAppraisalSubmission } from "@features/appraisals/validation";

export const createAppraisalsApi = (transport: Transport, config: ResolvedOptions): AppraisalsApi =>
  Object.freeze<AppraisalsApi>({
    getForm: async (dealershipSlug, options) => {
      validateSlug(dealershipSlug, "dealershipSlug");

      return transport.execute(
        {
          send: ({ api, organizationSlug, signal }) =>
            api.GET("/public/o/{organizationSlug}/d/{dealershipSlug}/appraisal-requests/form", {
              params: { path: { organizationSlug, dealershipSlug } },
              signal,
            }),
          decode: response.decodeAppraisalForm,
        },
        options,
      );
    },
    submit: async (dealershipSlug, submission, options) => {
      validateSlug(dealershipSlug, "dealershipSlug");
      validateIdempotencyKey(options?.idempotencyKey);
      validation.validateAppraisalInput(submission);

      return transport.execute(
        {
          send: ({ api, organizationSlug, signal }) =>
            api.POST("/public/o/{organizationSlug}/d/{dealershipSlug}/appraisal-requests", {
              params: {
                path: { organizationSlug, dealershipSlug },
                header: { "Idempotency-Key": options.idempotencyKey },
              },
              body: submission,
              signal,
            }),
          decode: response.decodeAppraisalReceipt,
        },
        options,
      );
    },
    uploadPhoto: (photo, file, declared, options) =>
      photos.uploadPhoto(config, photo, file, declared, options),
    completePhoto: async (dealershipSlug, reference, photo, options) => {
      validateSlug(dealershipSlug, "dealershipSlug");
      validateSlug(reference, "reference");
      const upload = photos.requireUpload(photo);
      validateSlug(photo.slug, "photo.slug");
      photos.validateExpiry(upload.completionExpiresAt);
      const segments = [
        "public",
        "o",
        config.organizationSlug,
        "d",
        dealershipSlug,
        "appraisal-requests",
        reference,
        "photos",
        photo.slug,
        "complete",
      ];
      const expected = `/${segments.map(encodeURIComponent).join("/")}`;

      if (
        upload.completePath !== expected ||
        !upload.completionToken ||
        !/^[A-Za-z0-9._~+/-]+=*$/u.test(upload.completionToken)
      ) {
        throw new TypeError(
          "Photo completion must match this organization, dealership, receipt and photo.",
        );
      }

      return transport.execute(
        {
          send: ({ api, organizationSlug, signal }) =>
            api.POST(
              "/public/o/{organizationSlug}/d/{dealershipSlug}/appraisal-requests/{requestReference}/photos/{photoSlug}/complete",
              {
                params: {
                  path: {
                    organizationSlug,
                    dealershipSlug,
                    requestReference: reference,
                    photoSlug: photo.slug,
                  },
                  header: { Authorization: `Bearer ${upload.completionToken}` },
                },
                signal,
              },
            ),
          decode: (value) => {
            if (!isRecord(value) || value.accepted !== true) {
              throw new OrimetricsError({ kind: "protocol" });
            }

            return { accepted: true as const };
          },
        },
        options,
      );
    },
  });
