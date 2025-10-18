export const metadata = {
  title: 'Verifactu App',
  description: 'VERIFACTU • Robotcontable',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body style={{ fontFamily: 'system-ui, -apple-system, Segoe UI, Roboto, Arial', margin: 0 }}>
        {children}
      </body>
    </html>
  );
}