<template>
  <div class="admin-layout">
    <aside class="sidebar" :class="{ collapsed: isCollapsed }">
      <div class="sidebar-brand">
        <div class="brand-mark">墨</div>
        <div class="brand-info" v-show="!isCollapsed">
          <span class="brand-name">管理后台</span>
          <span class="brand-sub">Blog Admin</span>
        </div>
      </div>

      <nav class="sidebar-nav">
        <router-link
          v-for="item in menuItems"
          :key="item.path"
          :to="item.path"
          class="nav-item"
          :class="{ active: isActive(item.path) }"
        >
          <span class="nav-icon" v-html="item.icon"></span>
          <span class="nav-label" v-show="!isCollapsed">{{ item.label }}</span>
        </router-link>
      </nav>

      <div class="sidebar-footer">
        <div class="user-info" v-show="!isCollapsed">
          <div class="user-avatar">{{ userInitial }}</div>
          <div class="user-detail">
            <span class="user-name">{{ userInfo?.nickname || '管理员' }}</span>
            <span class="user-role">{{ userInfo?.role || 'admin' }}</span>
          </div>
        </div>
        <button class="logout-btn" @click="handleLogout" :title="isCollapsed ? '退出' : ''">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/>
          </svg>
          <span v-show="!isCollapsed">退出登录</span>
        </button>
      </div>
    </aside>

    <div class="main-area">
      <header class="topbar">
        <button class="collapse-btn" @click="toggleCollapse">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="18" x2="21" y2="18"/>
          </svg>
        </button>
        <h1 class="page-title">{{ pageTitle }}</h1>
        <div class="topbar-right">
          <a href="/" target="_blank" class="view-site-btn">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/>
            </svg>
            访问前台
          </a>
        </div>
      </header>

      <main class="content-area">
        <slot />
      </main>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { auth } from '../api'

const route = useRoute()
const router = useRouter()

const isCollapsed = ref(false)
const userInfo = ref(null)

const menuItems = [
  {
    path: '/',
    label: '仪表盘',
    icon: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>'
  },
  {
    path: '/articles',
    label: '文章管理',
    icon: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>'
  },
  {
    path: '/categories',
    label: '分类管理',
    icon: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/></svg>'
  },
  {
    path: '/tags',
    label: '标签管理',
    icon: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"/><line x1="7" y1="7" x2="7.01" y2="7"/></svg>'
  },
  {
    path: '/comments',
    label: '评论管理',
    icon: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>'
  },
  {
    path: '/projects',
    label: '项目管理',
    icon: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/></svg>'
  }
]

const pageTitle = computed(() => {
  const item = menuItems.find(m => route.path.startsWith(m.path) && m.path !== '/')
  if (route.path === '/') return '仪表盘'
  if (route.path.includes('/articles/create')) return '新建文章'
  if (route.path.includes('/articles/edit')) return '编辑文章'
  return item ? item.label : '管理后台'
})

const userInitial = computed(() => {
  const name = userInfo.value?.nickname || userInfo.value?.username || 'A'
  return name.charAt(0).toUpperCase()
})

const isActive = (path) => {
  if (path === '/') return route.path === '/'
  return route.path.startsWith(path)
}

const toggleCollapse = () => {
  isCollapsed.value = !isCollapsed.value
}

const handleLogout = () => {
  localStorage.removeItem('token')
  localStorage.removeItem('userInfo')
  router.push('/login')
}

onMounted(async () => {
  try {
    const res = await auth.getMe()
    userInfo.value = res.data
  } catch (err) {
    // Token might be invalid
    router.push('/login')
  }
})
</script>

<style scoped>
.admin-layout {
  display: flex;
  min-height: 100vh;
  background: #f0ede8;
}

/* Sidebar */
.sidebar {
  width: 260px;
  background: #1a1816;
  color: #e8e4df;
  display: flex;
  flex-direction: column;
  transition: width 0.3s ease;
  position: sticky;
  top: 0;
  height: 100vh;
  flex-shrink: 0;
}

