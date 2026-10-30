"use client";

import { useEffect, useMemo, useState } from "react";
import {
  AlertCircle,
  Award,
  BookOpen,
  CalendarDays,
  CheckCircle2,
  Clock3,
  Download,
  Search,
} from "lucide-react";
import type { ReactNode } from "react";
import { userInfo } from "@/services/auth";
import { GetUserSubscribedCourses } from "@/services/course";
import { downloadCertificatePdf } from "@/lib/certificate";

type Course = {
  title?: string;
  slug?: string;
  credit?: number | string;
  fieldOfStudy?: string;
  startDate?: string;
  endDate?: string;
  programNumber?: string | number;
  medium?: string;
  certificateTemplate?: {
    data?: { attributes?: { url?: string } | null } | null;
  } | null;
  category?: {
    data?: { attributes?: { title?: string } | null } | null;
  } | null;
};

type UserCourse = {
  id?: string;
  attributes?: {
    status?: string;
    completedOn?: string | null;
    purchasedOn?: string | null;
    course?: { data?: { attributes?: Course | null } | null } | null;
  };
};

type TrackerCourse = {
  id: string;
  course: Course;
  status: string;
  completedOn: string | null;
  purchasedOn: string | null;
  progress: number;
  category: string;
};

const isCompleted = (course: TrackerCourse) =>
  course.status.toLowerCase() === "completed";

const isCertificateEligible = (course: TrackerCourse) =>
  isCompleted(course) ||
  (course.category.toLowerCase() === "recorded" && course.progress >= 70);

function formatDate(value: string | null | undefined) {
  if (!value) return "Not recorded";
  const date = new Date(value);
  return Number.isNaN(date.getTime())
    ? "Not recorded"
    : date.toLocaleDateString(undefined, {
        month: "short",
        day: "numeric",
        year: "numeric",
      });
}

