import { getPageSession } from "@/auth/lucia";
import { redirect } from "next/navigation";

const Page = async () => {
  const session = await getPageSession();
  if (session) redirect("/");
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Sign in to your account
          </h2>
        </div>
        <div className="rounded-md shadow-sm -space-y-px">
          <div>
            <a
              href="/login/github"
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-gray-600 hover:bg-gray-700"
            >
              Sign in with GitHub
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page;