.sidebar.collapsed {
  width: 72px;
}

.sidebar-brand {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 1.5rem 1.25rem;
  border-bottom: 1px solid rgba(255,255,255,0.08);
}

.brand-mark {
  width: 40px;
  height: 40px;
  background: #c44536;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: 'Fraunces', serif;
  font-size: 1.4rem;
  font-weight: 700;
  color: #fff;
  flex-shrink: 0;
}

.brand-info {
  display: flex;
  flex-direction: column;
}

.brand-name {
  font-size: 0.95rem;
  font-weight: 600;
  color: #fff;
}

.brand-sub {
  font-size: 0.7rem;
  color: #8b857c;
  letter-spacing: 0.1em;
  text-transform: uppercase;
}

.sidebar-nav {
  flex: 1;
  padding: 1rem 0.75rem;
  overflow-y: auto;
}

.nav-item {
  display: flex;
  align-items: center;
  gap: 0.875rem;
  padding: 0.75rem 1rem;
  border-radius: 8px;
  color: #a8a298;
  font-size: 0.9rem;
  font-weight: 500;
  margin-bottom: 0.25rem;
  transition: all 0.2s;
}

.nav-item:hover {
  background: rgba(255,255,255,0.06);
  color: #e8e4df;
}

.nav-item.active {
  background: #c44536;
  color: #fff;
}

.nav-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.sidebar-footer {
  padding: 1rem 0.75rem;
  border-top: 1px solid rgba(255,255,255,0.08);
}

.user-info {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.5rem 0.5rem 1rem;
}

.user-avatar {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: #c44536;
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  font-size: 0.9rem;
  flex-shrink: 0;
}

.user-detail {
  display: flex;
  flex-direction: column;
}

.user-name {
  font-size: 0.85rem;
  font-weight: 600;
  color: #e8e4df;
}

.user-role {
  font-size: 0.7rem;
  color: #8b857c;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.logout-btn {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  width: 100%;
  padding: 0.6rem 1rem;
  background: none;
  border: none;
  color: #8b857c;
  font-family: inherit;
  font-size: 0.85rem;
  cursor: pointer;
  border-radius: 8px;
  transition: all 0.2s;
}

.logout-btn:hover {
  background: rgba(196, 69, 54, 0.15);
  color: #c44536;
}

/* Main area */
.main-area {
  flex: 1;
  display: flex;
  flex-direction: column;
  min-width: 0;
}

.topbar {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 0 2rem;
  height: 64px;
  background: #fff;
  border-bottom: 1px solid #e5dfd5;
  position: sticky;
  top: 0;
  z-index: 50;
}

.collapse-btn {
  background: none;
  border: none;
  color: #8b857c;
  cursor: pointer;
  padding: 0.5rem;
  display: flex;
  align-items: center;
  border-radius: 6px;
  transition: all 0.2s;
}

.collapse-btn:hover {
  background: #f3efe8;
  color: #1c1b1a;
}

.page-title {
  font-family: 'Fraunces', serif;
  font-size: 1.3rem;
  font-weight: 600;
  color: #1c1b1a;
  flex: 1;
}

.view-site-btn {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  padding: 0.4rem 0.875rem;
  font-size: 0.8rem;
  font-weight: 500;
  color: #8b857c;
  border: 1px solid #e5dfd5;
  border-radius: 6px;
  transition: all 0.2s;
}

.view-site-btn:hover {
  border-color: #c44536;
  color: #c44536;
}

.content-area {
  flex: 1;
  padding: 2rem;
  overflow-y: auto;
}

@media (max-width: 768px) {
  .sidebar {
    width: 72px;
  }
  .sidebar .brand-info,
  .sidebar .nav-label,
  .sidebar .user-info {
    display: none;
  }
  .content-area {
    padding: 1rem;
  }
}
</style>
