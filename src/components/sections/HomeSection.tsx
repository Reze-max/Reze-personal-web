/**
 * HomeSection - 苹果风格 Hero Section
 *
 * 布局：左侧文字区 + 右侧头像区（两栏式）
 * 风格：极简、留白、清晰层次、高端品质
 *
 * @description
 * - 页面首次加载：整体 fade in + 交错动画
 * - 文字区域：姓名、Title、副标题、专注方向、简介
 * - 按钮区：View Resume / View Projects / GitHub（苹果风格）
 * - 头像区：圆形头像 + 阴影效果
 */

'use client';

import { motion } from 'framer-motion';
import { FileText, FolderOpen, Github } from 'lucide-react';

export default function HomeSection() {
  // 交错动画配置
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.12,
        delayChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: [0.22, 1, 0.36, 1],
      },
    },
  };

  return (
    <section
      id="home"
      className="relative min-h-screen flex items-center bg-white overflow-hidden"
    >
      {/* 全宽容器，配合侧边栏布局 */}
      <div className="w-full px-6 md:px-12 lg:px-16 xl:px-20 py-20 md:py-28 lg:py-32">
        <motion.div
          className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* ============================================
              左侧文字区域
          ============================================ */}
          <motion.div variants={itemVariants} className="order-2 lg:order-1">
            {/* 姓名 - 视觉焦点 */}
            <motion.h1
              variants={itemVariants}
              className="text-5xl sm:text-6xl lg:text-7xl font-semibold tracking-tight text-ink leading-[1.05] mb-4"
            >
              马睿哲
            </motion.h1>

            {/* Title */}
            <motion.p
              variants={itemVariants}
              className="text-xl sm:text-2xl text-ink font-medium mb-3 tracking-tight"
            >
              AI Product Manager & Data Analyst
            </motion.p>

            {/* 副标题 */}
            <motion.p
              variants={itemVariants}
              className="text-base text-muted mb-6 tracking-tight"
            >
              研究生 · 北京交通大学
            </motion.p>

            {/* 专注方向 */}
            <motion.div variants={itemVariants} className="mb-8">
              <p className="text-sm text-muted mb-3 tracking-tight">
                专注于：
              </p>
              <div className="flex flex-wrap gap-3">
                {[
                  'AI Product',
                  'Agent Workflow',
                  'Data Analytics',
                ].map((item, index) => (
                  <motion.span
                    key={item}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{
                      duration: 0.4,
                      delay: 0.6 + index * 0.08,
                      ease: [0.22, 1, 0.36, 1],
                    }}
                    className="inline-flex items-center px-4 py-1.5 rounded-full bg-ink text-white text-sm font-medium tracking-tight"
                  >
                    {item}
                  </motion.span>
                ))}
              </div>
            </motion.div>

            {/* 简介文本 */}
            <motion.p
              variants={itemVariants}
              className="text-base sm:text-[17px] leading-relaxed text-ink/80 max-w-xl mb-10"
            >
              目前就读于北京交通大学信息管理硕士。拥有百度产品实习经历。
              关注AI Agent、数据产品与智能工作流方向。致力于探索AI在真实业务场景中的落地应用。
            </motion.p>

            {/* 按钮区域 */}
            <motion.div
              variants={itemVariants}
              className="flex flex-wrap gap-4"
            >
              {/* 主要按钮：View Resume */}
              <motion.a
                href="#contact"
                onClick={(e) => {
                  e.preventDefault();
                  document
                    .getElementById('contact')
                    ?.scrollIntoView({ behavior: 'smooth' });
                }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="group inline-flex items-center gap-2.5 px-6 py-3 bg-ink text-white rounded-xl text-sm font-medium tracking-tight transition-shadow duration-300 hover:shadow-lg hover:shadow-ink/20"
              >
                <FileText size={16} strokeWidth={2} />
                <span>View Resume</span>
              </motion.a>

              {/* 主要按钮：View Projects */}
              <motion.a
                href="#projects"
                onClick={(e) => {
                  e.preventDefault();
                  document
                    .getElementById('projects')
                    ?.scrollIntoView({ behavior: 'smooth' });
                }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="group inline-flex items-center gap-2.5 px-6 py-3 bg-ink text-white rounded-xl text-sm font-medium tracking-tight transition-shadow duration-300 hover:shadow-lg hover:shadow-ink/20"
              >
                <FolderOpen size={16} strokeWidth={2} />
                <span>View Projects</span>
              </motion.a>

              {/* 次要按钮：GitHub */}
              <motion.a
                href="https://github.com/"
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="inline-flex items-center gap-2.5 px-6 py-3 border border-line text-ink rounded-xl text-sm font-medium tracking-tight transition-all duration-300 hover:border-ink hover:bg-ink/5"
              >
                <Github size={16} strokeWidth={2} />
                <span>GitHub</span>
              </motion.a>
            </motion.div>
          </motion.div>

          {/* ============================================
              右侧头像区域
          ============================================ */}
          <motion.div
            variants={itemVariants}
            className="order-1 lg:order-2 flex justify-center lg:justify-end"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{
                duration: 0.8,
                delay: 0.2,
                ease: [0.22, 1, 0.36, 1],
              }}
              className="relative"
            >
              {/* 头像容器 */}
              <motion.div
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                className="relative w-56 h-56 sm:w-64 sm:h-64 lg:w-80 lg:h-80"
              >
                {/* 占位头像 - 圆形 */}
                <div className="w-full h-full rounded-full bg-gradient-to-br from-gray-100 to-gray-200 border-4 border-white shadow-2xl shadow-gray-300/40 overflow-hidden flex items-center justify-center">
                  {/* 头像占位图标注 */}
                  <div className="text-center p-6">
                    <div className="w-20 h-20 mx-auto mb-3 rounded-full bg-gray-300 flex items-center justify-center">
                      <svg
                        className="w-10 h-10 text-gray-500"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={1.5}
                          d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                        />
                      </svg>
                    </div>
                    <p className="text-xs text-gray-400 tracking-tight">
                      头像占位图
                    </p>
                    <p className="text-[10px] text-gray-300 mt-0.5">
                      assets/avatar.jpg
                    </p>
                  </div>
                </div>

                {/* 装饰性光晕效果 */}
                <div className="absolute inset-0 rounded-full bg-gradient-to-br from-ink/5 to-transparent pointer-events-none" />
              </motion.div>

              {/* 背景装饰元素 - 呼应苹果风格 */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 1, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
                className="absolute -top-4 -right-4 w-24 h-24 bg-gradient-to-br from-ink/5 to-transparent rounded-full blur-2xl"
              />
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 1, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
                className="absolute -bottom-4 -left-4 w-32 h-32 bg-gradient-to-tr from-gray-100/80 to-transparent rounded-full blur-3xl"
              />
            </motion.div>
          </motion.div>
        </motion.div>

        {/* ============================================
            向下滚动提示（桌面端）
        ============================================ */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1.2 }}
          className="hidden md:flex absolute bottom-12 left-1/2 -translate-x-1/2 items-center gap-2 text-muted text-sm"
        >
          <span className="tracking-tight">向下滚动了解更多</span>
          <motion.div
            animate={{ y: [0, 4, 0] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polyline points="6 9 12 15 18 9" />
            </svg>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
