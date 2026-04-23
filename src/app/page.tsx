import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-[calc(100vh-4rem)]">

      {/* Hero — parchment paper feel with a soft dashed border accent */}
      <section className="py-20 px-6 text-center relative overflow-hidden"
               style={{ background: "linear-gradient(160deg, #f5f0e8 0%, #ede7d9 60%, #e8dfd0 100%)" }}>
        {/* Decorative ruled lines in the background */}
        <div className="absolute inset-0 pointer-events-none"
             style={{ backgroundImage: "repeating-linear-gradient(transparent, transparent 31px, #D9D0C0 31px, #D9D0C0 32px)", opacity: 0.35 }} />

        <div className="relative max-w-2xl mx-auto">
          <div className="mb-4 flex justify-center">
            <span className="sticker text-5xl" style={{ width: "5rem", height: "5rem", fontSize: "2.5rem" }}>🍼</span>
          </div>
          <h1 className="text-6xl md:text-7xl font-bold leading-tight text-ink mb-4"
              style={{ fontFamily: "var(--font-caveat), cursive" }}>
            Track every feed,
            <br />
            <span className="text-primary" style={{ textDecoration: "underline", textDecorationStyle: "wavy", textDecorationColor: "#E8A0B4", textUnderlineOffset: "4px" }}>every diaper,</span>
            <br />
            every moment.
          </h1>
          <p className="py-4 text-base text-ink-faint max-w-lg mx-auto leading-relaxed"
             style={{ fontFamily: "var(--font-nunito), sans-serif" }}>
            BabyLog makes it effortless to log feedings, diaper changes, and
            spot patterns in your baby&apos;s routine &mdash; so you can focus on
            what matters most.
          </p>
          <div className="flex gap-4 justify-center flex-wrap mt-2">
            <Link href="/log"
                  className="btn btn-primary btn-lg btn-stamp"
                  style={{ fontFamily: "var(--font-caveat), cursive", fontSize: "1.2rem", letterSpacing: "0.03em" }}>
              Start Logging
            </Link>
            <Link href="/analytics"
                  className="btn btn-outline btn-lg btn-stamp"
                  style={{ fontFamily: "var(--font-caveat), cursive", fontSize: "1.2rem", letterSpacing: "0.03em", borderColor: "#B8AEDD", color: "#251645" }}>
              View Analytics
            </Link>
          </div>
        </div>
      </section>

      {/* Features — scrapbook cards on paper background */}
      <section className="py-16 px-6" style={{ backgroundColor: "#EDE7D9" }}>
        <div className="max-w-5xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-2 text-ink"
              style={{ fontFamily: "var(--font-caveat), cursive" }}>
            Everything you need, nothing you don&apos;t
          </h2>
          {/* Pencil underline decoration */}
          <div className="flex justify-center mb-10">
            <div className="h-0.5 w-32 rounded-full" style={{ backgroundColor: "#D9D0C0" }} />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

            {/* Card 1 */}
            <div className="card-scrapbook p-6 flex flex-col items-center text-center gap-3 relative">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-6 h-6 rounded-full bg-dusty-rose border-2 border-white shadow-sm" />
              <span className="sticker text-4xl mt-2" style={{ width: "3.5rem", height: "3.5rem", fontSize: "2rem", backgroundColor: "#fff0f5" }}>🍼</span>
              <h3 className="text-2xl font-bold text-ink" style={{ fontFamily: "var(--font-caveat), cursive" }}>Feeding Tracker</h3>
              <p className="text-sm text-ink-faint leading-relaxed" style={{ fontFamily: "var(--font-nunito), sans-serif" }}>
                Log breast or bottle feedings with side, duration, and amount.
                All fields are optional &mdash; log what you need.
              </p>
            </div>

            {/* Card 2 */}
            <div className="card-scrapbook p-6 flex flex-col items-center text-center gap-3 relative">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-6 h-6 rounded-full bg-lavender border-2 border-white shadow-sm" />
              <span className="sticker text-4xl mt-2" style={{ width: "3.5rem", height: "3.5rem", fontSize: "2rem", backgroundColor: "#f5f0ff" }}>👶</span>
              <h3 className="text-2xl font-bold text-ink" style={{ fontFamily: "var(--font-caveat), cursive" }}>Diaper Tracking</h3>
              <p className="text-sm text-ink-faint leading-relaxed" style={{ fontFamily: "var(--font-nunito), sans-serif" }}>
                Quick checkboxes for wet and dirty diapers. Track patterns
                to keep your pediatrician in the loop.
              </p>
            </div>

            {/* Card 3 */}
            <div className="card-scrapbook p-6 flex flex-col items-center text-center gap-3 relative">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-6 h-6 rounded-full bg-sage border-2 border-white shadow-sm" />
              <span className="sticker text-4xl mt-2" style={{ width: "3.5rem", height: "3.5rem", fontSize: "2rem", backgroundColor: "#f0fff5" }}>📊</span>
              <h3 className="text-2xl font-bold text-ink" style={{ fontFamily: "var(--font-caveat), cursive" }}>Smart Analytics</h3>
              <p className="text-sm text-ink-faint leading-relaxed" style={{ fontFamily: "var(--font-nunito), sans-serif" }}>
                Beautiful charts showing feeding and diaper averages across
                24 hours, 3 days, and 7 days.
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* CTA — bottom of the notebook page */}
      <section className="py-14 px-6 text-center" style={{ backgroundColor: "#F5F0E8" }}>
        <div className="max-w-sm mx-auto card-scrapbook p-8">
          <h2 className="text-3xl font-bold mb-2 text-ink"
              style={{ fontFamily: "var(--font-caveat), cursive" }}>
            Ready to get started?
          </h2>
          <p className="text-sm text-ink-faint mb-6" style={{ fontFamily: "var(--font-nunito), sans-serif" }}>
            No account needed. Just start logging.
          </p>
          <Link href="/log"
                className="btn btn-primary btn-wide btn-stamp"
                style={{ fontFamily: "var(--font-caveat), cursive", fontSize: "1.15rem", letterSpacing: "0.03em" }}>
            Create Your First Log
          </Link>
        </div>
      </section>

    </div>
  );
}
