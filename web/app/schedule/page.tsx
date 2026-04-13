import PageLayout from "@/app/components/ui/PageLayout";
import Hero from "@/app/components/ui/Hero";
import Section from "@/app/components/ui/Section";
import Card from "@/app/components/ui/Card";

export default function SchedulePage() {
  return (
    <PageLayout maxWidth="max-w-4xl">
      <Hero
        eyebrow="Program"
        titleLine1="Schema"
        intro="Hela programmet för bröllopsdagen."
      />
      <Section number="01" title="Programpunkter">
        <Card>
          <p className="text-stone-500 dark:text-stone-400 italic text-sm">
            Interaktivt schema med talförfrågningar kommer i fas 4.
          </p>
        </Card>
      </Section>
    </PageLayout>
  );
}
