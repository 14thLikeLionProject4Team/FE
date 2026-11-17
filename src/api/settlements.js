import client from "./client";

// 정산
export const getCurrentSettlement = () => client.get("/settlements/current");
export const checkCurrentSettlement = () => client.get("/settlements/current/check"); // 부족 예상 조회
export const getSettlements = (params) => client.get("/settlements", { params }); // 정산 목록 / 결제일 기록 목록
export const getSettlementDetail = (settlementId) => client.get(`/settlements/${settlementId}`);

// 부족분 결제 (남은 돈 / 직접 송금)
export const payShortfall = (settlementId, body) =>
  client.post(`/settlements/${settlementId}/shortfall-payments`, body);
