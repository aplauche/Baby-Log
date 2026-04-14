import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-[calc(100vh-4rem)]">
      {/* Hero */}
      <section className="hero min-h-[70vh] bg-gradient-to-br from-primary/10 via-base-100 to-secondary/10">
        <div className="hero-content text-center">
          <div className="max-w-2xl">
            <h1 className="text-5xl font-bold tracking-tight">
              Track every feed,
              <br />
              <span className="text-primary">every diaper,</span>
              <br />
              every moment.
            </h1>
            <p className="py-6 text-lg text-base-content/70 max-w-lg mx-auto">
              BabyLog makes it effortless to log feedings, diaper changes, and
              spot patterns in your baby&apos;s routine &mdash; so you can focus on
              what matters most.
            </p>
            <div className="flex gap-4 justify-center">
              <Link href="/log" className="btn btn-primary btn-lg">
                Start Logging
              </Link>
              <Link href="/analytics" className="btn btn-outline btn-lg">
                View Analytics
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 px-6 bg-base-200">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">
            Everything you need, nothing you don&apos;t
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="card bg-base-100 shadow-md">
              <div className="card-body items-center text-center">
                <div className="text-4xl mb-2">🍼</div>
                <h3 className="card-title">Feeding Tracker</h3>
                <p className="text-base-content/60">
                  Log breast or bottle feedings with side, duration, and amount.
                  All fields are optional &mdash; log what you need.
                </p>
              </div>
            </div>
            <div className="card bg-base-100 shadow-md">
              <div className="card-body items-center text-center">
                <div className="text-4xl mb-2">👶</div>
                <h3 className="card-title">Diaper Tracking</h3>
                <p className="text-base-content/60">
                  Quick checkboxes for wet and dirty diapers. Track patterns
                  to keep your pediatrician in the loop.
                </p>
              </div>
            </div>
            <div className="card bg-base-100 shadow-md">
              <div className="card-body items-center text-center">
                <div className="text-4xl mb-2">📊</div>
                <h3 className="card-title">Smart Analytics</h3>
                <p className="text-base-content/60">
                  Beautiful charts showing feeding and diaper averages across
                  24 hours, 3 days, and 7 days.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 px-6 text-center">
        <h2 className="text-2xl font-bold mb-4">Ready to get started?</h2>
        <p className="text-base-content/60 mb-6">
          No account needed. Just start logging.
        </p>
        <Link href="/log" className="btn btn-primary btn-wide">
          Create Your First Log
        </Link>
      </section>
    </div>
  );
}
