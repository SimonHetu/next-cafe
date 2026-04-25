"use client";

import {
  Show,
  SignInButton,
  SignUpButton,
  UserButton,
  useUser,
} from "@clerk/nextjs";
import Link from "next/link";
import { useEffect, useState } from "react";
import { getCartCountAction } from "@/src/lib/cart/cart.actions";
import { getGuestCartCount } from "@/src/lib/cart/guest-cart";
import { usePathname } from "next/navigation";

function CartCount() {
  const { isSignedIn } = useUser();
  const [count, setCount] = useState(0);

  useEffect(() => {
    const updateCount = async () => {
      if (isSignedIn) {
        const c = await getCartCountAction();
        setCount(c);
      } else {
        setCount(getGuestCartCount());
      }
    };
    updateCount();

    const handler = () => updateCount();
    window.addEventListener("cart-updated", handler);
    window.addEventListener("guest-cart-updated", handler);
    return () => {
      window.removeEventListener("cart-updated", handler);
      window.removeEventListener("guest-cart-updated", handler);
    };
  }, [isSignedIn]);

  return (
    <Link
      href="/cart"
      className="text-base-content/60 hover:text-base-content transition-colors duration-200"
    >
      cart[{count}]
    </Link>
  );
}

export function Header() {
  const pathname = usePathname();
  const { user } = useUser();

  const promptUser = user?.firstName ?? user?.username ?? "guest";

  const navLink = (href: string, label: string) => {
    const active = pathname === href;
    return (
      <Link
        href={href}
        className={`transition-colors duration-200 ${active
          ? "text-base-content underline underline-offset-4 decoration-primary/50"
          : "text-base-content/60 hover:text-base-content"
          }`}
      >
        {label}
      </Link>
    );
  };

  return (
    <header className="sticky top-0 z-60 bg-base-100 border-b border-base-content/10 font-mono text-sm">
      <div className="flex items-center h-10 px-4 max-w-7xl mx-auto overflow-hidden">
        {/* Terminal prompt */}
        <Link href="/" className="flex items-center shrink-0 mr-6 group min-w-0">
          <span className="text-base truncate max-w-30">{promptUser}</span>
          <span className="text-base-content/30">@</span>
          <span className="text-base">kernel</span>
          <span className="inline-block w-2 h-4 bg-primary ml-1.5 animate-[blink_1s_step-end_infinite]" />
        </Link>

        {/* Commands */}
        <nav className="hidden md:flex items-center gap-4 shrink-0">
          {navLink("/", "cd ~")}
          {navLink("/products", "ls coffee")}
          <CartCount />
        </nav>

        {/* Right-side session commands */}
        <div className="ml-auto flex items-center gap-4 shrink-0">
          <Show when="signed-out">
            <SignInButton>
              <button className="text-base-content/60 hover:text-base-content transition-colors duration-200 cursor-pointer">
                ssh login
              </button>
            </SignInButton>
            <SignUpButton>
              <button className="text-base-content/60 hover:text-base-content transition-colors duration-200 cursor-pointer">
                adduser
              </button>
            </SignUpButton>
          </Show>
          <Show when="signed-in">
            <UserButton
              appearance={{
                elements: {
                  avatarBox: "w-6 h-6 rounded-none border border-primary/30",
                },
              }}
            />
          </Show>
        </div>
      </div>
    </header>
  );
}
