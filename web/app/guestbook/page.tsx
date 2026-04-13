import PageLayout from "@/app/components/ui/PageLayout";
import Hero from "@/app/components/ui/Hero";
import Section from "@/app/components/ui/Section";
import Card from "@/app/components/ui/Card";

export default function GuestbookPage() {
  return (
    <PageLayout maxWidth="max-w-4xl">
      <Hero
        eyebrow="Hälsningar"
        titleLine1="Gästbok"
        intro="Skriv en hälsning till brudparet."
      />
      <Section number="01" title="Hälsningar">
        <Card>
          <p className="text-stone-500 dark:text-stone-400 italic text-sm">
            Gästbok med svarsförmåga kommer snart.
          </p>
        </Card>
      </Section>
    </PageLayout>
  );
}
