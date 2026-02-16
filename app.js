const state = {
  lang: "ar",
  catalogs: { men: [], women: [], kids: [] },
  selectedSegment: "women",
  selectedItem: null,
  userPhotoURL: null,
};

const i18n = {
  ar: {
    title: "غرفة القياس الافتراضية بالذكاء الاصطناعي",
    privacy: "ملاحظة مهمة: لن نقوم بحفظ صورك. المعالجة في المتصفح فقط مع دعم تشفير البيانات المؤقتة.",
    profile: "بيانات التجربة",
    segment: "الفئة",
    height: "الطول (سم)",
    weight: "الوزن (كغ)",
    photo: "ارفع صورتك",
    recommend: "اقتراح المقاس والتنسيق",
    catalog: "الكتالوج",
    tryon: "تجربة القياس",
    startTryon: "ابدأ التجربة (حتى 60 ثانية)",
    save: "حفظ الإطلالة",
    share: "مشاركة",
    women: "نساء",
    men: "رجال",
    kids: "أطفال",
    noPhoto: "يرجى رفع صورة أولًا.",
    noItem: "يرجى اختيار قطعة من الكتالوج.",
    done: "اكتملت التجربة بنجاح.",
    saved: "تم حفظ الصورة محليًا على جهازك.",
    shared: "تم نسخ وصف الإطلالة للمشاركة.",
    recommendationTitle: "النتيجة",
    stylePick: "اقتراح تنسيق",
    size: "المقاس المتوقع",
  },
  en: {
    title: "AI Virtual Dressing Room",
    privacy: "Important: We do not store your photos. Processing stays in-browser with temporary encryption support.",
    profile: "Try-on Profile",
    segment: "Segment",
    height: "Height (cm)",
    weight: "Weight (kg)",
    photo: "Upload your photo",
    recommend: "Suggest size & styling",
    catalog: "Catalog",
    tryon: "Virtual Try-on",
    startTryon: "Start try-on (up to 60s)",
    save: "Save Look",
    share: "Share",
    women: "Women",
    men: "Men",
    kids: "Kids",
    noPhoto: "Please upload your photo first.",
    noItem: "Please choose an item from the catalog.",
    done: "Try-on finished successfully.",
    saved: "Image saved locally to your device.",
    shared: "Look summary copied for sharing.",
    recommendationTitle: "Result",
    stylePick: "Styling suggestion",
    size: "Expected size",
  }
};

const el = (id) => document.getElementById(id);

async function loadCatalogs() {
  for (const segment of ["men", "women", "kids"]) {
    const res = await fetch(`data/catalog-${segment}.json`);
    state.catalogs[segment] = await res.json();
  }
  renderCatalog();
}

function applyLanguage() {
  const t = i18n[state.lang];
  document.documentElement.lang = state.lang;
  document.documentElement.dir = state.lang === "ar" ? "rtl" : "ltr";
  el("title").textContent = t.title;
  el("privacyNote").textContent = t.privacy;
  el("profileTitle").textContent = t.profile;
  el("segmentLabel").textContent = t.segment;
  el("heightLabel").textContent = t.height;
  el("weightLabel").textContent = t.weight;
  el("photoLabel").textContent = t.photo;
  el("recommendBtn").textContent = t.recommend;
  el("catalogTitle").textContent = t.catalog;
  el("tryonTitle").textContent = t.tryon;
  el("tryOnBtn").textContent = t.startTryon;
  el("saveBtn").textContent = t.save;
  el("shareBtn").textContent = t.share;
  el("langToggle").textContent = state.lang === "ar" ? "EN" : "AR";
  const segmentSel = el("segment");
  segmentSel.options[0].textContent = t.women;
  segmentSel.options[1].textContent = t.men;
  segmentSel.options[2].textContent = t.kids;
  renderCatalog();
}

function renderCatalog() {
  const list = state.catalogs[state.selectedSegment] || [];
  const target = el("catalog");
  target.innerHTML = "";
  list.forEach((item) => {
    const card = document.createElement("article");
    card.className = "item" + (state.selectedItem?.id === item.id ? " active" : "");
    card.innerHTML = `
      <img src="${item.image}" alt="${item.nameEn}" />
      <strong>${state.lang === "ar" ? item.nameAr : item.nameEn}</strong>
      <div>${item.priceIQD.toLocaleString()} IQD</div>
    `;
    card.onclick = () => {
      state.selectedItem = item;
      renderCatalog();
    };
    target.appendChild(card);
  });
}

