'use client'

import React, { useRef, useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ContactModal } from '@components/client';

export default function NavigationBar() {
  const pathname = usePathname();
  const modalRef = useRef<HTMLDialogElement>(null);
  const [isMounted, setIsMounted] = React.useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null; // Prevents hydration mismatch
  }

  return (
    <nav>
      <div className="flex justify-end pl-4 pr-4 pt-2">
        {pathname !== '/' && (
          <Link href="/" className="rounded-md px-3 py-2 text-sm font-medium text-gray-300 hover:bg-gray-700 hover:text-white">Home</Link>
        )}
        <Link href="/about" className="rounded-md px-3 py-2 text-sm font-medium text-gray-300 hover:bg-gray-700 hover:text-white">About</Link>
        <a href="#" onClick={() => modalRef.current?.showModal()} className="rounded-md px-3 py-2 text-sm font-medium text-gray-300 hover:bg-gray-700 hover:text-white">Contact</a>
      </div>
      <ContactModal modalRef={modalRef} />
    </nav>
  );
};
