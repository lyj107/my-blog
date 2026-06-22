import { createRouter, createWebHistory } from "vue-router";

const routes = [
  {
    path: "/login",
    name: "Login",
    component: () => import("../views/Login.vue"),
  },
  {
    path: "/",
    name: "Dashboard",
    component: () => import("../views/Dashboard.vue"),
    meta: { requiresAuth: true },
  },
  {
    path: "/articles",
    name: "Articles",
    component: () => import("../views/Articles.vue"),
    meta: { requiresAuth: true },
  },
  {
    path: "/articles/create",
    name: "CreateArticle",
    component: () => import("../views/CreateArticle.vue"),
    meta: { requiresAuth: true },
  },
  {
    path: "/articles/edit/:id",
    name: "EditArticle",
    component: () => import("../views/CreateArticle.vue"),
    meta: { requiresAuth: true },
  },
  {
    path: "/categories",
    name: "Categories",
    component: () => import("../views/Categories.vue"),
    meta: { requiresAuth: true },
  },
  {
    path: "/tags",
    name: "Tags",
    component: () => import("../views/Tags.vue"),
    meta: { requiresAuth: true },
  },
  {
    path: "/comments",
    name: "Comments",
    component: () => import("../views/Comments.vue"),
    meta: { requiresAuth: true },
  },
  {
    path: "/projects",
    name: "Projects",
    component: () => import("../views/Projects.vue"),
    meta: { requiresAuth: true },
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach((to, from, next) => {
  const token = localStorage.getItem("token");
  if (to.meta.requiresAuth && !token) {
    next("/login");
  } else {
    next();
  }
});

export default router;