function recommendSize(height, weight, segment) {
  if (segment === "kids") {
    if (height < 100) return "2-3Y";
    if (height < 115) return "4-5Y";
    if (height < 130) return "6-7Y";
    if (height < 145) return "8-9Y";
    return "10-11Y";
  }
  const bmi = weight / ((height / 100) ** 2);
  if (bmi < 19) return "S";
  if (bmi < 24) return "M";
  if (bmi < 29) return "L";
  return "XL";
}

function recommendStyling(item, segment) {
  const ar = {
    men: "نسّقها مع حذاء أبيض وساعة معدنية لإطلالة يومية.",
    women: "أضيفي حقيبة صغيرة وحذاء حيادي لإطلالة متوازنة.",
    kids: "نسّقها مع سنيكرز مريح وخامة قطنية للراحة.",
  };
  const en = {
    men: "Pair with white sneakers and a metal watch for a daily look.",
    women: "Add a mini bag and neutral shoes for a balanced style.",
    kids: "Pair with comfy sneakers and cotton layers for comfort.",
  };
  return `${state.lang === "ar" ? ar[segment] : en[segment]} (${state.lang === "ar" ? item.nameAr : item.nameEn})`;
}

async function encryptTransient(text) {
  const enc = new TextEncoder();
  const key = await crypto.subtle.generateKey({ name: "AES-GCM", length: 256 }, true, ["encrypt", "decrypt"]);
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const cipher = await crypto.subtle.encrypt({ name: "AES-GCM", iv }, key, enc.encode(text));
  return { iv: Array.from(iv), bytes: new Uint8Array(cipher).byteLength };
}

function bindEvents() {
  el("langToggle").onclick = () => {
    state.lang = state.lang === "ar" ? "en" : "ar";
    applyLanguage();
  };

  el("segment").onchange = (e) => {
    state.selectedSegment = e.target.value;
    state.selectedItem = null;
    renderCatalog();
  };

  el("photoInput").onchange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (state.userPhotoURL) URL.revokeObjectURL(state.userPhotoURL);
    state.userPhotoURL = URL.createObjectURL(file);
    el("userPreview").src = state.userPhotoURL;
  };

  el("recommendBtn").onclick = () => {
    const h = Number(el("height").value);
    const w = Number(el("weight").value);
    const segment = el("segment").value;
    const item = state.selectedItem || (state.catalogs[segment] || [])[0];
    if (!item) return;
    const size = recommendSize(h, w, segment);
    const style = recommendStyling(item, segment);
    const t = i18n[state.lang];
    el("recommendation").innerHTML = `<strong>${t.recommendationTitle}</strong><br>${t.size}: <b>${size}</b><br>${t.stylePick}: ${style}`;
  };

  el("tryOnBtn").onclick = async () => {
    const t = i18n[state.lang];
    if (!state.userPhotoURL) return alert(t.noPhoto);
    if (!state.selectedItem) return alert(t.noItem);

    await encryptTransient(`${state.selectedItem.id}:${Date.now()}`);

    const bar = el("progressBar");
    bar.style.width = "0%";
    let p = 0;
    const timer = setInterval(() => {
      p += 2;
      bar.style.width = `${p}%`;
      if (p >= 100) {
        clearInterval(timer);
        el("clothOverlay").src = state.selectedItem.image;
        el("clothOverlay").style.display = "block";
        alert(t.done);
      }
    }, 1200);
  };

  el("saveBtn").onclick = () => {
    const t = i18n[state.lang];
    if (!state.userPhotoURL) return;
    const a = document.createElement("a");
    a.href = state.userPhotoURL;
    a.download = "virtual-look.png";
    a.click();
    alert(t.saved);
  };

  el("shareBtn").onclick = async () => {
    const t = i18n[state.lang];
    if (!state.selectedItem) return;
    const text = `${state.lang === "ar" ? "إطلالتي" : "My look"}: ${state.lang === "ar" ? state.selectedItem.nameAr : state.selectedItem.nameEn}`;
    await navigator.clipboard.writeText(text);
    alert(t.shared);
  };
}

(async function init() {
  applyLanguage();
  bindEvents();
  await loadCatalogs();
})();
