import { AnimatedSection } from '@/components/AnimatedSection';

const posts = [
  {
    date: '2026.05',
    title: '从0到1：一个AI产品的诞生笔记',
  },
  {
    date: '2026.04',
    title: '产品经理的技术理解力：边界与工具',
  },
  {
    date: '2026.03',
    title: '设计思维与工程思维的碰撞',
  },
];

export default function BlogSection() {
  return (
    <AnimatedSection id="blog">
      <div className="max-w-content mx-auto px-6 py-24 md:py-32">
      <p className="text-sm uppercase tracking-widest text-muted">Blog</p>
      <h2 className="mt-4 text-4xl md:text-5xl font-semibold tracking-tighter text-ink leading-[1.1]">
        最近写作
      </h2>
      <p className="mt-6 max-w-2xl text-[17px] leading-relaxed text-muted">
        关于产品、设计与成长的一些思考。
      </p>

      <div className="mt-16 space-y-2">
        {posts.map((post) => (
          <a
          key={post.title}
          href="#"
          className="group flex items-center gap-6 border-b border-line py-6 transition-all duration-300 ease-out hover:scale-[1.00]"
          >
            <span className="shrink-0 text-sm text-muted tabular-nums">
              {post.date}
            </span>
            <span className="flex-1 text-[17px] font-medium tracking-tight text-ink transition-colors group-hover:underline decoration-1 underline-offset-4">
              {post.title}
            </span>
            <span className="text-ink/60 transition-transform duration-300 group-hover:translate-x-1 group-hover:text-ink">
              →
            </span>
          </a>
        ))}
      </div>
    </div>
    </AnimatedSection>
  );
}
