"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { imageSchema, ImageInfo } from "@/lib/schemas";
import { useRouter } from "next/navigation";
import { useState, useEffect, useRef, useCallback } from "react";
import { getOnboarding, saveOnboarding } from "@/lib/onboarding-storage";

import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";

import { Button } from "@/components/ui/button";
import { UploadCloud, X } from "lucide-react";

import Cropper from "react-easy-crop";
import getCroppedImg from "@/lib/cropImage";

export function ImageForm() {
  const router = useRouter();
  const onboarding = getOnboarding();
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [preview, setPreview] = useState<string | null>(
    onboarding.image || null
  );
  const [dragActive, setDragActive] = useState(false);

  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<any>(null);
  const [cropping, setCropping] = useState(false);

  useEffect(() => {
    if (!onboarding.address) router.push("/address");
  }, []);

  const form = useForm<ImageInfo>({
    resolver: zodResolver(imageSchema),
  });

  const handleFileUpload = (file: File, fieldOnChange: any) => {
    if (!file) return;
    const url = URL.createObjectURL(file);
    setImageSrc(url);
    setCropping(true);
    fieldOnChange(file);
  };

  const onCropComplete = useCallback((_: any, area: any) => {
    setCroppedAreaPixels(area);
  }, []);

  const applyCrop = async () => {
    if (!imageSrc || !croppedAreaPixels) return;

    const croppedBlob = await getCroppedImg(imageSrc, croppedAreaPixels);
    const reader = new FileReader();

    reader.onload = () => {
      const base64 = reader.result as string;
      saveOnboarding({ image: base64 });
      setPreview(base64);
    };

    reader.readAsDataURL(croppedBlob);
    setCropping(false);
  };

  function onSubmit() {
    router.push("/profile-review");
  }

  return (
    <Form {...form}>
      <form
        onSubmit={(e) => {
          e.preventDefault();

          // If preview exists → bypass validation completely
          if (preview) {
            saveOnboarding({ image: preview });
            router.push("/profile-review");
            return;
          }

          // Otherwise validate the file normally
          form.handleSubmit(onSubmit)(e);
        }}
        className="space-y-6 max-w-xl"
      >
        <FormField
          control={form.control}
          name="file"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                {/* Wrap in single child */}
                <div className="flex flex-col">
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    ref={fileInputRef}
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      handleFileUpload(file!, field.onChange);
                    }}
                  />

                  <div
                    onDragOver={(e) => {
                      e.preventDefault();
                      setDragActive(true);
                    }}
                    onDragLeave={() => setDragActive(false)}
                    onDrop={(e) => {
                      e.preventDefault();
                      setDragActive(false);
                      const file = e.dataTransfer.files?.[0];
                      handleFileUpload(file!, field.onChange);
                    }}
                    onClick={() => fileInputRef.current?.click()}
                    className={`border-2 border-dashed rounded-lg p-8 flex flex-col items-center justify-center cursor-pointer transition
                      ${
                        dragActive
                          ? "border-blue-500 bg-blue-50"
                          : "border-gray-300 bg-gray-50 hover:bg-gray-100"
                      }`}
                  >
                    <UploadCloud className="h-10 w-10 text-gray-500 mb-3" />
                    <p className="text-gray-700 font-medium">
                      Drag & drop an image here
                    </p>
                    <p className="text-gray-500 text-sm mt-1">
                      or click to select a file
                    </p>
                  </div>
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {preview && (
          <div className="mt-4 relative w-40 h-40">
            <img
              src={preview}
              alt="Preview"
              className="w-40 h-40 rounded-full object-cover border shadow-sm"
            />
            <button
              type="button"
              className="absolute top-1 right-4 p-1 rounded-full bg-red-100 hover:bg-red-200 text-red-600"
              onClick={() => setPreview(null)}
            >
              <X size={16} />
            </button>
          </div>
        )}

        {cropping && imageSrc && (
          <>
            <div className="relative bg-black bg-opacity-50 w-96 h-96 flex items-center justify-center rounded-lg overflow-hidden">
              <div className="relative bg-white p-4  w-96 h-96 flex flex-col">
                <>
                  <Cropper
                    image={imageSrc}
                    crop={crop}
                    zoom={zoom}
                    aspect={1}
                    onCropChange={setCrop}
                    onZoomChange={setZoom}
                    onCropComplete={onCropComplete}
                  />
                </>
              </div>
            </div>
            <div className="mt-4 flex space-x-2 z-50">
              <Button
                type="button"
                variant="outline"
                onClick={() => setCropping(false)}
              >
                Cancel
              </Button>
              <Button type="button" onClick={applyCrop}>
                Apply
              </Button>
            </div>
          </>
        )}

        <Button
          type="submit"
          className="bg-green-500 hover:bg-green-600 px-8 h-12 rounded-sm mt-15 text-white font-semibold"
        >
          Finish onboarding
        </Button>
      </form>
    </Form>
  );
}
