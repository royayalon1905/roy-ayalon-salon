function toKebabCase(key) {
  return key.replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase()
}

// CSP 9.9.2026: style-src בלי 'unsafe-inline'. במקום document.documentElement
// .style.setProperty() (שדורש 'unsafe-inline' לכל שינוי style attribute דרך JS,
// גם עם nonce/hash — אלה חלים רק על <style> אלמנטים, לא על מוטציות JS ל-style
// attribute), בונים כאן מחרוזת CSS יציבה ומזריקים אותה כ-<style> אחד. התוכן
// נגזר במלואו מ-theme (קבוע per-build, לא תלוי קלט משתמש/זמן ריצה), ולכן
// ה-hash שלו יציב — מותר דרך 'sha256-...' ב-style-src ב-public/_headers
// במקום 'unsafe-inline'. אם משנים את הפונקציה הזו או את theme.colors/fonts
// ב-siteConfig.js, חובה לחשב מחדש את ה-hash (sha256 של style.textContent
// המדויק, base64) ולעדכן אותו ב-Content-Security-Policy ב-public/_headers —
// אחרת ה-theme ייחסם ע"י ה-CSP ויקרוס לצבעי ברירת המחדל של הדפדפן.
export function applyTheme(theme) {
  const lines = Object.entries(theme.colors).map(
    ([key, value]) => '  --color-' + toKebabCase(key) + ': ' + value + ';'
  )
  lines.push('  --font-display: ' + theme.fonts.display + ';')
  lines.push('  --font-body: ' + theme.fonts.body + ';')

  const css = ':root {\n' + lines.join('\n') + '\n}'

  const style = document.createElement('style')
  style.textContent = css
  document.head.appendChild(style)
}
