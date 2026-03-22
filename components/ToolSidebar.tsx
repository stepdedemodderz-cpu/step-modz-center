import Link from 'next/link';
import { Lang, tools } from '@/lib/site';

export function ToolSidebar({ lang, activeSlug }: { lang: Lang; activeSlug?: string }) {
  return (
    <aside className="card sidebar">
      <div className="h3" style={{ marginBottom: 10 }}>Tools</div>
      <div className="stack">
        {tools.map((tool) => (
          <Link
            key={tool.slug}
            href={`/${lang}/tools/${tool.slug}`}
            className={`tool-link ${activeSlug === tool.slug ? 'active' : ''}`}
          >
            <div style={{ fontWeight: 700 }}>{tool.title}</div>
            <div className="small muted">{tool.category}</div>
          </Link>
        ))}
      </div>
    </aside>
  );
}
