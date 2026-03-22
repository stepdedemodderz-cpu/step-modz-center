import Image from 'next/image';
import Link from 'next/link';
import { Lang, copy, site } from '@/lib/site';

export function Topbar({ lang }: { lang: Lang }) {
  const t = copy[lang];
  return (
    <header className="topbar">
      <div className="topbar-inner">
        <Link href={`/${lang}/dashboard`} className="row" style={{ alignItems: 'center', gap: 12 }}>
          <Image src="/logo.png" alt={site.name} width={48} height={48} />
          <div>
            <div style={{ fontWeight: 800 }}>{site.name}</div>
            <div className="small muted">{site.owner}</div>
          </div>
        </Link>
        <div className="row">
          <Link href="/" className="btn btn-secondary">{t.navHome}</Link>
          <a href="#discord" className="btn btn-secondary">{t.navDiscord}</a>
          <a href="#deploy" className="btn btn-primary">{t.navGuide}</a>
        </div>
      </div>
    </header>
  );
}
