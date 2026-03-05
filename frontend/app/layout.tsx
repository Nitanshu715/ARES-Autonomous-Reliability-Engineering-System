import { Cormorant_Garamond } from "next/font/google";

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["300", "400", "500"],
  style: ["normal", "italic"],
  variable: "--font-cormorant",
});

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={cormorant.variable}>{children}</body>
    </html>
  );
}