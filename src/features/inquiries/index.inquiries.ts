import type { InquiriesApi } from "@features/inquiries/types";
import type { Transport } from "@shared/api/transport";

import { validateSlug } from "@shared/configuration/urls";

import * as response from "@features/inquiries/response";
import * as validation from "@features/inquiries/validation";

export type {
  InquiriesApi,
  InquiryContact,
  InquiryCustomer,
  InquirySubmission,
  InquiryLimits,
  EnabledInquiryForm,
  InquiryForm,
  InquiryReceipt,
  InquirySubmitOptions,
} from "@features/inquiries/types";
export { validateInquirySubmission } from "@features/inquiries/validation";

export const createInquiriesApi = (transport: Transport): InquiriesApi =>
  Object.freeze<InquiriesApi>({
    getForm: async (listingSlug, options) => {
      validateSlug(listingSlug, "listingSlug");

      return transport.execute(
        {
          send: ({ api, organizationSlug, signal }) =>
            api.GET("/public/o/{organizationSlug}/vehicles/{listingSlug}/interest-requests/form", {
              params: { path: { organizationSlug, listingSlug } },
              signal,
            }),
          decode: response.decodeInquiryForm,
        },
        options,
      );
    },
    submit: async (listingSlug, submission, options) => {
      validateSlug(listingSlug, "listingSlug");
      validation.validateIdempotencyKey(options?.idempotencyKey);
      validation.validateSubmission(submission);

      return transport.execute(
        {
          send: ({ api, organizationSlug, signal }) =>
            api.POST("/public/o/{organizationSlug}/vehicles/{listingSlug}/interest-requests", {
              params: {
                path: { organizationSlug, listingSlug },
                header: { "Idempotency-Key": options.idempotencyKey },
              },
              body: submission,
              signal,
            }),
          decode: response.decodeInquiryReceipt,
        },
        options,
      );
    },
  });
