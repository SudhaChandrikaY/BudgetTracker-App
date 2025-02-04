"use client";
import React from 'react';
import Image from 'next/image';

function Hero() {
  return (
    <div className="bg-gray-50">
      {/* Main Hero Section */}
      <section className="flex items-center justify-center py-24">
        <div className="text-center max-w-screen-lg px-4">
          <h1 className="text-4xl font-extrabold sm:text-6xl text-gray-900">
            Master Your Finances
            <span className="block text-gray-800">Take Charge of Your Budget</span>
          </h1>

          <p className="mt-4 text-lg text-gray-600 sm:text-xl">
            Track your expenses, control your spending, and achieve your financial goals efficiently.
          </p>

          <div className="mt-6">
            <a
              href="dashboard"
              className="inline-block rounded bg-gray-900 px-12 py-3 text-lg font-medium text-white shadow hover:bg-gray-700 focus:outline-none"
            >
              Get Started
            </a>
          </div>
        </div>
      </section>

      {/* Dashboard Preview Section */}
      <div className="flex flex-col items-center justify-center py-12">
        <h2 className="font-bold text-3xl mb-6 text-gray-900">Explore Your Dashboard</h2>
        <Image src="/dashboard.jpg" alt="Dashboard Preview" width={1000} height={700} />
        <div className="mt-4 flex flex-wrap gap-4 justify-center">
          <a
            href="dashboard"
            className="block w-full rounded bg-gray-900 px-12 py-3 text-sm font-medium text-white shadow hover:bg-gray-700 focus:outline-none sm:w-auto"
          >
            Go to Dashboard
          </a>
        </div>
      </div>
    </div>
  );
}

export default Hero;
