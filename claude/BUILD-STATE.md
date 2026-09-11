# BUILD-STATE — לופ ROYA 2.0

> נוצר 10.9.2026 (session 1). עודכן 11.9.2026 (session 2) — בדיקה בפועל בכל 4 המאגרים + n8n + Supabase, ע"י 4 סוכני-בדיקה נפרדים שקראו קוד והריצו טסטים אמיתיים (לא רק "בטח נבנה"). כל איטרציה מתחילה כאן וממשיכה מהפריט הראשון שאינו DONE/BLOCKED/SKIPPED.
> סטטוסים: TODO / IN-PROGRESS / DONE / BLOCKED (סיבה) / BLOCKED-external (סיבה) / SKIPPED (סיבה).
> מקור ההוראות: `ROYA-2.0-תוספת-בנייה-10-9-2026.md` (קובע), `בריף-בנייה-מאסטר-ROYA-2.0-9-9-2026.md`.
> **ממצא קריטי מ-session 2 (11.9 בוקר):** migration לא הוחלה על ה-DB החי. **התעדכן 11.9 (סבב "אימות-אמת"): המיגרציה כן הוחלה** (`20260911051242`, מאומת). כל "(מיגרציה ממתינה)" למטה — החסימה העובדתית כבר לא נכונה, אבל רוב השורות לא אומתו-מחדש חי הפעם (רק 1.6, 1.8, N-3/#19 אומתו/נבנו מחדש בסבב הזה). ראו D29 ב-`DECISIONS-NEEDED.md`: כתיבה ל-DB חי חסומה ע"י מדיניות-הסשן, כך ש-2.3/2.8/5.4 (#10/#27/#33 website) עדיין BLOCKED בפועל. פירוט מלא ב-`FEATURE-PARITY.md`.
> **ממצא קריטי שני:** שלב 6 (roy-landing) **נסוג** — עבד ונבדק פעם אחת, ואז `index.html` חזר למצב הבסיס והקבצים החדשים נותרו לא-מקושרים. נעצר לדיווח, לא תוקן. ראו למטה ו-`DECISIONS-NEEDED.md` D20.

## מצב סביבה (נבדק 10.9.2026)
- Supabase branch: **אין**. עלות branch = $0.01344/שעה (`get_cost`). אסור לאשר → migrations נכתבות מקומית ב-`salon-demo/supabase/migrations-roya2/` וממתינות להחלה (ראו DECISIONS D3). אין Supabase CLI ואין Docker במחשב.
- n8n: 38 workflows קיימים. קיימים כבר (active:false, Green-API מנוטרל): Win-back, VIP Loyalty Threshold, VIP Targeted Campaigns, Monthly Report MID, Roy Monthly Client Report. חדשים נבנים כ-DRAFT נפרדים בשם `ROYA2 - ...` (D7).
- gh CLI: **לא מותקן** → repo GitHub ל-roya-owner-app נוצר ידנית ע"י רועי (D4).
- salon-alon worktree: `C:\Users\Ayalon\salon-alon-roya2` ענף `roya-2-customer` מ-HEAD 8766510. עץ העבודה המקורי לא נגע.
- roy-landing: ענף נוכחי בעץ `qa-audit-9-9-2026` (מכיל את תיקון 054-968-5982, commit fa2f553) → בסיס ל-`roya-2-landing` (D5).

## שלב 0
| פריט | סטטוס | תאריך | commit/workflow |
|---|---|---|---|
| 0.1 בקשת ביקורת Google (post_visit_review_request, DRAFT) | DONE | 11.9 | n8n S9WBfLleUVBtG499, exec 7377 |
| 0.2 הסרת טענות מהאתר | SKIPPED (הוחלט 10.9 לבנות במקום להסיר) | 10.9 | |
| 0.3 "בקרוב" ב-VIP | SKIPPED (הוחלט 10.9 לבנות במקום להסיר) | 10.9 | |
| 0.4 טקסטים חסרים באתר החי | DONE-no-change (D19 מאומת) | 11.9 | `master`: `ל-<bdi>2</bdi> אנשי צוות` קיים ותקין. נמצאו 2 מספרים אחרים ב-master בלי `<bdi>` ("לעד 2 אנשי צוות", "5 תורים שלא הלכו לאיבוד") — ראו D21, לא חוסם |

## שלב 1 — roya-owner-app
| פריט | סטטוס | תאריך | commit |
|---|---|---|---|
| 1.1 שלד (Vite+React, RTL, PWA, כניסה) | DONE | 11.9 | `0a9e5b0` |
| 1.2 migration mt_users + RLS + GRANT | DONE (מיגרציה ממתינה) | 11.9 | קובץ migration כולל policy+GRANT באותה פעימה (שורות 250-256) — עדיין לא הוחל |
| 1.3 Google Calendar חד-כיווני (DRAFT) | DONE — מוזג ל-N-9 (דו-כיווני נבנה ישר) | 11.9 | n8n XdrY7oob9etm0RP7 |
| 1.4 מסך בית "התורים להיום" | DONE (= #5) | 11.9 | `0a9e5b0` |
| 1.5 יומן יום/שבוע + קביעה ידנית + אישור/דחייה | DONE (= #14) | 11.9 | `0a9e5b0` |
| 1.6 חסימות + חגי ישראל | DONE | 11.9 (סבב "אימות-אמת") | חסימות ידניות (`mt_blocked_slots`) DONE. **חגי ישראל: הקוד היה קיים (`ISRAEL_HOLIDAYS`, `HolidaysModal`, `provider.toggleHoliday`) אך לא מכוסה — נוסף e2e אמיתי**: הפעלת מתג ליום כיפור (21.9.2026) חוסמת בפועל את כל הסלוטים באותו יום לכל הצוות (`staff_member=null`) עם סיבה "חג: יום כיפור" מוצגת, כיבוי משחרר בחזרה. `python tests/e2e_walkthrough.py`: 101/101. commit `5f78caa` |
| 1.7 לקוחות (רשימה + כרטיס מלא) | DONE (= #6 + #15) | 11.9 | `0a9e5b0` |
| 1.8 דוחות + CSV | DONE | 11.9 (סבב "אימות-אמת") | הדוח החודשי עצמו מוכח (= #25). **ייצוא CSV מהמסך אומת בפועל**: e2e מוריד קובץ אמיתי (`page.expect_download`), מוודא שם קובץ (`roya-YYYY-MM.csv`), כותרות מדויקות (BOM+גרשיים, תואם ל-`toCsv` המוגן), ו-144 שורות נתונים. commit `9a224d5`, 107/107 |
| 1.9 הגדרות עסק (שעות, שירותים, צוות, חיץ) | DONE | 11.9 | `SettingsScreen.jsx`, `ServicesScreen.jsx`, `TeamScreen.jsx`, unit test "#33 חיץ" |
| 1.10 עובד: הזמנה בקישור, רואה רק את שלו | DONE (UI), BLOCKED (קבלה בפועל — מיגרציה ממתינה) | 11.9 | e2e "הצוות: הזמנת איש צוות בקישור" עבר; `mt_staff_invites`/`mt_accept_staff_invite` ב-migration שלא הוחלה |
| 1.x vibesec + צילומי מסך | DONE | 11.9 (סבב "אימות-אמת") | צילומי מסך קיימים. **סקירת אבטחה בוצעה בפועל** (skill `vibesec-skill`, סבב חדש על כל הפריטים שלא כוסו בביקורת הלילה): נבדקו ואומתו נקיים — 0 `dangerouslySetInnerHTML`/`innerHTML`/`eval`, 0 מפתחות service_role/סודות בקוד, 0 `href` דינמי עם סיכון `javascript:` URI (כל ה-`href={}` הם ניווט-hash פנימי או ID ממסד-נתונים), אין בניית query-filter מ-קלט-משתמש (חיפוש לקוחות קורה כולו client-side על מערך שכבר הגיע מ-RLS), redirect ב-`signInWithEmail` מבוסס `location.origin` קבוע (לא open-redirect), `npm audit` — **0 חולשות** (prod+dev), `npm run build` — אין sourcemaps בפלט. **המלצת-חיזוק (לא באג פעיל)**: `google_review_link` (מוגדר ב-SettingsScreen) עדיין לא נצרך בשום מקום ב-salon-alon-roya2 — כשייבנה שם, לוודא ולידציית `https://` לפני שימוש כ-href |

## שלב 2 — אוטומציות WhatsApp (DRAFT)
| פריט | סטטוס | תאריך | workflow id |
|---|---|---|---|
| 2.1 אישור הגעה 2 כפתורים (T-24h) | DONE | 11.9 | VffsgzUqCEaxFzy3, exec 7379 |
| N-1 תזכורת בוקר 09:00 batch | DONE | 11.9 | VffsgzUqCEaxFzy3, exec 7381 (דילוג נכון על <3h) |
| 2.2 ביטול בלחיצה + חלון ביטול + WAITLIST | DONE | 11.9 | MqPsEBLHURiEVzgP, exec 7388 — ענף ביטול-בזמן נבדק, `Mark cancelled` + `WAITLIST Cascade` הופיעו ב-runData בפועל |
| 2.3 הרשמה עצמית לרשימת המתנה (salon-alon-roya2) | BLOCKED: מיגרציה ממתינה (קוד מוכן ומוכח מול RPC מדומה — `5446e0a`, 31/31) | 11.9 לילה | `mt_join_waitlist_self` RPC לא חי עדיין; קוד הלקוח מוכח מול הצורה האמיתית |
| 2.4 "לא חזרת מזמן" (60 יום, config) | DONE | 11.9 | jEsldE2TCE1Hq5dR, exec 7383 |
| 2.5 יום הולדת | DONE | 11.9 | jEsldE2TCE1Hq5dR, exec 7383 |
| 2.6 קמפיין/תפוצה מהאפליקציה | DONE | 11.9 | MW1BqafFCzk6k2hd, exec 7386 |
| 2.7 הודעות מתוזמנות | DONE (אותו workflow, `wait` node + `scheduled_at`) | 11.9 | MW1BqafFCzk6k2hd, exec 7386 |
| 2.8 חסימת מבריז | BLOCKED: מיגרציה ממתינה (צד ניהול DONE; צד אתר מוכח כעת מול RPC מדומה — `5446e0a`, 31/31) | 11.9 לילה | owner-app DONE; `mt_is_phone_blocked` RPC לא חי, אך קוד הלקוח מוכח משני הכיוונים (true/false) |

## שלב 3 — צוות
| פריט | סטטוס | תאריך | commit |
|---|---|---|---|
| 3.1 הרשאות owner/staff/manager | DONE (מיגרציה ממתינה) | 11.9 | `mt_users.role` + `sees_all` ב-migration; מתג הרשאה נבדק ב-e2e |
| 3.2 הכנסות לפי עובד | DONE (= #18) | 11.9 | `0a9e5b0` |
| 3.3 חשבון לעובד + קישור הצטרפות | DONE (UI), BLOCKED (מיגרציה) | 11.9 | = 1.10 |
| N-2 מגבלת צוות לפי מסלול (1/2/5) | DONE | 11.9 | unit test N-2, e2e חוסם הוספה שלישית ב-VIP |
| N-3 מחירון לכל איש צוות (mt_staff_service_prices) | DONE | 11.9 (סבב "אימות-אמת") | owner-app unit test N-3 חזק. **אתר אומת חי מול Supabase אמיתי** (לא סימולציה) — ראה #19 ב-FEATURE-PARITY.md ו-commit `00651cf` (salon-alon-roya2) |

## שלב 4 — כסף (מינימלי)
| פריט | סטטוס | תאריך | commit |
|---|---|---|---|
| 4.1 רישום תשלום + יתרה פתוחה (mt_payments) | DONE (מיגרציה ממתינה) | 11.9 | unit test "4.1" (חישוב יתרה) |
| 2.9 תזכורת חוב בוואטסאפ | DONE (מיגרציה ממתינה; כפתור בכרטיס לא מאומת) | 11.9 | jEsldE2TCE1Hq5dR, exec 7383 |

## שלב 5 — לקוח קצה
| פריט | סטטוס | תאריך | commit |
|---|---|---|---|
| 5.1 טפסים / הצהרת בריאות | DONE | 11.9 | `96d1a5d` — e2e: עריכה+יצירה+שליחה, שרד רענון מלא |
| 5.2 שדות מותאמים בכרטיס לקוח | DONE | 11.9 | `96d1a5d` — e2e: כרטיס נועה שמש, שדה חדש שרד רענון מלא |
| 5.3 ייבוא לקוחות CSV | DONE | 11.9 | `96d1a5d` — e2e מריץ את `ImportModal` בפועל עד שהלקוח נמצא בחיפוש |
| 5.4 הצגת ביקורות בדף העסק (salon-alon-roya2) | BLOCKED: מיגרציה ממתינה (קוד מוכח מול RPC מדומה — `5446e0a`, 31/31) | 11.9 לילה | `mt_reviews` לא חי עדיין; קוד הלקוח מוכח (3 ביקורות + fallback ריק) |

## פריטים חדשים (N)
| פריט | סטטוס | תאריך | commit/workflow |
|---|---|---|---|
| N-5 תוכנית נאמנות | DONE (מיגרציה ממתינה) | 11.9 | jEsldE2TCE1Hq5dR, exec 7383 |
| N-6 תוכנית הפניות (mt_referrals) | DONE (מיגרציה ממתינה) | 11.9 | jEsldE2TCE1Hq5dR, exec 7383 |
| N-7 דוח חודשי אוטומטי לבעלים | DONE | 11.9 | 1ob5iVqkEDGAFYsz exec 7384 (סוכם ביד: 310₪/3/1/1, תואם) + `96d1a5d` unit test "N-7" (450₪, תואם) |
| N-8 תור קבוע | DONE (מיגרציה ממתינה) | 11.9 | owner-app unit test N-8 + n8n 0bUPRP8354P2s2WJ exec 7385 |
| N-9 Google Calendar דו-כיווני | BLOCKED-external (credential רועי) — בנייה+בדיקה DONE | 11.9 | XdrY7oob9etm0RP7, exec 7387 |
| N-4 דומיין מותאם (נוהל + custom_domain) | DONE | 11.9 | מסמך קיים + `npm run build` מאומת (`site-meta.mjs` מדלג בחן) |

## שלב 6 — העברת הדף ל-roy-landing (אחרון)
| פריט | סטטוס | תאריך | commit |
|---|---|---|---|
| 6.1 ענף roya-2-landing מ-qa-audit-9-9-2026 | DONE | 11.9 | `git merge-base` = `ada62cb` = tip של `qa-audit-9-9-2026` |
| 6.2 העברת פרקים 01-03 + ניווט | DONE | 11.9 (סבב 2) | `port_landing.mjs` הורץ בפועל (`PORT_CONFIRM_REAL=1`), 21/21 שלבים, `git diff --stat -- index.html`: 424+/17-. commit `88ef0b3` |
| 6.3 תמונות מקבצים, הסרת פס טיוטה + .continues | DONE — חי בדף עכשיו | 11.9 (סבב 2) | אומת: 0 מופעי `data:IMG`/`.continues` ב-`index.html` החי |
| 6.4 כרטיסי מסלולים (ביטול בכל עת, 10 הראשונים) | DONE — חי בדף | 11.9 (סבב 2) | אומת ב-e2e: "מסלולים: ביטול בכל עת + 10 הראשונים" + "מחירים לא השתנו" |
| 6.5 בדיקת Playwright 1280/390 + Lighthouse a11y ≥ 90 | DONE (Playwright); Lighthouse לא אומת מחדש | 11.9 (סבב 2) | `tools/e2e_roya2_landing.py` מול הדף האמיתי: **86/86** (כולל 2 הבדיקות שנכשלו קודם). Lighthouse: לא הורץ הסבב הזה (לא התבקש) |
| 6.6 commit + push (לא deploy, לא merge) | DONE | 11.9 (סבב 2) | commit `88ef0b3`, נדחף ל-`origin/roya-2-landing` (ענף חדש). לא merge, לא deploy — אומת `git log`/`status` ישירות |

## איטרציות
- session 1 (10.9.2026): התחיל באיטרציה 1. תקרה: 30.
- session 2 (11.9.2026): לא בנייה — בדיקה מלאה של כל מה שנטען כבנוי ב-session 1. ראו `ITERATION-LOG.md`.
