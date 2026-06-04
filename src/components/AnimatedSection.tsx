'use client';

import { motion, type MotionProps } from 'framer-motion';
import type { ReactNode } from 'react';

interface AnimatedSectionProps extends MotionProps {
  id: string;
  children: ReactNode;
  className?: string;
}

export function AnimatedSection({
  id,
  children,
  className = '',
  ...rest
}: AnimatedSectionProps) {
  return (
    <motion.section
      id={id}
      className={`min-h-screen flex flex-col justify-center scroll-mt-12 ${className}`}
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
      {...rest}
    >
      {children}
    </motion.section>
  );
}
