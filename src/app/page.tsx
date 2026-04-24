import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-[calc(100vh-4rem)]">

      {/* Hero — bright lavender with colorful star accents */}
      <section className="py-20 px-6 text-center relative overflow-hidden"
               style={{ background: "#EDE8FF" }}>
        {/* Decorative star / dot elements */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <span className="absolute text-3xl" style={{ top: "12%", left: "8%", transform: "rotate(-15deg)", opacity: 0.7 }}>✦</span>
          <span className="absolute text-2xl" style={{ top: "20%", right: "10%", transform: "rotate(20deg)", color: "#FF6EB4", opacity: 0.8 }}>★</span>
          <span className="absolute text-4xl" style={{ bottom: "18%", left: "6%", transform: "rotate(10deg)", color: "#FFE566", opacity: 0.7 }}>✦</span>
          <span className="absolute text-2xl" style={{ bottom: "25%", right: "7%", transform: "rotate(-10deg)", color: "#5BC4FF", opacity: 0.8 }}>★</span>
          <span className="absolute text-xl" style={{ top: "50%", left: "3%", color: "#FF6EB4", opacity: 0.5 }}>◆</span>
          <span className="absolute text-xl" style={{ top: "45%", right: "4%", color: "#FFE566", opacity: 0.6 }}>◆</span>
          {/* Decorative circles */}
          <div className="absolute w-20 h-20 rounded-full" style={{ top: "5%", right: "20%", background: "#FF6EB4", opacity: 0.12, border: "2px solid #FF6EB4" }} />
          <div className="absolute w-12 h-12 rounded-full" style={{ bottom: "10%", left: "18%", background: "#5BC4FF", opacity: 0.15, border: "2px solid #5BC4FF" }} />
          <div className="absolute w-8 h-8 rounded-full" style={{ top: "30%", left: "22%", background: "#FFE566", opacity: 0.2, border: "2px solid #FFE566" }} />
        </div>

        <div className="relative max-w-2xl mx-auto">
          <div className="mb-4 flex justify-center">
            <span className="sticker text-5xl" style={{ width: "5rem", height: "5rem", fontSize: "2.5rem" }}>🍼</span>
          </div>
          <h1 className="text-6xl md:text-7xl font-bold leading-tight mb-4"
              style={{ fontFamily: "var(--font-caveat), cursive", color: "#1a1a2e" }}>
            Track every feed,
            <br />
            <span style={{ color: "#FF6EB4", WebkitTextStroke: "1px #1a1a2e" }}>every diaper,</span>
            <br />
            every moment.
          </h1>
          <p className="py-4 text-base max-w-lg mx-auto leading-relaxed"
             style={{ fontFamily: "var(--font-nunito), sans-serif", color: "#4a3d6b" }}>
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
                  className="btn btn-lg btn-stamp"
                  style={{ fontFamily: "var(--font-caveat), cursive", fontSize: "1.2rem", letterSpacing: "0.03em", background: "#FFE566", color: "#1a1a2e" }}>
              View Analytics
            </Link>
          </div>
        </div>
      </section>

      {/* Features — white background, colorful sticker cards */}
      <section className="py-16 px-6" style={{ backgroundColor: "#F8F5FF" }}>
        <div className="max-w-5xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-2"
              style={{ fontFamily: "var(--font-caveat), cursive", color: "#1a1a2e" }}>
            Everything you need, nothing you don&apos;t
          </h2>
          <div className="flex justify-center mb-10">
            <div className="h-1 w-32 rounded-full" style={{ backgroundColor: "#FF6EB4", boxShadow: "2px 2px 0 #1a1a2e" }} />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">

            {/* Card 1 — pink */}
            <div className="card-scrapbook p-6 flex flex-col items-center text-center gap-3 relative"
                 style={{ borderColor: "#FF6EB4", boxShadow: "5px 5px 0 #FF6EB4" }}>
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-6 h-6 rounded-full"
                   style={{ background: "#FF6EB4", border: "2px solid #1a1a2e" }} />
              <span className="sticker text-4xl mt-2" style={{ width: "3.5rem", height: "3.5rem", fontSize: "2rem", backgroundColor: "#FFE5F3" }}>🍼</span>
              <h3 className="text-2xl font-bold" style={{ fontFamily: "var(--font-caveat), cursive", color: "#1a1a2e" }}>Feeding Tracker</h3>
              <p className="text-sm leading-relaxed" style={{ fontFamily: "var(--font-nunito), sans-serif", color: "#4a3d6b" }}>
                Log breast or bottle feedings with side, duration, and amount.
                All fields are optional &mdash; log what you need.
              </p>
            </div>

            {/* Card 2 — blue */}
            <div className="card-scrapbook p-6 flex flex-col items-center text-center gap-3 relative"
                 style={{ borderColor: "#5BC4FF", boxShadow: "5px 5px 0 #5BC4FF" }}>
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-6 h-6 rounded-full"
                   style={{ background: "#5BC4FF", border: "2px solid #1a1a2e" }} />
              <span className="sticker text-4xl mt-2" style={{ width: "3.5rem", height: "3.5rem", fontSize: "2rem", backgroundColor: "#E0F3FF" }}>👶</span>
              <h3 className="text-2xl font-bold" style={{ fontFamily: "var(--font-caveat), cursive", color: "#1a1a2e" }}>Diaper Tracking</h3>
              <p className="text-sm leading-relaxed" style={{ fontFamily: "var(--font-nunito), sans-serif", color: "#4a3d6b" }}>
                Quick checkboxes for wet and dirty diapers. Track patterns
                to keep your pediatrician in the loop.
              </p>
            </div>

            {/* Card 3 — yellow */}
            <div className="card-scrapbook p-6 flex flex-col items-center text-center gap-3 relative"
                 style={{ borderColor: "#FFE566", boxShadow: "5px 5px 0 #d4a800" }}>
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-6 h-6 rounded-full"
                   style={{ background: "#FFE566", border: "2px solid #1a1a2e" }} />
              <span className="sticker text-4xl mt-2" style={{ width: "3.5rem", height: "3.5rem", fontSize: "2rem", backgroundColor: "#FFFAE0" }}>📊</span>
              <h3 className="text-2xl font-bold" style={{ fontFamily: "var(--font-caveat), cursive", color: "#1a1a2e" }}>Smart Analytics</h3>
              <p className="text-sm leading-relaxed" style={{ fontFamily: "var(--font-nunito), sans-serif", color: "#4a3d6b" }}>
                Beautiful charts showing feeding and diaper averages across
                24 hours, 3 days, and 7 days.
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-14 px-6 text-center" style={{ backgroundColor: "#EDE8FF" }}>
        <div className="max-w-sm mx-auto card-scrapbook p-8"
             style={{ borderColor: "#FF6EB4", boxShadow: "5px 5px 0 #FF6EB4" }}>
          <h2 className="text-3xl font-bold mb-2"
              style={{ fontFamily: "var(--font-caveat), cursive", color: "#1a1a2e" }}>
            Ready to get started?
          </h2>
          <p className="text-sm mb-6" style={{ fontFamily: "var(--font-nunito), sans-serif", color: "#4a3d6b" }}>
            No account needed. Just start logging.
          </p>
          <Link href="/log"
                className="btn btn-wide btn-stamp"
                style={{ fontFamily: "var(--font-caveat), cursive", fontSize: "1.15rem", letterSpacing: "0.03em", background: "#FFE566", color: "#1a1a2e" }}>
            Create Your First Log
          </Link>
        </div>
      </section>

    </div>
  );
}
