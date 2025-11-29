"use client";

import { useEffect, useMemo, useState, useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { getOnboarding, saveOnboarding } from "@/lib/onboarding-storage";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import useEmblaCarousel from "embla-carousel-react";
import { fullSchema, singleCardSchema } from "@/lib/schemas";
import {
  formatCardNumberForDisplay,
  formatExpiryForDisplay,
  getCardBrand,
  maskCardNumber,
  maskCVV,
} from "@/lib/utils";
import { X } from "lucide-react";

/* ---------- Component ---------- */
const CardDetailsForm = () => {
  const router = useRouter();
  const saved = getOnboarding() || {};
  const [mainEmblaRef, mainEmblaApi] = useEmblaCarousel({ loop: false });
  const tweenFactor = useRef(0);
  const form = useForm({
    resolver: zodResolver(fullSchema),
    defaultValues: {
      cards: saved.cards || [],
      newCard: {
        nameOnCard: "",
        cardNumber: "",
        expiryDate: "",
        cvv: "",
      },
    },
  });

  const [cvvFocus, setCvvFocus] = useState(false);

  useEffect(() => {
    if (!saved.address) router.push("/address");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const cards = form.watch("cards") || [];
  const newCard = form.watch("newCard") || {};

  /* ---------- Add card (from single form) ---------- */
  const handleAddCard = () => {
    try {
      singleCardSchema.parse(newCard);
    } catch (err) {
      form.trigger("newCard.nameOnCard");
      form.trigger("newCard.cardNumber");
      form.trigger("newCard.expiryDate");
      form.trigger("newCard.cvv");
      return;
    }

    const formattedExpiry =
      newCard?.expiryDate?.length === 4
        ? formatExpiryForDisplay(newCard.expiryDate)
        : newCard.expiryDate;

    const current = form.getValues()?.cards || [];
    const updated = [...current, { ...newCard, expiryDate: formattedExpiry }];

    form.setValue("cards", updated, { shouldDirty: true, shouldTouch: true });
    saveOnboarding({ cards: updated });

    form.setValue("newCard", {
      nameOnCard: "",
      cardNumber: "",
      expiryDate: "",
      cvv: "",
    });
  };

  /* ---------- Remove card ---------- */
  const handleRemove = (index: any) => {
    const current = form.getValues()?.cards || [];
    const updated = current.filter((_, i) => i !== index);
    form.setValue("cards", updated);
    saveOnboarding({ cards: updated });
  };

  const onSubmit = (values: any) => {
    const cardsToSave = values.cards || [];

    saveOnboarding({ cards: cardsToSave });

    // clear newCard so it doesn't trigger validation
    form.setValue("newCard", {
      nameOnCard: "",
      cardNumber: "",
      expiryDate: "",
      cvv: "",
    });

    router.push("/profile-review");
  };

  return (
    <div className="max-w-3xl space-y-6">
      <div className="overflow-hidden w-[400px]" ref={mainEmblaRef}>
        <div className="flex gap-6 items-start">
          <AnimatePresence>
            {cards &&
              cards.map((c, i) => (
                <motion.div
                  key={i}
                  layout
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="relative w-80 h-52 rounded-md overflow-hidden flex-[0_0_100%]"
                >
                  <div className="absolute inset-0 bg-linear-to-br from-purple-400 to-purple-800 backdrop-blur-md border border-purple/10 p-4 flex flex-col justify-between text-white">
                    <div className="flex items-center justify-between">
                      <div className="text-xs uppercase tracking-widest opacity-80">
                        {getCardBrand(c?.cardNumber || "").toUpperCase()}
                      </div>
                      <button
                        type="button"
                        className="absolute top-1 right-1 p-1 rounded-full bg-white/10 hover:bg-white/30 text-white"
                        onClick={() => handleRemove(i)}
                      >
                        <X size={14} />
                      </button>
                    </div>
                    <div className="mt-2">
                      <div className="text-md tracking-wider uppercase mb-1 font-semibold">
                        {c.nameOnCard}
                      </div>
                      <div className="text-md tracking-widest">
                        {maskCardNumber(c.cardNumber)}
                      </div>
                    </div>
                    <div className="flex justify-between text-sm opacity-90 gap-4">
                      <div>
                        <div className="text-md">Expiry</div>
                        <div className="font-medium">{c.expiryDate}</div>
                      </div>
                      <div>
                        <div className="text-md">CVV</div>
                        <div className="font-medium">{maskCVV(c.cvv)}</div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
          </AnimatePresence>
        </div>
      </div>

      <hr className="my-10" />
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-1 gap-4">
            <FormField
              control={form.control}
              name="newCard.nameOnCard"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name on Card</FormLabel>
                  <FormControl>
                    <Input placeholder="John Doe" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="newCard.cardNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Card Number</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="1234 5678 9012 3456"
                      value={formatCardNumberForDisplay(field.value)}
                      onChange={(e) => {
                        const raw = e.target.value.replace(/[^0-9]/g, "");
                        field.onChange(raw);
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="newCard.expiryDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Expiry (MM/YY)</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="07/28"
                        value={field.value}
                        onChange={(e) => {
                          const raw = e.target.value
                            .replace(/[^0-9]/g, "")
                            .slice(0, 4);
                          const formatted = formatExpiryForDisplay(raw);
                          field.onChange(formatted); // <-- stores “07/28”
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="newCard.cvv"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>CVV</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="***"
                        value={cvvFocus ? field.value : "***"}
                        onFocus={() => setCvvFocus(true)}
                        onBlur={() => setCvvFocus(false)}
                        onChange={(e) => {
                          const raw = e.target.value
                            .replace(/[^0-9]/g, "")
                            .slice(0, 4);
                          field.onChange(raw);
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>

          <div className="gap-3">
            <Button type="button" className="flex-1" onClick={handleAddCard}>
              + Add Card
            </Button>
          </div>
          <Button
            type="submit"
            className="flex-1 bg-green-500 hover:bg-green-600 px-8 h-12 rounded-sm mt-15 text-white font-semibold"
          >
            Continue to profile image
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default CardDetailsForm;
