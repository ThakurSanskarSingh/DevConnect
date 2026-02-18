import './globals.css'

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <nav className="p-4 border-b flex justify-between">
          <h1 className="font-bold">DevConnect</h1>
          <button>Login</button>
        </nav>

        {children}

        <footer className="p-4 border-t mt-10 text-center">
          © 2026 DevConnect
        </footer>
      </body>
    </html>
  );
}
