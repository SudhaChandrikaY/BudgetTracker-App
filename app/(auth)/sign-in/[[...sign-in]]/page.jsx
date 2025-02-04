import { SignIn } from "@clerk/nextjs";

export default function Page() {
  return (
    <section className="bg-white">
      <div className="lg:grid lg:min-h-screen lg:grid-cols-12">
        {/* Updated to include your saved Signin image */}
        <aside className="relative block h-16 lg:order-last lg:col-span-5 lg:h-full xl:col-span-6">
          <img
            alt="Track Budget Visualization"
            src="/SignUp.jpg"
            className="absolute inset-0 h-full w-full object-cover"
          />
        </aside>

        <main className="flex items-center justify-center px-8 py-8 sm:px-12 lg:col-span-7 lg:px-16 lg:py-12 xl:col-span-6">
          <div className="max-w-xl lg:max-w-3xl">
            <a className="block text-gray-900" href="/">
              <span className="sr-only">Home</span>
              {/* Updated to use your logo.svg */}
              <img src="/logo.svg" alt="Track Budget Logo" width={67} height={41} />
            </a>

            {/* Creative Welcome Message */}
            <h1 className="mt-6 text-2xl font-bold text-gray-900 sm:text-3xl md:text-4xl p-5">
            Welcome to Budget Tracker 🪙📊

            </h1>

            <SignIn />
          </div>
        </main>
      </div>
    </section>
  );
}
