"use client";

import { useMemo, useState } from "react";
import { useToast } from "@/components/ui/Toast";
import { Avatar } from "@/components/ui/Avatar";
import { Store, Search, MessageSquare, BadgeCheck } from "lucide-react";

type Persona = {
  name: string;
  initials: string;
  role: string;
  category: string;
  tagline: string;
  chats: number;
};

const CATEGORIES = ["All", "Founders", "Investors", "Recruiters", "Advisors", "Engineers"];

const PERSONAS: Persona[] = [
  { name: "Maya Rao", initials: "MR", role: "Founder · Seed-stage SaaS", category: "Founders", tagline: "Ask me about going from idea to first ten paying customers without a sales team.", chats: 320 },
  { name: "Dana Cho", initials: "DC", role: "Investor · Pre-seed & Seed", category: "Investors", tagline: "I share candid feedback on decks and the metrics I actually look for before a first check.", chats: 512 },
  { name: "Alex Chen", initials: "AC", role: "Recruiter · Technical Talent", category: "Recruiters", tagline: "How to stand out in engineering interviews and negotiate offers like you have leverage.", chats: 244 },
  { name: "Priya Nair", initials: "PN", role: "Advisor · GTM Strategy", category: "Advisors", tagline: "Positioning, pricing, and finding the wedge that turns a feature into a real company.", chats: 188 },
  { name: "Marcus Lee", initials: "ML", role: "Investor · Series A", category: "Investors", tagline: "I help founders pressure-test growth stories and prep for the partner meeting grind.", chats: 401 },
  { name: "Jordan Reyes", initials: "JR", role: "Founder · Consumer Apps", category: "Founders", tagline: "Lessons from two launches and one shutdown - retention beats acquisition, every time.", chats: 276 },
  { name: "Sam Patel", initials: "SP", role: "Engineer · Staff, Distributed Systems", category: "Engineers", tagline: "Scaling, on-call sanity, and how to grow from senior to staff without burning out.", chats: 333 },
  { name: "Riley Okafor", initials: "RO", role: "Recruiter · Exec & Leadership", category: "Recruiters", tagline: "What hiring managers really screen for when filling director and VP roles.", chats: 159 },
  { name: "Devon Wu", initials: "DW", role: "Advisor · Fundraising Ops", category: "Advisors", tagline: "Building a data room, running a tight raise, and keeping investors warm between rounds.", chats: 207 },
];

export function MarketplaceView() {
  const toast = useToast();
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("All");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return PERSONAS.filter((p) => {
      const matchesCategory = category === "All" || p.category === category;
      const matchesQuery =
        !q ||
        p.name.toLowerCase().includes(q) ||
        p.role.toLowerCase().includes(q) ||
        p.tagline.toLowerCase().includes(q);
      return matchesCategory && matchesQuery;
    });
  }, [query, category]);

  return (
    <div className="mx-auto w-full max-w-[820px] px-6 py-9 animate-fade-in">
      <header className="mb-6 flex items-start gap-3">
        <Store className="mt-1 text-accent" size={26} />
        <div>
          <h1 className="font-serif text-[26px] tracking-tight">Marketplace</h1>
          <p className="mt-1 text-muted">Discover and chat with other people&apos;s personas.</p>
        </div>
      </header>

      <div className="flex items-center gap-3 rounded-2xl border border-line bg-surface px-4 py-3 focus-within:border-accent">
        <Search className="text-muted" size={18} />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search personas by name, role, or tagline…"
          className="w-full bg-transparent text-ink outline-none placeholder:text-muted"
        />
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        {CATEGORIES.map((c) => {
          const active = c === category;
          return (
            <button
              key={c}
              onClick={() => setCategory(c)}
              className={`rounded-full px-4 py-1.5 text-[13px] transition-colors ${
                active ? "bg-accent-soft text-accent" : "text-ink-soft hover:bg-paper-2"
              }`}
            >
              {c}
            </button>
          );
        })}
      </div>

      <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((p) => (
          <div key={p.name} className="flex flex-col rounded-2xl border border-line bg-surface p-4">
            <div className="flex items-center gap-3">
              <Avatar initials={p.initials} size={44} />
              <div className="min-w-0">
                <div className="flex items-center gap-1">
                  <span className="truncate font-medium text-ink">{p.name}</span>
                  <BadgeCheck className="shrink-0 text-accent" size={15} />
                </div>
                <p className="truncate text-[12px] text-muted">{p.role}</p>
              </div>
            </div>

            <p className="mt-3 line-clamp-2 text-[13px] text-ink-soft">{p.tagline}</p>

            <p className="mt-3 text-[12px] text-muted">{p.chats} chats · replies in your voice</p>

            <button
              onClick={() => toast("Opening persona… (mock)", "info")}
              className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl px-4 py-2 text-[13px] font-medium text-[var(--accent-ink)]"
              style={{ background: "var(--accent)" }}
            >
              <MessageSquare size={16} />
              Chat
            </button>
          </div>
        ))}
      </div>

      {filtered.length === 0 && (
        <p className="mt-10 text-center text-muted">No personas match your search.</p>
      )}
    </div>
  );
}
