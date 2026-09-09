// עודכן 10.8.2026 — מבנה חדש: 6 זוגות "לפני/אחרי" לפי מפרט העיצוב החדש
// (במקום גלריית תמונות בודדות). כל זוג הוא "משבצת" גרדיאנט זמנית — לא תמונות
// אמיתיות — בדיוק כמו מנגנון ה"משבצות" בקובץ העיצוב שהתקבל מרועי. TODO: להחליף
// כל beforeImage/afterImage בתמונת עבודה אמיתית לפני שהאתר עולה ללקוח אמיתי.
export const gallery = [
  {
    id: 1,
    caption: 'גוון חדש ובליאז׳',
    before: { class: 'gallery-1-before', alt: 'לפני — שיער בגוון אחיד' },
    after: { class: 'gallery-1-after', alt: 'אחרי — בליאז׳ טבעי' },
  },
  {
    id: 2,
    caption: 'תספורת נשים מדויקת',
    before: { class: 'gallery-2-before', alt: 'לפני — קצוות לא אחידים' },
    after: { class: 'gallery-2-after', alt: 'אחרי — תספורת מעוצבת' },
  },
  {
    id: 3,
    caption: 'שיער חלק ובריא',
    before: { class: 'gallery-3-before', alt: 'לפני — שיער פרוע' },
    after: { class: 'gallery-3-after', alt: 'אחרי — שיער חלק ובריא' },
  },
  {
    id: 4,
    caption: 'עיצוב תלתלים',
    before: { class: 'gallery-4-before', alt: 'לפני — שיער ישר' },
    after: { class: 'gallery-4-after', alt: 'אחרי — תלתלים מעוצבים' },
  },
  {
    id: 5,
    caption: 'גימור זקן מוקפד',
    before: { class: 'gallery-5-before', alt: 'לפני — זקן לא מסודר' },
    after: { class: 'gallery-5-after', alt: 'אחרי — זקן מוקפד' },
  },
  {
    id: 6,
    caption: 'תספורת גברים נקייה',
    before: { class: 'gallery-6-before', alt: 'לפני — תספורת לא מסודרת' },
    after: { class: 'gallery-6-after', alt: 'אחרי — תספורת נקייה' },
  },
]
