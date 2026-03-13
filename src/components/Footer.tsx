import Link from "next/link";
import { siteConfig, areasDeAtuacao } from "@/lib/data";
import { MapPin, Phone, Mail } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-gold-500/8 bg-navy-950">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        {/* Main footer */}
        <div className="grid gap-12 py-16 md:grid-cols-4">
          {/* Brand column */}
          <div className="md:col-span-1">
            <Link href="/" className="inline-block">
              <span className="font-[family-name:var(--font-cormorant)] text-xl tracking-wide text-cream-100">
                Ferri Schoedl
              </span>
            </Link>
            <p className="mt-3 text-[13px] leading-relaxed text-txt-muted">
              Advocacia especializada com sede em Sao Paulo e atuacao em todo o
              territorio nacional.
            </p>
            <p className="mt-4 text-[11px] uppercase tracking-[1.5px] text-gold-600">
              {siteConfig.oab}
            </p>
          </div>

          {/* Areas column */}
          <div>
            <h4 className="mb-4 text-[11px] font-medium uppercase tracking-[2px] text-gold-500">
              Areas de atuacao
            </h4>
            <ul className="space-y-2">
              {areasDeAtuacao.map((area) => (
                <li key={area.slug}>
                  <Link
                    href={`/areas-de-atuacao#${area.slug}`}
                    className="text-[13px] text-txt-muted transition-colors hover:text-cream-100"
                  >
                    {area.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Navigation column */}
          <div>
            <h4 className="mb-4 text-[11px] font-medium uppercase tracking-[2px] text-gold-500">
              Navegacao
            </h4>
            <ul className="space-y-2">
              {[
                { href: "/sobre", label: "Sobre" },
                { href: "/publicacoes", label: "Publicacoes" },
                { href: "/cursos", label: "Cursos" },
                { href: "/faq", label: "Perguntas frequentes" },
                { href: "/contato", label: "Contato" },
              ].map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-[13px] text-txt-muted transition-colors hover:text-cream-100"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact column */}
          <div>
            <h4 className="mb-4 text-[11px] font-medium uppercase tracking-[2px] text-gold-500">
              Contato
            </h4>
            <ul className="space-y-3">
              <li className="flex gap-3">
                <MapPin size={14} className="mt-1 shrink-0 text-gold-600" />
                <span className="text-[13px] text-txt-muted">
                  {siteConfig.address.street}, {siteConfig.address.complement}
                  <br />
                  {siteConfig.address.neighborhood} — {siteConfig.address.city}/
                  {siteConfig.address.state}
                </span>
              </li>
              <li className="flex items-center gap-3">
                <Phone size={14} className="shrink-0 text-gold-600" />
                <span className="text-[13px] text-txt-muted">
                  {siteConfig.phone}
                </span>
              </li>
              <li className="flex items-center gap-3">
                <Mail size={14} className="shrink-0 text-gold-600" />
                <span className="text-[13px] text-txt-muted">
                  {siteConfig.email}
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="flex flex-col items-center justify-between gap-4 border-t border-gold-500/8 py-6 sm:flex-row">
          <p className="text-[11px] text-txt-muted">
            Ferri Schoedl Advocacia — Pagina institucional em observancia ao
            Codigo de Etica da OAB
          </p>
          <p className="text-[11px] text-txt-muted">
            Desenvolvido por{" "}
            <a
              href="https://pedrazzolidigital.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gold-600 transition-colors hover:text-gold-500"
            >
              Pedrazzoli Digital
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
