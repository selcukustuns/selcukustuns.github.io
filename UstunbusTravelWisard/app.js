const OPERATOR_HESAPLARI = [
    {
        kullaniciAdi: "selcukustun",
        sifreSha256: "3cb81a2ce0ef2ef78aa7cff1785532a24c568ae98c8c502b489bcda276805b22"
    }
];

let operatorOturumuAcik = false;

async function metinSha256(metin) {
    const veri = new TextEncoder().encode(metin);
    const hashBuffer = await crypto.subtle.digest("SHA-256", veri);
    return Array.from(new Uint8Array(hashBuffer))
        .map(b => b.toString(16).padStart(2, "0"))
        .join("");
}

function panelSekmesiDegistir(sekme) {
    const loginCard = document.getElementById("operatorLoginCard");
    const adminCard = document.getElementById("adminPanelCard");
    const fileCard = document.getElementById("fileUploadCard");
    const evrakCard = document.getElementById("evrakYonetimiCard");
    const mesafeCard = document.getElementById("mesafeOlcerCard");
    const kdvCard = document.getElementById("kdvHesaplayiciCard");
    const taksitCard = document.getElementById("taksitTablosuCard");
    const personelCard = document.getElementById("personelPaneliCard");
    const hizliMesajCard = document.getElementById("hizliMesajBariCard");
    
    const personelTab = document.getElementById("tabPersonel");
    const operatorTab = document.getElementById("tabOperator");
    const fileTab = document.getElementById("tabDosya");
    const evrakTab = document.getElementById("tabEvrak");
    const mesafeTab = document.getElementById("tabMesafe");
    const kdvTab = document.getElementById("tabKdv");
    const taksitTab = document.getElementById("tabTaksit");

    personelTab.classList.remove("active");
    operatorTab.classList.remove("active");
    fileTab.classList.remove("active");
    evrakTab.classList.remove("active");
    if (mesafeTab) mesafeTab.classList.remove("active");
    if (kdvTab) kdvTab.classList.remove("active");
    if (taksitTab) taksitTab.classList.remove("active");

    loginCard.style.display = "none";
    adminCard.style.display = "none";
    fileCard.style.display = "none";
    evrakCard.style.display = "none";
    if (mesafeCard) mesafeCard.style.display = "none";
    if (kdvCard) kdvCard.style.display = "none";
    if (taksitCard) taksitCard.style.display = "none";
    personelCard.style.display = "none";
    hizliMesajCard.style.display = "none";

    if (sekme === "personel") {
        personelTab.classList.add("active");
        personelCard.style.display = "block";
        hizliMesajCard.style.display = "block";
        return;
    }

    if (sekme === "taksit") {
        if (taksitTab) taksitTab.classList.add("active");
        if (taksitCard) taksitCard.style.display = "block";
        taksitArayuzunuHazirla();
        return;
    }

    if (sekme === "dosya") {
        fileTab.classList.add("active");
        fileCard.style.display = "block";
        return;
    }

    if (sekme === "evrak") {
        evrakTab.classList.add("active");
        evrakCard.style.display = "block";
        return;
    }

    if (sekme === "mesafe") {
        if (mesafeTab) mesafeTab.classList.add("active");
        if (mesafeCard) mesafeCard.style.display = "block";
        haritayiIlklendir();
        return;
    }

    if (sekme === "kdv") {
        if (kdvTab) kdvTab.classList.add("active");
        if (kdvCard) kdvCard.style.display = "block";
        document.getElementById("kdvTutar").focus();
        return;
    }

    operatorTab.classList.add("active");

    if (operatorOturumuAcik) {
        adminCard.style.display = "block";
    } else {
        loginCard.style.display = "block";
        document.getElementById("operatorUsername").focus();
    }
}

async function operatorGirisYap() {
    const kullaniciAdi = document.getElementById("operatorUsername").value.trim();
    const sifre = document.getElementById("operatorPassword").value;
    const hata = document.getElementById("operatorLoginError");

    hata.style.display = "none";
    hata.textContent = "";

    if (!kullaniciAdi || !sifre) {
        hata.textContent = "Lütfen kullanıcı adı ve şifreyi girin.";
        hata.style.display = "block";
        return;
    }

    const hesap = OPERATOR_HESAPLARI.find(h => h.kullaniciAdi === kullaniciAdi);
    const sifreHash = await metinSha256(sifre);

    if (!hesap || hesap.sifreSha256 !== sifreHash) {
        hata.textContent = "Kullanıcı adı veya şifre hatalı.";
        hata.style.display = "block";
        document.getElementById("operatorPassword").value = "";
        return;
    }

    operatorOturumuAcik = true;
    document.getElementById("operatorLoginCard").style.display = "none";
    document.getElementById("adminPanelCard").style.display = "block";
    document.getElementById("operatorStatus").style.display = "inline-block";
    document.getElementById("cikisYapBtnUst").style.display = "inline-flex";
    alert("Operatör girişi başarılı. Tur Programı Ekleme Paneli açıldı.");
}

function operatorCikisYap() {
    operatorOturumuAcik = false;
    document.getElementById("operatorUsername").value = "";
    document.getElementById("operatorPassword").value = "";
    document.getElementById("operatorLoginError").style.display = "none";
    document.getElementById("operatorStatus").style.display = "none";
    document.getElementById("cikisYapBtnUst").style.display = "none";
    panelSekmesiDegistir("personel");
}

/* ============================================================
   TUR TAKSİT MOTORU & JSON FİYAT YÖNETİMİ
   ============================================================ */
const TAKSIT_ORANLARI = [
    { taksit: 2, oran: 7.20 },
    { taksit: 3, oran: 9.15 },
    { taksit: 4, oran: 11.10 },
    { taksit: 5, oran: 13.90 },
    { taksit: 6, oran: 15.20 },
    { taksit: 7, oran: 16.40 },
    { taksit: 8, oran: 18.10 },
    { taksit: 9, oran: 19.35 },
    { taksit: 10, oran: 22.20 },
    { taksit: 11, oran: 24.30 },
    { taksit: 12, oran: 26.40 }
];

let SEZONLUK_TUR_FIYATLARI = {
    "eskisehir": { "0": 2000 },
    "kapadokya": { "0": 1000 },
    "gaziantep": { "0": 1250 },
    "ankara": { "0": 1750 },
    "mut_yerkopru": { "0": 1000 },
    "mardin_midyat": { "0": 2000 },
    "konya": { "0": 1300 },
    "dogu_karadeniz": { "2": 7000, "3": 10000, "4": 13000 },
    "dogu_anadolu": { "3": 11500 },
    "bati_karadeniz": { "1": 5250, "2": 8500 },
    "kuzey_ege": { "1": 5750, "2": 8500 },
    "kas_demre": { "1": 5500 },
    "istanbul": { "2": 7300 },
    "canakkale": { "1": 6500 },
    "gap": { "1": 4750 },
    "guney_ege": { "3": 14500 },
    "tunceli_kemaliye": { "1": 5000 },
    "bursa": { "1": 5750 }
};

let aktifTaksitModu = 'tur';
let aktifTaksitTurTipi = 'all';

function turfiyatlariniOtomatikYukle() {
    fetch("turfiyatlari.json", { cache: "no-store" })
        .then(res => {
            if (!res.ok) throw new Error("turfiyatlari.json okunamadı");
            return res.json();
        })
        .then(veri => {
            SEZONLUK_TUR_FIYATLARI = veri;
            console.log("✅ turfiyatlari.json otomatik yüklendi");
        })
        .catch(() => {
            console.warn("⚠️ turfiyatlari.json okunamadı, dahili liste devrede.");
        });
}

function turFiyatlariniYukle(event) {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = function(e) {
        try {
            const veri = JSON.parse(e.target.result);
            SEZONLUK_TUR_FIYATLARI = veri;
            taksitArayuzunuHazirla();
            alert("turfiyatlari.json başarıyla yüklendi ve güncellendi!");
        } catch (err) {
            alert("Dosya okunamadı veya JSON formatı geçersiz.");
        }
    };
    reader.readAsText(file);
    event.target.value = "";
}

