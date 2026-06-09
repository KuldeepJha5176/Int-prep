import { useState, useEffect, useMemo } from 'react'
import ALL_DATA from './data/index'
import Header from './components/Header'
import Sidebar from './components/Sidebar'
import Section from './components/Section'

export default function App() {
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [search, setSearch] = useState('')
  const [studied, setStudied] = useState(() => {
    try { return new Set(JSON.parse(localStorage.getItem('ip-studied') || '[]')) }
    catch { return new Set() }
  })
  const [activeSection, setActiveSection] = useState(null)

  useEffect(() => {
    localStorage.setItem('ip-studied', JSON.stringify([...studied]))
  }, [studied])

  const toggleStudied = (id) => {
    setStudied(prev => {
      const next = new Set(prev)
      next.has(id) ? next.delete(id) : next.add(id)
      return next
    })
  }

  const filteredData = useMemo(() => {
    if (!search.trim()) return ALL_DATA
    const q = search.toLowerCase()
    return ALL_DATA.map(sec => ({
      ...sec,
      questions: sec.questions.filter(ques =>
        ques.q.toLowerCase().includes(q) ||
        ques.s.toLowerCase().includes(q) ||
        (ques.tags || []).some(t => t.toLowerCase().includes(q))
      ),
    })).filter(s => s.questions.length > 0)
  }, [search])

  const total = ALL_DATA.reduce((s, sec) => s + sec.questions.length, 0)

  const scrollToSection = (id) => {
    setActiveSection(id)
    const el = document.getElementById('section-' + id)
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  return (
    <div className="dark min-h-screen bg-zinc-950 text-white flex flex-col">
      <Header
        search={search}
        setSearch={setSearch}
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        studied={studied.size}
        total={total}
      />
      <div className="flex flex-1 overflow-hidden" style={{ height: 'calc(100vh - 56px)' }}>
        <Sidebar
          open={sidebarOpen}
          data={ALL_DATA}
          studied={studied}
          activeSection={activeSection}
          onSelect={scrollToSection}
        />
        <main className="flex-1 overflow-y-auto p-4 lg:p-6 space-y-3">
          {filteredData.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-24 text-zinc-600">
              <span className="text-4xl mb-3">🔍</span>
              <p>No questions match <span className="text-zinc-400">"{search}"</span></p>
            </div>
          ) : (
            filteredData.map(section => (
              <Section
                key={section.id}
                section={section}
                studied={studied}
                toggleStudied={toggleStudied}
                defaultOpen={activeSection === section.id}
                searchActive={!!search.trim()}
              />
            ))
          )}
        </main>
      </div>
    </div>
  )
}
