"use client";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import RecipesCards from "@/components/RecipesCards";
import Search from "@/components/Search";
import { useState } from "react";

export default function Home() {
  const [searchTerm, setSearchTerm] = useState<string>("");
  return (
    <div className="min-h-screen font-[family-name:var(--font-geist-sans)]">
      <main className="mx-auto px-4 sm:px-6 lg:px-8 max-w-[1400px] grid place-items-start gap-5 py-8 sm:py-12">
        <Navbar />
        <Search value={searchTerm} onChange={setSearchTerm} />
        <RecipesCards searchTerm={searchTerm} />
        <Footer />
      </main>
    </div>
  );
}