function taksitModuDegistir(mod) {
    aktifTaksitModu = mod;
    document.getElementById('btnTaksitModTur').classList.toggle('active', mod === 'tur');
    document.getElementById('btnTaksitModManuel').classList.toggle('active', mod === 'manuel');
    document.getElementById('taksitTurSecimBlok').style.display = (mod === 'tur') ? 'block' : 'none';
    document.getElementById('taksitManuelBlok').style.display = (mod === 'manuel') ? 'block' : 'none';
    taksitHesapla();
}

function taksitTurTipiFiltrele(tip) {
    aktifTaksitTurTipi = tip;
    document.getElementById('tabTaksitAll').classList.toggle('active', tip === 'all');
    document.getElementById('tabTaksitGunu').classList.toggle('active', tip === 'gunubirlik');
    document.getElementById('tabTaksitKona').classList.toggle('active', tip === 'konaklamali');
    taksitArayuzunuHazirla();
}

function taksitArayuzunuHazirla() {
    const bolgeSelect = document.getElementById('taksitBolgeSecim');
    bolgeSelect.innerHTML = "";

    let kaynakList = TUM_BOLGELER;
    if (aktifTaksitTurTipi === 'gunubirlik') kaynakList = GUNUBIRLIK_BOLGELER;
    if (aktifTaksitTurTipi === 'konaklamali') kaynakList = KONAKLAMALI_BOLGELER;

    kaynakList.forEach(b => {
        if (SEZONLUK_TUR_FIYATLARI[b.code] && Object.keys(SEZONLUK_TUR_FIYATLARI[b.code]).length > 0) {
            const opt = document.createElement("option");
            opt.value = b.code;
            opt.text = b.name;
            bolgeSelect.appendChild(opt);
        }
    });

    if (bolgeSelect.options.length > 0) {
        taksitBolgeDegisti();
    } else {
        document.getElementById('taksitSureSecim').innerHTML = '<option value="">Fiyat Tanımlı Tur Bulunamadı</option>';
        taksitHesapla();
    }
}

function taksitBolgeDegisti() {
    const bolge = document.getElementById('taksitBolgeSecim').value;
    const sureSelect = document.getElementById('taksitSureSecim');
    sureSelect.innerHTML = "";

    const fiyatObj = SEZONLUK_TUR_FIYATLARI[bolge];
    if (fiyatObj) {
        Object.keys(fiyatObj).forEach(gece => {
            const opt = document.createElement("option");
            opt.value = gece;
            opt.text = duyuruSureEtiketiGetir(gece) + ` — (${paraFormatla(fiyatObj[gece])})`;
            sureSelect.appendChild(opt);
        });
    }
    taksitHesapla();
}

function taksitSureDegisti() {
    taksitHesapla();
}

function taksitHesapla() {
    let kisiBasiFiyat = 0;
    const kisiSayisi = parseInt(document.getElementById('taksitKisiSayisi').value) || 1;

    if (aktifTaksitModu === 'tur') {
        const bolge = document.getElementById('taksitBolgeSecim').value;
        const gece = document.getElementById('taksitSureSecim').value;
        if (SEZONLUK_TUR_FIYATLARI[bolge] && SEZONLUK_TUR_FIYATLARI[bolge][gece]) {
            kisiBasiFiyat = parseFloat(SEZONLUK_TUR_FIYATLARI[bolge][gece]);
        }
    } else {
        kisiBasiFiyat = parseFloat(document.getElementById('taksitManuelTutar').value) || 0;
    }

    const toplamBazTutar = kisiBasiFiyat * kisiSayisi;
    document.getElementById('taksitBazTutarGosterge').innerText = paraFormatla(toplamBazTutar);

    const tabloGovdesi = document.getElementById('taksitTabloGovdesi');
    tabloGovdesi.innerHTML = "";

    if (toplamBazTutar <= 0) {
        tabloGovdesi.innerHTML = `<tr><td colspan="5" style="text-align:center; color:#94a3b8; padding:20px;">Lütfen geçerli bir tur seçin veya tutar girin.</td></tr>`;
        return;
    }

    TAKSIT_ORANLARI.forEach(item => {
        const vadeFarki = toplamBazTutar * (item.oran / 100);
        const toplamCekilecek = toplamBazTutar + vadeFarki;
        const aylikTaksit = toplamCekilecek / item.taksit;

        const tr = document.createElement("tr");
        tr.innerHTML = `
            <td><strong>${item.taksit} Taksit</strong></td>
            <td><span style="color:#64748b;">%${item.oran.toFixed(2)}</span></td>
            <td style="color:var(--warning); font-weight:700;">${paraFormatla(aylikTaksit)}</td>
            <td style="color:#ef4444;">+${paraFormatla(vadeFarki)}</td>
            <td style="color:var(--success); font-weight:800; font-size:15px;">${paraFormatla(toplamCekilecek)}</td>
        `;
        tabloGovdesi.appendChild(tr);
    });
}

function taksitMetniDerle(musteriAdi = "") {
    const kisiSayisi = document.getElementById('taksitKisiSayisi').value;
    const bazTutar = document.getElementById('taksitBazTutarGosterge').innerText;
    let turAdi = "Özel Tutar";

    if (aktifTaksitModu === 'tur') {
        const bolgeSelect = document.getElementById('taksitBolgeSecim');
        const sureSelect = document.getElementById('taksitSureSecim');
        turAdi = `${bolgeSelect.options[bolgeSelect.selectedIndex]?.text} (${sureSelect.options[sureSelect.selectedIndex]?.text.split('—')[0].trim()})`;
    }

    let hitap = musteriAdi ? `Sayın *${musteriAdi}*,\n\n` : "";

    let metin = `${hitap}🚌 *Üstünbus Turizm - Kredi Kartı Taksit Seçenekleri*\n\n` +
                `📍 *Tur:* ${turAdi}\n` +
                `👥 *Kişi Sayısı:* ${kisiSayisi} Kişi\n` +
                `💵 *Nakit / Tek Çekim Tutar:* ${bazTutar}\n\n` +
                `💳 *Taksit Dağılım Tablosu:*\n`;

    let kisiBasiFiyat = 0;
    if (aktifTaksitModu === 'tur') {
        const bolge = document.getElementById('taksitBolgeSecim').value;
        const gece = document.getElementById('taksitSureSecim').value;
        kisiBasiFiyat = SEZONLUK_TUR_FIYATLARI[bolge]?.[gece] || 0;
    } else {
        kisiBasiFiyat = parseFloat(document.getElementById('taksitManuelTutar').value) || 0;
    }
    const toplamBazTutar = kisiBasiFiyat * parseInt(kisiSayisi);

    TAKSIT_ORANLARI.forEach(item => {
        const toplamCekilecek = toplamBazTutar * (1 + (item.oran / 100));
        const aylik = toplamCekilecek / item.taksit;
        metin += `• *${item.taksit} Taksit:* Aylık ${paraFormatla(aylik)} (Toplam: ${paraFormatla(toplamCekilecek)})\n`;
    });

    metin += `\nDetaylı bilgi ve rezervasyon için bize ulaşabilirsiniz! 🚀`;
    return metin;
}

function taksitTablosuKopyala() {
    const adInput = document.getElementById("taksitMusteriAd");
    const musteriAdi = adInput ? adInput.value.trim() : "";
    const metin = taksitMetniDerle(musteriAdi);

    navigator.clipboard.writeText(metin).then(() => {
        kopyalandiGoster('btnTaksitKopyala');
    });
}

function taksitWhatsappGonder() {
    const telInput = document.getElementById("taksitMusteriTel");
    const adInput = document.getElementById("taksitMusteriAd");

    const tel = telInput ? telInput.value.trim() : "";
    const musteriAdi = adInput ? adInput.value.trim() : "";

    if (!tel) {
        alert("Lütfen müşterinin telefon numarasını girin!");
        if (telInput) telInput.focus();
        return;
    }

    const metin = taksitMetniDerle(musteriAdi);
    whatsappAc(tel, metin);
}

/* ============================================================
   KDV HESAPLAMA MOTORU
   ============================================================ */
let aktifKdvModu = 'dahil';

function kdvModDegistir(mod) {
    aktifKdvModu = mod;
    document.getElementById('btnKdvDahilMod').classList.toggle('active', mod === 'dahil');
    document.getElementById('btnKdvHaricMod').classList.toggle('active', mod === 'haric');

    const lbl = document.getElementById('lblKdvTutar');
    if (mod === 'dahil') {
        lbl.innerText = "KDV Dahil Toplam Tutar (₺):";
    } else {
        lbl.innerText = "KDV Hariç Net Tutar (₺):";
    }
    kdvHesapla();
}

