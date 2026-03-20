import { Link } from "react-router-dom";

export default function NotFoundPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-100 p-6">
      <div className="rounded-2xl bg-white p-10 text-center shadow-sm">
        <h1 className="text-3xl font-bold text-slate-900">404</h1>
        <p className="mt-2 text-slate-500">Page not found</p>
        <Link
          to="/login"
          className="mt-6 inline-block rounded-xl bg-orange-600 px-5 py-3 font-semibold text-white"
        >
          Go to Login
        </Link>
      </div>
    </div>
  );
}