import { AnimatedSection } from '@/components/AnimatedSection';

const projects = [
  {
    index: '01',
    title: 'AI 产品设计',
    description: '从用户研究到原型交付，一次端到端的产品设计与思考过程。',
  },
  {
    index: '02',
    title: '数据可视化工具',
    description: '用简洁清晰地呈现复杂数据，让信息变得可读与可感。',
  },
  {
    index: '03',
    title: '协作平台重构',
    description: '在约束条件下的交互与取舍，平衡体验与效率的博弈。',
  },
  {
    index: '04',
    title: '个人博客系统',
    description: '从 0 到 1 的个人站点，记录思考与成长的过程。',
  },
];

export default function ProjectsSection() {
  return (
    <AnimatedSection id="projects">
      <div className="max-w-content mx-auto px-6 py-24 md:py-32">
      <p className="text-sm uppercase tracking-widest text-muted">Projects</p>
      <h2 className="mt-4 text-4xl md:text-5xl font-semibold tracking-tighter text-ink leading-[1.1]">
        精选项目
      </h2>
      <p className="mt-6 max-w-2xl text-[17px] leading-relaxed text-muted">
        精选作品合集，探索设计与产品思考。
      </p>

      <div className="mt-16 grid md:grid-cols-2 gap-8">
        {projects.map((project) => (
          <article
            key={project.index}
            className="group flex flex-col justify-between rounded-2xl border border-line p-8 transition-all duration-300 ease-out hover:scale-105 hover:shadow-sm hover:border-ink/10"
          >
            <div>
              <p className="text-sm text-muted">{project.index}</p>
              <h3 className="mt-6 text-xl font-semibold tracking-tight text-ink">
                {project.title}
              </h3>
              <p className="mt-4 text-[15px] leading-relaxed text-ink/80">
                {project.description}
              </p>
            </div>
            <p className="mt-10 text-[15px] font-medium text-ink/90 transition-colors group-hover:text-ink">
              查看详情 →
            </p>
          </article>
        ))}
      </div>
    </div>
    </AnimatedSection>
  );
}