function kdvOranSec(oran, btn) {
    document.getElementById('kdvSeciliOran').value = oran;
    document.querySelectorAll('.kdv-oran-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    kdvHesapla();
}

function paraFormatla(sayi) {
    return new Intl.NumberFormat('tr-TR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(sayi) + " ₺";
}

function kdvHesapla() {
    const tutarInput = document.getElementById('kdvTutar').value;
    const tutar = parseFloat(tutarInput);
    const oran = parseFloat(document.getElementById('kdvSeciliOran').value);

    if (isNaN(tutar) || tutar <= 0) {
        document.getElementById('resNetTutar').innerText = "0,00 ₺";
        document.getElementById('resKdvTutari').innerText = "0,00 ₺";
        document.getElementById('resToplamTutar').innerText = "0,00 ₺";
        return;
    }

    let netTutar = 0;
    let kdvTutari = 0;
    let toplamTutar = 0;

    if (aktifKdvModu === 'dahil') {
        toplamTutar = tutar;
        netTutar = toplamTutar / (1 + (oran / 100));
        kdvTutari = toplamTutar - netTutar;
    } else {
        netTutar = tutar;
        kdvTutari = netTutar * (oran / 100);
        toplamTutar = netTutar + kdvTutari;
    }

    document.getElementById('resNetTutar').innerText = paraFormatla(netTutar);
    document.getElementById('resKdvTutari').innerText = paraFormatla(kdvTutari);
    document.getElementById('resToplamTutar').innerText = paraFormatla(toplamTutar);
}

function kdvOzetiKopyala() {
    const net = document.getElementById('resNetTutar').innerText;
    const kdv = document.getElementById('resKdvTutari').innerText;
    const toplam = document.getElementById('resToplamTutar').innerText;
    const oran = document.getElementById('kdvSeciliOran').value;

    const metin = `*Üstünbus Turizm - KDV Hesaplama Dökümü*\n` +
                  `• KDV Oranı: %${oran}\n` +
                  `• KDV Hariç Tutar: ${net}\n` +
                  `• KDV Tutarı: ${kdv}\n` +
                  `• KDV Dahil Toplam: ${toplam}`;

    navigator.clipboard.writeText(metin).then(() => {
        kopyalandiGoster('btnKdvKopyala');
    });
}

function kdvSifirla() {
    document.getElementById('kdvTutar').value = "";
    kdvHesapla();
}

/* ============================================================
   GOOGLE PLACES + LEAFLET / OSRM HİBRİT HARİTA MOTORU
   ============================================================ */
let harita = null;
let rotaKatmani = null;

function haritayiIlklendir() {
    setTimeout(() => {
        if (!harita) {
            harita = L.map('haritaAlani').setView([36.9167, 34.8953], 7);
            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                maxZoom: 18,
                attribution: '© OpenStreetMap'
            }).addTo(harita);
            
            googleAutocompleteBagla('rotaKalkis');
            googleAutocompleteBagla('rotaVaris');

            const kalkisInp = document.getElementById('rotaKalkis');
            if (kalkisInp && kalkisInp.value === "Tarsus") {
                kalkisInp.dataset.lat = "36.9167";
                kalkisInp.dataset.lon = "34.8953";
            }
        } else {
            harita.invalidateSize();
        }
    }, 250);
}

function googleAutocompleteBagla(inputId) {
    const input = document.getElementById(inputId);
    if (!input) return;

    input.addEventListener('input', () => {
        delete input.dataset.lat;
        delete input.dataset.lon;
    });

    if (!window.google || !google.maps || !google.maps.places) {
        console.warn("Google Maps Places API henüz yüklenmedi.");
        return;
    }

    const autocomplete = new google.maps.places.Autocomplete(input, {
        componentRestrictions: { country: "tr" },
        fields: ["geometry", "name", "formatted_address"]
    });

    autocomplete.addListener("place_changed", function () {
        const place = autocomplete.getPlace();

        if (!place || !place.geometry || !place.geometry.location) {
            return;
        }

        input.dataset.lat = place.geometry.location.lat();
        input.dataset.lon = place.geometry.location.lng();
    });
}

async function koordinatCozucu(inputEl) {
    if (inputEl.dataset.lat && inputEl.dataset.lon) {
        return {
            lat: parseFloat(inputEl.dataset.lat),
            lon: parseFloat(inputEl.dataset.lon)
        };
    }

    const adres = inputEl.value.trim();
    if (!adres) return null;

    if (window.google && google.maps && google.maps.Geocoder) {
        const geocoder = new google.maps.Geocoder();
        const gResult = await new Promise((resolve) => {
            geocoder.geocode({ address: adres, componentRestrictions: { country: 'TR' } }, (results, status) => {
                if (status === 'OK' && results[0]) {
                    resolve({
                        lat: results[0].geometry.location.lat(),
                        lon: results[0].geometry.location.lng()
                    });
                } else {
                    resolve(null);
                }
            });
        });

        if (gResult) {
            inputEl.dataset.lat = gResult.lat;
            inputEl.dataset.lon = gResult.lon;
            return gResult;
        }
    }

    try {
        const url = `https://nominatim.openstreetmap.org/search?format=json&countrycodes=tr&limit=1&q=${encodeURIComponent(adres)}`;
        const res = await fetch(url, { headers: { "Accept-Language": "tr" } });
        const data = await res.json();
        if (data && data.length > 0) {
            const osmResult = { lat: parseFloat(data[0].lat), lon: parseFloat(data[0].lon) };
            inputEl.dataset.lat = osmResult.lat;
            inputEl.dataset.lon = osmResult.lon;
            return osmResult;
        }
    } catch (e) {
        console.error("OSM Geocode hatası:", e);
    }

    return null;
}

async function rotaHesapla() {
    const kalkisInp = document.getElementById("rotaKalkis");
    const varisInp = document.getElementById("rotaVaris");
    const btn = document.getElementById("btnRotaHesapla");

    if (!kalkisInp.value.trim() || !varisInp.value.trim()) {
        alert("Lütfen hem kalkış hem de varış noktasını girin!");
        return;
    }

    if (btn) btn.innerText = "Hesaplanıyor...";

    try {
        const k1 = await koordinatCozucu(kalkisInp);
        const k2 = await koordinatCozucu(varisInp);

        if (!k1) {
            alert(`Kalkış noktası ("${kalkisInp.value}") bulunamadı. Lütfen açılan Google önerilerinden seçin.`);
            return;
        }

        if (!k2) {
            alert(`Varış noktası ("${varisInp.value}") bulunamadı. Lütfen açılan Google önerilerinden seçin.`);
            return;
        }

        const osrmUrl = `https://router.project-osrm.org/route/v1/driving/${k1.lon},${k1.lat};${k2.lon},${k2.lat}?overview=full&geometries=geojson`;
        const res = await fetch(osrmUrl);
        const rotaVerisi = await res.json();

        if (!rotaVerisi.routes || rotaVerisi.routes.length === 0) {
            alert("İki nokta arasında karayolu rotası oluşturulamadı.");
            return;
        }

        const mesafeMetre = rotaVerisi.routes[0].distance;
        const sureSaniye = rotaVerisi.routes[0].duration;

        const km = (mesafeMetre / 1000).toFixed(1);
        
        const normalSaat = Math.floor(sureSaniye / 3600);
        const normalDk = Math.round((sureSaniye % 3600) / 60);

        const otobusToplamSaat = (mesafeMetre / 1000) / 80;
        const otobusSaat = Math.floor(otobusToplamSaat);
        const otobusDk = Math.round((otobusToplamSaat - otobusSaat) * 60);

        document.getElementById("sonucKm").innerText = `${km} km`;
        document.getElementById("sonucSureOtobus").innerText = `~${otobusSaat} sa ${otobusDk} dk`;
        document.getElementById("sonucSureNormal").innerText = `~${normalSaat} sa ${normalDk} dk`;
        document.getElementById("rotaSonucKutusu").style.display = "block";

        if (rotaKatmani) harita.removeLayer(rotaKatmani);

        const geojson = rotaVerisi.routes[0].geometry;
        rotaKatmani = L.geoJSON(geojson, {
            style: { color: "#3498db", weight: 5, opacity: 0.8 }
        }).addTo(harita);

        L.marker([k1.lat, k1.lon]).addTo(rotaKatmani).bindPopup(`🛫 Kalkış: ${kalkisInp.value}`).openPopup();
        L.marker([k2.lat, k2.lon]).addTo(rotaKatmani).bindPopup(`🛬 Varış: ${varisInp.value}`);

        harita.fitBounds(rotaKatmani.getBounds(), { padding: [40, 40] });

    } catch (err) {
        console.error(err);
        alert("Mesafe hesaplanırken sunucu bağlantı hatası oluştu.");
    } finally {
        if (btn) btn.innerText = "🔍 Mesafeyi ve Rotayı Hesapla";
    }
}

