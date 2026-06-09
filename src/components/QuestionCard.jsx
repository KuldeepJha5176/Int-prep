import { useState } from 'react'
import { ChevronDown, Check } from 'lucide-react'

// Colored pill palette (cycles for each tag)
const TAG_COLORS = [
  'bg-blue-600/80 text-blue-200 ring-blue-500/30',
  'bg-teal-700/80 text-teal-200 ring-teal-500/30',
  'bg-violet-700/80 text-violet-200 ring-violet-500/30',
  'bg-rose-700/80 text-rose-200 ring-rose-500/30',
  'bg-amber-700/80 text-amber-200 ring-amber-500/30',
  'bg-emerald-700/80 text-emerald-200 ring-emerald-500/30',
  'bg-indigo-700/80 text-indigo-200 ring-indigo-500/30',
  'bg-pink-700/80 text-pink-200 ring-pink-500/30',
  'bg-cyan-700/80 text-cyan-200 ring-cyan-500/30',
  'bg-orange-700/80 text-orange-200 ring-orange-500/30',
]

export default function QuestionCard({ question, index, sectionId, studied, onToggleStudied }) {
  const [expanded, setExpanded] = useState(false)

  return (
    <div className={`border-b border-zinc-800/70 last:border-0 transition-colors
                     ${expanded ? 'bg-[#111113]' : 'hover:bg-zinc-800/20'}`}>

      {/* ── Question row ── */}
      <div
        className="flex items-start gap-3 px-5 py-4 cursor-pointer"
        onClick={() => setExpanded(e => !e)}
      >
        {/* Checkbox */}
        <button
          onClick={e => { e.stopPropagation(); onToggleStudied() }}
          className={`mt-0.5 shrink-0 w-5 h-5 rounded-md border flex items-center justify-center
                      transition-all duration-150
                      ${studied
                        ? 'bg-emerald-500 border-emerald-500'
                        : 'border-zinc-700 hover:border-zinc-500 bg-transparent'}`}
        >
          {studied && <Check size={11} strokeWidth={3} className="text-white" />}
        </button>

        {/* Q number */}
        <span className="text-[11px] text-zinc-600 mt-0.5 shrink-0 w-5">Q{index + 1}</span>

        {/* Text */}
        <div className="flex-1 min-w-0">
          <p className={`text-sm font-semibold leading-snug transition-colors
                         ${studied ? 'text-zinc-400 line-through decoration-zinc-600' : 'text-white'}`}>
            {question.q}
          </p>
          <p className="text-xs text-zinc-500 mt-1 leading-relaxed line-clamp-2">
            {question.s}
          </p>
        </div>

        {/* Expand chevron */}
        <ChevronDown
          size={15}
          className={`text-zinc-600 shrink-0 mt-0.5 transition-transform duration-200
                       ${expanded ? 'rotate-180 text-zinc-400' : ''}`}
        />
      </div>

      {/* ── Expanded detail (matches the screenshot) ── */}
      {expanded && (
        <div className="px-5 pb-6 pt-2 ml-8">

          {/* Large question title */}
          <h3 className="text-white font-bold text-lg leading-snug mb-4">
            {question.q}
          </h3>

          {/* Colored concept tags */}
          {question.tags && question.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-5">
              {question.tags.map((tag, i) => (
                <span
                  key={tag}
                  className={`${TAG_COLORS[i % TAG_COLORS.length]}
                              text-[12px] font-medium px-3 py-1 rounded-full ring-1`}
                >
                  {tag}
                </span>
              ))}
            </div>
          )}

          {/* HTML content — styled by .detail-content in index.css */}
          <div
            className="detail-content"
            dangerouslySetInnerHTML={{ __html: question.d }}
          />
        </div>
      )}
    </div>
  )
}
