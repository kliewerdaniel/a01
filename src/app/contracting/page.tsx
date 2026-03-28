import { Metadata } from "next";
import Link from "next/link";
import { Mail, Linkedin, ArrowRight } from "lucide-react";

export const metadata: Metadata = {
  title: "Enterprise AI Systems | Local-First Architecture & Data Sovereignty",
  description:
    "Design and deployment of local-first AI systems, on-prem LLM infrastructure, and audit-ready architectures for enterprise environments.",
};

export default function ContractingPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-3xl mx-auto px-6 py-24 md:py-32">
        {/* Section 1 — Headline */}
        <section className="mb-20">
          <h1
            className="text-4xl md:text-5xl font-bold tracking-tight text-foreground leading-tight"
            style={{ fontFamily: "var(--font-playfair), Georgia, serif" }}
          >
            I design and deploy local-first AI systems for enterprise
            environments.
          </h1>
          <p className="mt-6 text-lg md:text-xl text-muted-foreground leading-relaxed">
            On-prem LLM infrastructure. Data sovereignty. Audit-ready
            architectures built to meet modern regulatory standards.
          </p>
        </section>

        {/* Section 2 — Problem */}
        <section className="mb-20">
          <h2
            className="text-2xl md:text-3xl font-bold tracking-tight text-foreground mb-6"
            style={{ fontFamily: "var(--font-playfair), Georgia, serif" }}
          >
            Most AI systems fail at the control boundary.
          </h2>
          <p className="text-lg text-muted-foreground leading-relaxed">
            Teams rush into APIs, leak sensitive data, and retrofit governance
            later. By the time risk is visible, it's already embedded in the
            system.
          </p>
        </section>

        {/* Section 3 — Offer */}
        <section className="mb-20">
          <h2
            className="text-2xl md:text-3xl font-bold tracking-tight text-foreground mb-6"
            style={{ fontFamily: "var(--font-playfair), Georgia, serif" }}
          >
            What I build
          </h2>
          <ul className="space-y-4">
            <li className="flex items-start gap-3">
              <span className="mt-2 w-1.5 h-1.5 rounded-full bg-foreground shrink-0" />
              <span className="text-lg text-muted-foreground leading-relaxed">
                Local RAG systems with deterministic routing (Mixture-of-Experts)
              </span>
            </li>
            <li className="flex items-start gap-3">
              <span className="mt-2 w-1.5 h-1.5 rounded-full bg-foreground shrink-0" />
              <span className="text-lg text-muted-foreground leading-relaxed">
                On-prem LLM deployment (Ollama / llama.cpp / air-gapped)
              </span>
            </li>
            <li className="flex items-start gap-3">
              <span className="mt-2 w-1.5 h-1.5 rounded-full bg-foreground shrink-0" />
              <span className="text-lg text-muted-foreground leading-relaxed">
                Data sovereignty architecture (no external dependency paths)
              </span>
            </li>
            <li className="flex items-start gap-3">
              <span className="mt-2 w-1.5 h-1.5 rounded-full bg-foreground shrink-0" />
              <span className="text-lg text-muted-foreground leading-relaxed">
                Agentic workflows with enforced control boundaries
              </span>
            </li>
            <li className="flex items-start gap-3">
              <span className="mt-2 w-1.5 h-1.5 rounded-full bg-foreground shrink-0" />
              <span className="text-lg text-muted-foreground leading-relaxed">
                Audit-ready systems aligned with &ldquo;Reasonable Care&rdquo;
                standards
              </span>
            </li>
          </ul>
        </section>

        {/* Section 4 — Proof */}
        <section className="mb-20">
          <h2
            className="text-2xl md:text-3xl font-bold tracking-tight text-foreground mb-6"
            style={{ fontFamily: "var(--font-playfair), Georgia, serif" }}
          >
            Selected outcomes
          </h2>
          <ul className="space-y-4">
            <li className="flex items-start gap-3">
              <span className="mt-2 w-1.5 h-1.5 rounded-full bg-foreground shrink-0" />
              <span className="text-lg text-muted-foreground leading-relaxed">
                Reduced cloud AI costs by up to 90% via local-first
                architectures
              </span>
            </li>
            <li className="flex items-start gap-3">
              <span className="mt-2 w-1.5 h-1.5 rounded-full bg-foreground shrink-0" />
              <span className="text-lg text-muted-foreground leading-relaxed">
                Deployed air-gapped inference systems for sensitive environments
              </span>
            </li>
            <li className="flex items-start gap-3">
              <span className="mt-2 w-1.5 h-1.5 rounded-full bg-foreground shrink-0" />
              <span className="text-lg text-muted-foreground leading-relaxed">
                Built multi-agent reasoning systems backed by knowledge graphs
              </span>
            </li>
            <li className="flex items-start gap-3">
              <span className="mt-2 w-1.5 h-1.5 rounded-full bg-foreground shrink-0" />
              <span className="text-lg text-muted-foreground leading-relaxed">
                Designed governance layers that evaluate intent before execution
              </span>
            </li>
          </ul>
        </section>

        {/* Section 5 — Engagement Model */}
        <section className="mb-20">
          <h2
            className="text-2xl md:text-3xl font-bold tracking-tight text-foreground mb-6"
            style={{ fontFamily: "var(--font-playfair), Georgia, serif" }}
          >
            Engagement
          </h2>
          <p className="text-lg text-muted-foreground leading-relaxed mb-6">
            I work directly with a small number of teams on high-impact systems.
          </p>
          <ul className="space-y-4 mb-8">
            <li className="flex items-start gap-3">
              <span className="mt-2 w-1.5 h-1.5 rounded-full bg-foreground shrink-0" />
              <span className="text-lg text-muted-foreground leading-relaxed">
                6-month contracts
              </span>
            </li>
            <li className="flex items-start gap-3">
              <span className="mt-2 w-1.5 h-1.5 rounded-full bg-foreground shrink-0" />
              <span className="text-lg text-muted-foreground leading-relaxed">
                Enterprise environments only
              </span>
            </li>
            <li className="flex items-start gap-3">
              <span className="mt-2 w-1.5 h-1.5 rounded-full bg-foreground shrink-0" />
              <span className="text-lg text-muted-foreground leading-relaxed">
                Focus: architecture, deployment, and control systems
              </span>
            </li>
          </ul>
          <p className="text-lg text-muted-foreground leading-relaxed italic">
            If you are exploring AI, I am not the right fit.
            <br />
            If you are deploying it into critical workflows, we should talk.
          </p>
        </section>

        {/* Section 6 — CTA */}
        <section className="mb-16">
          <h2
            className="text-2xl md:text-3xl font-bold tracking-tight text-foreground mb-6"
            style={{ fontFamily: "var(--font-playfair), Georgia, serif" }}
          >
            Contact
          </h2>
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <Mail className="w-5 h-5 text-muted-foreground" />
              <a
                href="mailto:danielkliewer@gmail.com"
                className="text-lg text-muted-foreground hover:text-foreground transition-colors underline underline-offset-4"
              >
                danielkliewer@gmail.com
              </a>
            </div>
            <div className="flex items-center gap-3">
              <Linkedin className="w-5 h-5 text-muted-foreground" />
              <a
                href="https://www.linkedin.com/in/daniel-kliewer-42691944/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-lg text-muted-foreground hover:text-foreground transition-colors underline underline-offset-4"
              >
                LinkedIn
              </a>
            </div>
          </div>
          <p className="mt-6 text-sm text-muted-foreground">
            Include a brief description of your system and constraints.
          </p>
        </section>

        {/* Back link */}
        <div className="pt-8 border-t border-border">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowRight className="w-4 h-4 rotate-180" />
            Back to home
          </Link>
        </div>
      </div>
    </div>
  );
}