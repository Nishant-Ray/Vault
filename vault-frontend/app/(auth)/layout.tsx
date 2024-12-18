export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <div>
      <h1>Auth layout.</h1>
      <div>{children}</div>
    </div>
  );
}
