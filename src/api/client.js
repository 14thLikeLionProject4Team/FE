import axios from "axios";

// 백엔드 주소는 .env 의 VITE_API_URL 에서 읽어요.
// 예) VITE_API_URL=https://api.4roro.hufsglobalikelion.co.kr
// 응답 interceptor 가 data 만 돌려주기 때문에 TS 에서는 any 로 다뤄요.
/** @type {any} */
const client = axios.create({
  // 개발 서버에서는 vite.config.ts 의 프록시(/__backend)를 거쳐서 CORS 를 피해요.
  baseURL: import.meta.env.DEV ? "/__backend" : import.meta.env.VITE_API_URL,
  timeout: 60000, // 무료 서버는 첫 요청(콜드 스타트)이 느릴 수 있어 넉넉하게
});

// 현재 보고 있는 계정(페르소나) ID를 모든 요청에 X-Persona-Id 헤더로 붙여요.
// 주소가 /child/2/... 또는 /parent/1/... 이면 그 숫자를 쓰고,
// 아니면 마지막으로 저장한 ID를 써요. (ID 목록: GET /personas)
const getPersonaId = () => {
  const match = window.location.pathname.match(/^\/(?:child|parent)\/(\d+)/);
  if (match) return match[1];
  return localStorage.getItem("personaId");
};

export const setPersonaId = (id) => localStorage.setItem("personaId", String(id));

client.interceptors.request.use((config) => {
  const personaId = getPersonaId();
  if (personaId) config.headers["X-Persona-Id"] = personaId;
  return config;
});

// 백엔드 응답 { success, code, message, data } 에서 data 만 꺼내서 돌려줘요.
// (파일 다운로드처럼 이 형태가 아니면 그대로 돌려줘요.)
// 에러는 콘솔에 남기고 그대로 던져요.
client.interceptors.response.use(
  (res) => {
    const body = res.data;
    if (body && typeof body === "object" && "success" in body && "data" in body) return body.data;
    return body;
  },
  (err) => {
    console.error("[API ERROR]", err.config?.method?.toUpperCase(), err.config?.url, err.response?.status, err.response?.data);
    return Promise.reject(err);
  }
);

export default client;

// "/uploads/파일명" → "https://백엔드주소/uploads/파일명"
export const toImageUrl = (path) => {
  if (!path) return "";
  if (path.startsWith("http")) return path; // 이미 전체 주소면 그대로
  return `${import.meta.env.VITE_API_URL}${path}`;
};