function googleMapsRotaAc() {
    const baslangic = document.getElementById("rotaKalkis").value.trim();
    const bitis = document.getElementById("rotaVaris").value.trim();

    if (!baslangic || !bitis) {
        alert("Lütfen önce kalkış ve varış noktalarını girin.");
        return;
    }

    const gmapsUrl = `https://www.google.com/maps/dir/?api=1&origin=${encodeURIComponent(baslangic)}&destination=${encodeURIComponent(bitis)}&travelmode=driving`;
    window.open(gmapsUrl, "_blank");
}

/* ============================================================
   BÖLGE / DESTİNASYON LİSTELERİ
   ============================================================ */
const KONAKLAMALI_BOLGELER = [
    { code: "dogu_karadeniz", name: "🌲 Doğu Karadeniz" },
    { code: "bati_karadeniz", name: "🌊 Batı Karadeniz" },
    { code: "kuzey_ege", name: "🫒 Kuzey Ege" },
    { code: "istanbul", name: "🌉 İstanbul" },
    { code: "gap", name: "☀️ GAP (Güneydoğu Anadolu)" },
    { code: "kaplica", name: "♨️ Kaplıca" },
    { code: "dogu_anadolu", name: "❄️ Doğu Anadolu" },
    { code: "kas_demre", name: "🏖️ Kaş - Demre (Antalya)" },
    { code: "guney_ege", name: "🌅 Güney Ege" },
    { code: "canakkale", name: "⚓ Çanakkale" },
    { code: "tunceli_kemaliye", name: "🏔️ Tunceli - Kemaliye" },
    { code: "isparta", name: "🌷 Isparta" },
    { code: "tokat_amasya", name: "🍑 Tokat - Amasya" },
    { code: "bursa", name: "🌰 Bursa" },
    { code: "diger_konaklamali", name: "🗺️ Diğer" }
];

const GUNUBIRLIK_BOLGELER = [
    { code: "kapadokya", name: "🎈 Kapadokya Turu" },
    { code: "gaziantep", name: "🥙 Gaziantep Turu" },
    { code: "ankara", name: "🏛️ Ankara Turu" },
    { code: "eskisehir", name: "🚤 Eskişehir Turu" },
    { code: "hatay", name: "🏺 Hatay Turu" },
    { code: "sanliurfa", name: "🕊️ Şanlıurfa Turu" },
    { code: "mardin_midyat", name: "🏘️ Mardin - Midyat Turu" },
    { code: "adiyaman_nemrut", name: "🗿 Adıyaman - Nemrut Turu" },
    { code: "mut_yerkopru", name: "🏞️ Mut - Yerköprü Turu" },
    { code: "konya", name: "🕌 Konya Turu" },
    { code: "erciyes", name: "⛷️ Erciyes Turu" },
    { code: "diger_gunubirlik", name: "🗺️ Diğer" }
];

const TUM_BOLGELER = [...KONAKLAMALI_BOLGELER, ...GUNUBIRLIK_BOLGELER];

const SABIT_DURAKLAR = [
    { 
        key: "mersin", 
        sehir: "Mersin", 
        duraklar: [
            { isim: "Vipol AVM", harita: "https://maps.app.goo.gl/7W79esaZCTQXnioC7" },
            { isim: "Forum AVM", harita: "https://maps.app.goo.gl/Fohj4EZxtCSEppc7A" },
            { isim: "Eski Devlet Hastanesi", harita: "https://maps.app.goo.gl/N1UToGRf5KM6MgN98" }
        ]
    },
    { 
        key: "tarsus", 
        sehir: "Tarsus", 
        duraklar: [
            { isim: "Şehitler Tepesi Ofis", harita: "https://maps.app.goo.gl/uuodXP2fXSZ1AW387" },
            { isim: "Madame Home (Eski Vatan Bilgisayar)", harita: "https://maps.app.goo.gl/66dyQkq5A3idR4kZ8" },
            { isim: "Cengiz Topel", harita: "https://maps.app.goo.gl/g16Fain2ePpUTLMw7" },
            { isim: "Kleopatra Kapısı", harita: "https://maps.app.goo.gl/TQPikmNHAU7E8pcPA" }
        ]
    },
    { 
        key: "adana", 
        sehir: "Adana", 
        duraklar: [
            { isim: "Duygu Kafe", harita: "https://maps.app.goo.gl/H6KKoUfpaY151w8h7" }
        ]
    }
];

const ONEMLI_DURAK_DUYURUSU = "Değerli misafirimiz, turumuzun kalkış saatlerinin aksamaması adına sizleri yalnızca önceden belirttiğiniz duraklardan alabilmekteyiz. Seçtiğiniz konum genel duraklarımız arasında yer alsa bile, listemizde adınız bulunmadığında araçlarımız o durakta durmayacaktır. Tur günü bir mağduriyet yaşamamanız ve operasyonel aksaklıklara yol açmamak adına seçtiğiniz durakta zamanında bulunmanızı rica ederiz. Durak değişikliği taleplerinizi, tur kalkışından en geç 1 gün öncesine kadar çağrı merkezimizi arayarak bize iletebilirsiniz. Şimdiden keyifli yolculuklar dileriz!";

function kalkisMetniOlustur(kTarihFormatli, saatler) {
    let satirlar = [kTarihFormatli];
    SABIT_DURAKLAR.forEach(blok => {
        const saat = saatler[blok.key];
        if (saat) {
            satirlar.push(`🕐 ${blok.sehir} Kalkış Saati: ${saat}`);
            blok.duraklar.forEach(durak => satirlar.push(`   • ${durak.isim}`));
        }
    });
    return satirlar.join("\n");
}

function durakKonumlariMesajiOlustur() {
    let satirlar = [];
    SABIT_DURAKLAR.forEach(blok => {
        satirlar.push(`🏙️ *${blok.sehir} Durak Noktalarımız ve Konumları:*`);
        blok.duraklar.forEach(durak => {
            satirlar.push(`📍 ${durak.isim}:\n${durak.harita}`);
        });
        satirlar.push("");
    });
    satirlar.push(`⚠️ *Önemli Duyuru:*\n${ONEMLI_DURAK_DUYURUSU}`);
    return satirlar.join("\n");
}

let anaTurListesi = [];
let aktifTipFiltresi = 'all';

window.onload = function() {
    bolgeSecenekleriniDoldur();
    otelAlanlariniOlustur();
    duyuruSecimKutulariniOlustur();
    duyuruSablonuGetir();

    turListesiniOtomatikYukle();
    duyuruKutuphanesiniOtomatikYukle();
    turfiyatlariniOtomatikYukle();
};

function bolgeListesiGetir(tip) {
    if (tip === 'konaklamali') return KONAKLAMALI_BOLGELER;
    if (tip === 'gunubirlik') return GUNUBIRLIK_BOLGELER;
    return TUM_BOLGELER;
}

function bolgeSecenekleriniDoldur() {
    bolgeSelectGuncelle('yeniBolge', document.getElementById("yeniTip").value, false);
    bolgeSelectGuncelle('filtreBolge', aktifTipFiltresi, true);
}

