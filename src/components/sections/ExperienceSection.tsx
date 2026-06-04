import { AnimatedSection } from '@/components/AnimatedSection';

const experiences = [
  {
    date: '2025.06 – Present',
    company: '公司名称 A',
    role: '产品经理',
    desc: '一句话描述你的角色与成就。',
  },
  {
    date: '2024.07 – 2025.05',
    company: '公司名称 B',
    role: '产品实习生',
    desc: '一句话描述你的角色与成就。',
  },
  {
    date: '2023.03 – 2024.06',
    company: '公司名称 C',
    role: '设计助理',
    desc: '一句话描述你的角色与成就。',
  },
];

export default function ExperienceSection() {
  return (
    <AnimatedSection id="experience">
      <div className="max-w-content mx-auto px-6 py-24 md:py-32">
        <p className="text-sm uppercase tracking-widest text-muted">Experience</p>
        <h2 className="mt-4 text-4xl md:text-5xl font-semibold tracking-tighter text-ink leading-[1.1]">
          经历
        </h2>

        <div className="mt-16">
          {experiences.map((item, i) => (
            <div
              key={i}
              className="py-6 grid gap-4 md:grid-cols-[140px_1fr] md:gap-8 border-b border-line last:border-b-0"
            >
              <div className="text-[14px] text-muted pt-1">
                {item.date}
              </div>
              <div>
                <h3 className="text-[17px] font-semibold tracking-tight text-ink leading-snug">
                  {item.role}
                  <span className="text-muted font-normal"> · {item.company}</span>
                </h3>
                <p className="mt-2 text-[15px] text-ink/80 leading-relaxed">
                  {item.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </AnimatedSection>
  );
}
