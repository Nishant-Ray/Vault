export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <div>
      <h1>Main layout.</h1>
      <div>{children}</div>
    </div>
  );
}
