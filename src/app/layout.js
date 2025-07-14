export const metadata = {
  title: "Memory Card Game | Fudail",
  description: "Fun memory game built in Next.js",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
