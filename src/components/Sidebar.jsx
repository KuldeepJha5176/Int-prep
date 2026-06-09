const CAT_COLORS = {
  'Core Java':           'bg-red-500',
  'Spring / Spring Boot':'bg-emerald-500',
  'Microservices':       'bg-violet-500',
  'Coding Questions':    'bg-amber-500',
  'Database':            'bg-cyan-500',
  'DevOps & Tools':      'bg-pink-500',
  'Agile':               'bg-teal-500',
}

export default function Sidebar({ open, data, studied, activeSection, onSelect }) {
  // group sections by category
  const cats = {}
  data.forEach(sec => {
    if (!cats[sec.category]) cats[sec.category] = []
    cats[sec.category].push(sec)
  })

  return (
    <aside
      className={`shrink-0 bg-zinc-900 border-r border-zinc-800 overflow-y-auto
                  transition-all duration-300 ${open ? 'w-64' : 'w-0 overflow-hidden'}`}
    >
      <div className="w-64 py-3">
        {Object.entries(cats).map(([cat, sections]) => (
          <div key={cat} className="mb-2">
            <p className="px-4 py-1.5 text-[10px] font-bold uppercase tracking-widest text-zinc-600">
              {cat}
            </p>
            {sections.map(sec => {
              const total = sec.questions.length
              const done = sec.questions.filter((_, i) =>
                studied.has(`${sec.id}_${i}`)
              ).length
              const dot = CAT_COLORS[sec.category] || 'bg-zinc-500'
              const active = activeSection === sec.id

              return (
                <button
                  key={sec.id}
                  onClick={() => onSelect(sec.id)}
                  className={`w-full flex items-center gap-2.5 px-4 py-2 text-left text-sm
                              transition-colors group
                              ${active
                                ? 'bg-zinc-800 text-white'
                                : 'text-zinc-400 hover:text-white hover:bg-zinc-800/50'}`}
                >
                  <span className={`w-2 h-2 rounded-full shrink-0 ${dot}`} />
                  <span className="flex-1 truncate text-[13px]">{sec.title}</span>
                  <span className={`text-[10px] shrink-0 px-1.5 py-0.5 rounded-full
                                   ${done === total && total > 0
                                     ? 'bg-emerald-900/50 text-emerald-400'
                                     : 'bg-zinc-800 text-zinc-500'}`}>
                    {done}/{total}
                  </span>
                </button>
              )
            })}
          </div>
        ))}
      </div>
    </aside>
  )
}
