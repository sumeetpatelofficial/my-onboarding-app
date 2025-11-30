"use client";

import { cn } from "@/lib/utils";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import {
  User,
  MapPin,
  UploadCloud,
  CheckCircle2,
  CreditCard,
} from "lucide-react";
import { Button } from "./ui/button";
import ProgressBar from "./ProgressBar";

const steps = [
  { name: "Personal Information", href: "/", key: "personal", icon: User },
  {
    name: "Address Information",
    href: "/address",
    key: "address",
    icon: MapPin,
  },
  { name: "Card Details", href: "/card-detail", key: "card", icon: CreditCard },
  {
    name: "Upload Image",
    href: "/profile-image",
    key: "image",
    icon: UploadCloud,
  },
  {
    name: "Complete",
    href: "/profile-review",
    key: "completed",
    icon: CheckCircle2,
  },
];

export function OnboardingProgress() {
  const pathname = usePathname();
  const router = useRouter();

  const [completedSteps, setCompletedSteps] = useState(0);

  useEffect(() => {
    const raw = localStorage.getItem("onboarding-data");
    const data = raw ? JSON.parse(raw) : {};

    let count = 0;

    // Step 1 – Personal
    if (data.personal && Object.keys(data.personal).length > 0) count++;

    // Step 2 – Address
    if (data.address && Object.keys(data.address).length > 0) count++;

    // Step 3 – Card
    if (data.cards && Array.isArray(data.cards) && data.cards.length > 0)
      count++;

    // Step 4 – Image
    if (data.image && data.image !== "") count++;

    // Step 5 – Completed (permanent once reached)
    const reachedReview = localStorage.getItem("reached-review") === "yes";

    if (pathname === "/profile-review") {
      localStorage.setItem("reached-review", "yes");
      count = 5;
    } else if (reachedReview) {
      count = 5; // 👈 prevents progress drop
    }

    setCompletedSteps(count);
  }, [pathname]);

  const progress = (completedSteps / steps.length) * 100;

  const handleStepClick = (idx: number, href: string) => {
    if (idx < completedSteps) {
      router.push(href);
    }
  };

  return (
    <div className="md:py-6">
      {/* <ProgressBar progress={progress} /> */}

      {/* Steps */}
      <ol className="flex justify-between md:justify-normal md:space-x-3 border-b">
        {steps.map((step, idx) => {
          const isActive = pathname === step.href;
          const isCompleted = idx < completedSteps;
          const isLocked = idx > completedSteps;
          const Icon = step.icon;

          return (
            <li key={idx} className="relative stepper md:pr-10 pr-5 last:pr-0">
              <Button
                variant="link"
                type="button"
                disabled={isLocked}
                onClick={() => handleStepClick(idx, step.href)}
                className={cn(
                  "w-full text-left flex items-center gap-3 transition-all rounded-none h-12 font-normal tracking-wide",
                  "hover:shadow-none disabled:hover:scale-100 disabled:hover:shadow-none hover:no-underline",
                  isCompleted &&
                    "border-b-2 border-green-500 text-green-700 cursor-pointer",
                  isActive &&
                    !isCompleted &&
                    "border-b-2 border-pink-400 text-salte-600",
                  !isCompleted &&
                    !isActive &&
                    "border-gray-200 bg-white text-gray-600",
                  isLocked && "cursor-not-allowed"
                )}
              >
                <Icon
                  size={20}
                  className={cn(
                    isCompleted
                      ? "text-green-600"
                      : isActive
                      ? "text-salte-600"
                      : "text-gray-500"
                  )}
                />
                <span className="hidden md:block">{step.name}</span>
              </Button>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
