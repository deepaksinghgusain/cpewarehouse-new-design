import { Footer } from '@/components/shared/Footer';
import { Header } from '@/components/shared/Header';
import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />

      <main className="flex flex-1 items-center justify-center px-4 py-16">
        <section className="mx-auto flex w-full max-w-2xl items-center justify-center text-center">
          <div>
            <div className="mb-6 text-7xl font-bold text-[#155dee] sm:text-9xl">404</div>
            <h1 className="text-3xl font-semibold text-[#101828] sm:text-5xl">Page not found</h1>
            <p className="mt-4 text-base text-[#475467] sm:text-lg">
              The page you are looking for doesn’t exist or may have been moved.
            </p>

            <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Link
                href="/"
                className="inline-flex items-center justify-center rounded-full bg-[#155dee] px-6 py-3 text-base font-semibold text-white transition hover:bg-[#0d48d8]"
              >
                Back to home
              </Link>
              <Link
                href="/course-catalog"
                className="inline-flex items-center justify-center rounded-full border border-[#d0d5dd] bg-white px-6 py-3 text-base font-semibold text-[#101828] transition hover:bg-[#f8fafc]"
              >
                Explore courses
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