function bolgeSelectGuncelle(selectId, tip, ilkSecenekVarMi) {
    const select = document.getElementById(selectId);
    const oncekiDeger = select.value;
    select.innerHTML = "";

    if (ilkSecenekVarMi) {
        let optAll = document.createElement("option");
        optAll.value = "all";
        optAll.text = "-- Tüm Bölgeler / Rotalar --";
        select.appendChild(optAll);
    }

    if (tip === 'all') {
        const grupKona = document.createElement("optgroup");
        grupKona.label = "🏨 Konaklamalı Rotalar";
        KONAKLAMALI_BOLGELER.forEach(b => {
            let opt = document.createElement("option");
            opt.value = b.code;
            opt.text = b.name;
            grupKona.appendChild(opt);
        });
        select.appendChild(grupKona);

        const grupGunu = document.createElement("optgroup");
        grupGunu.label = "☀️ Günübirlik Rotalar";
        GUNUBIRLIK_BOLGELER.forEach(b => {
            let opt = document.createElement("option");
            opt.value = b.code;
            opt.text = b.name;
            grupGunu.appendChild(opt);
        });
        select.appendChild(grupGunu);
    } else {
        bolgeListesiGetir(tip).forEach(b => {
            let opt = document.createElement("option");
            opt.value = b.code;
            opt.text = b.name;
            select.appendChild(opt);
        });
    }

    const yeniSecenekler = Array.from(select.options).map(o => o.value);
    if (yeniSecenekler.includes(oncekiDeger)) {
        select.value = oncekiDeger;
    } else {
        select.selectedIndex = 0;
    }
}

function tipDegisti() {
    const tip = document.getElementById("yeniTip").value;
    document.getElementById("geceSayisiBloku").style.display = (tip === 'gunubirlik') ? 'none' : 'block';
    document.getElementById("dinamikOteller").style.display = (tip === 'gunubirlik') ? 'none' : 'block';
    bolgeSelectGuncelle('yeniBolge', tip, false);
}

function otelAlanlariniOlustur(hazirVeri = null) {
    const geceSayisi = parseInt(document.getElementById("yeniGeceSayisi").value);
    const konteyner = document.getElementById("dinamikOteller");
    konteyner.innerHTML = "<h4>🏨 Otel Listesi</h4>";
    
    for(let i = 1; i <= geceSayisi; i++) {
        let varsayilanOtel = "";
        if(hazirVeri && hazirVeri[i-1]) {
            varsayilanOtel = hazirVeri[i-1].replace(`${i}. Gece: `, "").trim();
        }
        konteyner.innerHTML += `
            <div style="margin-bottom:8px;">
                <span style="font-size:12px; font-weight:bold; color:var(--warning);">${i}. Gece Kalınacak Otel:</span>
                <input type="text" class="otel-input" data-gece="${i}" value="${varsayilanOtel}" placeholder="Örn: Ayder Haşimoğlu Otel">
            </div>
        `;
    }
}

function turGeceSayisiGetir(tur) {
    if (tur.raw && tur.raw.geceSayisi) return parseInt(tur.raw.geceSayisi, 10);
    if (tur.oteller) {
        const satirlar = tur.oteller.split("\n").filter(s => s.trim() !== "" && s.trim() !== "Günübirlik Tur (Konaklama Yok)");
        if (satirlar.length > 0) return satirlar.length;
    }
    return 1;
}

function turSureAciklamasi(tur) {
    if (tur.tip === 'gunubirlik') return "Günübirlik (1 Gün)";
    const gece = turGeceSayisiGetir(tur);
    const gun = gece + 1;
    return `${gece} Gece ${gun} Gün`;
}

function tarihFormatlaMetin(tarihStr) {
    if(!tarihStr) return "";
    const secilenTarih = new Date(tarihStr);
    return secilenTarih.toLocaleDateString('tr-TR', { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
    });
}

const TURKCE_AYLAR = {
    "ocak": 1, "şubat": 2, "subat": 2, "mart": 3, "nisan": 4,
    "mayıs": 5, "mayis": 5, "haziran": 6, "temmuz": 7,
    "ağustos": 8, "agustos": 8, "eylül": 9, "eylul": 9,
    "ekim": 10, "kasım": 11, "kasim": 11, "aralık": 12, "aralik": 12
};

function turkceTarihiISOyeCevir(metin) {
    if (!metin) return "";
    const eslesme = metin.match(/(\d{1,2})\s+([A-Za-zÇĞİÖŞÜçğıöşü]+)\s+(\d{4})/);
    if (!eslesme) return "";
    const gun = eslesme[1].padStart(2, "0");
    const ayAdi = eslesme[2].toLocaleLowerCase("tr-TR");
    const ay = TURKCE_AYLAR[ayAdi];
    if (!ay) return "";
    return `${eslesme[3]}-${String(ay).padStart(2, "0")}-${gun}`;
}

function turdanRawCikar(tur) {
    const araParcalar = (tur.turAraligi || "").split(" - ");
    const tBaslangic = turkceTarihiISOyeCevir(araParcalar[0] || "");
    const tBitis = turkceTarihiISOyeCevir(araParcalar[1] || "");

    const kalkisMetin = tur.kalkisDetay || "";
    const kTarih = turkceTarihiISOyeCevir((kalkisMetin.split("\n")[0] || ""));
    let mersinSaat = "", tarsusSaat = "", adanaSaat = "";
    
    SABIT_DURAKLAR.forEach(blok => {
        const eslesme = kalkisMetin.match(new RegExp(blok.sehir + "\\s*Kalkış Saati:\\s*(\\d{1,2}:\\d{2})"));
        if (eslesme) {
            if (blok.key === "mersin") mersinSaat = eslesme[1];
            if (blok.key === "tarsus") tarsusSaat = eslesme[1];
            if (blok.key === "adana") adanaSaat = eslesme[1];
        }
    });

    const donusMetin = tur.donusDetay || "";
    const dSaatEslesme = donusMetin.match(/Saat:\s*(\d{1,2}:\\d{2})/);
    const dSaat = dSaatEslesme ? dSaatEslesme[1] : "";
    
    const dNoktaEslesme = donusMetin.match(/Varış Yeri:\s*(.+)$/);
    let dNokta = dNoktaEslesme ? dNoktaEslesme[1].trim() : "";
    if (dNokta === "Belirtilmedi") dNokta = "";

    let geceSayisi = "1";
    if (tur.tip === 'konaklamali' && tur.oteller) {
        const satirlar = tur.oteller.split("\n").filter(s => s.trim() !== "");
        if (satirlar.length > 0) geceSayisi = String(satirlar.length);
    }

    return { 
        tBaslangic, tBitis, kTarih, mersinSaat, tarsusSaat, adanaSaat, dSaat, dNokta, geceSayisi 
    };
}

function turEkle() {
    const duzenlenenId = document.getElementById("duzenlenenTurId").value;
    const tip = document.getElementById("yeniTip").value;
    const bolge = document.getElementById("yeniBolge").value;
    const ad = document.getElementById("yeniAd").value.trim();
    
    const tBaslangic = document.getElementById("turBaslangicTarih").value;
    const tBitis = document.getElementById("turBitisTarih").value;
    
    const kTarih = document.getElementById("kalkisTarih").value;
    const mersinSaat = document.getElementById("mersinSaat").value;
    const tarsusSaat = document.getElementById("tarsusSaat").value;
    const adanaSaat = document.getElementById("adanaSaat").value;
    
    const dSaat = document.getElementById("donusSaat").value;
    const dNokta = document.getElementById("donusNokta").value.trim();
    
    const program = document.getElementById("yeniProgram").value.trim();

    if(!ad || !tBaslangic || !tBitis || !kTarih || (!mersinSaat && !tarsusSaat && !adanaSaat) || !program) { 
        alert("Lütfen zorunlu alanları eksiksiz doldurun! (Kalkış için en az bir şehrin saatini girmelisiniz)"); 
        return; 
    }

    let otellerDizisi = [];
    if(tip === 'konaklamali') {
        const otelInputs = document.querySelectorAll(".otel-input");
        otelInputs.forEach(input => {
            const geceNo = input.getAttribute("data-gece");
            const otelAdi = input.value.trim() || "Belirtilmedi";
            otellerDizisi.push(`${geceNo}. Gece: ${otelAdi}`);
        });
    } else {
        otellerDizisi.push("Günübirlik Tur (Konaklama Yok)");
    }

    const turAralikFormatli = `${tarihFormatlaMetin(tBaslangic)} - ${tarihFormatlaMetin(tBitis)}`;

    const turData = {
        id: duzenlenenId ? duzenlenenId : Date.now().toString(),
        tip,
        bolge,
        ad,
        siralamaTarih: tBaslangic,
        turAraligi: turAralikFormatli,
        kalkisDetay: kalkisMetniOlustur(tarihFormatlaMetin(kTarih), { mersin: mersinSaat, tarsus: tarsusSaat, adana: adanaSaat }),
        donusDetay: `⏰ Saat: ${dSaat || 'Belirtilmedi'} | 📍 Varış Yeri: ${dNokta || 'Belirtilmedi'}`,
        oteller: otellerDizisi.join("\n"),
        program,
        raw: { tBaslangic, tBitis, kTarih, mersinSaat, tarsusSaat, adanaSaat, dSaat, dNokta, geceSayisi: document.getElementById("yeniGeceSayisi").value }
    };

    if(duzenlenenId) {
        const index = anaTurListesi.findIndex(t => t.id === duzenlenenId);
        if(index !== -1) anaTurListesi[index] = turData;
        
        document.getElementById("duzenlenenTurId").value = "";
        document.getElementById("anaEklemeBtn").innerText = "➕ Formatlı Turu Havuza Ekle";
        document.getElementById("anaEklemeBtn").className = "btn-orange";
        alert("Tur başarıyla güncellendi!");
    } else {
        anaTurListesi.push(turData);
        alert("Yeni tur başarıyla eklendi!");
    }

    anaTurListesi.sort((a, b) => new Date(a.siralamaTarih) - new Date(b.siralamaTarih));
    listeleriYenile();
    formuTemizle();
}

