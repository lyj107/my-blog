<template>
  <header class="header" :class="{ scrolled: isScrolled }">
    <div class="container header-inner">
      <router-link to="/" class="logo">
        <span class="logo-mark">墨</span>
        <span class="logo-text">记</span>
      </router-link>

      <nav class="nav-desktop">
        <router-link to="/" class="nav-link">首页</router-link>
        <router-link to="/articles" class="nav-link">文章</router-link>
        <router-link to="/archives" class="nav-link">归档</router-link>
        <router-link to="/projects" class="nav-link">项目</router-link>
        <router-link to="/about" class="nav-link">关于</router-link>
      </nav>

      <div class="nav-actions">
        <button class="search-btn" @click="showSearch = !showSearch">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/>
          </svg>
        </button>
        <a :href="adminUrl" class="admin-link">管理</a>
        <button class="menu-toggle" @click="mobileMenuOpen = !mobileMenuOpen">
          <span></span><span></span><span></span>
        </button>
      </div>
    </div>

    <!-- Search bar -->
    <transition name="slide-down">
      <div v-if="showSearch" class="search-bar">
        <div class="container">
          <input
            ref="searchInput"
            v-model="searchKeyword"
            type="text"
            placeholder="搜索文章..."
            @keyup.enter="handleSearch"
          />
          <button @click="handleSearch" class="search-submit">搜索</button>
          <button @click="showSearch = false" class="search-close">✕</button>
        </div>
      </div>
    </transition>

    <!-- Mobile menu -->
    <transition name="slide-down">
      <nav v-if="mobileMenuOpen" class="nav-mobile">
        <router-link to="/" @click="mobileMenuOpen = false">首页</router-link>
        <router-link to="/articles" @click="mobileMenuOpen = false">文章</router-link>
        <router-link to="/archives" @click="mobileMenuOpen = false">归档</router-link>
        <router-link to="/projects" @click="mobileMenuOpen = false">项目</router-link>
        <router-link to="/about" @click="mobileMenuOpen = false">关于</router-link>
        <a :href="adminUrl" @click="mobileMenuOpen = false">管理后台</a>
      </nav>
    </transition>
  </header>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const adminUrl = import.meta.env.VITE_ADMIN_URL || (import.meta.env.DEV ? 'http://localhost:5174/' : '/admin/')
const isScrolled = ref(false)
const showSearch = ref(false)
const mobileMenuOpen = ref(false)
const searchKeyword = ref('')
const searchInput = ref(null)

const handleScroll = () => {
  isScrolled.value = window.scrollY > 20
}

const handleSearch = () => {
  if (searchKeyword.value.trim()) {
    router.push({ path: '/articles', query: { keyword: searchKeyword.value.trim() } })
    showSearch.value = false
    searchKeyword.value = ''
  }
}

onMounted(() => {
  window.addEventListener('scroll', handleScroll)
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
})
</script>

<style scoped>
.header {
  position: sticky;
  top: 0;
  z-index: 100;
  background: rgba(250, 247, 242, 0.85);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border-bottom: 1px solid transparent;
  transition: all 0.3s ease;
}

.header.scrolled {
  border-bottom-color: var(--border);
  background: rgba(250, 247, 242, 0.95);
}

.header-inner {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 72px;
}

.logo {
  display: flex;
  align-items: baseline;
  gap: 2px;
  font-family: var(--font-display);
  font-weight: 700;
  font-size: 1.5rem;
  letter-spacing: -0.02em;
}

.logo-mark {
  color: var(--accent);
  font-size: 1.8rem;
}

.logo-text {
  color: var(--ink);
}

.nav-desktop {
  display: flex;
  gap: 2rem;
}

.nav-link {
  font-size: 0.9rem;
  font-weight: 500;
  color: var(--ink-soft);
  position: relative;
  padding: 0.25rem 0;
  transition: color 0.2s;
}

.nav-link::after {
  content: '';
  position: absolute;
  bottom: -2px;
  left: 0;
  width: 0;
  height: 2px;
  background: var(--accent);
  transition: width 0.3s ease;
}

.nav-link:hover::after,
.nav-link.router-link-active::after {
  width: 100%;
}

.nav-link.router-link-active {
  color: var(--accent);
}

.nav-actions {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.search-btn {
  background: none;
  border: none;
  color: var(--ink-soft);
  cursor: pointer;
  padding: 0.5rem;
  display: flex;
  align-items: center;
  transition: color 0.2s;
}

.search-btn:hover {
  color: var(--accent);
}

.admin-link {
  font-size: 0.85rem;
  font-weight: 500;
  color: var(--muted);
  padding: 0.4rem 1rem;
  border: 1px solid var(--border);
  border-radius: 100px;
  transition: all 0.2s;
}

.admin-link:hover {
  border-color: var(--accent);
  color: var(--accent);
}

.menu-toggle {
  display: none;
  flex-direction: column;
  gap: 4px;
  background: none;
  border: none;
  cursor: pointer;
  padding: 0.5rem;
}

.menu-toggle span {
  width: 20px;
  height: 2px;
  background: var(--ink);
  transition: all 0.3s;
}

/* Search bar */
.search-bar {
  border-top: 1px solid var(--border);
  background: var(--bg);
  padding: 1rem 0;
}

.search-bar .container {
  display: flex;
  gap: 0.75rem;
  align-items: center;
}

.search-bar input {
  flex: 1;
  border: none;
  background: none;
  font-family: var(--font-body);
  font-size: 1.1rem;
  color: var(--ink);
  outline: none;
  padding: 0.5rem 0;
}

.search-bar input::placeholder {
  color: var(--muted-light);
}

.search-submit {
  background: var(--accent);
  color: #fff;
  border: none;
  padding: 0.5rem 1.5rem;
  border-radius: var(--radius);
  font-weight: 500;
  cursor: pointer;
  transition: background 0.2s;
}

.search-submit:hover {
  background: var(--accent-dark);
}

.search-close {
  background: none;
  border: none;
  font-size: 1.2rem;
  color: var(--muted);
  cursor: pointer;
  padding: 0.25rem 0.5rem;
}

/* Mobile nav */
.nav-mobile {
  display: none;
  flex-direction: column;
  background: var(--bg);
  border-top: 1px solid var(--border);
  padding: 1rem 0;
}

.nav-mobile a {
  padding: 0.75rem 2rem;
  font-weight: 500;
  color: var(--ink-soft);
  border-bottom: 1px solid var(--border-soft);
}

.nav-mobile a:hover {
  background: var(--bg-alt);
  color: var(--accent);
}

/* Transitions */
.slide-down-enter-active,
.slide-down-leave-active {
  transition: all 0.3s ease;
  overflow: hidden;
}

.slide-down-enter-from,
.slide-down-leave-to {
  opacity: 0;
  max-height: 0;
}

.slide-down-enter-to,
.slide-down-leave-from {
  max-height: 400px;
}

@media (max-width: 768px) {
  .nav-desktop { display: none; }
  .admin-link { display: none; }
  .menu-toggle { display: flex; }
  .nav-mobile { display: flex; }
}
</style>
