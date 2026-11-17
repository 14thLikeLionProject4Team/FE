import client from "./client";

// 목록 / 상세
// status 예: "PROPOSED", "active", "ended" (명세에 대소문자가 섞여 있어요 → 백엔드에 확인)
export const getMissions = (status, cursor) =>
  client.get("/missions", { params: { status, cursor } });
export const getMissionDetail = (missionId) => client.get(`/missions/${missionId}`);

// 생성 / 수정 / 취소 (부모)
export const createMission = (body) => client.post("/missions", body);
export const updateMission = (missionId, body) => client.patch(`/missions/${missionId}`, body);
export const cancelMission = (missionId) => client.delete(`/missions/${missionId}`);
export const holdMission = (missionId) => client.patch(`/missions/${missionId}/hold`); // 제안 보류
export const openMission = (missionId) => client.patch(`/missions/${missionId}/open`); // 제안·추천 미션 오픈

// 제안 (자녀)
export const proposeMission = (body) => client.post("/missions/proposals", body);
export const proposeRecommendedMission = (missionId) => client.post(`/missions/${missionId}/propose`);

// 추천
// target: "CHILD" | "PARENT"
export const getRecommendations = (target, cursor) =>
  client.get("/missions/recommendations", { params: { target, cursor } });

// 제출 / 승인 / 반려
export const submitMission = (missionId, body) => client.post(`/missions/${missionId}/submissions`, body);
export const remindSubmission = (submissionId) => client.post(`/missions/submissions/${submissionId}/remind`);
export const getSubmissions = (status = "PENDING") =>
  client.get("/missions/submissions", { params: { status } }); // 승인 대기 목록
export const approveSubmission = (submissionId) =>
  client.post(`/missions/submissions/${submissionId}/approve`);
export const rejectSubmission = (submissionId, body) =>
  client.post(`/missions/submissions/${submissionId}/reject`, body);

// 기타
export const getRewardsSummary = () => client.get("/missions/rewards/summary"); // 월 보상 합계
export const getRewardGuide = () => client.get("/missions/reward-guide");
export const getSavingTip = () => client.get("/missions/saving-tip");
