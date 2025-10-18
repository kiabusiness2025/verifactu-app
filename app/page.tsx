export default function Home() {
  return (
    <main style={{ padding: 24 }}>
      <h1>Verifactu App</h1>
      <p>Build OK. Endpoints:</p>
      <ul>
        <li><code>/api/ping</code> (salud)</li>
        <li><code>/api/send</code> (Resend)</li>
        <li><code>/api/ping-backend</code> (llama al backend con ID token)</li>
      </ul>
    </main>
  );
}
