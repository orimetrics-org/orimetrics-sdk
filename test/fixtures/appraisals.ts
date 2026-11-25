import type {
  AppraisalSubmission,
  EnabledAppraisalForm,
  AppraisalPhoto,
  AppraisalPhotoInput,
} from "@sdk";

import { createInquiry, createInquiryForm } from "./inquiries";

export const createAppraisal = (): AppraisalSubmission => ({
  ...createInquiry(),
  vehicle: {
    submittedBrand: "Toyota",
    submittedModel: "Corolla",
    modelYear: 2020,
    submittedCity: "Quito",
    conditionDescription: "Good condition",
    vin: null,
    odometerValue: 50000,
    odometerUnit: "km",
    expectedPriceUsd: "15000.00",
  },
});
export const createAppraisalForm = (): EnabledAppraisalForm => ({
  ...createInquiryForm(),
  company: { slug: "demo", name: "Demo" },
  dealership: { slug: "north", name: "North" },
  photos: {
    enabled: true,
    maxPhotos: 12,
    maxUploadBytes: 10000000,
    uploadSeconds: 900,
    contentTypes: ["image/jpeg", "image/png", "image/webp", "image/heic"],
  },
});
export const createPhotoInput = (): AppraisalPhotoInput => ({
  filename: "front.jpg",
  contentType: "image/jpeg",
  byteSize: 3,
  altText: "Front",
});
export const createPhoto = (): Extract<AppraisalPhoto, { state: "upload_available" }> => ({
  slug: "front",
  state: "upload_available",
  upload: {
    url: "https://storage.example/photo?signature=secret",
    method: "PUT",
    expiresAt: new Date(Date.now() + 600000).toISOString(),
    headers: { "Content-Type": "image/jpeg", "If-None-Match": "*" },
    completePath: "/public/o/demo/d/north/appraisal-requests/apr-receipt/photos/front/complete",
    completionToken: "private-completion-token",
    completionExpiresAt: new Date(Date.now() + 600000).toISOString(),
  },
});
