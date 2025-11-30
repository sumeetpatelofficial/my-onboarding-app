"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getOnboarding } from "@/lib/onboarding-storage";
import Link from "next/link";
import { usePathname } from "next/navigation";

const navigation = [
  {
    title: "Home",
    path: "/",
  },
  {
    title: "Payment",
    path: "#",
  },
  {
    title: "Contact",
    path: "#",
  },
];

const Header = () => {
  const [useImage, setUserImage] = useState<string | undefined>(undefined);
  const currentPath = usePathname();
  const isActive = (path: string) => currentPath === path;

  useEffect(() => {
    const load = () => {
      const data = getOnboarding();
      setUserImage(data?.image);
    };

    load();

    // 🔥 react to changes
    window.addEventListener("onboarding-updated", load);
    return () => window.removeEventListener("onboarding-updated", load);
  }, []);

  return (
    <header className="bg-white min-h-16 shadow-md flex items-center sticky top-0 z-10">
      <div className="container mx-auto px-3 md:px-0">
        <div className="flex items-center justify-between">
          <Image src="/logo.svg" width={48} height={48} alt="logo" />
          <div className="md:flex items-center mx-auto hidden">
            {navigation.map((navLink, i) => (
              <Link
                key={i}
                href={navLink.path}
                className={`relative text-sm px-8 py-5 after:absolute after:block after:h-1 after:bg-sky-400 after:w-full after:bottom-0 after:left-0 after:rounded-t-lg hover:after:block ${
                  isActive(navLink.path)
                    ? "text-slate-800"
                    : "text-slate-400 after:hidden"
                }`}
              >
                {navLink.title}
              </Link>
            ))}
          </div>
          <Avatar className="size-10">
            <AvatarImage src={useImage || "https://github.com/shadcn.png"} />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
        </div>
      </div>
    </header>
  );
};

export default Header;
