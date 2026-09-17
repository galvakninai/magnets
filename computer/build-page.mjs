import { readFileSync, writeFileSync } from "node:fs";
const b64 = (f) => "data:image/jpeg;base64," + readFileSync(f).toString("base64");
const HERO = b64("web-hero.jpg"), P2 = b64("web-p2.jpg"), P3 = b64("web-p3.jpg");
const K = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inhocmh5cW11dWdwa3huZnJ3bm9hIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODI2NjI2NTcsImV4cCI6MjA5ODIzODY1N30.581pFOEK3-buFUwMk2c66cWjXThTtoJrmNLsYEnq_5w";

const PROMPT = `אתה עובד על המסך שלי. לפני שאתה נוגע במשהו, קרא את חמשת הסעיפים.

1. תוצאה
בסוף המשימה צריך להיות מוכן: [דוח הזמנות עם סטטוס, חריגות והפעולה הבאה].
פורמט: [גיליון עם העמודות: מספר הזמנה, לקוח, סטטוס, חריגה, פעולה הבאה].

2. מקורות
[מערכת ההזמנות] - מספר הזמנה, שם לקוח, תאריך, סכום.
[תיבת המייל] - עדכוני משלוח, מזוהים לפי מספר ההזמנה בשורת הנושא.
טווח: [ההזמנות מ-1 בספטמבר ואילך].

3. גבולות
מותר לך לבד: לקרוא, להעתיק, למלא שורות בגיליון.
עצור ובקש ממני אישור לפני: זיכוי, ביטול, מחיקה, שליחת הודעה ללקוח, וכל שינוי במערכת ההזמנות.
אל תיגע ב: [טאבים, קבצים או חשבונות אחרים].

4. סדר עבודה
א. אסוף את ההזמנות מהטווח שהגדרתי.
ב. הצלב מול המיילים לפי מספר ההזמנה.
ג. מלא את הגיליון שורה אחר שורה.
ד. סמן כל הזמנה בלי התאמה כחריגה.
ה. סכם.

5. בדיקה
לפני שאתה אומר שסיימת: ספור כמה הזמנות היו במקור וכמה שורות מילאת. אם המספרים לא זהים, אל תסיים. תגיד לי מה חסר.
סיים בסיכום של שלוש שורות: כמה עובדו, כמה חריגות, ומה דורש את תשומת הלב שלי.

חוק על: חסר לך מידע, או שמסך נראה אחרת ממה שתיארתי? עצור ושאל. אל תנחש.`;

const esc = (s) => s.replace(/&/g, "&#38;").replace(/</g, "&#60;").replace(/>/g, "&#62;");

