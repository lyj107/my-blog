<template>
  <Layout>
    <div class="create-article">
      <div class="action-bar">
        <el-button @click="router.push('/articles')">← 返回列表</el-button>
        <div class="action-buttons">
          <el-button @click="saveArticle('draft')">保存草稿</el-button>
          <el-button type="primary" @click="saveArticle('published')">
            {{ isEdit ? '更新并发布' : '发布文章' }}
          </el-button>
        </div>
      </div>

      <div class="form-card">
        <el-form :model="form" label-position="top">
          <el-form-item label="文章标题">
            <el-input v-model="form.title" placeholder="请输入一个吸引人的标题..." size="large" />
          </el-form-item>

          <div class="form-row">
            <el-form-item label="分类" style="flex: 1">
              <el-select v-model="form.categoryId" placeholder="选择分类" style="width: 100%">
                <el-option v-for="cat in categoriesList" :key="cat.id" :label="cat.name" :value="cat.id" />
              </el-select>
            </el-form-item>
            <el-form-item label="标签" style="flex: 2">
              <el-select v-model="form.tagIds" multiple placeholder="选择标签" style="width: 100%">
                <el-option v-for="tag in tagsList" :key="tag.id" :label="tag.name" :value="tag.id" />
              </el-select>
            </el-form-item>
          </div>

          <el-form-item label="封面图片 URL">
            <el-input v-model="form.coverImage" placeholder="https://..." />
          </el-form-item>

          <el-form-item label="摘要">
            <el-input type="textarea" v-model="form.excerpt" placeholder="一段简短的文章摘要..." :rows="3" />
          </el-form-item>

          <el-form-item label="正文内容（Markdown 格式）">
            <div class="editor-wrapper">
              <textarea
                v-model="form.content"
                class="markdown-editor"
                placeholder="## 开始写作...

支持 Markdown 格式：**粗体**、*斜体*、`代码`、[链接](url) 等"
                spellcheck="false"
              ></textarea>
            </div>
          </el-form-item>
        </el-form>
      </div>
    </div>
  </Layout>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import Layout from '../components/Layout.vue'
import { articles, categories, tags } from '../api'

const route = useRoute()
const router = useRouter()

const isEdit = computed(() => route.path.includes('/edit'))
const articleId = computed(() => route.params.id)

const form = reactive({
  title: '',
  categoryId: '',
  tagIds: [],
  excerpt: '',
  coverImage: '',
  content: ''
})

const categoriesList = ref([])
const tagsList = ref([])

const fetchCategories = async () => {
  try {
    const res = await categories.list()
    categoriesList.value = res.data || []
  } catch (err) {
    console.error('Failed to fetch categories:', err)
  }
}

const fetchTags = async () => {
  try {
    const res = await tags.list()
    tagsList.value = res.data || []
  } catch (err) {
    console.error('Failed to fetch tags:', err)
  }
}

const fetchArticle = async () => {
  if (!isEdit.value || !articleId.value) return
  try {
    const res = await articles.get(articleId.value)
    const article = res.data
    form.title = article.title
    form.categoryId = article.categoryId
    form.tagIds = article.tags?.map(t => t.id) || []
    form.excerpt = article.excerpt || ''
    form.coverImage = article.coverImage || ''
    form.content = article.content
  } catch (err) {
    console.error('Failed to fetch article:', err)
    ElMessage.error('获取文章失败')
  }
}

const saveArticle = async (status) => {
  if (!form.title || !form.content || !form.categoryId) {
    ElMessage.warning('请填写标题、内容和分类')
    return
  }

  try {
    if (isEdit.value) {
      await articles.update(articleId.value, { ...form, status })
      ElMessage.success(status === 'published' ? '文章已更新并发布' : '草稿已保存')
    } else {
      await articles.create({ ...form, status })
      ElMessage.success(status === 'published' ? '文章发布成功' : '草稿已保存')
      router.push('/articles')
    }
  } catch (err) {
    ElMessage.error(err.response?.data?.message || '操作失败')
  }
}

onMounted(async () => {
  await Promise.all([fetchCategories(), fetchTags(), fetchArticle()])
})
</script>

<style scoped>
.action-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.25rem;
}

.form-card {
  background: #fff;
  border-radius: 12px;
  border: 1px solid #e5dfd5;
  padding: 2rem;
}

.form-row {
  display: flex;
  gap: 1.5rem;
}

.editor-wrapper {
  width: 100%;
}

.markdown-editor {
  width: 100%;
  min-height: 450px;
  padding: 1.25rem;
  font-family: 'JetBrains Mono', 'Fira Code', monospace;
  font-size: 0.875rem;
  line-height: 1.7;
  color: #1c1b1a;
  background: #fafaf8;
  border: 1px solid #e5dfd5;
  border-radius: 8px;
  resize: vertical;
  outline: none;
  transition: border-color 0.2s;
}

.markdown-editor:focus {
  border-color: #c44536;
  background: #fff;
}

.markdown-editor::placeholder {
  color: #b8b2a8;
}
</style>