function turDuzenle(id) {
    const tur = anaTurListesi.find(t => t.id === id);
    if(!tur) return;

    document.getElementById("duzenlenenTurId").value = tur.id;
    document.getElementById("yeniTip").value = tur.tip;
    tipDegisti(); 

    document.getElementById("yeniAd").value = tur.ad;
    document.getElementById("yeniProgram").value = tur.program;

    const varsayilanBolge = tur.tip === 'gunubirlik' ? 'diger_gunubirlik' : 'diger_konaklamali';
    document.getElementById("yeniBolge").value = tur.bolge || varsayilanBolge;

    const raw = (tur.raw && tur.raw.tBaslangic) ? tur.raw : turdanRawCikar(tur);

    document.getElementById("turBaslangicTarih").value = raw.tBaslangic || "";
    document.getElementById("turBitisTarih").value = raw.tBitis || "";
    document.getElementById("kalkisTarih").value = raw.kTarih || "";
    document.getElementById("mersinSaat").value = raw.mersinSaat || "";
    document.getElementById("tarsusSaat").value = raw.tarsusSaat || "";
    document.getElementById("adanaSaat").value = raw.adanaSaat || "";
    document.getElementById("donusSaat").value = raw.dSaat || "";
    document.getElementById("donusNokta").value = raw.dNokta || "";

    if(tur.tip === 'konaklamali') {
        document.getElementById("yeniGeceSayisi").value = raw.geceSayisi || "1";
        const otellerListesi = (tur.oteller || "").split("\n").filter(s => s.trim() !== "");
        otelAlanlariniOlustur(otellerListesi);
    }

    document.getElementById("anaEklemeBtn").innerText = "💾 Değişiklikleri Kaydet ve Listeyi Yenile";
    document.getElementById("anaEklemeBtn").className = "btn-green";
    document.getElementById("yeniAd").focus();
}

function turSil(id) {
    if(confirm("Bu turu listeden silmek istediğinize emin misiniz?")) {
        anaTurListesi = anaTurListesi.filter(t => t.id !== id);
        listeleriYenile();
        document.getElementById("detayPaneli").style.display = "none";
    }
}

function turListesiniUygula(veri, kaynak = "tur_listesi.json") {
    if (!Array.isArray(veri)) {
        throw new Error("Geçersiz format: tur listesi bir JSON dizisi olmalı.");
    }

    anaTurListesi = veri;
    anaTurListesi.sort((a, b) => new Date(a.siralamaTarih) - new Date(b.siralamaTarih));
    listeleriYenile();

    const dosyaAlani = document.getElementById("dosyaOku");
    if (dosyaAlani) dosyaAlani.title = `Aktif veri: ${kaynak}`;

    console.log(`✅ Tur listesi yüklendi (${anaTurListesi.length} tur) — ${kaynak}`);
}

function turListesiniOtomatikYukle() {
    fetch("tur_listesi.json", { cache: "no-store" })
        .then(res => {
            if (!res.ok) throw new Error(`tur_listesi.json okunamadı (${res.status})`);
            return res.json();
        })
        .then(veri => {
            turListesiniUygula(veri, "tur_listesi.json (fetch)");
        })
        .catch(err => {
            console.warn(
                "⚠️ tur_listesi.json fetch ile okunamadı (muhtemelen dosya çift tıklanarak açıldı). " +
                "tur_listesi.js üzerinden yedek yöntem deneniyor.",
                err
            );
            turListesiniScriptTagIleYukle();
        });
}

function turListesiniScriptTagIleYukle() {
    const script = document.createElement("script");
    script.src = "tur_listesi.js";
    script.onload = function() {
        if (typeof TUR_LISTESI_JSON !== "undefined" && Array.isArray(TUR_LISTESI_JSON)) {
            turListesiniUygula(TUR_LISTESI_JSON, "tur_listesi.js (otomatik yedek)");
        } else {
            otomatikTurYuklemeBasarisiz();
        }
    };
    script.onerror = otomatikTurYuklemeBasarisiz;
    document.head.appendChild(script);
}

function otomatikTurYuklemeBasarisiz() {
    console.warn(
        "⚠️ Ne tur_listesi.json (fetch) ne de tur_listesi.js (script) otomatik yüklenebildi. " +
        "Manuel yükleme alanını kullanabilirsiniz."
    );
    const secici = document.getElementById("dosyaOku");
    if (secici) {
        secici.title = "Otomatik tur listesi yüklenemedi — manuel JSON seçebilirsiniz.";
        secici.style.outline = "2px solid #e67e22";
    }
}

function veritabaniniYukle(event) {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = function(e) {
        try {
            const veri = JSON.parse(e.target.result);
            turListesiniUygula(veri, file.name);
            alert(`Üstünbus Turizm tur listesi başarıyla yüklendi! (${anaTurListesi.length} tur)`);
        } catch (err) {
            alert("Dosya okunamadı veya JSON formatı hatalı! Lütfen geçerli bir tur_listesi.json dosyası seçin.");
            console.error(err);
        }
    };
    reader.onerror = function() {
        alert("Dosya okunurken bir hata oluştu. Lütfen tekrar deneyin.");
    };
    reader.readAsText(file);

    event.target.value = "";
}

function dosyaIndir(icerik, dosyaAdi, mimeTuru) {
    const dataStr = `data:${mimeTuru};charset=utf-8,` + encodeURIComponent(icerik);
    const dlAnchor = document.createElement('a');
    dlAnchor.setAttribute("href", dataStr);
    dlAnchor.setAttribute("download", dosyaAdi);
    document.body.appendChild(dlAnchor);
    dlAnchor.click();
    dlAnchor.remove();
}

function veriyiDisariAktar() {
    if(anaTurListesi.length === 0) { 
        alert("Listede indirilecek tur yok!"); 
        return; 
    }
    const json = JSON.stringify(anaTurListesi, null, 2);
    dosyaIndir(json, "tur_listesi.json", "text/json");
    dosyaIndir(
        `// Bu dosya panel tarafından otomatik üretilmiştir. Elle düzenlemeyin.\nconst TUR_LISTESI_JSON = ${json};\n`,
        "tur_listesi.js",
        "text/javascript"
    );
}

function filtreleTip(tip) {
    aktifTipFiltresi = tip;
    document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
    
    if(tip === 'all') document.getElementById('tabAll').classList.add('active');
    if(tip === 'gunubirlik') document.getElementById('tabGunu').classList.add('active');
    if(tip === 'konaklamali') document.getElementById('tabKona').classList.add('active');
    
    bolgeSelectGuncelle('filtreBolge', tip, true); 
    listeleriYenile();
    document.getElementById("detayPaneli").style.display = "none";
}

function filtreleriTemizle() {
    document.getElementById("filtreBaslangic").value = "";
    document.getElementById("filtreBitis").value = "";
    filtreleTip('all');
}

