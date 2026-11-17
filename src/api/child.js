import client from "./client";

// 자녀 홈
export const getChildHome = () => client.get("/child/home");
export const getDailySpending = (params) => client.get("/child/home/daily-spending", { params });

// 자녀 결제
export const getPaymentsSummary = (params) => client.get("/child/payments/summary", { params });
export const getPayments = (params) => client.get("/child/payments", { params });
export const getCategoryRatio = (params) => client.get("/child/payments/category-ratio", { params });

// 자녀 내 정보
export const getChildMy = () => client.get("/child/my");

// 확인서
export const getCertificateEligibility = () => client.get("/child/certificates/eligibility");
export const getCertificatePreview = () => client.get("/child/certificates/preview");
export const issueCertificate = (body) => client.post("/child/certificates", body);
export const getLatestCertificate = () => client.get("/child/certificates/latest");
export const downloadCertificate = (certificateId) =>
  client.get(`/child/certificates/${certificateId}/download`, { responseType: "blob" }); // 파일이라 blob
export const createCertificateShareLink = (certificateId) =>
  client.post(`/child/certificates/${certificateId}/share`);
