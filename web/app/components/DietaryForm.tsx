"use client";

import { useState } from "react";
import Button from "./ui/Button";

const ALLERGY_OPTIONS = [
  "Nötter", "Gluten", "Laktos", "Skaldjur", "Ägg", "Soja", "Fisk", "Selleri",
];

const DIETARY_TYPES = [
  { value: "none", label: "Inga restriktioner" },
  { value: "vegetarian", label: "Vegetarisk" },
  { value: "vegan", label: "Vegansk" },
  { value: "halal", label: "Halal" },
  { value: "kosher", label: "Kosher" },
  { value: "other", label: "Annat" },
];

type DietaryFormProps = {
  isPlusOne?: boolean;
  label?: string;
  onSave: (data: {
    is_plus_one: boolean;
    allergies: string[];
    dietary_type: string;
    other_notes: string;
  }) => Promise<void>;
};

export default function DietaryForm({ isPlusOne = false, label, onSave }: DietaryFormProps) {
  const [allergies, setAllergies] = useState<string[]>([]);
  const [dietaryType, setDietaryType] = useState("none");
  const [otherNotes, setOtherNotes] = useState("");
  const [saving, setSaving] = useState(false);

  function toggleAllergy(allergy: string) {
    setAllergies((prev) =>
      prev.includes(allergy) ? prev.filter((a) => a !== allergy) : [...prev, allergy]
    );
  }

  async function handleSave() {
    setSaving(true);
    await onSave({
      is_plus_one: isPlusOne,
      allergies,
      dietary_type: dietaryType,
      other_notes: otherNotes,
    });
    setSaving(false);
  }

  return (
    <div className="space-y-6">
      {label && (
        <h3 className="text-sm font-serif text-stone-900 dark:text-stone-100">{label}</h3>
      )}

      {/* Dietary type */}
      <div>
        <div className="text-[10px] tracking-[0.2em] uppercase font-medium text-stone-500 dark:text-stone-400 mb-2">
          Kostpreferens
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {DIETARY_TYPES.map((type) => (
            <button
              key={type.value}
              type="button"
              onClick={() => setDietaryType(type.value)}
              className={`px-3 py-2 text-xs transition-colors border ${
                dietaryType === type.value
                  ? "bg-stone-900 text-white border-stone-900 dark:bg-stone-100 dark:text-stone-900 dark:border-stone-100"
                  : "border-stone-300 dark:border-stone-700 text-stone-600 dark:text-stone-400 hover:bg-stone-100 dark:hover:bg-stone-800"
              }`}
            >
              {type.label}
            </button>
          ))}
        </div>
      </div>

      {/* Allergies */}
      <div>
        <div className="text-[10px] tracking-[0.2em] uppercase font-medium text-stone-500 dark:text-stone-400 mb-2">
          Allergier
        </div>
        <div className="flex flex-wrap gap-2">
          {ALLERGY_OPTIONS.map((allergy) => (
            <button
              key={allergy}
              type="button"
              onClick={() => toggleAllergy(allergy)}
              className={`px-3 py-1.5 text-xs transition-colors border ${
                allergies.includes(allergy)
                  ? "bg-red-600 text-white border-red-600 dark:bg-red-500 dark:border-red-500"
                  : "border-stone-300 dark:border-stone-700 text-stone-600 dark:text-stone-400 hover:bg-stone-100 dark:hover:bg-stone-800"
              }`}
            >
              {allergy}
            </button>
          ))}
        </div>
      </div>

      {/* Other notes */}
      <div>
        <div className="text-[10px] tracking-[0.2em] uppercase font-medium text-stone-500 dark:text-stone-400 mb-2">
          Övriga anteckningar
        </div>
        <textarea
          value={otherNotes}
          onChange={(e) => setOtherNotes(e.target.value)}
          placeholder="Annat vi behöver veta..."
          rows={3}
          className="w-full px-4 py-2.5 bg-white dark:bg-[#1a1918] border border-stone-300 dark:border-stone-700 text-stone-900 dark:text-stone-100 placeholder:text-stone-400 text-sm focus:outline-none focus:ring-2 focus:ring-stone-900 dark:focus:ring-stone-100 resize-none"
        />
      </div>

      <Button onClick={handleSave} loading={saving} size="md">
        Spara
      </Button>
    </div>
  );
}
