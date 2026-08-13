import { siteConfig } from '../config/siteConfig'

const { businessInfo, content } = siteConfig
const { footer } = content

// עודכן 10.8.2026 — תוקן באג ניגודיות אמיתי שנמצא ע"י בדיקת axe-core: הפוטר כהה
// (bg-ink-light) אבל השתמש בצבעי טקסט text-muted/text-primary (מיועדים לרקע בהיר) —
// עכשיו text-muted-on-dark/text-primary-on-dark, כמו שכבר נעשה נכון בשאר האתר.
// פושט 10.8.2026 — לפי בקשת רועי: הוסרו עמודת "ניווט מהיר" (כפילות של הנאבבר)
// ועמודת "רשתות חברתיות" (businessInfo.socials לא בשימוש בשום מקום אחר, נבדק לפני ההסרה).
// עכשיו שורה אחת פשוטה: שם המותג בצד אחד, זכויות יוצרים + קישורים משפטיים בצד שני —
// תואם את הפשטות של הרפרנס.
export default function Footer() {
  return (
    <footer className="bg-ink-light px-6 py-8 md:px-10">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 text-sm sm:flex-row">
        <p className="font-display text-lg text-surface">
          <span className="font-light">{businessInfo.shortName}</span>{' '}
          <span className="text-primary-on-dark">·</span> {businessInfo.category}
        </p>

        <div className="flex flex-col items-center gap-3 text-xs text-surface-dim sm:flex-row">
          <p>© {new Date().getFullYear()} {businessInfo.shortName}. {footer.rightsNote}</p>
          <nav aria-label={footer.legalTitle} className="flex gap-4">
            <a href={content.legal.accessibility.path} className="text-surface-dim hover:text-primary-on-dark">{footer.accessibilityLinkLabel}</a>
            <a href={content.legal.privacy.path} className="text-surface-dim hover:text-primary-on-dark">{footer.privacyLinkLabel}</a>
          </nav>
        </div>
      </div>
    </footer>
  )
}
