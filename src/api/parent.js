import client from "./client";

// 부모 화면
export const getParentHome = () => client.get("/parent/home");
export const getChildSpending = (params) => client.get("/parent/child-spending", { params }); // 정산 요약
export const getParentMy = () => client.get("/parent/my");
export const getPromise = () => client.get("/parent/promise"); // 약속 요약
export const getAdultTransition = () => client.get("/parent/adult-transition"); // 성년 전환 카드
export const getDecisions = () => client.get("/parent/decisions"); // 결정 카드 목록

// 가족 설정
export const updateMissionCap = (body) => client.patch("/family-settings/mission-cap", body);

// 용돈
export const getAllowanceSetup = () => client.get("/allowance/setup");
export const getAllowanceChanges = (params) => client.get("/allowance/changes", { params }); // 변경 이력
export const previewAllowanceChange = (params) => client.get("/allowance/changes/preview", { params }); // 알림 문구 미리보기
export const saveAllowanceChange = (body) => client.post("/allowance/changes", body);

// AI 용돈 제안
export const getAllowanceSuggestion = () => client.get("/allowance/suggestion");
export const handleAllowanceSuggestion = (suggestionId, body) =>
  client.patch(`/allowance/suggestions/${suggestionId}`, body);
