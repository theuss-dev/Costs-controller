"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, PlusCircle, User } from "lucide-react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export default function BottomNav() {
  const pathname = usePathname();

  const hiddenRoutes = ["/login", "/signup", "/onboarding"];
  if (hiddenRoutes.includes(pathname)) return null;

  const links = [
    { name: "Home",    href: "/",       icon: Home        },
    { name: "Add",     href: "/add",    icon: PlusCircle  },
    { name: "Perfil",  href: "/profile",icon: User        },
  ];

  return (
    <div className="fixed bottom-0 w-full max-w-md bg-black/95 backdrop-blur-xl border-t border-white/5 pb-safe pt-2 px-6 z-50">
      <div className="flex justify-between items-center h-16">
        {links.map((link) => {
          const isActive = pathname === link.href;
          const Icon = link.icon;

          return (
            <Link
              key={link.name}
              href={link.href}
              className="flex flex-col items-center justify-center w-16 gap-1 group touch-manipulation"
              aria-label={link.name}
            >
              <div
                className={cn(
                  "flex items-center justify-center rounded-2xl transition-all duration-300",
                  isActive
                    ? "text-orange-500 drop-shadow-[0_0_10px_rgba(249,115,22,0.5)]"
                    : "text-neutral-500 hover:text-neutral-300"
                )}
              >
                <Icon
                  strokeWidth={isActive ? 2 : 1.5}
                  size={24}
                  className="transition-all duration-300"
                />
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
