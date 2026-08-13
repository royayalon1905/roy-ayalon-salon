import RazorReveal from './RazorReveal'
import { siteConfig } from '../config/siteConfig'

const { staffData, content } = siteConfig
const { team } = content

// חדש 10.8.2026 — רצועה כהה נפרדת לצוות, לפי הרפרנס מ-Claude Design (במקום
// שהצוות היה חלק מסקשן "הסיפור שלנו"). עדיין 4 אנשי צוות (לא 3 כמו ברפרנס —
// רועי אישר שהמספר האמיתי בעסק הוא 4). אווטארים עדיין גרדיאנט placeholder עם
// האות הראשונה — לא תמונות אמיתיות. TODO: להחליף בתמונות אמיתיות של הצוות.
const AVATAR_GRADIENTS = [
  'linear-gradient(135deg, #3e7c6f, #1e2b26)',
  'linear-gradient(135deg, #9fc4b8, #2c5a50)',
  'linear-gradient(135deg, #2c5a50, #22302b)',
  'linear-gradient(135deg, #5a6862, #1e2b26)',
]

export default function Team() {
  return (
    <section id="team" className="border-b-[3px] border-b-[#9fb8b0] bg-ink px-6 py-24 md:px-10 lg:py-32">
      <div className="mx-auto max-w-5xl text-center">
        <span className="text-xs font-semibold tracking-[0.3em] text-primary-on-dark">{team.eyebrow}</span>
        <RazorReveal as="h2" className="mx-auto mt-4 overflow-hidden font-display text-4xl text-surface sm:text-5xl">
          {team.title}
        </RazorReveal>

        <div className="mt-14 grid grid-cols-2 gap-6 sm:grid-cols-4">
          {staffData.map((member, i) => (
            <div key={member.id} className="flex flex-col items-center text-center">
              <div
                className="flex h-24 w-24 items-center justify-center rounded-full text-2xl font-display text-surface-dim"
                style={{ background: AVATAR_GRADIENTS[i % AVATAR_GRADIENTS.length] }}
                aria-hidden="true"
              >
                {member.name.trim()[0]}
              </div>
              <span className="mt-4 text-sm font-semibold text-surface">{member.name}</span>
              <span className="mt-0.5 text-xs text-muted-on-dark">{member.role}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
