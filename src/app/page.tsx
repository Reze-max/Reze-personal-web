'use client';

import { motion } from 'framer-motion';
import { Sidebar } from '@/components/Sidebar';
import HomeSection from '@/components/sections/HomeSection';
import AboutSection from '@/components/sections/AboutSection';
import ExperienceSection from '@/components/sections/ExperienceSection';
import ProjectsSection from '@/components/sections/ProjectsSection';
import SkillsSection from '@/components/sections/SkillsSection';
import BlogSection from '@/components/sections/BlogSection';
import ContactSection from '@/components/sections/ContactSection';

export default function Home() {
  return (
    <div className="relative min-h-screen bg-white text-ink">
      <Sidebar />

      {/* 页面首次进入：整体 fade in */}
      <motion.main
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        className="lg:pl-56 xl:pl-64 pt-16 lg:pt-0"
      >
        <HomeSection />
        <AboutSection />
        <ExperienceSection />
        <ProjectsSection />
        <SkillsSection />
        <BlogSection />
        <ContactSection />

        <footer className="border-t border-line">
          <div className="max-w-content mx-auto px-6 py-10 text-[13px] text-muted">
            © {new Date().getFullYear()} Portfolio · Designed & Built with care.
          </div>
        </footer>
      </motion.main>
    </div>
  );
}
