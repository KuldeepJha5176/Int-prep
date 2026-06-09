import JAVA_DATA     from './java'
import SPRING_DATA    from './spring'
import JAVA_EXTRA     from './java-extra'
import SPRING_EXTRA   from './spring-extra'
import JAVA_EXTRA2    from './java-extra2'
import SPRING_EXTRA2  from './spring-extra2'
import FINAL_EXTRA    from './final-extra'
import FINAL_EXTRA2   from './final-extra2'

const mergeExtras = (base, ...extras) => {
  const merged = {}
  extras.forEach(e => {
    Object.keys(e).forEach(k => {
      merged[k] = [...(merged[k] || []), ...e[k]]
    })
  })
  return base.map(section => ({
    ...section,
    questions: [...section.questions, ...(merged[section.id] || [])],
  }))
}

const ALL_DATA = mergeExtras(
  [...JAVA_DATA, ...SPRING_DATA],
  JAVA_EXTRA,
  SPRING_EXTRA,
  JAVA_EXTRA2,
  SPRING_EXTRA2,
  FINAL_EXTRA,
  FINAL_EXTRA2,
)

export default ALL_DATA
