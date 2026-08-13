import { useEffect, useState } from 'react'

const STORAGE_KEY = 'a11y-prefs-v1'

const DEFAULTS = {
  fontScale: 0, // 0 = normal, 1 = +12.5%, 2 = +25%
  highContrast: false,
  grayscale: false,
  stopAnimations: false,
  highlightLinks: false,
}

function load() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return DEFAULTS
    return { ...DEFAULTS, ...JSON.parse(raw) }
  } catch {
    return DEFAULTS
  }
}

// חדש 10.8.2026 — ווידג'ט נגישות אמיתי (לא רק לינק להצהרת נגישות כמו קודם).
// שומר העדפות ב-localStorage (אתר אמיתי, לא Claude artifact - מותר ותקין כאן)
// ומיישם אותן כ-class-ים על ה-<html>, שמוגדרים ב-index.css.
export function useAccessibilityPrefs() {
  const [prefs, setPrefs] = useState(load)

  useEffect(() => {
    const root = document.documentElement
    root.classList.toggle('a11y-contrast', prefs.highContrast)
    root.classList.toggle('a11y-grayscale', prefs.grayscale)
    root.classList.toggle('a11y-stop-animations', prefs.stopAnimations)
    root.classList.toggle('a11y-highlight-links', prefs.highlightLinks)
    root.classList.remove('a11y-font-1', 'a11y-font-2')
    if (prefs.fontScale === 1) root.classList.add('a11y-font-1')
    if (prefs.fontScale === 2) root.classList.add('a11y-font-2')
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(prefs))
    } catch {
      // localStorage לא זמין (מצב פרטי וכו') - לא קריטי, פשוט לא נשמר בין ביקורים
    }
  }, [prefs])

  function toggle(key) {
    setPrefs((p) => ({ ...p, [key]: !p[key] }))
  }

  function cycleFontScale() {
    setPrefs((p) => ({ ...p, fontScale: (p.fontScale + 1) % 3 }))
  }

  function reset() {
    setPrefs(DEFAULTS)
  }

  return { prefs, toggle, cycleFontScale, reset }
}