const html = `<!doctype html>
<html lang="he" dir="rtl"><head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>COMPUTER USE KIT - 5 שלבים לפני שהסוכן נוגע במסך</title>
<meta name="description" content="כרטיס חמשת השלבים ופרומפט מוכן להעתקה, לפני שאתם נותנים לסוכן AI לעבוד על המסך שלכם">
<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Heebo:wght@500;600;700;800;900&display=swap" rel="stylesheet">
<style>
*{margin:0;padding:0;box-sizing:border-box}
body{font-family:'Heebo',sans-serif;background:#F6F1E2;color:#111111;direction:rtl;-webkit-font-smoothing:antialiased;
  min-height:100vh;padding:clamp(20px,5vw,56px) clamp(16px,5vw,40px) 56px;position:relative;overflow-x:hidden}
.at{position:fixed;inset:0;z-index:0;pointer-events:none;overflow:hidden}
.gA{position:absolute;top:-360px;right:-440px;width:1100px;height:1100px;border-radius:50%;
  background:radial-gradient(circle,rgba(168,85,247,.16) 0%,rgba(168,85,247,0) 60%)}
.gB{position:absolute;bottom:-300px;left:-400px;width:1100px;height:1100px;border-radius:50%;
  background:radial-gradient(circle,rgba(44,73,245,.10) 0%,rgba(44,73,245,0) 58%)}
.wrap{position:relative;z-index:1;max-width:720px;margin:0 auto}
.top{display:flex;align-items:center;justify-content:space-between;padding-bottom:14px;border-bottom:3px solid #111111}
.wm{font-weight:900;font-size:20px;direction:ltr;letter-spacing:-.01em}
.wm u{text-decoration:none;border-bottom:3px solid #2C49F5;padding-bottom:1px}
.kicker{font-weight:700;font-size:15px;color:#5A544B}
h1{font-weight:900;font-size:clamp(32px,7.4vw,54px);line-height:1.07;letter-spacing:-.03em;margin-top:30px}
h1 .acc{display:inline-block;padding-bottom:9px;box-shadow:inset 0 -7px 0 0 #3DF5B0}
.sub{font-weight:500;font-size:clamp(16px,4vw,20px);line-height:1.55;color:#5A544B;margin-top:18px}
.hero{width:100%;display:block;margin-top:26px;border:3px solid #111111}
.cta{display:block;margin-top:26px;background:#3DF5B0;color:#111111;text-decoration:none;text-align:center;
  font-weight:900;font-size:clamp(19px,4.6vw,25px);padding:20px 24px;border:3px solid #111111}
.cta small{display:block;font-weight:600;font-size:14px;margin-top:5px;color:rgba(17,17,17,.66)}
.pbox{margin-top:32px;border-top:3px solid #111111;padding-top:22px}
.pbox h2{font-weight:900;font-size:clamp(19px,4.6vw,24px)}
.pbox p.lead{font-weight:500;font-size:15px;color:#5A544B;margin-top:6px;line-height:1.55}
.pwrap{position:relative;margin-top:14px}
pre{background:#141210;color:#EDE7DA;border:3px solid #111111;border-radius:12px;padding:18px 18px 18px;
  font-family:'Heebo',sans-serif;font-size:14.5px;line-height:1.72;white-space:pre-wrap;word-break:break-word;
  direction:rtl;text-align:right;max-height:420px;overflow-y:auto}
.copy{margin-top:12px;width:100%;font-family:'Heebo',sans-serif;font-size:17px;font-weight:900;padding:14px 20px;
  border:3px solid #111111;border-radius:10px;background:#FFFFFF;color:#111111;cursor:pointer}
.copy:active{transform:translateY(1px)}
.copy.done{background:#3DF5B0}
.sub-box{margin-top:26px;padding:18px 18px 16px;background:#FFFFFF;border:2px solid #111111;border-radius:14px}
.sub-box h3{margin:0 0 4px;font-size:18px;font-weight:800;color:#111111}
.sub-box p{margin:0 0 12px;font-size:14px;line-height:1.55;color:rgba(17,17,17,.7)}
.sub-row{display:flex;gap:8px;flex-wrap:wrap}
.sub-row input{flex:1 1 190px;min-width:0;font-family:'Heebo',sans-serif;font-size:16px;padding:12px 14px;
  border:2px solid rgba(17,17,17,.25);border-radius:10px;background:#F6F1E2;color:#111111;direction:ltr;text-align:left}
.sub-row input:focus{outline:none;border-color:#2C49F5}
.sub-row button{flex:0 0 auto;font-family:'Heebo',sans-serif;font-size:16px;font-weight:800;padding:12px 20px;
  border:2px solid #111111;border-radius:10px;background:#2C49F5;color:#FFFFFF;cursor:pointer}
.sub-row button:disabled{opacity:.55;cursor:default}
.sub-msg{margin:10px 0 0;font-size:14px;font-weight:600;min-height:19px}
.sub-msg.ok{color:#1E7A52}.sub-msg.err{color:#A8482B}
.chips{margin-top:30px;border-top:3px solid #111111;padding-top:20px}
.chip{display:flex;align-items:center;gap:13px;padding:9px 0}
.chip i{width:32px;height:32px;flex:none;background:#3DF5B0;color:#111111;display:flex;align-items:center;
  justify-content:center;font-weight:900;font-size:16px;font-style:normal;direction:ltr}
.chip span{font-weight:800;font-size:clamp(16px,4vw,20px)}
.peek{margin-top:32px;border-top:3px solid #111111;padding-top:22px}
.peek h2{font-weight:900;font-size:clamp(18px,4.4vw,22px)}
.peek p{font-weight:500;font-size:15px;color:#5A544B;margin-top:6px;line-height:1.5}
.strip{display:grid;grid-template-columns:1fr 1fr;gap:14px;margin-top:16px}
.strip img{width:100%;display:block;border:2px solid #111111}
.foot{margin-top:34px;border-top:3px solid #111111;padding-top:18px;display:flex;align-items:center;
  justify-content:space-between;gap:14px;font-weight:600;font-size:14px;color:#5A544B}
@media (max-width:430px){.strip{grid-template-columns:1fr}}
</style></head>
<body>
<div class="at"><div class="gA"></div><div class="gB"></div></div>
<div class="wrap">
  <div class="top">
    <span class="wm">vaknin.<u>ai</u></span>
    <span class="kicker">3 עמודים · PDF · פרומפט להעתקה</span>
  </div>

  <h1>5 שלבים לפני
    <span class="acc">שהסוכן נוגע במסך</span></h1>
  <p class="sub">סוכן AI עם Computer Use לא נעצר בהוראות, הוא רואה את המסך, לוחץ ומקליד בפועל. הכרטיס הזה הוא המסגרת שכותבים לפניו, והפרומפט למטה מוכן להעתקה עכשיו.</p>

  <img class="hero" src="${HERO}" alt="כרטיס חמשת השלבים">

  <a class="cta" id="dl" href="vaknin-computer-use-kit.pdf" download>
    להורדת הכרטיס
    <small>PDF · 3 עמודים · חינם</small>
  </a>

  <div class="pbox">
    <h2>הפרומפט שמכין את הסוכן</h2>
    <p class="lead">החליפו את מה שבסוגריים המרובעים בפרטים שלכם. השאירו את סעיף 3 ואת חוק העל כלשונם, הם מה שעוצר טעות יקרה.</p>
    <div class="pwrap">
      <pre id="pr">${esc(PROMPT)}</pre>
      <button class="copy" id="cp" type="button">העתקת הפרומפט</button>
    </div>
  </div>

  <div class="sub-box">
    <h3>רוצה עוד כאלה?</h3>
    <p>מדריך אחד בשבוע על AI ואוטומציה, בעברית. בלי ספאם, יציאה בלחיצה.</p>
    <div class="sub-row">
      <input id="sub-email" type="email" inputmode="email" autocomplete="email"
             placeholder="name@example.com" aria-label="כתובת המייל שלך">
      <button id="sub-btn" type="button">שלחו לי</button>
    </div>
    <p class="sub-msg" id="sub-msg" role="status" aria-live="polite"></p>
  </div>

  <div class="chips">
    <div class="chip"><i>1</i><span>חמשת השלבים, עם השאלה שכל אחד עונה עליה</span></div>
    <div class="chip"><i>2</i><span>שלד הפרומפט, להעתקה ומילוי</span></div>
    <div class="chip"><i>3</i><span>משימה אמיתית מקצה לקצה: הזמנות, מייל, גיליון, דוח</span></div>
    <div class="chip"><i>4</i><span>קו האדום: מה הסוכן לא עושה בלי אישור</span></div>
  </div>

  <div class="peek">
    <h2>שני העמודים שתחזרו אליהם</h2>
    <p>שלד הפרומפט שממלאים לפני כל משימה, והדוגמה שמראה איך זה נראה בפועל.</p>
    <div class="strip"><img src="${P2}" alt="שלד הפרומפט"><img src="${P3}" alt="משימה אמיתית"></div>
  </div>

  <div class="foot">
    <span>גל · vaknin.ai</span>
    <span>COMPUTER USE KIT · ספטמבר 2026</span>
  </div>
</div>
<script>
(function(){
var U="https://xhrhyqmuugpkxnfrwnoa.supabase.co/rest/v1/magnet_events",K="${K}";
function ev(e){try{fetch(U,{method:"POST",keepalive:true,headers:{"apikey":K,"Authorization":"Bearer "+K,"Content-Type":"application/json","Prefer":"return=minimal"},body:JSON.stringify({magnet_key:"computer",event:e,ref:(document.referrer||"").slice(0,200),ua:navigator.userAgent.slice(0,200)})}).catch(function(){})}catch(_){}}
ev("view");
var dl=document.getElementById("dl"); if(dl) dl.addEventListener("click",function(){ev("download")});
var cp=document.getElementById("cp"),pr=document.getElementById("pr");
cp.addEventListener("click",function(){
  var t=pr.innerText;
  function done(){cp.textContent="הפרומפט הועתק";cp.classList.add("done");ev("copy_prompt");
    setTimeout(function(){cp.textContent="העתקת הפרומפט";cp.classList.remove("done")},2200)}
  if(navigator.clipboard&&navigator.clipboard.writeText){navigator.clipboard.writeText(t).then(done,fallback)}else{fallback()}
  function fallback(){var ta=document.createElement("textarea");ta.value=t;ta.style.position="fixed";ta.style.opacity="0";
    document.body.appendChild(ta);ta.select();try{document.execCommand("copy");done()}catch(_){ }document.body.removeChild(ta)}
});
var SU="https://xhrhyqmuugpkxnfrwnoa.supabase.co/rest/v1/email_subscribers";
var inp=document.getElementById("sub-email"),btn=document.getElementById("sub-btn"),msg=document.getElementById("sub-msg");
function say(t,c){msg.textContent=t;msg.className="sub-msg "+(c||"")}
btn.addEventListener("click",function(){
  var email=(inp.value||"").trim();
  if(!/^[^@\\s]+@[^@\\s]+\\.[^@\\s]{2,}$/.test(email)){say("הכתובת לא נראית תקינה. בדקו שוב.","err");inp.focus();return}
  btn.disabled=true;say("רגע...");
  fetch(SU,{method:"POST",headers:{"apikey":K,"Authorization":"Bearer "+K,"Content-Type":"application/json","Prefer":"return=minimal"},
    body:JSON.stringify({email:email,source:"magnet-page",magnet_key:"computer",ref:(document.referrer||"").slice(0,200)})})
  .then(function(r){if(r.ok||r.status===409){say("נרשמת. נתראה במדריך הבא.","ok");inp.value="";ev("email")}
    else{say("משהו נתקע. נסו שוב בעוד רגע.","err");btn.disabled=false}})
  .catch(function(){say("משהו נתקע. נסו שוב בעוד רגע.","err");btn.disabled=false});
});
inp.addEventListener("keydown",function(e){if(e.key==="Enter")btn.click()});
})();
</script>
</body></html>`;
writeFileSync("index.html", html, "utf8");
console.log("index.html: " + html.length + " chars");
