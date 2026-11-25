import type { PublicSubmission } from "@shared/submissions/types";
import type { RequestOptions } from "@shared/configuration/options";

export type {
  SubmissionCustomer as AppraisalCustomer,
  SubmissionContact as AppraisalContact,
} from "@shared/submissions/types";

export interface AppraisalVehicle {
  readonly submittedBrand: string;
  readonly submittedModel: string;
  readonly modelYear: number;
  readonly submittedCity: string;
  readonly conditionDescription: string;
  readonly vin?: string | null;
  readonly licensePlate?: string | null;
  readonly odometerValue?: number | null;
  readonly odometerUnit?: "km" | "mi" | null;
  readonly expectedPriceUsd?: string | null;
}
export type AppraisalPhotoContentType = "image/jpeg" | "image/png" | "image/webp" | "image/heic";
export interface AppraisalPhotoInput {
  readonly filename: string;
  readonly contentType: AppraisalPhotoContentType;
  readonly byteSize: number;
  readonly altText?: string;
}
export interface AppraisalSubmission extends PublicSubmission {
  readonly vehicle: AppraisalVehicle;
  readonly photos?: AppraisalPhotoInput[];
}
export interface AppraisalLimits {
  readonly nameMaxCharacters: number;
  readonly messageMaxCharacters: number;
  readonly maxPhones: number;
  readonly maxEmails: number;
}
export type AppraisalPhotoPolicy =
  | {
      readonly enabled: false;
      readonly contentTypes: AppraisalPhotoContentType[];
      readonly maxPhotos?: never;
      readonly maxUploadBytes?: never;
      readonly uploadSeconds?: never;
    }
  | {
      readonly enabled: true;
      readonly contentTypes: AppraisalPhotoContentType[];
      readonly maxPhotos: number;
      readonly maxUploadBytes: number;
      readonly uploadSeconds: number;
    };
export interface EnabledAppraisalForm {
  readonly enabled: true;
  readonly company: { readonly slug: string; readonly name: string };
  readonly dealership: { readonly slug: string; readonly name: string };
  readonly privacyNotice: { readonly url: string | null; readonly version: string | null };
  readonly turnstile: { readonly siteKey: string; readonly action: string };
  readonly limits: AppraisalLimits;
  readonly photos: AppraisalPhotoPolicy;
}
export type AppraisalForm =
  | EnabledAppraisalForm
  | {
      readonly enabled: false;
      readonly company?: never;
      readonly dealership?: never;
      readonly privacyNotice?: never;
      readonly turnstile?: never;
      readonly limits?: never;
      readonly photos?: never;
    };
export interface AppraisalUpload {
  readonly url: string;
  readonly method: "GET" | "PUT";
  readonly expiresAt: string;
  readonly headers: Record<string, string>;
  readonly completePath: string;
  readonly completionToken: string;
  readonly completionExpiresAt: string;
}
export type AppraisalPhoto =
  | { readonly slug: string; readonly state: "upload_available"; readonly upload: AppraisalUpload }
  | {
      readonly slug: string;
      readonly state: "upload_closed" | "temporarily_unavailable" | "completion_accepted";
      readonly upload: null;
    };
export interface AppraisalReceipt {
  readonly accepted: true;
  readonly reference: string;
  readonly photos: AppraisalPhoto[];
}
export interface AppraisalCompletionReceipt {
  readonly accepted: true;
}
export interface AppraisalSubmitOptions extends RequestOptions {
  readonly idempotencyKey: string;
}
export interface AppraisalsApi {
  readonly getForm: (dealershipSlug: string, options?: RequestOptions) => Promise<AppraisalForm>;
  readonly submit: (
    dealershipSlug: string,
    submission: AppraisalSubmission,
    options: AppraisalSubmitOptions,
  ) => Promise<AppraisalReceipt>;
  readonly uploadPhoto: (
    photo: AppraisalPhoto,
    file: Blob,
    declared: AppraisalPhotoInput,
    options?: RequestOptions,
  ) => Promise<void>;
  readonly completePhoto: (
    dealershipSlug: string,
    reference: string,
    photo: AppraisalPhoto,
    options?: RequestOptions,
  ) => Promise<AppraisalCompletionReceipt>;
}
