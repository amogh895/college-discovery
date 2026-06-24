import Link from "next/link";
import { prisma } from "@/lib/prisma";
import RatingStars from "@/components/RatingStars";

export default async function HomePage() {
  const [featuredColleges, stats] = await Promise.all([
    prisma.college.findMany({
      take: 6,
      orderBy: { rating: "desc" },
    }),
    prisma.college.count(),
  ]);

  const courseCount = await prisma.course.count();

  return (
    <div className="animate-fade-in">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-[#1e1b4b] via-[#312e81] to-[#4c1d95] text-white">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-96 h-96 rounded-full bg-primary/20 blur-3xl" />
          <div className="absolute -bottom-40 -left-40 w-96 h-96 rounded-full bg-secondary/20 blur-3xl" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-accent/10 blur-3xl" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32 md:py-44">
          <div className="text-center max-w-3xl mx-auto">


            <h1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold tracking-tight leading-tight">
              Discover Your{" "}
              <span className="bg-gradient-to-r from-cyan-300 via-blue-300 to-purple-300 bg-clip-text text-transparent">
                Dream College
              </span>
            </h1>

            <p className="mt-6 text-lg md:text-xl text-blue-100/80 max-w-2xl mx-auto leading-relaxed">
              Explore {stats}+ top colleges across India. Compare fees,
              placements, ratings, and courses — all in one place.
            </p>

            <div className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/colleges"
                className="w-full sm:w-auto inline-flex items-center justify-center px-8 py-4 rounded-xl bg-white text-indigo-900 font-semibold text-lg shadow-xl shadow-indigo-900/30 hover:shadow-indigo-900/50 hover:scale-105 transition-all duration-300"
              >
                <svg
                  className="w-5 h-5 mr-2"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
                Explore Colleges
              </Link>
              <Link
                href="/compare"
                className="w-full sm:w-auto inline-flex items-center justify-center px-8 py-4 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20 text-white font-semibold text-lg hover:bg-white/20 transition-all duration-300"
              >
                <svg
                  className="w-5 h-5 mr-2"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                  />
                </svg>
                Compare Colleges
              </Link>
            </div>
          </div>
        </div>

        {/* Wave divider */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg
            viewBox="0 0 1440 120"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="w-full"
          >
            <path
              d="M0 120L60 105C120 90 240 60 360 52.5C480 45 600 60 720 67.5C840 75 960 75 1080 67.5C1200 60 1320 45 1380 37.5L1440 30V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z"
              className="fill-background"
            />
          </svg>
        </div>
      </section>

      {/* Quick Filter Buttons */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-24">
        <div className="text-center mb-12">
          <h2 className="text-2xl md:text-3xl font-bold">
            Browse by Category
          </h2>
          <p className="mt-2 text-muted">
            Find colleges that match your preferences
          </p>
        </div>

        <div className="flex flex-wrap justify-center gap-6">
          {[
            {
              type: "GOVERNMENT",
              label: "Government",
              icon: "🏛️",
              desc: "IITs, NITs & more",
              gradient: "from-blue-500 to-blue-700",
            },
            {
              type: "PRIVATE",
              label: "Private",
              icon: "🏫",
              desc: "BITS, Manipal & more",
              gradient: "from-pink-500 to-rose-700",
            },
            {
              type: "DEEMED",
              label: "Deemed",
              icon: "🎓",
              desc: "VIT, SRM & more",
              gradient: "from-emerald-500 to-green-700",
            },
          ].map((cat) => (
            <Link
              key={cat.type}
              href={`/colleges?type=${cat.type}`}
              className="group flex items-center gap-4 px-6 py-4 rounded-2xl bg-card-bg border border-card-border hover:border-primary/30 shadow-sm hover:shadow-lg hover:shadow-primary/10 transition-all duration-300 w-full sm:w-auto"
            >
              <div
                className={`flex items-center justify-center w-14 h-14 rounded-xl bg-gradient-to-br ${cat.gradient} text-2xl shadow-lg`}
              >
                {cat.icon}
              </div>
              <div>
                <div className="font-semibold text-lg group-hover:text-primary transition-colors">
                  {cat.label}
                </div>
                <div className="text-sm text-muted">{cat.desc}</div>
              </div>
              <svg
                className="w-5 h-5 ml-auto text-muted group-hover:text-primary group-hover:translate-x-1 transition-all"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured Colleges */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-24">
        <div className="flex items-center justify-between mb-12">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold">
              Top Rated Colleges
            </h2>
            <p className="mt-1 text-muted">
              Highest rated institutions across India
            </p>
          </div>
          <Link
            href="/colleges"
            className="hidden sm:inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary/10 text-primary font-medium hover:bg-primary/20 transition-colors"
          >
            View All
            <svg
              className="w-4 h-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17 8l4 4m0 0l-4 4m4-4H3"
              />
            </svg>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {featuredColleges.map((college, index) => (
            <Link
              key={college.id}
              href={`/colleges/${college.id}`}
              className="group relative overflow-hidden rounded-2xl bg-card-bg border border-card-border card-hover"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              {/* Card Image / Gradient */}
              <div
                className={`h-44 bg-gradient-to-br ${
                  college.type === "GOVERNMENT"
                    ? "from-blue-600 to-indigo-800"
                    : college.type === "PRIVATE"
                      ? "from-pink-600 to-rose-800"
                      : "from-emerald-600 to-teal-800"
                } relative overflow-hidden`}
              >
                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors" />
                <div className="absolute top-4 right-4">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold badge-${college.type.toLowerCase()}`}
                  >
                    {college.type}
                  </span>
                </div>
                <div className="absolute bottom-4 left-4 right-4">
                  <h3 className="text-xl font-bold text-white drop-shadow-lg">
                    {college.name}
                  </h3>
                </div>
              </div>

              {/* Card Body */}
              <div className="p-5">
                <div className="flex items-center gap-1.5 text-sm text-muted mb-3">
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                  {college.location}, {college.state}
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <RatingStars rating={college.rating} size="sm" />
                    <span className="text-sm font-medium">
                      {college.rating.toFixed(1)}
                    </span>
                  </div>
                  <div className="text-right">
                    <div className="text-sm text-muted">Annual Fees</div>
                    <div className="font-semibold text-primary">
                      ₹{(college.fees / 100000).toFixed(1)}L
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>

        <div className="mt-8 text-center sm:hidden">
          <Link
            href="/colleges"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-primary text-white font-medium hover:bg-primary-dark transition-colors"
          >
            View All Colleges
            <svg
              className="w-4 h-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17 8l4 4m0 0l-4 4m4-4H3"
              />
            </svg>
          </Link>
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-gradient-to-r from-primary/5 via-secondary/5 to-accent/5 border-y border-card-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-24">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-10">
            {[
              { value: `${stats}+`, label: "Top Colleges", icon: "🏫" },
              { value: `${courseCount}+`, label: "Courses", icon: "📚" },
              { value: "8+", label: "States Covered", icon: "🗺️" },
              { value: "100%", label: "Free to Use", icon: "✨" },
            ].map((stat, i) => (
              <div key={i} className="text-center">
                <div className="text-3xl mb-2">{stat.icon}</div>
                <div className="text-3xl md:text-4xl font-extrabold gradient-text">
                  {stat.value}
                </div>
                <div className="mt-1 text-sm text-muted font-medium">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-card-bg border-t border-card-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-20">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            <div>
              <h3 className="text-xl font-bold gradient-text">
                CollegeDiscover
              </h3>
              <p className="mt-3 text-sm text-muted leading-relaxed">
                India&apos;s most comprehensive platform for discovering,
                comparing, and choosing the right college for your career.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-3">Quick Links</h4>
              <div className="space-y-2">
                <Link
                  href="/colleges"
                  className="block text-sm text-muted hover:text-primary transition-colors"
                >
                  Browse Colleges
                </Link>
                <Link
                  href="/compare"
                  className="block text-sm text-muted hover:text-primary transition-colors"
                >
                  Compare Colleges
                </Link>
                <Link
                  href="/saved"
                  className="block text-sm text-muted hover:text-primary transition-colors"
                >
                  Saved Colleges
                </Link>
              </div>
            </div>
            <div>
              <h4 className="font-semibold mb-3">Categories</h4>
              <div className="space-y-2">
                <Link
                  href="/colleges?type=GOVERNMENT"
                  className="block text-sm text-muted hover:text-primary transition-colors"
                >
                  Government Colleges
                </Link>
                <Link
                  href="/colleges?type=PRIVATE"
                  className="block text-sm text-muted hover:text-primary transition-colors"
                >
                  Private Colleges
                </Link>
                <Link
                  href="/colleges?type=DEEMED"
                  className="block text-sm text-muted hover:text-primary transition-colors"
                >
                  Deemed Universities
                </Link>
              </div>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-card-border text-center text-sm text-muted">
            © {new Date().getFullYear()} CollegeDiscover. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
