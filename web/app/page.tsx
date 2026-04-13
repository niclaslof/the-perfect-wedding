import PageLayout from "./components/ui/PageLayout";
import Hero from "./components/ui/Hero";
import Section from "./components/ui/Section";
import Card from "./components/ui/Card";

export default function Home() {
  return (
    <PageLayout maxWidth="max-w-4xl">
      <Hero
        eyebrow="Välkommen"
        titleLine1="The Perfect"
        titleLine2="Wedding"
        intro="Er digitala guide till bröllopet. Här hittar ni all information, kan chatta med andra gäster, skriva i gästboken och mycket mer."
      />

      <Section number="01" title="Ange din kod">
        <Card variant="emphasis" size="lg">
          <div className="text-center">
            <p className="text-sm text-stone-600 dark:text-stone-300 mb-6">
              Ange din personliga inbjudningskod för att komma åt all information om bröllopet.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 max-w-sm mx-auto">
              <input
                type="text"
                placeholder="Din kod..."
                className="flex-1 px-4 py-3 bg-white dark:bg-[#0f0f0e] border border-stone-300 dark:border-stone-700 text-center font-mono text-lg tracking-[0.3em] uppercase text-stone-900 dark:text-stone-100 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-stone-900 dark:focus:ring-stone-100"
                maxLength={8}
              />
              <button className="px-6 py-3 bg-stone-900 text-white dark:bg-stone-100 dark:text-stone-900 text-xs tracking-[0.15em] uppercase font-medium hover:bg-stone-800 dark:hover:bg-stone-200 transition-colors">
                Logga in
              </button>
            </div>
            <p className="text-[10px] tracking-[0.15em] uppercase text-stone-400 dark:text-stone-500 mt-4">
              Koden finns i din inbjudan
            </p>
          </div>
        </Card>
      </Section>

      <Section number="02" title="Vad du hittar här">
        <div className="grid gap-4 sm:grid-cols-2">
          {[
            {
              title: "Bröllopsinfo",
              desc: "Datum, plats, dresscode, schema och alla praktiska detaljer",
              icon: "I",
            },
            {
              title: "Realtids-Chat",
              desc: "Prata med andra gäster och ställ frågor",
              icon: "C",
            },
            {
              title: "Gästbok",
              desc: "Skriv en hälsning till brudparet",
              icon: "G",
            },
            {
              title: "Foton",
              desc: "Dela och bläddra bland bröllopsfoton",
              icon: "F",
            },
            {
              title: "Schema",
              desc: "Se hela programmet och anmäl tal",
              icon: "S",
            },
            {
              title: "AI Assistent",
              desc: "Fråga vår AI om bröllopet",
              icon: "A",
            },
          ].map((card) => (
            <Card key={card.title} size="sm" hover>
              <div className="flex items-start gap-4">
                <div className="w-8 h-8 border border-stone-300 dark:border-stone-700 flex items-center justify-center shrink-0">
                  <span className="text-xs font-mono text-stone-500 dark:text-stone-400">
                    {card.icon}
                  </span>
                </div>
                <div>
                  <h3 className="font-serif text-stone-900 dark:text-stone-100">
                    {card.title}
                  </h3>
                  <p className="mt-1 text-xs text-stone-500 dark:text-stone-400 leading-relaxed">
                    {card.desc}
                  </p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </Section>
    </PageLayout>
  );
}
