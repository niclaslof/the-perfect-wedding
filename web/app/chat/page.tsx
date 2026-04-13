import PageLayout from "@/app/components/ui/PageLayout";
import Hero from "@/app/components/ui/Hero";
import Section from "@/app/components/ui/Section";
import Card from "@/app/components/ui/Card";

export default function ChatPage() {
  return (
    <PageLayout maxWidth="max-w-4xl">
      <Hero
        eyebrow="Kommunikation"
        titleLine1="Chat"
        intro="Realtids-chat med andra bröllopsgäster."
      />
      <Section number="01" title="Meddelanden">
        <Card>
          <p className="text-stone-500 dark:text-stone-400 italic text-sm">
            Chat kopplas till Supabase Realtime i nästa fas.
          </p>
        </Card>
      </Section>
    </PageLayout>
  );
}
