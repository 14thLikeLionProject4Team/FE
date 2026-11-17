import client from "./client";

// 열람 범위
export const getVisibility = () => client.get("/settings/visibility");
export const updateVisibility = (body) => client.patch("/settings/visibility", body);

// 기록 지표
export const getRecordsSummary = (params) => client.get("/records/summary", { params });

// 연결 계좌
export const getAccounts = () => client.get("/accounts");

// 알림 설정
export const getNotificationSettings = () => client.get("/notification-settings");
export const updateNotificationSetting = (type, body) => client.patch(`/notification-settings/${type}`, body);

// 알림
export const getNotifications = (cursor) => client.get("/notifications", { params: { cursor } });
export const readNotification = (notificationId) => client.patch(`/notifications/${notificationId}/read`);

// AI 대화
export const getConversationStarter = () => client.get("/conversations/starter");
export const getMessages = (cursor) => client.get("/conversations/messages", { params: { cursor } });
export const sendMessage = (body) => client.post("/conversations/messages", body);
export const deleteConversations = () => client.delete("/conversations");

// 전할 말
export const updateChildMessage = (childMessageId, body) =>
  client.patch(`/child-messages/${childMessageId}`, body);

// 페르소나
export const getPersonas = () => client.get("/personas");

// 월말 회고
export const getCurrentRetrospect = () => client.get("/retrospects/current");
export const approveRetrospect = () => client.post("/retrospects/current/approve");

// 브리핑
export const getBriefings = (cursor) => client.get("/briefings", { params: { cursor } });
export const getLatestBriefing = () => client.get("/briefings/latest");
export const readBriefing = (briefingId) => client.patch(`/briefings/${briefingId}/read`);
