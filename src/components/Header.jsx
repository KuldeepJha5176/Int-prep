import { Menu, Search, X } from 'lucide-react'

export default function Header({ search, setSearch, sidebarOpen, setSidebarOpen, studied, total }) {
  const pct = total > 0 ? Math.round((studied / total) * 100) : 0

  return (
    <header className="sticky top-0 z-50 flex items-center gap-3 px-4 h-14
                       bg-zinc-900 border-b border-zinc-800 shrink-0">
      {/* Hamburger */}
      <button
        onClick={() => setSidebarOpen(o => !o)}
        className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
      >
        <Menu size={18} />
      </button>

      {/* Logo */}
      <span className="font-bold text-white text-sm hidden sm:block whitespace-nowrap">
        ☕ Java Interview Prep
      </span>

      {/* Search */}
      <div className="flex-1 max-w-xl mx-auto relative">
        <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500 pointer-events-none" />
        <input
          type="text"
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search questions, topics, concepts..."
          className="w-full bg-zinc-800 border border-zinc-700 rounded-lg pl-8 pr-8 py-1.5
                     text-sm text-white placeholder-zinc-500 outline-none
                     focus:border-zinc-500 focus:bg-zinc-800 transition-colors"
        />
        {search && (
          <button
            onClick={() => setSearch('')}
            className="absolute right-2 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-white"
          >
            <X size={14} />
          </button>
        )}
      </div>

      {/* Progress */}
      <div className="hidden sm:flex items-center gap-2 shrink-0">
        <div className="w-24 h-1.5 bg-zinc-800 rounded-full overflow-hidden">
          <div
            className="h-full bg-emerald-500 rounded-full transition-all duration-500"
            style={{ width: `${pct}%` }}
          />
        </div>
        <span className="text-xs text-zinc-400 whitespace-nowrap">
          {studied}/{total}
        </span>
      </div>
    </header>
  )
}
