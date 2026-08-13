// עודכן 10.8.2026 — מבנה חדש: 6 זוגות "לפני/אחרי" לפי מפרט העיצוב החדש
// (במקום גלריית תמונות בודדות). כל זוג הוא "משבצת" גרדיאנט זמנית — לא תמונות
// אמיתיות — בדיוק כמו מנגנון ה"משבצות" בקובץ העיצוב שהתקבל מרועי. TODO: להחליף
// כל beforeImage/afterImage בתמונת עבודה אמיתית לפני שהאתר עולה ללקוח אמיתי.
export const gallery = [
  {
    id: 1,
    caption: 'גוון חדש ובליאז׳',
    before: { gradient: 'linear-gradient(135deg, #5a6862, #22302b)', alt: 'לפני — שיער בגוון אחיד' },
    after: { gradient: 'linear-gradient(135deg, #9fc4b8, #3e7c6f)', alt: 'אחרי — בליאז׳ טבעי' },
  },
  {
    id: 2,
    caption: 'תספורת נשים מדויקת',
    before: { gradient: 'linear-gradient(135deg, #8a958f, #5a6862)', alt: 'לפני — קצוות לא אחידים' },
    after: { gradient: 'linear-gradient(135deg, #3e7c6f, #1e2b26)', alt: 'אחרי — תספורת מעוצבת' },
  },
  {
    id: 3,
    caption: 'שיער חלק ובריא',
    before: { gradient: 'linear-gradient(135deg, #22302b, #5a6862)', alt: 'לפני — שיער פרוע' },
    after: { gradient: 'linear-gradient(135deg, #eef5f2, #9fc4b8)', alt: 'אחרי — שיער חלק ובריא' },
  },
  {
    id: 4,
    caption: 'עיצוב תלתלים',
    before: { gradient: 'linear-gradient(135deg, #5a6862, #2c5a50)', alt: 'לפני — שיער ישר' },
    after: { gradient: 'linear-gradient(135deg, #2c5a50, #9fc4b8)', alt: 'אחרי — תלתלים מעוצבים' },
  },
  {
    id: 5,
    caption: 'גימור זקן מוקפד',
    before: { gradient: 'linear-gradient(135deg, #1e2b26, #8a958f)', alt: 'לפני — זקן לא מסודר' },
    after: { gradient: 'linear-gradient(135deg, #22302b, #3e7c6f)', alt: 'אחרי — זקן מוקפד' },
  },
  {
    id: 6,
    caption: 'תספורת גברים נקייה',
    before: { gradient: 'linear-gradient(135deg, #8a958f, #22302b)', alt: 'לפני — תספורת לא מסודרת' },
    after: { gradient: 'linear-gradient(135deg, #1e2b26, #3e7c6f)', alt: 'אחרי — תספורת נקייה' },
  },
]
