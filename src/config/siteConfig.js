export const siteConfig = {
  businessInfo: {
    shortName: 'רועי אילון',
    category: 'עיצוב שיער',
    heroEyebrow: 'סטודיו פרימיום לעיצוב שיער',
    heroSubtitle: 'לא רודפים אחרי טרנדים. יוצרים שיער שמספר את הסיפור שלך.',
    footerTagline: 'סטודיו לעיצוב שיער בלב תל אביב. צבע, בליאז׳, החלקות ותספורות — מאז 2012.',
    foundedYear: 2012,
    phone: '03-1234567',
    address: 'שינקין 22, תל אביב',
    mapQuery: 'Sheinkin Street Tel Aviv',
    hours: [
      { day: 'ראשון – חמישי', time: '09:00 – 21:00' },
      { day: 'שישי', time: '08:00 – 15:00' },
      { day: 'שבת', time: 'סגור' },
    ],
    stats: [
      { num: '15+', label: 'שנות ניסיון' },
      { num: '500+', label: 'לקוחות מרוצים' },
      { num: '4.9★', label: 'דירוג גוגל' },
    ],
    socials: [
      { label: 'אינסטגרם', href: '#' },
      { label: 'פייסבוק', href: '#' },
      { label: 'וואטסאפ', href: '#' },
    ],
    accessibility: {
      wheelchairAccess: true,
      accessibleParking: true,
      notes: '',
    },
  },

  nav: {
    ariaLabel: 'ניווט ראשי',
    links: [
      { href: '#services', label: 'שירותים' },
      { href: '#gallery', label: 'עבודות' },
      { href: '#testimonials', label: 'לקוחות ממליצות' },
      { href: '#contact', label: 'צור קשר' },
    ],
    bookCta: 'קבעו תור',
    menuOpenLabel: 'פתיחת תפריט',
    menuCloseLabel: 'סגירת תפריט',
  },

  content: {
    skipToMain: 'דלגו לתוכן הראשי',
    floatingCta: 'קביעת תור',
    hero: {
      ariaLabel: 'כותרת ראשית',
      ctaBook: 'קביעת תור',
      ctaPrices: 'מחירון שירותים',
    },
    services: {
      eyebrow: 'מה אנחנו מציעים',
      title: 'מחירון שירותים',
      staffTabsLabel: 'בחירת מעצב/ת',
    },
    serviceCard: {
      bookLabel: 'להזמנה',
      badges: { women: 'נשים', men: 'גברים' },
    },
    gallery: {
      eyebrow: 'תיק עבודות',
      title: 'כל תמונה מדברת בעד עצמה',
    },
    about: {
      eyebrow: 'הסיפור שלנו',
      title: 'כל שיער מספר סיפור אחר',
      paragraphs: [
        'מה שהתחיל ב־{year} כחדר קטן בשינקין, הפך לכתובת שאליה מגיעים כשרוצים שינוי אמיתי - גוון חדש, אורך אחר, או פשוט מישהי שבאמת מקשיבה לפני שהיא נוגעת בשיער שלך. בלי פשרות על התוצאה, בלי חיפזון בדרך אליה.',
        'הצוות שלנו מתמחה בצבע ובליאז׳, החלקות, ותספורות שנבנות לפי מבנה הפנים והאישיות שלך - לא לפי תמונה שהבאת מאינסטגרם.',
      ],
      foundedNote: 'השנה בה הכל התחיל',
    },
    testimonials: {
      eyebrow: 'לקוחות ממליצות',
      title: 'מה שאומרים עלינו',
      prevLabel: 'ביקורת קודמת',
      nextLabel: 'ביקורת הבאה',
      carouselLabel: 'קרוסלת המלצות לקוחות',
      slideLabel: 'המלצה {current} מתוך {total}',
      positionLabel: 'מוצגת המלצה {current} מתוך {total}',
    },
    contact: {
      eyebrow: 'בואו לבקר',
      title: 'יש שאלה? בואו נדבר',
      form: {
        nameLabel: 'שם',
        namePlaceholder: 'השם שלך',
        nameError: 'נא למלא שם',
        contactLabel: 'טלפון או אימייל',
        contactPlaceholder: '0501234567 או you@example.com',
        contactError: 'נא להזין טלפון או אימייל תקין',
        messageLabel: 'הודעה',
        messagePlaceholder: 'איך נוכל לעזור?',
        messageError: 'נא לכתוב הודעה קצרה',
        submitLabel: 'שליחת הודעה',
        sentTitle: 'ההודעה נשלחה',
        sentBody: 'נחזור אליכם בהקדם. תודה שפניתם אלינו.',
        sendAnotherLabel: 'שליחת הודעה נוספת',
      },
      info: {
        mapTitle: 'מיקום הסטודיו על מפה',
        addressLabel: 'כתובת',
        phoneLabel: 'טלפון',
        hoursLabel: 'שעות פתיחה',
        accessibilityLabel: 'נגישות פיזית במקום',
        accessibilityWheelchairYes: 'המקום נגיש לכיסא גלגלים — כניסה ללא מדרגות',
        accessibilityWheelchairNo: 'יש מדרגה בכניסה למקום',
        accessibilityParkingYes: 'חניה נגישה בקרבת מקום',
      },
    },
    booking: {
      title: 'קביעת תור',
      doneTitle: 'התור נקבע',
      backLabel: 'חזרה',
      closeLabel: 'סגירה',
      serviceStepLabel: 'בחירת שירות',
      staffStepLabel: 'בחירת ספר/ית',
      dateStepLabel: 'בחירת תאריך',
      timeStepLabel: 'בחירת שעה',
      todayLabel: 'היום',
      bookedLabel: 'תפוס',
      pickDateHint: 'בחרו תאריך כדי לראות שעות פנויות',
      nameLabel: 'שם מלא',
      namePlaceholder: 'ישראל ישראלי',
      phoneLabel: 'טלפון נייד',
      phonePlaceholder: '0501234567',
      phoneError: 'מספר טלפון לא תקין — נסו לדוגמה 0501234567',
      consentLabel: 'מעדכנים אותי במבצעים ותזכורות לתור',
      summaryTitle: 'סיכום ההזמנה',
      nextLabel: 'המשך',
      confirmLabel: 'אישור הזמנה',
      dateTimeSummary: 'יום {day}, {date} ל{month} בשעה {time}',
      confirmation: {
        greeting: 'מחכים לך, {name}',
        summary: '{service} עם {barber} — יום {day}, {date} ל{month} בשעה {time}.',
        demoNote: 'זהו דמו — לא נשלח אישור אמיתי.',
        anotherLabel: 'תור נוסף',
        closeLabel: 'סגירה',
      },
    },
    footer: {
      quickNavTitle: 'ניווט מהיר',
      bookingLinkLabel: 'הזמנת תור',
      socialTitle: 'עקבו אחרינו',
      rightsNote: 'כל הזכויות שמורות.',
      demoNote: 'אתר דמו לצורכי הדגמה בלבד',
      legalTitle: 'מידע משפטי',
      accessibilityLinkLabel: 'הצהרת נגישות',
      privacyLinkLabel: 'מדיניות פרטיות',
    },
    legal: {
      backLabel: 'חזרה לעמוד הבית',
      updatedLabel: 'עודכן לאחרונה',
      updatedDate: 'יולי 2026',
      accessibility: {
        path: '/accessibility',
        metaTitle: 'הצהרת נגישות',
        title: 'הצהרת נגישות',
        intro:
          'הסטודיו של {shortName} רואה חשיבות עליונה בהנגשת השירות והמידע באתר לכלל הציבור, לרבות אנשים עם מוגבלות. האתר נבנה ונבדק בהתאם לתקן הישראלי (ת"י) 5568 ולהנחיות WCAG 2.1 ברמת AA, ובהתאם לתקנות שוויון זכויות לאנשים עם מוגבלות (התאמות נגישות לשירות), התשע"ג-2013.',
        sections: [
          {
            heading: 'ההתאמות שבוצעו באתר',
            list: [
              'ניווט מלא מהמקלדת בכל רכיבי האתר, כולל תפריט הניווט וטופס קביעת התור',
              'קישור "דלגו לתוכן הראשי" בתחילת העמוד עבור משתמשי מקלדת וקוראי מסך',
              'מיקוד (focus) חסום בתוך חלון קביעת התור כל עוד הוא פתוח, כך שהמיקוד לא בורח לתוכן שמאחוריו',
              'סגירת חלונות קופצים וכפתורי ניווט זמינים גם באמצעות מקש Esc',
              'טקסט חלופי (alt) תיאורי לכל התמונות באתר',
              'תיוג ARIA לרכיבים אינטראקטיביים - תפריט, קרוסלת ההמלצות וכפתורי הניווט שבה',
              'ניגודיות צבעים העומדת ביחס של לפחות 4.5:1 בין טקסט לרקע',
              'תמיכה מלאה בעברית ובכיוון כתיבה מימין לשמאל (RTL)',
              'מבנה HTML סמנטי המאפשר ניווט בין כותרות ואזורי העמוד באמצעות קוראי מסך',
            ],
          },
          {
            heading: 'רמת הנגישות ומגבלות ידועות',
            paragraphs: [
              'האתר נבדק ונמצא תואם ברובו לדרישות התקן. עם זאת, ייתכנו חלקים שטרם הונגשו במלואם, ובכלל זה תוכן חיצוני המוטמע באתר (כגון מפה אינטראקטיבית) שאינו בשליטתנו המלאה.',
              'אנו ממשיכים לבדוק ולשפר את נגישות האתר על בסיס שוטף.',
            ],
          },
        ],
        contact: {
          heading: 'פנייה בנושא נגישות',
          paragraphs: [
            'נתקלתם בבעיית נגישות באתר, או שיש לכם הצעה לשיפור? נשמח שתפנו אלינו ונטפל בפנייה בהקדם.',
            'אם לא התקבל מענה מספק, ניתן לפנות לנציבות שוויון זכויות לאנשים עם מוגבלות במשרד המשפטים.',
          ],
          roleLabel: 'רכז/ת נגישות',
          phoneLabel: 'טלפון',
        },
      },
      privacy: {
        path: '/privacy',
        metaTitle: 'מדיניות פרטיות',
        title: 'מדיניות פרטיות',
        intro:
          'מדיניות פרטיות זו מסבירה אילו מידע אנו אוספים בעת השימוש באתר {shortName}, כיצד אנו משתמשים בו, ואילו זכויות עומדות לרשותכם ביחס אליו.',
        sections: [
          {
            heading: 'המידע שאנו אוספים',
            paragraphs: [
              'בעת קביעת תור באתר אנו אוספים את שמך המלא, מספר הטלפון שלך, ואת השירות, התאריך והשעה שבחרת.',
              'בעת פנייה דרך טופס יצירת הקשר אנו אוספים את שמך, פרטי התקשרות (טלפון או אימייל) ותוכן ההודעה שכתבת.',
              'האתר אינו אוסף מידע גלישה, אינו משתמש בכלי אנליטיקס, ואינו משתמש בעוגיות מעקב או פרסום.',
            ],
          },
          {
            heading: 'כיצד אנו משתמשים במידע',
            list: [
              'לתיאום, אישור ותזכורת של תורים שנקבעו, לרבות שליחת הודעות בוואטסאפ',
              'למענה על פניות שהתקבלו דרך טופס יצירת הקשר',
              'לשליחת עדכונים ומבצעים - רק אם סימנת הסכמה מפורשת לכך בעת קביעת התור, וניתן לבטלה בכל עת',
            ],
          },
          {
            heading: 'שיתוף מידע עם צדדים שלישיים',
            paragraphs: [
              'לצורך תפעול מערכת התורים אנו משתמשים בספקי שירות טכנולוגיים (כגון מערכת לניהול נתונים ומערכת שליחת הודעות וואטסאפ) הפועלים מטעמנו בלבד ואינם רשאים לעשות שימוש במידע למטרה אחרת.',
              'אנו לא מוכרים ולא משכירים את המידע שלך לצד שלישי לצורכי שיווק.',
            ],
          },
          {
            heading: 'שמירת מידע ואבטחה',
            paragraphs: ['המידע נשמר במערכות מאובטחות, למשך הזמן הנדרש לצורך מתן השירות ולעמידה בדרישות הדין.'],
          },
          {
            heading: 'הזכויות שלך',
            paragraphs: [
              'בהתאם לחוק הגנת הפרטיות, התשמ"א-1981, באפשרותך לעיין במידע השמור עליך, לבקש לתקנו או למוחקו, ולבטל בכל עת הסכמה שנתת לקבלת עדכונים שיווקיים - בפנייה אלינו בפרטי הקשר שבהמשך.',
            ],
          },
          {
            heading: 'עוגיות (Cookies) וגופנים חיצוניים',
            paragraphs: [
              'האתר טוען גופנים (fonts) משרתי Google Fonts, מה שעשוי לשתף עם Google את כתובת ה-IP שלך בעת טעינת העמוד. האתר עצמו אינו משתמש בעוגיות מעקב או פרסום.',
            ],
          },
        ],
        contact: {
          heading: 'יצירת קשר בנושאי פרטיות',
          paragraphs: ['לכל שאלה בנושא פרטיות המידע, ניתן לפנות אלינו בפרטים הבאים:'],
          phoneLabel: 'טלפון',
        },
      },
    },
  },

  servicesData: [
    {
      id: 'color',
      title: 'צבע שיער, גוונים ובליאז׳',
      price: '280₪',
      duration: '90 דק׳',
      desc: 'מגוון עד בליאז׳ טבעי - כל גוון נבנה במיוחד בשבילך, לפי גוון העור ומה שבא לך להרגיש.',
      audience: 'women',
      barberId: 'michal',
    },
    {
      id: 'keratin',
      title: 'החלקות וקרטין',
      price: '450₪',
      duration: '120 דק׳',
      desc: 'טיפול שמחזיר לשיער חלקות, ברק ושליטה - בלי לוותר על התנועה הטבעית שלו.',
      audience: 'women',
      barberId: 'shiran',
    },
    {
      id: 'womens-cut',
      title: 'תספורות ועיצוב נשי',
      price: '150₪',
      duration: '50 דק׳',
      desc: 'תספורת שמתחילה בשיחה על מה שאת רוצה, וממשיכה בגזירה מדויקת לפי מבנה הפנים.',
      audience: 'women',
      barberId: 'roi',
    },
    {
      id: 'blowdry',
      title: 'פן ועיצוב לאירועים',
      price: '120₪',
      duration: '45 דק׳',
      desc: 'תמיד מגיע בול בזמן. פן חלק ליומיום, או עיצוב מיוחד לאירוע שלא שוכחים.',
      audience: 'women',
      barberId: 'roi',
    },
    {
      id: 'extensions',
      title: 'תוספות שיער',
      price: '650₪',
      duration: '150 דק׳',
      desc: 'אורך ונפח שנראים אמיתיים לגמרי. מתאימים לצבע ולמרקם השיער שלך אחד לאחד.',
      audience: 'women',
      barberId: 'michal',
    },
    {
      id: 'mens-cut',
      title: 'תספורת גברים',
      price: '110₪',
      duration: '35 דק׳',
      desc: 'תספורת נקייה ומדויקת, עם גימור על קו השיער שנשאר חד גם שבועות אחרי.',
      audience: 'men',
      barberId: 'itay',
    },
  ],

  staffData: [
    { id: 'roi', name: 'רועי אילון', role: 'מייסד ומעצב שיער ראשי' },
    { id: 'michal', name: 'מיכל בר', role: 'מומחית צבע ובליאז׳' },
    { id: 'shiran', name: 'שירן כהן', role: 'מומחית החלקות וקרטין' },
    { id: 'itay', name: 'איתי גולן', role: 'תספורות גברים' },
  ],

  theme: {
    colors: {
      ink: '#2b221d',
      inkLight: '#3a2e27',
      surface: '#f8f1e7',
      surfaceDim: '#ece0d0',
      primary: '#d9bd86',
      accent: '#aa543c',
      muted: '#786b5f',
      mutedOnDark: '#9c8f82',
    },
    fonts: {
      display: "'Frank Ruhl Libre', serif",
      body: "'Assistant', sans-serif",
    },
    heroImage: 'https://images.unsplash.com/photo-1521590832167-7bcbfaa6381f?w=1920&h=1280&fit=crop&auto=format&q=80',
    heroImageAlt: 'פנים הסטודיו - כיסאות עיצוב שיער וסביבת עבודה',
  },
}

/** Fill {placeholder} slots in a config template string. */
export function fmt(template, vars = {}) {
  return template.replace(/\{(\w+)\}/g, (match, key) => (vars[key] ?? match))
}
