export default function Home() {
  return (
    <div className="mx-auto flex max-w-3xl flex-col items-center px-4 py-24 text-center">
      <h1 className="text-5xl font-bold tracking-tight sm:text-6xl">
        Välkommen till vårt bröllop
      </h1>
      <p className="mt-6 text-lg text-stone-600 dark:text-stone-400">
        Här hittar du all information, chat och allt annat du behöver inför den
        stora dagen.
      </p>
      <div className="mt-12 grid w-full gap-4 sm:grid-cols-2">
        {[
          {
            href: "/info",
            title: "Bröllopsinfo",
            desc: "Datum, plats, dresscode och schema",
          },
          {
            href: "/chat",
            title: "Chat",
            desc: "Prata med andra gäster i realtid",
          },
          {
            href: "/assistant",
            title: "AI Assistent",
            desc: "Fråga vår AI om bröllopet",
          },
          {
            href: "/guestbook",
            title: "Gästbok",
            desc: "Skriv en hälsning till brudparet",
          },
        ].map((card) => (
          <a
            key={card.href}
            href={card.href}
            className="rounded-2xl border border-stone-200 bg-white p-6 text-left transition-shadow hover:shadow-lg dark:border-stone-800 dark:bg-stone-900"
          >
            <h2 className="text-lg font-semibold">{card.title}</h2>
            <p className="mt-1 text-sm text-stone-500 dark:text-stone-400">
              {card.desc}
            </p>
          </a>
        ))}
      </div>
    </div>
  );
}
