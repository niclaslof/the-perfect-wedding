import PageLayout from "@/app/components/ui/PageLayout";
import Hero from "@/app/components/ui/Hero";
import Section from "@/app/components/ui/Section";
import Card from "@/app/components/ui/Card";

export default function PhotosPage() {
  return (
    <PageLayout maxWidth="max-w-4xl">
      <Hero
        eyebrow="Minnen"
        titleLine1="Foton"
        intro="Dela och bläddra bland bröllopsfoton."
      />
      <Section number="01" title="Galleri">
        <Card>
          <p className="text-stone-500 dark:text-stone-400 italic text-sm">
            Fotogalleri med uppladdning kommer i fas 6.
          </p>
        </Card>
      </Section>
    </PageLayout>
  );
}
