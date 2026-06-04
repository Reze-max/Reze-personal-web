import { AnimatedSection } from '@/components/AnimatedSection';

const contacts = [
  {
    label: 'Email',
    value: 'hello@example.com',
  },
  {
    label: 'WeChat',
    value: 'your-wechat-id',
  },
  {
    label: 'GitHub',
    value: 'github.com/your-handle',
  },
];

export default function ContactSection() {
  return (
    <AnimatedSection id="contact">
      <div className="max-w-content mx-auto px-6 py-24 md:py-32">
      <p className="text-sm uppercase tracking-widest text-muted">Contact</p>
      <h2 className="mt-4 text-4xl md:text-5xl font-semibold tracking-tighter text-ink leading-[1.1]">
        保持联系
      </h2>
      <p className="mt-6 max-w-2xl text-[17px] leading-relaxed text-muted">
        欢迎交流合作，或只是聊聊你感兴趣的话题。
      </p>

      <div className="mt-16 space-y-6">
        {contacts.map((item) => (
          <div key={item.label} className="flex gap-6 border-b border-line pb-6">
            <span className="w-20 shrink-0 text-sm text-muted">{item.label}</span>
            <span className="text-[17px] text-ink">{item.value}</span>
          </div>
        ))}
      </div>

      <p className="mt-24 text-[17px] leading-relaxed text-ink/80">
        期待与你的对话。
      </p>
    </div>
    </AnimatedSection>
  );
}
