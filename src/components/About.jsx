import RazorReveal from './RazorReveal'
import { siteConfig } from '../config/siteConfig'

const { businessInfo } = siteConfig

export default function About() {
  return (
    <section id="about" className="bg-cream px-6 py-24 md:px-10 lg:py-32">
      <div className="mx-auto max-w-2xl text-center">
        <span className="text-xs font-semibold tracking-[0.3em] text-burgundy">הסיפור שלנו</span>
        <RazorReveal as="h2" className="mx-auto mt-4 overflow-hidden font-display text-4xl text-charcoal sm:text-5xl">
          כל שיער מספר סיפור אחר
        </RazorReveal>

        <p className="mt-6 leading-relaxed text-stone">
          מה שהתחיל ב־{businessInfo.foundedYear} כחדר קטן בשינקין, הפך לכתובת שאליה מגיעים כשרוצים שינוי אמיתי -
          גוון חדש, אורך אחר, או פשוט מישהי שבאמת מקשיבה לפני שהיא נוגעת בשיער שלך.
          בלי פשרות על התוצאה, בלי חיפזון בדרך אליה.
        </p>
        <p className="mt-4 leading-relaxed text-stone">
          הצוות שלנו מתמחה בצבע ובליאז׳, החלקות, ותספורות שנבנות לפי מבנה הפנים והאישיות שלך -
          לא לפי תמונה שהבאת מאינסטגרם.
        </p>

        <div className="mx-auto mt-8 inline-flex items-center gap-2 border border-charcoal/15 px-4 py-2">
          <span className="font-display text-lg text-gold">{businessInfo.foundedYear}</span>
          <span className="text-sm text-stone">השנה בה הכל התחיל</span>
        </div>
      </div>
    </section>
  )
}
