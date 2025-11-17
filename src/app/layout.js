"use client";

import "./globals.css";
import { BlockchainProvider } from "../context/BlockchainContext";
import Header from "../components/Header";
import Footer from "../components/Footer";

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <BlockchainProvider>
          <Header />
          <main>{children}</main>
          <Footer />
        </BlockchainProvider>
      </body>
    </html>
  );
}

