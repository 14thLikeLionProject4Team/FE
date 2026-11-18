import axios from "axios";

// 백엔드 주소는 .env 의 VITE_API_URL 에서 읽어요.
// 예) VITE_API_URL=https://api.4roro.hufsglobalikelion.co.kr
const client = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  timeout: 60000, // 무료 서버는 첫 요청(콜드 스타트)이 느릴 수 있어 넉넉하게
});

// 로그인 토큰을 쓰는 경우 자동으로 헤더에 붙여요.
// 토큰 저장 방식이 다르면 이 부분만 바꾸면 돼요.
client.interceptors.request.use((config) => {
  const token = localStorage.getItem("accessToken");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// 응답에서 data 만 꺼내서 돌려줘요. 에러는 콘솔에 남기고 그대로 던져요.
client.interceptors.response.use(
  (res) => res.data,
  (err) => {
    console.error("[API ERROR]", err.config?.method?.toUpperCase(), err.config?.url, err.response?.status, err.response?.data);
    return Promise.reject(err);
  }
);

export default client;
export const toImageUrl = (path) => {
  if (!path) return "";
  if (path.startsWith("http")) return path; // 이미 전체 주소면 그대로
  return `${import.meta.env.VITE_API_URL}${path}`;
};