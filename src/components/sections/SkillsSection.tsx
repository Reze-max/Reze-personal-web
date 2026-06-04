import { AnimatedSection } from '@/components/AnimatedSection';

const skillGroups = [
  {
    name: '产品设计',
    items: ['用户研究', '信息架构', '交互设计', '原型设计'],
  },
  {
    name: '数据分析',
    items: ['SQL', 'Python', 'Pandas', 'Excel'],
  },
  {
    name: '技术基础',
    items: ['HTML', 'CSS', 'JavaScript', 'React', 'Next.js'],
  },
  {
    name: 'AI 工具',
    items: ['Prompt Engineering', 'RAG', 'Agent 设计'],
  },
];

export default function SkillsSection() {
  return (
    <AnimatedSection id="skills">
      <div className="max-w-content mx-auto px-6 py-24 md:py-32">
      <p className="text-sm uppercase tracking-widest text-muted">Skills</p>
      <h2 className="mt-4 text-4xl md:text-5xl font-semibold tracking-tighter text-ink leading-[1.1]">
        技能与工具
      </h2>
      <p className="mt-6 max-w-2xl text-[17px] leading-relaxed text-muted">
        工具与方法论，支撑我的产品设计与研发协作。
      </p>

      <div className="mt-16 grid md:grid-cols-2 gap-x-16 gap-y-12">
        {skillGroups.map((group) => (
          <div key={group.name}>
            <h3 className="text-[15px] font-semibold tracking-tight text-ink">
              {group.name}
            </h3>
            <p className="mt-4 text-[15px] leading-relaxed text-muted">
              {group.items.join(' / ')}
            </p>
          </div>
        ))}
      </div>
    </div>
    </AnimatedSection>
  );
}
