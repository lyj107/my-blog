<template>
  <div class="login-page">
    <div class="login-bg">
      <div class="bg-shape shape-1"></div>
      <div class="bg-shape shape-2"></div>
      <div class="bg-shape shape-3"></div>
    </div>

    <div class="login-card">
      <div class="login-brand">
        <div class="brand-mark">墨</div>
        <h1 class="login-title">管理后台</h1>
        <p class="login-subtitle">欢迎回来，请登录您的账号</p>
      </div>

      <form @submit.prevent="handleLogin" class="login-form">
        <div class="form-field">
          <label>用户名</label>
          <div class="input-wrap">
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
            >
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
              <circle cx="12" cy="7" r="4" />
            </svg>
            <input
              v-model="form.username"
              type="text"
              placeholder="请输入用户名"
              autocomplete="username"
            />
          </div>
        </div>

        <div class="form-field">
          <label>密码</label>
          <div class="input-wrap">
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
            >
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
              <path d="M7 11V7a5 5 0 0 1 10 0v4" />
            </svg>
            <input
              v-model="form.password"
              type="password"
              placeholder="请输入密码"
              autocomplete="current-password"
            />
          </div>
        </div>

        <button type="submit" class="login-btn" :disabled="loading">
          <span v-if="!loading">登 录</span>
          <span v-else class="loading-dots">
            登录中<span class="dot">.</span><span class="dot">.</span
            ><span class="dot">.</span>
          </span>
        </button>
      </form>

      <!-- <div class="login-hint">
        <span>默认账号</span>
        <code>admin</code>
        <span>/</span>
        <code>admin123</code>
      </div> -->
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from "vue";
import { useRouter } from "vue-router";
import { auth } from "../api";

const router = useRouter();
const loading = ref(false);

const form = reactive({
  username: "",
  password: "",
});

const handleLogin = async () => {
  if (!form.username || !form.password) {
    return;
  }

  loading.value = true;
  try {
    const response = await auth.login(form);
    localStorage.setItem("token", response.data.token);
    localStorage.setItem("userInfo", JSON.stringify(response.data.user));
    router.push("/");
  } catch (error) {
    alert(error.response?.data?.message || "登录失败");
  } finally {
    loading.value = false;
  }
};
</script>

<style scoped>
.login-page {
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background: #1a1816;
  position: relative;
  overflow: hidden;
}

.login-bg {
  position: absolute;
  inset: 0;
  pointer-events: none;
}

.bg-shape {
  position: absolute;
  border-radius: 50%;
  filter: blur(80px);
  opacity: 0.3;
}

.shape-1 {
  width: 500px;
  height: 500px;
  background: #c44536;
  top: -100px;
  left: -100px;
  animation: float 12s ease-in-out infinite;
}

.shape-2 {
  width: 400px;
  height: 400px;
  background: #c9a961;
  bottom: -100px;
  right: -50px;
  animation: float 15s ease-in-out infinite reverse;
}

.shape-3 {
  width: 300px;
  height: 300px;
  background: #8e3025;
  top: 40%;
  left: 50%;
  animation: float 10s ease-in-out infinite;
}

@keyframes float {
  0%,
  100% {
    transform: translate(0, 0);
  }
  50% {
    transform: translate(30px, -30px);
  }
}

.login-card {
  position: relative;
  z-index: 1;
  width: 420px;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(20px);
  border-radius: 20px;
  padding: 3rem 2.5rem;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
}

.login-brand {
  text-align: center;
  margin-bottom: 2rem;
}

.brand-mark {
  width: 56px;
  height: 56px;
  background: #c44536;
  border-radius: 14px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-family: "Fraunces", serif;
  font-size: 2rem;
  font-weight: 700;
  color: #fff;
  margin-bottom: 1rem;
}

.login-title {
  font-family: "Fraunces", serif;
  font-size: 1.6rem;
  font-weight: 600;
  color: #1c1b1a;
  margin-bottom: 0.25rem;
}

.login-subtitle {
  font-size: 0.85rem;
  color: #8b857c;
}

.login-form {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

.form-field {
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
}

.form-field label {
  font-size: 0.8rem;
  font-weight: 600;
  color: #3d3a36;
  letter-spacing: 0.03em;
}

.input-wrap {
  display: flex;
  align-items: center;
  gap: 0.625rem;
  padding: 0 0.875rem;
  background: #f3efe8;
  border: 1.5px solid transparent;
  border-radius: 10px;
  transition: all 0.2s;
}

.input-wrap:focus-within {
  background: #fff;
  border-color: #c44536;
}

.input-wrap svg {
  color: #8b857c;
  flex-shrink: 0;
}

.input-wrap input {
  flex: 1;
  border: none;
  background: none;
  padding: 0.75rem 0;
  font-family: inherit;
  font-size: 0.9rem;
  color: #1c1b1a;
  outline: none;
}

.input-wrap input::placeholder {
  color: #b8b2a8;
}

.login-btn {
  margin-top: 0.5rem;
  background: #c44536;
  color: #fff;
  border: none;
  padding: 0.875rem;
  border-radius: 10px;
  font-family: inherit;
  font-size: 0.95rem;
  font-weight: 600;
  letter-spacing: 0.05em;
  cursor: pointer;
  transition: all 0.2s;
}

.login-btn:hover:not(:disabled) {
  background: #a83a2d;
  transform: translateY(-1px);
  box-shadow: 0 8px 20px rgba(196, 69, 54, 0.3);
}

.login-btn:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.loading-dots .dot {
  animation: blink 1.4s infinite;
}

.loading-dots .dot:nth-child(2) {
  animation-delay: 0.2s;
}
.loading-dots .dot:nth-child(3) {
  animation-delay: 0.4s;
}

@keyframes blink {
  0%,
  80%,
  100% {
    opacity: 0;
  }
  40% {
    opacity: 1;
  }
}

.login-hint {
  margin-top: 1.5rem;
  padding-top: 1.5rem;
  border-top: 1px solid #e5dfd5;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  font-size: 0.8rem;
  color: #8b857c;
}

.login-hint code {
  font-family: "JetBrains Mono", monospace;
  background: #f3efe8;
  padding: 0.15rem 0.5rem;
  border-radius: 4px;
  color: #c44536;
  font-size: 0.8rem;
}
</style>
