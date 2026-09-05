// apps/web/src/app/layout.tsx
import { ClerkProvider } from '@clerk/nextjs';
import './global.css';

export const metadata = {
  title: 'SSB Sentinel-ID | AI Border Document Screening System',
  description: 'Ministry of Home Affairs • Sashastra Seema Bal (SSB) • SIH PS 26188',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-[#F8FAFC] text-slate-900 antialiased min-h-screen">
        <ClerkProvider>
          {children}
        </ClerkProvider>
      </body>
    </html>
  );
}