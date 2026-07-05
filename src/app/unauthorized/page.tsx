export default function UnauthorizedPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-6 font-[family-name:var(--font-geist-sans)] bg-[var(--astro-bg)] text-[var(--astro-text)] text-center">
      <div className="bg-[var(--astro-card)] p-10 rounded-2xl shadow-xl border border-white/5 max-w-lg w-full flex flex-col items-center gap-6">
        <div 
          className="w-24 h-24 relative bg-[var(--astro-primary)] transition-colors duration-300 opacity-50"
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
        <h1 className="text-2xl md:text-3xl font-bold text-[var(--astro-primary)]">Acesso Restrito</h1>
        <p className="opacity-80 leading-relaxed font-light">
          Obrigado pelo interesse! O <strong>Kalon Astro Alpha</strong> está em fase fechada de validação e o acesso se dá apenas por convite.
        </p>
        <p className="opacity-50 text-sm">
          Se você acredita que isto é um erro ou se foi convidado recentemente, entre em contato com a equipe Kalon.
        </p>
      </div>
    </div>
  );
}
