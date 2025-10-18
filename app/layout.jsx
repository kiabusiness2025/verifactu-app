export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <body style={{margin:0, fontFamily:"system-ui, -apple-system, Segoe UI, Roboto, Arial"}}>
        {children}
      </body>
    </html>
  );
}
