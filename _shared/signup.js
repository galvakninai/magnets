/* vaknin.ai · פס ההרשמה לניוזלטר (13/11/2026). כל דף מגנט מוסיף שורה אחת, לפני </body>:
     <script src="../_shared/signup.js" defer></script>
   הסקריפט טוען את signup.css בעצמו ומזריק את הפס לפני חתימת הדף (footer.sign), או לפני
   [data-signup-here] אם קיים, או בסוף ה-main. source = שם התיקייה (או data-source על התגית).
   מצב תצוגה (preview.html, ?preview, file://): לא פונה לשרת, רק מדמה הצלחה.
   הנוסח ליד התיבה = CONSENT_TEXT בפונקציה newsletter, מילה במילה. משנים בשני המקומות יחד,
   ומעלים את CONSENT_VERSION שם. */
(function () {
  "use strict";
  var FN = "https://xhrhyqmuugpkxnfrwnoa.supabase.co/functions/v1/newsletter";
  var CONSENT = "אני מסכים/ה לקבל מגל ווקנין (vaknin.ai) מייל שבועי שכולל תכנים ופרסומות. אפשר להסיר בכל רגע.";
  var ERR = {
    invalid_email: "המייל לא נראה תקין. בדקו שוב.",
    consent_required: "צריך לסמן את התיבה כדי להירשם.",
    rate_limited: "יותר מדי ניסיונות. נסו שוב בעוד דקה.",
    _: "משהו נתקע אצלנו. נסו שוב בעוד רגע."
  };

  var me = document.currentScript;
  if (!me || document.querySelector(".vk-su")) return;
  var base = me.src.replace(/[^/]*$/, "");
  var parts = location.pathname.split("/").filter(Boolean);
  var last = parts[parts.length - 1] || "";
  var folder = /\.html?$/.test(last) ? parts[parts.length - 2] : last;
  var source = (me.getAttribute("data-source") || folder || "unknown").toLowerCase();
  var preview = location.protocol === "file:" || /preview\.html?$/.test(location.pathname) ||
    /[?&]preview\b/.test(location.search);
  var src = "";
  try { src = new URLSearchParams(location.search).get("src") || ""; } catch (e) {}

  var css = document.createElement("link");
  css.rel = "stylesheet";
  css.href = base + "signup.css";
  document.head.appendChild(css);

  function el(tag, attrs, text) {
    var e = document.createElement(tag);
    for (var k in attrs) e.setAttribute(k, attrs[k]);
    if (text != null) e.textContent = text;
    return e;
  }

  var uid = "vk" + Math.random().toString(36).slice(2, 7);
  var sec = el("section", { "class": "vk-su", dir: "rtl", lang: "he", "aria-label": "הרשמה למייל השבועי" });
  var box0 = el("div", { "class": "vk-in" });
  sec.appendChild(box0);
  box0.appendChild(el("span", { "class": "vk-bg", "aria-hidden": "true" }));
  box0.appendChild(el("img", { "class": "vk-cut", src: base + "gal-cut.png", alt: "גל ווקנין",
    width: "354", height: "420", loading: "lazy", decoding: "async" }));
  var cp = el("div", { "class": "vk-cp" });
  cp.appendChild(el("b", {}, "המגנט הבא, ישר למייל"));
  cp.appendChild(el("span", {}, "מייל אחד בשבוע ממני, עם מה שחדש אצלי."));
  box0.appendChild(cp);

  var f = el("form", { novalidate: "" });
  var name = el("input", { type: "text", name: "first_name", placeholder: "שם פרטי", autocomplete: "given-name",
    maxlength: "60", required: "", "aria-label": "שם פרטי" });
  var mail = el("input", { type: "email", name: "email", placeholder: "מייל", autocomplete: "email",
    inputmode: "email", maxlength: "254", required: "", "aria-label": "מייל" });
  var go = el("button", { "class": "vk-go", type: "submit", disabled: "" }, "הרשמה");
  var hp = el("input", { type: "text", name: "company", "class": "vk-hp", tabindex: "-1", autocomplete: "off",
    "aria-hidden": "true" });
  var ok = el("label", { "class": "vk-ok", "for": uid });
  var box = el("input", { type: "checkbox", id: uid });
  ok.appendChild(box);
  var txt = el("span");
  txt.appendChild(document.createTextNode(CONSENT + " "));
  txt.appendChild(el("a", { href: base + "../privacy/", target: "_blank", rel: "noopener" }, "מדיניות פרטיות"));
  ok.appendChild(txt);
  var msg = el("p", { "class": "vk-msg", role: "status", "aria-live": "polite" });
  f.appendChild(name); f.appendChild(mail); f.appendChild(go); f.appendChild(hp); f.appendChild(ok); f.appendChild(msg);
  box0.appendChild(f);
  box0.appendChild(el("p", { "class": "vk-done", role: "status" }, "נרשמת 🙌 נתראה במייל של השבוע."));

  box.addEventListener("change", function () { go.disabled = !box.checked; });

  var busy = false;
  f.addEventListener("submit", function (e) {
    e.preventDefault();
    if (busy) return;
    msg.textContent = "";
    var email = mail.value.trim();
    if (!name.value.trim()) { msg.textContent = "חסר שם פרטי."; name.focus(); return; }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { msg.textContent = ERR.invalid_email; mail.focus(); return; }
    if (!box.checked) { msg.textContent = ERR.consent_required; return; }
    if (preview) { sec.classList.add("vk-sent"); return; }
    busy = true; go.disabled = true; go.textContent = "שולח...";
    fetch(FN, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ first_name: name.value.trim(), email: email, consent: true,
        source: source, src: src, company: hp.value })
    }).then(function (r) { return r.json().catch(function () { return { ok: false }; }); })
      .then(function (d) {
        if (d && d.ok) { sec.classList.add("vk-sent"); return; }
        msg.textContent = ERR[d && d.error] || ERR._;
        busy = false; go.disabled = !box.checked; go.textContent = "הרשמה";
      })
      .catch(function () {
        msg.textContent = "אין חיבור כרגע. נסו שוב בעוד רגע.";
        busy = false; go.disabled = !box.checked; go.textContent = "הרשמה";
      });
  });

  function mount() {
    var anchor = document.querySelector("[data-signup-here]") || document.querySelector("footer.sign");
    if (anchor) { anchor.parentNode.insertBefore(sec, anchor); return; }
    var main = document.querySelector("main") || document.body;
    main.appendChild(sec);
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", mount);
  else mount();
})();
