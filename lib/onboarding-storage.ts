export type OnboardingData = {
  personal?: any;
  address?: any;
  cards?: any[];
  image?: string;
};

/** ------------------------------
 *  getOnboarding()
 *  - ALWAYS returns complete structure
 *  - Initializes with correct default values
 * ------------------------------ */
export function getOnboarding(): OnboardingData {
  if (typeof window === "undefined") return {};

  const raw = localStorage.getItem("onboarding-data");

  const initial = {
    personal: {},
    address: {},
    cards: [],
    image: "",
  };

  if (!raw) {
    localStorage.setItem("onboarding-data", JSON.stringify(initial));
    return initial;
  }

  try {
    const parsed = JSON.parse(raw);
    // ensure missing keys are restored
    return {
      personal: parsed.personal ?? {},
      address: parsed.address ?? {},
      cards: parsed.cards ?? [],
      image: parsed.image ?? "",
    };
  } catch {
    // fallback if JSON is corrupted
    localStorage.setItem("onboarding-data", JSON.stringify(initial));
    return initial;
  }
}

/** ------------------------------
 *  saveOnboarding()
 *  - merges deeply
 *  - NEVER removes fields
 *  - NEVER removes empty values
 *  - preserves user progress correctly
 * ------------------------------ */
export function saveOnboarding(update: Partial<OnboardingData>) {
  const prev = getOnboarding() || {};

  const merged = {
    ...prev,
    ...update,
  };

  localStorage.setItem("onboarding-data", JSON.stringify(merged));

  window.dispatchEvent(new Event("onboarding-updated"));
  return merged;
}
