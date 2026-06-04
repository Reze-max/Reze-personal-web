'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X } from 'lucide-react';
import { navItems } from '@/data/nav';
import { useActiveSection } from '@/hooks/useActiveSection';

export function Sidebar() {
  const active = useActiveSection();
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileOpen]);

  const onNavClick = (id: string) => {
    setMobileOpen(false);
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <>
      {/* 桌面端：左侧固定导航栏 */}
      <nav
        aria-label="主导航"
        className="hidden lg:flex fixed left-0 top-0 h-screen w-56 xl:w-64 flex-col justify-between z-40 bg-white/80 backdrop-blur-xl border-r border-line/60 px-8 py-10"
      >
        <div>
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-[15px] font-medium tracking-tight text-ink"
          >
            Portfolio
          </motion.div>
        </div>

        <ul className="space-y-1 flex-1 my-16">
          {navItems.map((item, idx) => {
            const isActive = active === item.id;
            return (
              <motion.li
                key={item.id}
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.15 + idx * 0.05 }}
              >
                <button
                  onClick={() => onNavClick(item.id)}
                  className={`w-full text-left py-2 text-[14px] transition-colors duration-300 tracking-tight ${
                    isActive
                      ? 'text-ink font-medium'
                      : 'text-muted hover:text-ink'
                  }`}
                >
                  <span className="inline-flex items-center gap-3">
                    <span
                      className={`inline-block h-px transition-all duration-300 ${
                        isActive ? 'w-5 bg-ink' : 'w-2 bg-line'
                      }`}
                    />
                    {item.label}
                  </span>
                </button>
              </motion.li>
            );
          })}
        </ul>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="text-[11px] text-muted"
        >
          © {new Date().getFullYear()}
        </motion.div>
      </nav>

      {/* 移动端：顶部条 + 抽屉菜单 */}
      <div className="lg:hidden">
        <header className="fixed top-0 inset-x-0 z-40 bg-white/80 backdrop-blur-xl border-b border-line/60">
          <div className="flex items-center justify-between h-14 px-5">
            <span className="text-[14px] font-medium tracking-tight">
              Portfolio
            </span>
            <button
              aria-label={mobileOpen ? '关闭菜单' : '打开菜单'}
              onClick={() => setMobileOpen((s) => !s)}
              className="p-2 -mr-2 text-ink"
            >
              {mobileOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </header>

        <AnimatePresence>
          {mobileOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="fixed inset-0 z-30 bg-white pt-16"
            >
              <ul className="px-8 pt-8 space-y-2">
                {navItems.map((item, idx) => {
                  const isActive = active === item.id;
                  return (
                    <motion.li
                      key={item.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.35, delay: idx * 0.05 }}
                    >
                      <button
                        onClick={() => onNavClick(item.id)}
                        className={`w-full text-left py-3 text-[18px] tracking-tight border-b border-line/40 ${
                          isActive ? 'text-ink font-medium' : 'text-muted'
                        }`}
                      >
                        {item.label}
                      </button>
                    </motion.li>
                  );
                })}
              </ul>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </>
  );
}
