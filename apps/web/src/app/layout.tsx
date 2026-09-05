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
    <ClerkProvider>
      <html lang="en" className="dark">
        <body className="bg-slate-950 text-slate-100 antialiased min-h-screen">
          {children}
        </body>
      </html>
    </ClerkProvider>
  );
}