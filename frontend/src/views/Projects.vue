<template>
  <div class="projects-page">
    <div class="container">
      <div class="page-header">
        <span class="section-label">项目展示</span>
        <h1 class="page-title">我的项目</h1>
        <p class="page-subtitle">一些我参与开发的开源项目和作品，持续探索技术的边界。</p>
      </div>

      <div v-if="loading" class="loading">
        <div class="loading-spinner"></div>
      </div>

      <div v-else-if="projects.length === 0" class="empty-state">
        <h3>暂无项目</h3>
        <p>还没有添加任何项目。</p>
      </div>

      <div v-else class="projects-grid">
        <div
          v-for="project in projects"
          :key="project.id"
          class="project-card"
        >
          <div class="project-cover" v-if="project.coverImage">
            <img :src="project.coverImage" :alt="project.name" loading="lazy" />
            <span class="project-status" :class="project.status">
              {{ getStatusText(project.status) }}
            </span>
          </div>
          <div class="project-body">
            <h3 class="project-name">{{ project.name }}</h3>
            <p class="project-desc">{{ project.description }}</p>
            <div class="project-tech" v-if="project.techStack">
              <span
                v-for="tech in project.techStack.split(',')"
                :key="tech"
                class="tech-tag"
              >
                {{ tech.trim() }}
              </span>
            </div>
            <div class="project-links">
              <a v-if="project.demoUrl" :href="project.demoUrl" target="_blank" class="project-link demo">
                在线演示 →
              </a>
              <a v-if="project.githubUrl" :href="project.githubUrl" target="_blank" class="project-link github">
                GitHub
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { projects as projectsApi } from '../api'

const projects = ref([])
const loading = ref(true)

const getStatusText = (status) => {
  const map = { active: '进行中', completed: '已完成', in_progress: '开发中' }
  return map[status] || status
}

onMounted(async () => {
  try {
    const res = await projectsApi.list()
    projects.value = res.data || []
  } catch (err) {
    console.error('Failed to fetch projects:', err)
  } finally {
    loading.value = false
  }
})
</script>

<style scoped>
.projects-page {
  padding: 3rem 0;
  min-height: 60vh;
}

.page-header {
  text-align: center;
  margin-bottom: 3rem;
}

.page-title {
  font-size: clamp(2rem, 4vw, 3rem);
  margin: 0.5rem 0;
}

.page-subtitle {
  color: var(--muted);
  font-size: 1rem;
  max-width: 500px;
  margin: 0.5rem auto 0;
}

.projects-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 2rem;
}

.project-card {
  background: var(--bg-card);
  border: 1px solid var(--border-soft);
  border-radius: var(--radius-lg);
  overflow: hidden;
  transition: all 0.3s;
}

.project-card:hover {
  transform: translateY(-4px);
  box-shadow: var(--shadow-lg);
  border-color: var(--accent-soft);
}

.project-cover {
  position: relative;
  height: 200px;
  overflow: hidden;
}

.project-cover img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.5s;
}

.project-card:hover .project-cover img {
  transform: scale(1.05);
}

.project-status {
  position: absolute;
  top: 1rem;
  right: 1rem;
  padding: 0.25rem 0.75rem;
  border-radius: 100px;
  font-size: 0.75rem;
  font-weight: 600;
  color: #fff;
  backdrop-filter: blur(8px);
}

.project-status.active { background: rgba(196, 69, 54, 0.9); }
.project-status.completed { background: rgba(76, 175, 80, 0.9); }
.project-status.in_progress { background: rgba(255, 152, 0, 0.9); }

.project-body {
  padding: 1.5rem;
}

.project-name {
  font-size: 1.3rem;
  margin-bottom: 0.75rem;
}

.project-desc {
  font-size: 0.9rem;
  color: var(--muted);
  line-height: 1.6;
  margin-bottom: 1rem;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.project-tech {
  display: flex;
  flex-wrap: wrap;
  gap: 0.4rem;
  margin-bottom: 1.25rem;
}

.tech-tag {
  font-size: 0.75rem;
  font-family: var(--font-mono);
  color: var(--ink-soft);
  background: var(--bg-alt);
  padding: 0.2rem 0.6rem;
  border-radius: var(--radius);
}

.project-links {
  display: flex;
  gap: 1rem;
}

.project-link {
  font-size: 0.85rem;
  font-weight: 500;
  transition: color 0.2s;
}

.project-link.demo {
  color: var(--accent);
}

.project-link.github {
  color: var(--ink-soft);
}

.project-link:hover {
  opacity: 0.7;
}

@media (max-width: 768px) {
  .projects-grid {
    grid-template-columns: 1fr;
  }
}
</style>
