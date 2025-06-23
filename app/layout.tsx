import React from 'react';
import "./global.css";
import { NavigationBar } from '@components';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html className="dark" lang="en">
      <body className="font-body bg-white dark:bg-black text-black dark:text-zinc-300">
        <div className="flex flex-col h-screen">
          <NavigationBar />
          <main className="flex-grow">
            {children}
          </main>
          <footer className="mt-8 py-4 text-center">
            Copyright &copy; 2025 emef. All rights reserved.
          </footer>
        </div>
      </body>
    </html>
  );
}
