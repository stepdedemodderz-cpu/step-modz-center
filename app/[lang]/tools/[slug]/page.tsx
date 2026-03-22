import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Topbar } from '@/components/Topbar';
import { ToolClient } from '@/components/ToolClient';
import { ToolSidebar } from '@/components/ToolSidebar';
import { bySlug, copy, Lang } from '@/lib/site';

export default function ToolPage({ params }: { params: { lang: Lang; slug: string } }) {
  const lang = params.lang;
  const tool = bySlug[params.slug];
  if (!['de', 'en'].includes(lang) || !tool) notFound();

  return (
    <main>
      <Topbar lang={lang} />
      <div className="shell">
        <div className="row" style={{ marginBottom: 16 }}>
          <Link href={`/${lang}/dashboard`} className="btn btn-secondary">← {copy[lang].dashboard}</Link>
        </div>
        <div className="side-layout">
          <ToolSidebar lang={lang} activeSlug={tool.slug} />
          <ToolClient tool={tool} />
        </div>
      </div>
      <footer>Step Mod!Z Tools</footer>
    </main>
  );
}
