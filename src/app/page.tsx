import Link from "next/link";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-6 font-[family-name:var(--font-geist-sans)] bg-[var(--astro-bg)] text-[var(--astro-text)]">
      <main className="flex flex-col items-center justify-center text-center max-w-2xl w-full gap-10">
        
        {/* Brand Block */}
        <div className="flex flex-col items-center gap-4">
          {/* Brand SVG styled via CSS mask */}
          <div 
            className="w-48 h-48 md:w-56 md:h-56 relative bg-[var(--astro-primary)] transition-colors duration-300"
            style={{
              WebkitMaskImage: "url('/brand/kalon-symbol-master.svg')",
              WebkitMaskRepeat: "no-repeat",
              WebkitMaskPosition: "center",
              WebkitMaskSize: "contain",
              maskImage: "url('/brand/kalon-symbol-master.svg')",
              maskRepeat: "no-repeat",
              maskPosition: "center",
              maskSize: "contain",
            }}
          />
          <span className="text-xl md:text-2xl uppercase tracking-[0.25em] font-semibold text-[var(--astro-primary)]">
            Kalon Astro
          </span>
        </div>

        <div className="flex flex-col gap-6 items-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight leading-tight">
            Descubra seus melhores momentos.
          </h1>
          
          <p className="text-lg md:text-xl max-w-xl opacity-90 leading-relaxed font-light">
            Calendários personalizados que mostram quando agir, decidir e aproveitar as melhores oportunidades do seu ciclo.
          </p>
        </div>

        <div className="pt-4">
          <Link href="/login">
            <button 
              className="px-10 py-4 rounded-full font-semibold text-lg transition-all duration-300 shadow-lg hover:-translate-y-1 hover:shadow-xl bg-[var(--astro-primary)] text-[var(--astro-bg)] hover:bg-[var(--astro-primary-dark)]"
            >
              Começar
            </button>
          </Link>
        </div>
        
      </main>
    </div>
  );
}
