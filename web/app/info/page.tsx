export default function InfoPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-16">
      <h1 className="text-3xl font-bold">Bröllopsinfo</h1>
      <p className="mt-4 text-stone-600 dark:text-stone-400">
        Här kommer all information om bröllopet — datum, plats, dresscode,
        schema och praktiska detaljer.
      </p>
      <div className="mt-8 rounded-2xl border border-stone-200 bg-white p-8 dark:border-stone-800 dark:bg-stone-900">
        <p className="text-stone-500 dark:text-stone-400 italic">
          Detaljer kommer snart...
        </p>
      </div>
    </div>
  );
}