function listeleriYenile() {
    const select = document.getElementById("turSecimi");
    select.innerHTML = '<option value="">-- Tur Seçiniz --</option>';
    
    const secilenFiltreBolge = document.getElementById("filtreBolge").value;
    const fBaslangic = document.getElementById("filtreBaslangic").value;
    const fBitis = document.getElementById("filtreBitis").value;

    const filtreliList = anaTurListesi.filter(tur => {
        if (aktifTipFiltresi !== 'all' && tur.tip !== aktifTipFiltresi) return false;
        if (secilenFiltreBolge !== 'all' && tur.bolge !== secilenFiltreBolge) return false;
        if (fBaslangic && new Date(tur.siralamaTarih) < new Date(fBaslangic)) return false;
        if (fBitis && new Date(tur.siralamaTarih) > new Date(fBitis)) return false;
        return true;
    });
    
    filtreliList.forEach(tur => {
        const fTarih = new Date(tur.siralamaTarih).toLocaleDateString('tr-TR');
        const ikon = tur.tip === 'gunubirlik' ? '☀️' : '🏨';
        const sure = turSureAciklamasi(tur);
        let opt = document.createElement("option");
        opt.value = tur.id;
        opt.text = `${ikon} [${fTarih}] - ${tur.ad} (${sure})`;
        select.appendChild(opt);
    });

    const bugun = new Date();
    bugun.setHours(0, 0, 0, 0);

    const guncelTurlar = [];
    const gecmisTurlar = [];
    anaTurListesi.forEach(tur => {
        const turTarihi = new Date(tur.siralamaTarih);
        if (turTarihi >= bugun) guncelTurlar.push(tur); else gecmisTurlar.push(tur);
    });

    adminHavuzListesiCiz(guncelTurlar, "adminTurListesi", "Bu tarihten itibaren havuzda görüntülenecek tur bulunmuyor.");
    adminHavuzListesiCiz(gecmisTurlar, "adminTurListesiGecmis", "Geçmiş havuzda tur bulunmuyor.");

    const gecmisBaslikMetin = document.querySelector("#gecmisHavuzBlok .gecmis-havuz-baslik span:first-child");
    if (gecmisBaslikMetin) gecmisBaslikMetin.textContent = `🗄️ Geçmiş Havuzdaki Turlar (${gecmisTurlar.length})`;
}

function adminHavuzListesiCiz(liste, konteynerId, bosMesaji) {
    const konteyner = document.getElementById(konteynerId);
    if (!konteyner) return;
    konteyner.innerHTML = "";

    if (liste.length === 0) {
        konteyner.innerHTML = `<div class="admin-pool-empty">${bosMesaji}</div>`;
        return;
    }

    liste.forEach(tur => {
        const fTarih = new Date(tur.siralamaTarih).toLocaleDateString('tr-TR');
        const badgeClass = tur.tip === 'gunubirlik' ? 'badge-gunubirlik' : 'badge-konaklama';
        const badgeText = tur.tip === 'gunubirlik' ? 'Günübirlik' : 'Konaklamalı';
        const bObjesi = TUM_BOLGELER.find(b => b.code === tur.bolge) || { name: "Diğer" };

        let div = document.createElement("div");
        div.className = "admin-item";
        div.innerHTML = `<div><strong>${tur.ad}</strong><span class="badge ${badgeClass}">${badgeText}</span><span class="badge badge-bolge">${bObjesi.name}</span><br><small>Başlangıç: ${fTarih}</small></div>
                         <div class="admin-actions">
                            <button onclick="turDuzenle('${tur.id}')" class="btn-blue btn-small">Düzenle</button>
                            <button onclick="turSil('${tur.id}')" class="btn-red btn-small">Sil</button>
                         </div>`;
        konteyner.appendChild(div);
    });
}

function gecmisHavuzuAcKapat() {
    const blok = document.getElementById("gecmisHavuzBlok");
    blok.classList.toggle("acik");
}

function turDetayiniGetir() {
    const id = document.getElementById("turSecimi").value;
    if(!id) { document.getElementById("detayPaneli").style.display = "none"; return; }
    
    const tur = anaTurListesi.find(t => t.id === id);
    
    document.getElementById("pTurAraligi").innerText = tur.turAraligi;
    document.getElementById("pSureAciklama").innerText = `⏱️ ${turSureAciklamasi(tur)}`;
    document.getElementById("pKalkisZamani").innerText = tur.kalkisDetay;
    document.getElementById("pDonusZamani").innerText = tur.donusDetay;
    document.getElementById("pProgram").innerText = tur.program;
    document.getElementById("pOtelDetay").innerText = tur.oteller;
    
    document.getElementById("pOtelBloku").style.display = (tur.tip === 'gunubirlik') ? 'none' : 'block';
    document.getElementById("detayPaneli").style.display = "block";
}

function turKalkisOzet(tur) {
    const kalkisMetin = tur.kalkisDetay || "";
    const tarihSatiri = kalkisMetin.split("\n")[0] || "";
    const saatler = [];
    SABIT_DURAKLAR.forEach(blok => {
        const eslesme = kalkisMetin.match(new RegExp(blok.sehir + "\\s*Kalkış Saati:\\s*(\\d{1,2}:\\d{2})"));
        if (eslesme) saatler.push(`${blok.sehir}: ${eslesme[1]}`);
    });
    return saatler.length > 0 ? `${tarihSatiri} — ${saatler.join(", ")}` : tarihSatiri;
}

function musteriBilgisiKontrolEt() {
    const tel = document.getElementById("mTel").value.trim();
    if(!tel) { alert("Lütfen müşteri telefon numarasını girin!"); return null; }
    const ad = document.getElementById("mAd").value.trim() || "Değerli Yolcumuz";
    return { ad, tel };
}

function whatsappAc(tel, msg) {
    const dummy = document.createElement("textarea");
    document.body.appendChild(dummy);
    dummy.value = msg;
    dummy.select();
    document.execCommand("copy");
    document.body.removeChild(dummy);
    window.open(`https://wa.me/90${tel}?text=${encodeURIComponent(msg)}`, "_blank");
}

function seciliTuruGetir() {
    const id = document.getElementById("turSecimi").value;
    if(!id) { alert("Lütfen önce bir tur seçin!"); return null; }
    return anaTurListesi.find(t => t.id === id);
}

function whatsappMesajOlustur(tur, ad) {
    let msg = `🚌 *${tur.ad}*\n\n` +
              `📅 *Kalkış Tarihi ve Zamanı:*\n${turKalkisOzet(tur)}\n\n` +
              `🗓️ *Tur Tarihi:*\n${tur.turAraligi}\n⏱️ ${turSureAciklamasi(tur)}\n\n` +
              `🛫 *Araç Kalkış Noktası, Zamanı ve Yeri:*\n${tur.kalkisDetay}\n\n`;

    if(tur.tip !== 'gunubirlik') msg += `🏨 *Otel Listesi:*\n${tur.oteller}\n\n`;

    msg += `🗺️ *Tur Programı:*\n${tur.program}\n\n` +
           `🛬 *Dönüş Saati:*\n${tur.donusDetay}\n\n`;

    if(tur.ekDuyuru) msg += `📢 *Ek Duyuru:*\n${tur.ekDuyuru}\n\n`;

    msg += `Sayın ${ad}, keyifli yolculuklar dileriz! 🚀`;
    return msg;
}

function whatsappGonder() {
    const tur = seciliTuruGetir();
    if(!tur) return;
    const musteri = musteriBilgisiKontrolEt();
    if(!musteri) return;

    const msg = whatsappMesajOlustur(tur, musteri.ad);
    whatsappAc(musteri.tel, msg);
}

function kopyalandiGoster(btnId = "btnKopyala") {
    const btn = document.getElementById(btnId);
    if(btn.dataset.zamanlayici) clearTimeout(Number(btn.dataset.zamanlayici));

    const eskiMetin = btn.dataset.orijinalMetin || btn.innerText;
    btn.dataset.orijinalMetin = eskiMetin;
    btn.innerText = "Kopyalandı ✅";
    btn.style.backgroundColor = "var(--success)";

    const zamanlayici = setTimeout(() => {
        btn.innerText = eskiMetin;
        btn.style.backgroundColor = "";
        delete btn.dataset.zamanlayici;
    }, 2000);
    btn.dataset.zamanlayici = zamanlayici;
}

