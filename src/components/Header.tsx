import { Show, SignInButton, SignUpButton, UserButton } from '@clerk/nextjs'
import Link from "next/link";

export function Header() {
  return (
    <header className="flex justify-end items-center p-4 gap-4 h-16">
      <Show when="signed-out">
        <SignInButton>
          {/*   <button className="bg-purple-700 text-white rounded-full font-medium text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 cursor-pointer"> */}
          {/*     Connexion */}
          {/*   </button> */}
        </SignInButton>
        <SignUpButton>
          {/*   <button className="bg-purple-700 text-white rounded-full font-medium text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 cursor-pointer"> */}
          {/*     Inscription */}
          {/*   </button> */}
        </SignUpButton>
      </Show>
      <Show when="signed-in">
        <UserButton />
      </Show>
    </header>
  );
}
