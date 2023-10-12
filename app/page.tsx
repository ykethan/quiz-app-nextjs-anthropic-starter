import { getPageSession, auth } from "@/auth/lucia";
import { redirect } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import {
  Menubar,
  MenubarContent,
  MenubarMenu,
  MenubarTrigger,
} from "@/components/ui/menubar";

import Form from "@/components/form";
import Link from "next/link";

const Page = async () => {
  const session = await getPageSession();
  if (!session) redirect("/login");
  const user = await auth.getUser(session.user.userId);

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      {/* Menubar positioned at the top of the page */}
      <div className="bg-white shadow-md">
        <Menubar>
          <MenubarMenu>
            <MenubarTrigger>
              <Avatar>
                <AvatarImage src={user.avatarUrl} alt="avatar_url" />
              </Avatar>
            </MenubarTrigger>
            <MenubarContent>
              <Form action="/logout">
                <Button
                  variant="destructive"
                  type="submit"
                  className="bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded-md text-sm sm:text-base"
                >
                  Sign out
                </Button>
              </Form>
            </MenubarContent>
          </MenubarMenu>
          <MenubarMenu>
            <Link href="/writing">
              <span className="cursor-pointer text-base sm:text-lg md:text-xl lg:text-2xl xl:text-3xl text-gray-700 hover:text-gray-900">
                Quiz
              </span>
            </Link>
          </MenubarMenu>
        </Menubar>
      </div>

      {/* Main content below the Menubar */}
      <div className="py-6 flex flex-col justify-center sm:py-12 flex-grow">
        <div className="relative sm:max-w-xl sm:mx-auto">
          <div className="absolute inset-0 bg-gradient-to-r from-teal-500 to-cyan-600 shadow-lg transform -skew-y-6 sm:skew-y-0 sm:-rotate-6 sm:rounded-3xl"></div>
          <div className="relative px-4 py-10 bg-white shadow-lg sm:rounded-3xl sm:p-20">
            <div className="max-w-md mx-auto">
              <h1 className="mb-4 text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-semibold text-gray-700">
                Profile
              </h1>
              <p className="text-gray-700 mb-2">
                User id: {session.user.userId}
              </p>
              <p className="text-gray-700">
                GitHub username: {session.user.githubUsername}
              </p>
              {/* Additional information */}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page;
