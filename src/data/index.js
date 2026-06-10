import JAVA_DATA     from './java'
import SPRING_DATA   from './spring'
import JAVA_EXTRA    from './java-extra'
import SPRING_EXTRA  from './spring-extra'
import JAVA_EXTRA2   from './java-extra2'
import SPRING_EXTRA2 from './spring-extra2'
import FINAL_EXTRA   from './final-extra'
import FINAL_EXTRA2  from './final-extra2'
import { BATCH2_JAVA, BATCH2_NEW_SECTIONS } from './batch2-java'
import BATCH2_SPRING from './batch2-spring'
import BATCH2_CODING from './batch2-coding'
import BATCH2_DEVOPS from './batch2-devops'
import BATCH3        from './batch3'

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

// Base sections + all extras merged
const BASE_DATA = mergeExtras(
  [...JAVA_DATA, ...SPRING_DATA],
  JAVA_EXTRA,
  SPRING_EXTRA,
  JAVA_EXTRA2,
  SPRING_EXTRA2,
  FINAL_EXTRA,
  FINAL_EXTRA2,
  BATCH2_JAVA,
  BATCH2_SPRING,
  BATCH2_CODING,
  BATCH2_DEVOPS,
  BATCH3,
)

// Append brand-new sections (Generics, Inner Classes)
const ALL_DATA = [...BASE_DATA, ...BATCH2_NEW_SECTIONS]

export default ALL_DATA
