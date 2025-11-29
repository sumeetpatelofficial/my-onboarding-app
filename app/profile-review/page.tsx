"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { CheckCircle2, ArrowLeft, Pencil } from "lucide-react";

export default function ProfileReviewPage() {
  const router = useRouter();

  const [personal, setPersonal] = useState<any>(null);
  const [address, setAddress] = useState<any>(null);
  const [image, setImage] = useState<string | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem("onboarding-data");

    if (!saved) {
      router.push("/");
      return;
    }

    try {
      const data = JSON.parse(saved);

      // Validation
      if (!data.personal) return router.push("/");
      if (!data.address) return router.push("/address");
      if (!data.image) return router.push("/profile-image");

      setPersonal(data.personal);
      setAddress(data.address);
      setImage(data.image);
    } catch {
      router.push("/");
    }
  }, []);

  const finishOnboarding = () => {
    alert("🎉 Onboarding completed!");
    setTimeout(() => {
      router.push("/");
      localStorage.removeItem("onboarding-data");
      localStorage.removeItem("reached-review");
    }, 2000);
  };

  if (!personal || !address) return null;

  return (
    <div className="max-w-2xl p-8 space-y-10">
      <div className="flex items-center gap-3">
        <CheckCircle2 className="h-8 w-8 text-green-600" />
        <h1 className="text-2xl font-semibold">Review Your Profile</h1>
      </div>

      {/* PERSONAL INFO */}
      <section className="p-5 border rounded-lg bg-white shadow-sm relative">
        <div className="absolute top-4 right-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => router.push("/")}
            className="flex items-center gap-1"
          >
            <Pencil size={14} />
            Edit
          </Button>
        </div>

        <h2 className="font-semibold text-lg mb-4">Personal Information</h2>

        <div className="grid grid-cols-2 gap-4">
          <p>
            <strong>First Name:</strong> {personal.firstName}
          </p>
          <p>
            <strong>Last Name:</strong> {personal.lastName}
          </p>
          <p>
            <strong>Email:</strong> {personal.email}
          </p>
          <p>
            <strong>Phone:</strong> {personal.phone}
          </p>
          <p>
            <strong>Gender:</strong> {personal.gender}
          </p>
        </div>
      </section>

      {/* ADDRESS INFO */}
      <section className="p-5 border rounded-lg bg-white shadow-sm relative">
        <div className="absolute top-4 right-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => router.push("/address")}
            className="flex items-center gap-1"
          >
            <Pencil size={14} />
            Edit
          </Button>
        </div>

        <h2 className="font-semibold text-lg mb-4">Address Information</h2>

        <div className="grid grid-cols-2 gap-4">
          <p>
            <strong>Address Line 1:</strong> {address.line1}
          </p>
          <p>
            <strong>Address Line 2:</strong> {address.line2 || "---"}
          </p>
          <p>
            <strong>City:</strong> {address.city}
          </p>
          <p>
            <strong>State:</strong> {address.state}
          </p>
          <p>
            <strong>Country:</strong> {address.country}
          </p>
        </div>
      </section>

      {/* PROFILE IMAGE */}
      <section className="p-5 border rounded-lg bg-white shadow-sm relative">
        <div className="absolute top-4 right-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => router.push("/profile-image")}
            className="flex items-center gap-1"
          >
            <Pencil size={14} />
            Edit
          </Button>
        </div>

        <h2 className="font-semibold text-lg mb-4">Profile Image</h2>

        {image ? (
          <Image
            src={image}
            alt="Profile"
            width={140}
            height={140}
            className="rounded-lg border shadow-sm object-cover"
          />
        ) : (
          <p>No image uploaded.</p>
        )}
      </section>

      {/* ACTIONS
      <div className="flex justify-between mt-8">
        <Button
          onClick={finishOnboarding}
          className="bg-green-600 hover:bg-green-700"
        >
          Finish Onboarding
        </Button>
      </div> */}
    </div>
  );
}
