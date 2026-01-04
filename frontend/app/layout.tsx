import "./globals.css";

export const metadata = {
  title: "Sajilo Sewa",
  description: "House Service Booking System",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
