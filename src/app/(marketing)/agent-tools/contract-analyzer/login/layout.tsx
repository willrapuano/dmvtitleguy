import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sign In | DMV Title Guy",
  robots: { index: false, follow: false },
  alternates: { canonical: "https://dmvtitleguy.com/agent-tools/contract-analyzer/login" },
};

export default function LoginLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
