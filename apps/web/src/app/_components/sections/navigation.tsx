'use client';

import { useState } from 'react';
import { Menu, X } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

export const NavigationHeader = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50 text-black">
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex-shrink-0">
            <Image
              src="/isologo-black.png"
              alt="DoryAI Logo"
              width={599}
              height={167}
              sizes="120px"
              className="h-auto w-[120px]"
            />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link
              href="/how-it-works"
              className="text-base font-medium hover:underline underline-offset-4"
            >
              How it works
            </Link>
            <Link
              href="/about"
              className="text-base font-medium hover:underline underline-offset-4"
            >
              About
            </Link>
            <Link
              href="/#pricing"
              className="text-base font-medium text-dark-text hover:text-primary transition-colors duration-150 ease-in-out"
            >
              Pricing
            </Link>
          </nav>

          {/* Login - Desktop */}
          <div className="hidden md:block">
            <Link
              href="/sign-in"
              className="inline-flex items-center px-6 py-3 bg-[#EA64D3] text-black text-base font-medium rounded-md hover:bg-pink-300 transition-colors duration-150 ease-in-out"
            >
              Login
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={toggleMobileMenu}
            className="md:hidden p-2 rounded-md text-dark-text hover:text-primary transition-colors duration-150 ease-in-out"
            aria-label="Toggle mobile menu"
            aria-expanded={isMobileMenuOpen}
            aria-controls="mobile-navigation"
          >
            {isMobileMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="md:hidden mt-4 pb-4 border-t border-light-background">
            <nav
              id="mobile-navigation"
              className="flex flex-col space-y-4 pt-4"
            >
              <Link
                href="/how-it-works"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                How it works
              </Link>
              <Link href="/about" onClick={() => setIsMobileMenuOpen(false)}>
                About
              </Link>
              <Link
                href="/#features"
                className="text-base font-medium text-dark-text hover:text-primary transition-colors duration-150 ease-in-out"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Features
              </Link>
              <Link
                href="/#pricing"
                className="text-base font-medium text-dark-text hover:text-primary transition-colors duration-150 ease-in-out"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Pricing
              </Link>
              <a
                href="mailto:nmamanipantoja@gmail.com"
                className="text-base font-medium text-dark-text hover:text-primary transition-colors duration-150 ease-in-out"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Contact
              </a>
              <Link
                href="/sign-in"
                className="inline-flex items-center px-6 py-3 bg-[#EA64D3] text-black text-base font-medium rounded-md hover:bg-pink-300 transition-colors duration-150 ease-in-out"
              >
                Login
              </Link>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};