function CpeTracker() {
  const [courses, setCourses] = useState<TrackerCourse[]>([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [certificateError, setCertificateError] = useState("");
  const [downloadingId, setDownloadingId] = useState<string | null>(null);

  useEffect(() => {
    let active = true;

    async function loadCourses() {
      try {
        setLoading(true);
        setError("");

        const currentUser = await userInfo();
        if (!currentUser?.id || !currentUser?.email) {
          throw new Error("Unable to verify your account. Please sign in again.");
        }

        const response = await GetUserSubscribedCourses(currentUser.email);
        if (!Array.isArray(response?.data)) {
          throw new Error("The course history could not be loaded. Please try again.");
        }

        const userCourses = (response.data as UserCourse[])
          .map((item, index): TrackerCourse | null => {
            const attributes = item.attributes;
            const course = attributes?.course?.data?.attributes;
            if (!course) return null;

            const progress =
              attributes?.status?.toLowerCase() === "completed" ? 100 : 0;

            return {
              id: item.id ?? `${course.slug ?? course.title ?? "course"}-${index}`,
              course,
              status: attributes?.status || "Not started",
              completedOn: attributes?.completedOn ?? null,
              purchasedOn: attributes?.purchasedOn ?? null,
              progress,
              category:
                course.category?.data?.attributes?.title || "Uncategorized",
            };
          })
          .filter((course): course is TrackerCourse => course !== null);

        if (active) setCourses(userCourses);
      } catch (loadError) {
        if (active) {
          setError(
            loadError instanceof Error
              ? loadError.message
              : "The course history could not be loaded. Please try again.",
          );
        }
      } finally {
        if (active) setLoading(false);
      }
    }

    void loadCourses();
    return () => {
      active = false;
    };
  }, []);

  const completedCourses = useMemo(
    () => courses.filter(isCompleted),
    [courses],
  );
  const inProgressCourses = useMemo(
    () => courses.filter((course) => !isCompleted(course)),
    [courses],
  );
  const certificateCourses = useMemo(
    () => courses.filter(isCertificateEligible),
    [courses],
  );
  const earnedCredits = useMemo(
    () =>
      completedCourses.reduce(
        (sum, course) => sum + (Number(course.course.credit) || 0),
        0,
      ),
    [completedCourses],
  );
  const categories = useMemo(
    () => Array.from(new Set(courses.map((course) => course.category))).sort(),
    [courses],
  );
  const filteredCourses = useMemo(() => {
    const query = search.trim().toLowerCase();
    return courses.filter((course) => {
      const matchesSearch =
        !query ||
        course.course.title?.toLowerCase().includes(query) ||
        course.course.fieldOfStudy?.toLowerCase().includes(query);
      const matchesStatus =
        statusFilter === "all" ||
        (statusFilter === "completed" && isCompleted(course)) ||
        (statusFilter === "in-progress" && !isCompleted(course));
      const matchesCategory =
        categoryFilter === "all" || course.category === categoryFilter;
      return matchesSearch && matchesStatus && matchesCategory;
    });
  }, [courses, search, statusFilter, categoryFilter]);

  const handleCertificateDownload = async (item: TrackerCourse) => {
    setDownloadingId(item.id);
    setCertificateError("");
    try {
      const currentUser = await userInfo();
      const fullName = [currentUser?.firstName, currentUser?.lastName]
        .filter((name): name is string => typeof name === "string" && !!name.trim())
        .join(" ");
      await downloadCertificatePdf(
        item.course,
        item.completedOn,
        fullName || currentUser?.username || "",
      );
    } catch (downloadError) {
      setCertificateError(
        downloadError instanceof Error
          ? downloadError.message
          : "Unable to download this certificate. Please try again.",
      );
    } finally {
      setDownloadingId(null);
    }
  };

  return (
    <div className="mx-auto w-full max-w-7xl space-y-8 px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
      <header className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-wide text-indigo-600">
            Learning record
          </p>
          <h1 className="mt-1 text-2xl font-bold text-slate-900 sm:text-3xl">
            CPE Tracker
          </h1>
          <p className="mt-2 max-w-2xl text-sm text-slate-600 sm:text-base">
            Track your course progress, earned CPE credits, and certificates in
            one place.
          </p>
        </div>
        <div className="inline-flex w-fit items-center gap-2 rounded-full bg-indigo-50 px-3 py-2 text-sm font-medium text-indigo-700">
          <Award className="h-4 w-4" />
          Personal CPE record
        </div>
      </header>

      <section aria-label="CPE summary" className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <SummaryCard
          icon={<BookOpen className="h-5 w-5" />}
          label="Courses tracked"
          value={loading ? "—" : courses.length.toString()}
          color="indigo"
        />
        <SummaryCard
          icon={<Award className="h-5 w-5" />}
          label="CPE credits earned"
          value={loading ? "—" : earnedCredits.toString()}
          color="emerald"
        />
        <SummaryCard
          icon={<Clock3 className="h-5 w-5" />}
          label="In progress"
          value={loading ? "—" : inProgressCourses.length.toString()}
          color="amber"
        />
        <SummaryCard
          icon={<CheckCircle2 className="h-5 w-5" />}
          label="Certificates available"
          value={loading ? "—" : certificateCourses.length.toString()}
          color="blue"
        />
      </section>

      {error && (
        <div role="alert" className="flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-800">
          <AlertCircle className="mt-0.5 h-5 w-5 shrink-0" />
          <p>{error}</p>
        </div>
      )}

      <section aria-labelledby="course-list-heading" className="space-y-4">
        <div>
          <h2 id="course-list-heading" className="text-xl font-semibold text-slate-900">
            Your course history
          </h2>
          <p className="mt-1 text-sm text-slate-600">
            All courses associated with your account, with current progress and
            credit details.
          </p>
        </div>

        <div className="grid gap-3 rounded-xl border border-slate-200 bg-white p-4 shadow-sm md:grid-cols-[minmax(220px,1fr)_180px_200px]">
          <label className="relative block">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search courses or subjects"
              aria-label="Search courses or subjects"
              className="h-11 w-full rounded-lg border border-slate-300 bg-white pl-10 pr-3 text-sm text-slate-900 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
            />
          </label>
          <select
            aria-label="Filter by progress"
            value={statusFilter}
            onChange={(event) => setStatusFilter(event.target.value)}
            className="h-11 rounded-lg border border-slate-300 bg-white px-3 text-sm text-slate-700 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
          >
            <option value="all">All progress</option>
            <option value="in-progress">In progress</option>
            <option value="completed">Completed</option>
          </select>
          <select
            aria-label="Filter by course category"
            value={categoryFilter}
            onChange={(event) => setCategoryFilter(event.target.value)}
            className="h-11 rounded-lg border border-slate-300 bg-white px-3 text-sm text-slate-700 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
          >
            <option value="all">All course types</option>
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>

        {loading ? (
          <div className="rounded-xl border border-slate-200 bg-white px-4 py-16 text-center text-sm text-slate-500">
            Loading your course history…
          </div>
        ) : !error && filteredCourses.length === 0 ? (
          <div className="rounded-xl border border-dashed border-slate-300 bg-white px-4 py-14 text-center">
            <BookOpen className="mx-auto h-8 w-8 text-slate-400" />
            <p className="mt-3 font-medium text-slate-800">
              {courses.length === 0
                ? "No courses found for your account."
                : "No courses match your filters."}
            </p>
            <p className="mt-1 text-sm text-slate-500">
              {courses.length === 0
                ? "Courses you enroll in will appear here."
                : "Try changing the search or filters."}
            </p>
          </div>
        ) : (
          <div className="grid gap-4">
            {filteredCourses.map((item) => (
              <CourseCard
                key={item.id}
                item={item}
                downloading={downloadingId === item.id}
                onDownload={() => void handleCertificateDownload(item)}
              />
            ))}
          </div>
        )}
      </section>

      <section aria-labelledby="credit-history-heading" className="space-y-4">
        <div>
          <h2 id="credit-history-heading" className="text-xl font-semibold text-slate-900">
            CPE credit history
          </h2>
          <p className="mt-1 text-sm text-slate-600">
            Completed courses contributing to your earned credits.
          </p>
        </div>
        <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
          {loading ? (
            <p className="p-6 text-sm text-slate-500">Loading credit history…</p>
          ) : completedCourses.length === 0 ? (
            <p className="p-6 text-sm text-slate-500">
              Completed courses and credits will appear here.
            </p>
          ) : (
            <ul className="divide-y divide-slate-100">
              {completedCourses.map((item) => (
                <li
                  key={item.id}
                  className="flex flex-col gap-2 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6"
                >
                  <div className="min-w-0">
                    <p className="truncate font-medium text-slate-900">
                      {item.course.title || "Course"}
                    </p>
                    <p className="mt-1 flex items-center gap-1.5 text-sm text-slate-500">
                      <CalendarDays className="h-4 w-4 shrink-0" />
                      Completed {formatDate(item.completedOn)}
                    </p>
                  </div>
                  <span className="w-fit rounded-full bg-emerald-50 px-3 py-1 text-sm font-semibold text-emerald-700">
                    {Number(item.course.credit) || 0} CPE credits
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>

      {certificateError && (
        <div role="alert" className="flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-800">
          <AlertCircle className="mt-0.5 h-5 w-5 shrink-0" />
          <p>{certificateError}</p>
          <button
            type="button"
            className="ml-auto font-semibold underline"
            onClick={() => setCertificateError("")}
          >
            Dismiss
          </button>
        </div>
      )}
    </div>
  );
}

function SummaryCard({
  icon,
  label,
  value,
  color,
}: {
  icon: ReactNode;
  label: string;
  value: string;
  color: "indigo" | "emerald" | "amber" | "blue";
}) {
  const styles = {
    indigo: "bg-indigo-50 text-indigo-700",
    emerald: "bg-emerald-50 text-emerald-700",
    amber: "bg-amber-50 text-amber-700",
    blue: "bg-blue-50 text-blue-700",
  };

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className={`mb-4 flex h-10 w-10 items-center justify-center rounded-lg ${styles[color]}`}>
        {icon}
      </div>
      <p className="text-sm text-slate-500">{label}</p>
      <p className="mt-1 text-2xl font-bold text-slate-900">{value}</p>
    </div>
  );
}

function CourseCard({
  item,
  downloading,
  onDownload,
}: {
  item: TrackerCourse;
  downloading: boolean;
  onDownload: () => void;
}) {
  const completed = isCompleted(item);
  const certificateEligible = isCertificateEligible(item);
  const certificateAvailable = !!item.course.certificateTemplate?.data?.attributes?.url;

  return (
    <article className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-600">
              {item.category}
            </span>
            <span
              className={`rounded-full px-2.5 py-1 text-xs font-medium ${
                completed
                  ? "bg-emerald-50 text-emerald-700"
                  : "bg-amber-50 text-amber-700"
              }`}
            >
              {item.status}
            </span>
          </div>
          <h3 className="mt-3 text-base font-semibold text-slate-900 sm:text-lg">
            {item.course.title || "Untitled course"}
          </h3>
          <p className="mt-1 text-sm text-slate-600">
            {item.course.fieldOfStudy || "Subject not specified"}
          </p>
        </div>
        <div className="shrink-0 rounded-lg bg-indigo-50 px-4 py-3 text-left sm:text-right">
          <p className="text-xs font-medium uppercase tracking-wide text-indigo-700">
            CPE credits
          </p>
          <p className="mt-0.5 text-xl font-bold text-indigo-900">
            {Number(item.course.credit) || 0}
          </p>
        </div>
      </div>

      <div className="mt-5">
        <div className="mb-2 flex items-center justify-between gap-3 text-sm">
          <span className="font-medium text-slate-700">Course progress</span>
          <span className="text-slate-600">{item.progress}%</span>
        </div>
        <div
          className="h-2 overflow-hidden rounded-full bg-slate-100"
          role="progressbar"
          aria-label={`${item.course.title || "Course"} progress`}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={item.progress}
        >
          <div
            className={`h-full rounded-full ${
              completed ? "bg-emerald-500" : "bg-indigo-600"
            }`}
            style={{ width: `${item.progress}%` }}
          />
        </div>
      </div>

      <div className="mt-4 flex flex-col gap-3 border-t border-slate-100 pt-4 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-slate-500">
          {completed
            ? `Completed ${formatDate(item.completedOn)}`
            : `Added ${formatDate(item.purchasedOn)}`}
        </p>
        {certificateEligible && (
          <button
            type="button"
            onClick={onDownload}
            disabled={downloading || !certificateAvailable}
            title={
              certificateAvailable
                ? "Download certificate"
                : "Certificate template is not available"
            }
            className="inline-flex min-h-10 items-center justify-center gap-2 rounded-lg border border-indigo-200 px-3 py-2 text-sm font-semibold text-indigo-700 transition hover:bg-indigo-50 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <Download className="h-4 w-4" />
            {downloading ? "Preparing…" : "Certificate"}
          </button>
        )}
      </div>
    </article>
  );
}

export default CpeTracker;
