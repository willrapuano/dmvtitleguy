import { FileSearch, Wrench } from "lucide-react";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Agent Tools | DMV Title Guy",
  description:
    "Exclusive tools for real estate agents — AI-powered contract analysis, compliance checks, and more.",
  alternates: { canonical: "https://dmvtitleguy.com/agent-tools" },
};

const tools = [
  {
    title: "Contract Analyzer",
    description:
      "AI-powered contract compliance checker for DC, Virginia & Maryland real estate contracts. Upload any NVAR K1321, GCAAR 1301, or MAR contract and get instant analysis of missing fields, signature issues, date conflicts, and more.",
    href: "/agent-tools/contract-analyzer",
    icon: FileSearch,
    badge: "Live",
    badgeColor: "bg-green-100 text-green-800",
  },
  // Future tools will be added here
  // {
  //   title: "Offer Analyzer",
  //   description: "Compare and score competing offers side-by-side.",
  //   href: "/agent-tools/offer-analyzer",
  //   icon: Scale,
  //   badge: "Coming Soon",
  //   badgeColor: "bg-amber-100 text-amber-800",
  // },
];

export default function AgentToolsPage() {
  return (
    <section className="py-16 bg-gray-50 min-h-screen">
      <div className="container-xl">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 rounded-full bg-brand-navy/10 px-4 py-1.5 text-sm font-medium text-brand-navy mb-4">
            <Wrench className="h-4 w-4" />
            Exclusive Agent Tools
          </div>
          <h1 className="text-4xl font-bold text-brand-navy mb-4">
            Tools Built for DMV Agents
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Powerful, AI-driven tools designed specifically for real estate
            professionals in DC, Virginia, and Maryland. Free to use for agents
            who work with Pruitt Title.
          </p>
        </div>

        {/* Tool Cards */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 max-w-5xl mx-auto">
          {tools.map((tool) => {
            const Icon = tool.icon;
            return (
              <Link
                key={tool.href}
                href={tool.href}
                className="group surface-card p-8 transition-colors duration-150 hover:border-brand-blue/30"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="rounded-xl bg-brand-navy/5 p-3 group-hover:bg-brand-blue/10 transition-colors">
                    <Icon className="h-8 w-8 text-brand-navy group-hover:text-brand-blue transition-colors" />
                  </div>
                  {tool.badge && (
                    <span
                      className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${tool.badgeColor}`}
                    >
                      {tool.badge}
                    </span>
                  )}
                </div>
                <h2 className="t-h5 text-brand-navy mb-2 group-hover:text-brand-blue transition-colors">
                  {tool.title}
                </h2>
                <p className="text-sm text-gray-600 leading-relaxed max-w-[68ch]">
                  {tool.description}
                </p>
                <div className="mt-4 text-sm font-medium text-brand-blue opacity-0 group-hover:opacity-100 transition-opacity">
                  Launch tool →
                </div>
              </Link>
            );
          })}
        </div>

        {/* CTA */}
        <div className="text-center mt-16">
          <p className="text-gray-500 text-sm max-w-[68ch] mx-auto leading-relaxed">
            Have a tool idea?{" "}
            <a
              href="mailto:will@pruitt-title.com"
              className="text-brand-blue-deep hover:underline font-medium"
            >
              Let us know
            </a>
          </p>
        </div>
      </div>
    </section>
  );
}
