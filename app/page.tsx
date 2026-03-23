import Link from 'next/link';
import { copy, site } from '@/lib/site';

export default function LandingPage() {
  return (
    <main className="shell" style={{ minHeight: '100vh', display: 'grid', placeItems: 'center' }}>
      <section className="grid" style={{ width: '100%' }}>
        
        {/* 🔥 LOGO FIX (kein next/image mehr) */}
        <div className="logo-box">
          <img
            src="/logo-new.png?v=2"
            alt="Step Mod!Z Logo"
            style={{
              width: '100%',
              maxWidth: 420,
              height: 'auto',
              margin: '0 auto',
              display: 'block'
            }}
          />
        </div>

        <div className="card hero-card" style={{ textAlign: 'center' }}>
          <div className="badge">{site.owner} · {site.discord}</div>
          <div className="space" />

          <h1 className="h1">{site.name}</h1>

          <p className="muted" style={{ maxWidth: 860, margin: '16px auto 0', fontSize: '1.08rem' }}>
            {copy.de.heroText}
          </p>

          <div className="space" />

          <p className="small muted">
            {copy.de.chooseLanguage} / {copy.en.chooseLanguage}
          </p>

          <div className="row" style={{ justifyContent: 'center', marginTop: 12 }}>
            <Link href="/de/dashboard" className="btn btn-secondary lang-chip">
              Deutsch
            </Link>
            <Link href="/en/dashboard" className="btn btn-secondary lang-chip">
              English
            </Link>
          </div>

          <div className="space" />

          <div className="row" style={{ justifyContent: 'center' }}>
            <Link href="/de/dashboard" className="btn btn-primary">
              Step Mod!Z
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}