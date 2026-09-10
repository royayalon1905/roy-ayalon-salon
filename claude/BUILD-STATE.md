# BUILD-STATE — לופ ROYA 2.0

> נוצר 10.9.2026 (session 1). כל איטרציה מתחילה כאן וממשיכה מהפריט הראשון שאינו DONE/BLOCKED/SKIPPED.
> סטטוסים: TODO / IN-PROGRESS / DONE / BLOCKED (סיבה) / BLOCKED-external (סיבה) / SKIPPED (סיבה).
> מקור ההוראות: `ROYA-2.0-תוספת-בנייה-10-9-2026.md` (קובע), `בריף-בנייה-מאסטר-ROYA-2.0-9-9-2026.md`.

## מצב סביבה (נבדק 10.9.2026)
- Supabase branch: **אין**. עלות branch = $0.01344/שעה (`get_cost`). אסור לאשר → migrations נכתבות מקומית ב-`salon-demo/supabase/migrations-roya2/` וממתינות להחלה (ראו DECISIONS D3). אין Supabase CLI ואין Docker במחשב.
- n8n: 38 workflows קיימים. קיימים כבר (active:false, Green-API מנוטרל): Win-back, VIP Loyalty Threshold, VIP Targeted Campaigns, Monthly Report MID, Roy Monthly Client Report. חדשים נבנים כ-DRAFT נפרדים בשם `ROYA2 - ...` (D7).
- gh CLI: **לא מותקן** → repo GitHub ל-roya-owner-app נוצר ידנית ע"י רועי (D4).
- salon-alon worktree: `C:\Users\Ayalon\salon-alon-roya2` ענף `roya-2-customer` מ-HEAD 8766510. עץ העבודה המקורי לא נגע.
- roy-landing: ענף נוכחי בעץ `qa-audit-9-9-2026` (מכיל את תיקון 054-968-5982, commit fa2f553) → בסיס ל-`roya-2-landing` (D5).

## שלב 0
| פריט | סטטוס | תאריך | commit/workflow |
|---|---|---|---|
| 0.1 בקשת ביקורת Google (post_visit_review_request, DRAFT) | TODO | | |
| 0.2 הסרת טענות מהאתר | SKIPPED (הוחלט 10.9 לבנות במקום להסיר) | 10.9 | |
| 0.3 "בקרוב" ב-VIP | SKIPPED (הוחלט 10.9 לבנות במקום להסיר) | 10.9 | |
| 0.4 טקסטים חסרים באתר החי | TODO | | |

## שלב 1 — roya-owner-app
| פריט | סטטוס | תאריך | commit |
|---|---|---|---|
| 1.1 שלד (Vite+React, RTL, PWA, כניסה) | TODO | | |
| 1.2 migration mt_users + RLS + GRANT | TODO | | |
| 1.3 Google Calendar חד-כיווני (DRAFT) | TODO | | |
| 1.4 מסך בית "התורים להיום" | TODO | | |
| 1.5 יומן יום/שבוע + קביעה ידנית + אישור/דחייה | TODO | | |
| 1.6 חסימות + חגי ישראל | TODO | | |
| 1.7 לקוחות (רשימה + כרטיס מלא) | TODO | | |
| 1.8 דוחות + CSV | TODO | | |
| 1.9 הגדרות עסק (שעות, שירותים, צוות, חיץ) | TODO | | |
| 1.10 עובד: הזמנה בקישור, רואה רק את שלו | TODO | | |
| 1.x vibesec + צילומי מסך | TODO | | |

## שלב 2 — אוטומציות WhatsApp (DRAFT)
| פריט | סטטוס | תאריך | workflow id |
|---|---|---|---|
| 2.1 אישור הגעה 2 כפתורים (T-24h) | TODO | | |
| N-1 תזכורת בוקר 09:00 batch | TODO | | |
| 2.2 ביטול בלחיצה + חלון ביטול + WAITLIST | TODO | | |
| 2.3 הרשמה עצמית לרשימת המתנה (salon-alon-roya2) | TODO | | |
| 2.4 "לא חזרת מזמן" (60 יום, config) | TODO | | |
| 2.5 יום הולדת | TODO | | |
| 2.6 קמפיין/תפוצה מהאפליקציה | TODO | | |
| 2.7 הודעות מתוזמנות | TODO | | |
| 2.8 חסימת מבריז | TODO | | |

## שלב 3 — צוות
| פריט | סטטוס | תאריך | commit |
|---|---|---|---|
| 3.1 הרשאות owner/staff/manager | TODO | | |
| 3.2 הכנסות לפי עובד | TODO | | |
| 3.3 חשבון לעובד + קישור הצטרפות | TODO | | |
| N-2 מגבלת צוות לפי מסלול (1/2/5) | TODO | | |
| N-3 מחירון לכל איש צוות (mt_staff_service_prices) | TODO | | |

## שלב 4 — כסף (מינימלי)
| פריט | סטטוס | תאריך | commit |
|---|---|---|---|
| 4.1 רישום תשלום + יתרה פתוחה (mt_payments) | TODO | | |
| 2.9 תזכורת חוב בוואטסאפ | TODO | | |

## שלב 5 — לקוח קצה
| פריט | סטטוס | תאריך | commit |
|---|---|---|---|
| 5.1 טפסים / הצהרת בריאות | TODO | | |
| 5.2 שדות מותאמים בכרטיס לקוח | TODO | | |
| 5.3 ייבוא לקוחות CSV | TODO | | |
| 5.4 הצגת ביקורות בדף העסק (salon-alon-roya2) | TODO | | |

## פריטים חדשים (N)
| פריט | סטטוס | תאריך | commit/workflow |
|---|---|---|---|
| N-5 תוכנית נאמנות | TODO | | |
| N-6 תוכנית הפניות (mt_referrals) | TODO | | |
| N-7 דוח חודשי אוטומטי לבעלים | TODO | | |
| N-8 תור קבוע | TODO | | |
| N-9 Google Calendar דו-כיווני | TODO | | |
| N-4 דומיין מותאם (נוהל + custom_domain) | TODO | | |

## שלב 6 — העברת הדף ל-roy-landing (אחרון)
| פריט | סטטוס | תאריך | commit |
|---|---|---|---|
| 6.1 ענף roya-2-landing מ-qa-audit-9-9-2026 | TODO | | |
| 6.2 העברת פרקים 01-03 + ניווט | TODO | | |
| 6.3 תמונות מקבצים, הסרת פס טיוטה + .continues | TODO | | |
| 6.4 כרטיסי מסלולים (ביטול בכל עת, 10 הראשונים) | TODO | | |
| 6.5 בדיקת Playwright 1280/390 + Lighthouse a11y ≥ 90 | TODO | | |
| 6.6 commit + push (לא deploy, לא merge) | TODO | | |

## איטרציות
- session 1 (10.9.2026): התחיל באיטרציה 1. תקרה: 30.
