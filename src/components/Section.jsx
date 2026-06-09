import { useState, useEffect } from 'react'
import { ChevronDown } from 'lucide-react'
import QuestionCard from './QuestionCard'

const COLOR_MAP = {
  java:    { dot: 'bg-red-500',     ring: 'ring-red-500/20',    text: 'text-red-400'     },
  spring:  { dot: 'bg-emerald-500', ring: 'ring-emerald-500/20',text: 'text-emerald-400' },
  micro:   { dot: 'bg-violet-500',  ring: 'ring-violet-500/20', text: 'text-violet-400'  },
  coding:  { dot: 'bg-amber-500',   ring: 'ring-amber-500/20',  text: 'text-amber-400'   },
  db:      { dot: 'bg-cyan-500',    ring: 'ring-cyan-500/20',   text: 'text-cyan-400'    },
  devops:  { dot: 'bg-pink-500',    ring: 'ring-pink-500/20',   text: 'text-pink-400'    },
  agile:   { dot: 'bg-teal-500',    ring: 'ring-teal-500/20',   text: 'text-teal-400'    },
}

export default function Section({ section, studied, toggleStudied, defaultOpen, searchActive }) {
  const [open, setOpen] = useState(defaultOpen || false)

  useEffect(() => {
    if (searchActive) setOpen(true)
  }, [searchActive])

  useEffect(() => {
    if (defaultOpen) setOpen(true)
  }, [defaultOpen])

  const c = COLOR_MAP[section.color] || COLOR_MAP.java
  const total = section.questions.length
  const done = section.questions.filter((_, i) => studied.has(`${section.id}_${i}`)).length
  const pct = total > 0 ? Math.round((done / total) * 100) : 0

  return (
    <div id={`section-${section.id}`}
         className="bg-zinc-900 rounded-2xl border border-zinc-800 overflow-hidden">

      {/* Section header */}
      <button
        onClick={() => setOpen(o => !o)}
        className="w-full flex items-center gap-3 px-5 py-4 hover:bg-zinc-800/50 transition-colors text-left"
      >
        <span className={`w-2.5 h-2.5 rounded-full shrink-0 ${c.dot}`} />
        <div className="flex-1 min-w-0">
          <div className="text-white font-semibold text-sm">{section.title}</div>
          <div className={`text-xs mt-0.5 ${c.text}`}>{section.category}</div>
        </div>

        {/* Progress */}
        <div className="hidden sm:flex items-center gap-2 shrink-0">
          <div className="w-20 h-1 bg-zinc-800 rounded-full overflow-hidden">
            <div className="h-full bg-emerald-500 rounded-full transition-all duration-500"
                 style={{ width: `${pct}%` }} />
          </div>
          <span className="text-[11px] text-zinc-500 w-10 text-right">{done}/{total}</span>
        </div>

        <ChevronDown
          size={16}
          className={`text-zinc-500 shrink-0 transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
        />
      </button>

      {/* Questions list */}
      {open && (
        <div className="border-t border-zinc-800">
          {section.questions.map((q, i) => (
            <QuestionCard
              key={i}
              question={q}
              index={i}
              sectionId={section.id}
              studied={studied.has(`${section.id}_${i}`)}
              onToggleStudied={() => toggleStudied(`${section.id}_${i}`)}
            />
          ))}
        </div>
      )}
    </div>
  )
}