function mesajKopyala() {
    const tur = seciliTuruGetir();
    if(!tur) return;

    const ad = document.getElementById("mAd").value.trim() || "Değerli Yolcumuz";
    const msg = whatsappMesajOlustur(tur, ad);

    navigator.clipboard.writeText(msg).then(() => {
        kopyalandiGoster("btnKopyala");
    }).catch(() => {
        const dummy = document.createElement("textarea");
        document.body.appendChild(dummy);
        dummy.value = msg;
        dummy.select();
        document.execCommand("copy");
        document.body.removeChild(dummy);
        kopyalandiGoster("btnKopyala");
    });
}

function duyuruKopyala() {
    const msg = document.getElementById("ekDuyuruMetni").value;
    if(!msg.trim()) { 
        alert("Kopyalanacak bir duyuru metni yok. Lütfen önce bir Bölge / Süre seçin."); 
        return; 
    }

    navigator.clipboard.writeText(msg).then(() => {
        kopyalandiGoster("btnDuyuruKopyala");
    }).catch(() => {
        const dummy = document.createElement("textarea");
        document.body.appendChild(dummy);
        dummy.value = msg;
        dummy.select();
        document.execCommand("copy");
        document.body.removeChild(dummy);
        kopyalandiGoster("btnDuyuruKopyala");
    });
}

function duraklariGonder() {
    const tel = document.getElementById("hmTel").value.trim();
    if(!tel) { alert("Lütfen müşteri telefon numarasını girin!"); return; }
    const ad = document.getElementById("hmAd").value.trim() || "Değerli Yolcumuz";

    const msg = `Merhaba ${ad},\n\n${durakKonumlariMesajiOlustur()}`;
    whatsappAc(tel, msg);
}

/* ============================================================
   BÖLGEYE ÖZEL DUYURU KÜTÜPHANESİ
   ============================================================ */
let duyuruSablonlari = [];

const DUYURU_SURE_SECENEKLERI = [
    { gece: 0, label: "☀️ Günübirlik" },
    { gece: 1, label: "1 Gece 2 Gün" },
    { gece: 2, label: "2 Gece 3 Gün" },
    { gece: 3, label: "3 Gece 4 Gün" },
    { gece: 4, label: "4 Gece 5 Gün" },
    { gece: 5, label: "5 Gece 6 Gün" },
    { gece: 6, label: "6 Gece 7 Gün" },
    { gece: 7, label: "7 Gece 8 Gün" }
];

const BOLGE_SURE_KISITLAMALARI = {
    guney_ege: [3],                    
    kuzey_ege: [1, 2],                 
    dogu_karadeniz: [2, 3, 4],         
    kas_demre: [1],                    
    bati_karadeniz: [1, 2],            
    dogu_anadolu: [3],                 
    gap: [1],                          
    canakkale: [1, 2],                 
    tunceli_kemaliye: [1],             
    bursa: [1],                        
    istanbul: [2],                     
    kaplica: [2, 3, 4],                
    isparta: [1],                      
    tokat_amasya: [1]                  
};

function duyuruSureEtiketiGetir(gece) {
    const s = DUYURU_SURE_SECENEKLERI.find(x => x.gece === Number(gece));
    return s ? s.label : `${gece} Gece`;
}

function bolgeIcinIzinliGeceler(bolgeKod) {
    if (BOLGE_SURE_KISITLAMALARI[bolgeKod]) return BOLGE_SURE_KISITLAMALARI[bolgeKod];
    if (GUNUBIRLIK_BOLGELER.some(b => b.code === bolgeKod)) return [0];
    return [1, 2, 3, 4, 5, 6, 7];
}

function duyuruSecimKutulariniOlustur() {
    const bolgeSelect = document.getElementById("duyuruBolge");
    bolgeSelect.innerHTML = "";
    TUM_BOLGELER.forEach(b => {
        const opt = document.createElement("option");
        opt.value = b.code;
        opt.text = b.name;
        bolgeSelect.appendChild(opt);
    });

    duyuruSureListesiniOlustur();
}

function duyuruSureListesiniOlustur() {
    const bolge = document.getElementById("duyuruBolge").value;
    const sureSelect = document.getElementById("duyuruSure");
    const oncekiDeger = sureSelect.value;
    sureSelect.innerHTML = "";

    bolgeIcinIzinliGeceler(bolge).forEach(gece => {
        const opt = document.createElement("option");
        opt.value = gece;
        opt.text = duyuruSureEtiketiGetir(gece);
        sureSelect.appendChild(opt);
    });

    const mevcutDegerler = Array.from(sureSelect.options).map(o => o.value);
    if (mevcutDegerler.includes(oncekiDeger)) sureSelect.value = oncekiDeger;
}

function duyuruBolgeDegisti() {
    duyuruSureListesiniOlustur();
    duyuruSablonuGetir();
}

function duyuruSablonuGetir() {
    const bolge = document.getElementById("duyuruBolge").value;
    const gece = Number(document.getElementById("duyuruSure").value);
    const kayit = duyuruSablonlari.find(d => d.bolge === bolge && d.gece === gece);
    document.getElementById("ekDuyuruMetni").value = kayit ? kayit.metin : "";
}

function duyuruKutuphanesiniOtomatikYukle() {
    function uygula(veri, kaynak) {
        if (!Array.isArray(veri)) throw new Error("Geçersiz format: dizi bekleniyor");
        duyuruSablonlari = veri;
        duyuruSablonuGetir();
        console.log(`✅ Duyuru kütüphanesi otomatik yüklendi (${duyuruSablonlari.length} kayıt) — ${kaynak}`);
    }

    fetch("turduyurusu.json")
        .then(res => { if (!res.ok) throw new Error("turduyurusu.json bulunamadı"); return res.json(); })
        .then(veri => uygula(veri, "turduyurusu.json (fetch)"))
        .catch(() => {
            fetch("turduyurusu.txt")
                .then(res => { if (!res.ok) throw new Error("turduyurusu.txt bulunamadı"); return res.text(); })
                .then(metin => uygula(JSON.parse(metin), "turduyurusu.txt (fetch)"))
                .catch(() => {
                    const script = document.createElement("script");
                    script.src = "turduyurusu.js";
                    script.onload = function() {
                        if (typeof TUR_DUYURUSU_JSON !== "undefined" && Array.isArray(TUR_DUYURUSU_JSON)) {
                            uygula(TUR_DUYURUSU_JSON, "turduyurusu.js (otomatik yedek)");
                        } else {
                            console.warn("⚠️ Otomatik duyuru dosyası bulunamadı/okunamadı. Gerekirse üstteki 'Duyuru Kütüphanesini Okutun' alanından elle yükleyin.");
                        }
                    };
                    script.onerror = function() {
                        console.warn("⚠️ Otomatik duyuru dosyası bulunamadı/okunamadı. Gerekirse üstteki 'Duyuru Kütüphanesini Okutun' alanından elle yükleyin.");
                    };
                    document.head.appendChild(script);
                });
        });
}

function duyuruSablonlariniYukle(event) {
    const file = event.target.files[0];
    if(!file) return;
    const reader = new FileReader();
    reader.onload = function(e) {
        try {
            const veri = JSON.parse(e.target.result);
            if(!Array.isArray(veri)) throw new Error("Geçersiz format");
            duyuruSablonlari = veri;
            duyuruSablonuGetir();
            alert(`Duyuru kütüphanesi yüklendi! (${duyuruSablonlari.length} kayıt)`);
        } catch(err) {
            alert("Dosya okunamadı, geçerli bir duyuru JSON dosyası seçin.");
        }
    };
    reader.readAsText(file);
    event.target.value = "";
}

function formuTemizle() {
    document.getElementById("duzenlenenTurId").value = "";
    document.getElementById("yeniAd").value = "";
    document.getElementById("turBaslangicTarih").value = "";
    document.getElementById("turBitisTarih").value = "";
    document.getElementById("kalkisTarih").value = "";
    document.getElementById("mersinSaat").value = "";
    document.getElementById("tarsusSaat").value = "";
    document.getElementById("adanaSaat").value = "";
    document.getElementById("donusSaat").value = "";
    document.getElementById("donusNokta").value = "";
    document.getElementById("yeniProgram").value = "";
    document.getElementById("yeniGeceSayisi").value = "1";
    
    bolgeSelectGuncelle('yeniBolge', document.getElementById("yeniTip").value, false);
    
    document.getElementById("anaEklemeBtn").innerText = "➕ Formatlı Turu Havuza Ekle";
    document.getElementById("anaEklemeBtn").className = "btn-orange";
    
    otelAlanlariniOlustur();
}