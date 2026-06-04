import { AnimatedSection } from '@/components/AnimatedSection';

export default function AboutSection() {
  return (
    <AnimatedSection id="about">
      <div className="max-w-content mx-auto px-6 py-24 md:py-32">
        <p className="text-sm uppercase tracking-widest text-muted">About</p>
        <h2 className="mt-4 text-4xl md:text-5xl font-semibold tracking-tighter text-ink leading-[1.1]">
          关于我
        </h2>

        <div className="mt-10 space-y-5 max-w-2xl text-[17px] leading-relaxed text-ink/90">
          <p>
            我是一名对产品与设计都感兴趣的人，喜欢在复杂的问题里找到简洁的表达方式。
            过去几年我在 [某某学校 / 机构] 学习，参与过若干个从 0 到 1 的项目。
          </p>
          <p>
            工作之外，我也在持续写作、摄影与旅行，希望让生活保持一点开放与好奇。
          </p>
        </div>

        <div className="mt-16 grid gap-10 md:grid-cols-3">
          <div>
            <h3 className="text-[15px] font-semibold tracking-tight text-ink">教育背景</h3>
            <ul className="mt-4 space-y-2 text-[15px] text-ink/80 leading-relaxed">
              <li>• [学校名称] · [专业]</li>
              <li>• [学校名称] · [专业]</li>
            </ul>
          </div>
          <div>
            <h3 className="text-[15px] font-semibold tracking-tight text-ink">专业兴趣</h3>
            <ul className="mt-4 space-y-2 text-[15px] text-ink/80 leading-relaxed">
              <li>• 产品方法论</li>
              <li>• 用户研究与设计</li>
              <li>• 数据驱动决策</li>
            </ul>
          </div>
          <div>
            <h3 className="text-[15px] font-semibold tracking-tight text-ink">个人爱好</h3>
            <ul className="mt-4 space-y-2 text-[15px] text-ink/80 leading-relaxed">
              <li>• 写作与阅读</li>
              <li>• 摄影</li>
              <li>• 独立旅行</li>
            </ul>
          </div>
        </div>
      </div>
    </AnimatedSection>
  );
}
