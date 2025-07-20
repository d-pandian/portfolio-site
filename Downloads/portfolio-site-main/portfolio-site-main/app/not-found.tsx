import Link from "next/link";
import { Home } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-darkOrange/10 to-darkOrange/20 via-darkOrange/10 flex justify-center px-4 sm:px-6 lg:px-8">
      <div className="max-w-lg w-full space-y-8 text-center py-20 md:py-32">
        <div className="space-y-4">
          <h1 className="text-9xl font-extrabold text-gray-800">404</h1>
          <p className="text-3xl font-semibold text-gray-600">Page Not Found</p>
          <p className="text-xl text-gray-500">
            Oops! The page you&apos;re looking for doesn&apos;t exist.
          </p>
        </div>
        <div className="flex flex-col sm:flex-row justify-center items-center space-y-4 sm:space-y-0 sm:space-x-4">
          <Link
            href="/"
            className="flex items-center justify-center px-4 py-2 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 transition-colors duration-300 ease-in-out"
          >
            <Home className="mr-2 h-5 w-5" />
            Go to Homepage
          </Link>
        </div>
      </div>
    </div>
  );
}
