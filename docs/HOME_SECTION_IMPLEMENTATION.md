# HomeSection - 苹果风格 Hero Section 实现说明

## 📋 功能概览

本 Hero Section 实现了符合苹果官网风格的首屏展示区域，采用左侧文字区与右侧头像区的两栏式布局。

## 🎨 设计特点

### 1. 布局结构
- **桌面端（lg+）**：两栏布局，左侧文字区域（60%）+ 右侧头像区域（40%）
- **移动端**：单栏垂直布局，头像在上、文字在下
- **响应式断点**：sm:640px, lg:1024px, xl:1280px

### 2. 视觉层次

| 元素 | 字号 | 字重 | 颜色 | 说明 |
|------|------|------|------|------|
| 姓名 | 5xl-7xl | 600 | #1d1d1f | 视觉焦点，超大字号 |
| Title | xl-2xl | 500 | #1d1d1f | 次级强调 |
| 副标题 | base | 400 | #86868b | 辅助信息 |
| 专注方向标签 | sm | 500 | #ffffff | 黑色胶囊标签 |
| 简介文本 | base-17px | 400 | #1d1d1f/80 | 正文内容 |

### 3. 按钮设计（苹果风格）

**主要按钮（填充样式）**
- 背景：#1d1d1f（深色）
- 文字：#ffffff（白色）
- 圆角：12px（rounded-xl）
- 悬停效果：scale(1.02) + 阴影扩散
- 点击反馈：scale(0.98)

**次要按钮（轮廓样式）**
- 背景：透明
- 边框：1px #d2d2d7
- 文字：#1d1d1f
- 悬停效果：边框变黑 + 背景微灰

## ✨ 动画实现

### 交错动画（Framer Motion）

```typescript
containerVariants: {
  staggerChildren: 0.12,  // 子元素间隔 120ms
  delayChildren: 0.1,     // 容器延迟 100ms
}

itemVariants: {
  duration: 0.6,          // 动画时长 600ms
  ease: [0.22, 1, 0.36, 1]  // 贝塞尔曲线（苹果常用缓动）
}
```

### 动画时序

| 元素 | 延迟 | 动画效果 |
|------|------|---------|
| 姓名 | 0.1s | fade + slide up |
| Title | 0.22s | fade + slide up |
| 副标题 | 0.34s | fade + slide up |
| 专注方向 | 0.46s | fade + scale |
| 简介文本 | 0.58s | fade + slide up |
| 按钮 | 0.7s | fade + slide up |
| 头像 | 0.2s | fade + scale(0.95 → 1) |

### 特殊动画

**专注方向标签**
```typescript
transition={{
  duration: 0.4,
  delay: 0.6 + index * 0.08,  // 逐个延迟出现
  ease: [0.22, 1, 0.36, 1],
}}
```

**头像悬停**
```typescript
whileHover={{ scale: 1.02 }}
transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
```

**滚动提示箭头**
```typescript
animate={{ y: [0, 4, 0] }}
transition={{ duration: 1.5, repeat: Infinity }}
```

## 🎯 技术实现

### 核心技术栈
- **Next.js 15** - React 框架
- **TypeScript** - 类型安全
- **Tailwind CSS** - 样式系统
- **Framer Motion** - 动画库
- **Lucide React** - 图标库

### 布局技术
- **CSS Grid** - 两栏布局 `grid-cols-1 lg:grid-cols-2`
- **Flexbox** - 元素对齐和按钮排列
- **CSS 变量** - 主题色彩系统

### 响应式策略

```css
/* 移动优先设计 */
.text-5xl           /* 默认：移动端 */
.sm\:text-6xl       /* 640px+ */
.lg\:text-7xl       /* 1024px+ */

/* 头像尺寸 */
.w-56 h-56          /* 移动端 */
.sm\:w-64           /* 640px+ */
.lg\:w-80           /* 1024px+ */
```

## 📱 适配说明

### 移动端适配
- 单栏垂直布局
- 文字左对齐
- 按钮垂直排列
- 头像居中显示

### 平板适配
- 两栏布局开始生效
- 文字区域和头像区域并排
- 按钮保持水平排列

### 桌面适配
- 头像尺寸增大（80=320px）
- 更多水平空间
- 头像右对齐

## 🔧 自定义指南

### 替换头像
1. 准备头像图片（建议正方形，800x800px）
2. 命名为 `avatar.jpg`
3. 放入 `public/assets/avatar/` 目录
4. 更新 HomeSection 中的占位图路径

### 修改个人信息
在 [HomeSection.tsx](file:///C:/Users/33397/Python/trae%20test/%E4%B8%AA%E4%BA%BA%E7%BD%91%E7%AB%99/portfolio-site/src/components/sections/HomeSection.tsx) 中修改：
- 第 65 行：姓名
- 第 74 行：Title
- 第 82 行：副标题
- 第 91-93 行：专注方向
- 第 118 行：简介文本

### 调整动画
修改 `containerVariants` 和 `itemVariants` 中的配置：
- `staggerChildren`: 子元素间隔（当前 0.12s）
- `delayChildren`: 容器延迟（当前 0.1s）
- `duration`: 单个动画时长（当前 0.6s）

## ♿ 无障碍支持

- 使用语义化标签 `<section>`, `<h1>`, `<a>`
- 按钮有适当的 `aria-label`
- 链接有 `rel="noopener noreferrer"`（外部链接）
- 颜色对比度符合 WCAG AA 标准
- 支持键盘导航

## 🚀 性能优化

- 使用 Framer Motion 的 `initial/animate` 而非 `whileInView`（首屏动画）
- 使用 `will-change` 提示浏览器优化
- 动画使用 GPU 加速属性（transform, opacity）
- 避免布局抖动（layout thrashing）

## 📦 依赖项

确保 `package.json` 中包含：
```json
{
  "framer-motion": "^11",
  "lucide-react": "^0.453"
}
```

## 🎉 使用方式

组件已在 `page.tsx` 中自动引入，无需额外配置。

```tsx
import HomeSection from '@/components/sections/HomeSection';

// 使用
<HomeSection />
```

## 📝 注意事项

1. 组件使用 `'use client'` 指令，需要客户端渲染
2. 头像路径需要根据实际部署方式调整
3. GitHub 链接需要替换为真实地址
4. 滚动锚点需要在页面中有对应的 id 区块

---

**实现日期**：2026年6月
**最后更新**：2026年6月
**版本**：1.0
