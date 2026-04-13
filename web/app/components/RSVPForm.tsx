"use client";

import { useState } from "react";
import Card from "./ui/Card";
import Button from "./ui/Button";
import DietaryForm from "./DietaryForm";

type RSVPFormProps = {
  plusOneAllowed: boolean;
  onSubmit: (data: {
    attending: boolean;
    plus_one_attending: boolean;
    plus_one_name: string;
    message: string;
  }) => Promise<void>;
  onDietarySave: (data: {
    is_plus_one: boolean;
    allergies: string[];
    dietary_type: string;
    other_notes: string;
  }) => Promise<void>;
};

type Step = "attending" | "dietary" | "plusone" | "message" | "done";

export default function RSVPForm({ plusOneAllowed, onSubmit, onDietarySave }: RSVPFormProps) {
  const [step, setStep] = useState<Step>("attending");
  const [attending, setAttending] = useState<boolean | null>(null);
  const [plusOneAttending, setPlusOneAttending] = useState(false);
  const [plusOneName, setPlusOneName] = useState("");
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function handleFinalSubmit() {
    if (attending === null) return;
    setSubmitting(true);
    await onSubmit({
      attending,
      plus_one_attending: plusOneAttending,
      plus_one_name: plusOneName,
      message,
    });
    setSubmitting(false);
    setStep("done");
  }

  return (
    <div className="space-y-6">
      {/* Step 1: Attending? */}
      {step === "attending" && (
        <Card variant="emphasis" size="lg">
          <div className="text-center space-y-6">
            <h3 className="text-xl font-serif text-stone-900 dark:text-stone-100">
              Kommer du på bröllopet?
            </h3>
            <div className="flex gap-4 justify-center">
              <Button
                size="lg"
                variant={attending === true ? "primary" : "secondary"}
                onClick={() => setAttending(true)}
              >
                Ja, jag kommer!
              </Button>
              <Button
                size="lg"
                variant={attending === false ? "primary" : "secondary"}
                onClick={() => setAttending(false)}
              >
                Tyvärr inte
              </Button>
            </div>
            {attending !== null && (
              <Button
                variant="ghost"
                onClick={() => {
                  if (attending) {
                    setStep("dietary");
                  } else {
                    setStep("message");
                  }
                }}
              >
                Nästa &rarr;
              </Button>
            )}
          </div>
        </Card>
      )}

      {/* Step 2: Dietary preferences */}
      {step === "dietary" && (
        <Card size="lg">
          <div className="space-y-4">
            <h3 className="text-lg font-serif text-stone-900 dark:text-stone-100">
              Matpreferenser
            </h3>
            <DietaryForm
              label="Dina matpreferenser"
              onSave={async (data) => {
                await onDietarySave(data);
                if (plusOneAllowed) {
                  setStep("plusone");
                } else {
                  setStep("message");
                }
              }}
            />
          </div>
        </Card>
      )}

      {/* Step 3: Plus one */}
      {step === "plusone" && (
        <Card size="lg">
          <div className="space-y-6">
            <h3 className="text-lg font-serif text-stone-900 dark:text-stone-100">
              Tar du med en partner?
            </h3>
            <div className="flex gap-4">
              <Button
                variant={plusOneAttending ? "primary" : "secondary"}
                onClick={() => setPlusOneAttending(true)}
              >
                Ja
              </Button>
              <Button
                variant={!plusOneAttending ? "primary" : "secondary"}
                onClick={() => setPlusOneAttending(false)}
              >
                Nej
              </Button>
            </div>
            {plusOneAttending && (
              <div className="space-y-4">
                <div>
                  <div className="text-[10px] tracking-[0.2em] uppercase font-medium text-stone-500 dark:text-stone-400 mb-1.5">
                    Partnerns namn
                  </div>
                  <input
                    type="text"
                    value={plusOneName}
                    onChange={(e) => setPlusOneName(e.target.value)}
                    placeholder="Namn..."
                    className="w-full px-4 py-2.5 bg-white dark:bg-[#1a1918] border border-stone-300 dark:border-stone-700 text-stone-900 dark:text-stone-100 text-sm focus:outline-none focus:ring-2 focus:ring-stone-900 dark:focus:ring-stone-100"
                  />
                </div>
                <DietaryForm
                  isPlusOne
                  label="Partnerns matpreferenser"
                  onSave={async (data) => {
                    await onDietarySave(data);
                    setStep("message");
                  }}
                />
              </div>
            )}
            {!plusOneAttending && (
              <Button variant="ghost" onClick={() => setStep("message")}>
                Nästa &rarr;
              </Button>
            )}
          </div>
        </Card>
      )}

      {/* Step 4: Message */}
      {step === "message" && (
        <Card size="lg">
          <div className="space-y-4">
            <h3 className="text-lg font-serif text-stone-900 dark:text-stone-100">
              {attending ? "Något du vill säga?" : "Vill du skicka en hälsning?"}
            </h3>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Valfritt meddelande till brudparet..."
              rows={4}
              className="w-full px-4 py-2.5 bg-white dark:bg-[#1a1918] border border-stone-300 dark:border-stone-700 text-stone-900 dark:text-stone-100 placeholder:text-stone-400 text-sm focus:outline-none focus:ring-2 focus:ring-stone-900 dark:focus:ring-stone-100 resize-none"
            />
            <Button onClick={handleFinalSubmit} loading={submitting} size="lg">
              Skicka OSA
            </Button>
          </div>
        </Card>
      )}

      {/* Done */}
      {step === "done" && (
        <Card variant={attending ? "subtle" : "default"} size="lg">
          <div className="text-center space-y-3">
            <div className="text-3xl">{attending ? "🎉" : "💌"}</div>
            <h3 className="text-lg font-serif text-stone-900 dark:text-stone-100">
              {attending ? "Tack! Vi ses där!" : "Tack för ditt svar!"}
            </h3>
            <p className="text-sm text-stone-500 dark:text-stone-400">
              {attending
                ? "Du hittar mer detaljerad information under Info-sidan nu."
                : "Vi hoppas vi ses en annan gång."}
            </p>
          </div>
        </Card>
      )}
    </div>
  );
}
