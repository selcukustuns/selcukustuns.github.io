/* ============================================================
   OPERATÖR ERİŞİMİ (Kullanıcı: selcukustun | Şifre: selcukustun1234)
   ============================================================ */
const OPERATOR_KULLANICI_ADI = "selcukustun";
const OPERATOR_SIFRE = "selcukustun1234";

let operatorOturumuAcik = false;

async function ibanBilgisiKopyala(elementId, button, removeSpaces = false) {
    const valueElement = document.getElementById(elementId);
    if (!valueElement || !button) return;

    let value = valueElement.textContent.trim();
    if (removeSpaces) value = value.replace(/\s+/g, "");

    try {
        await navigator.clipboard.writeText(value);
        button.textContent = "Kopyalandı!";
        button.classList.add("copied");
    } catch {
        button.textContent = "Kopyalanamadı";
    }

    window.setTimeout(() => {
        button.textContent = "Kopyala";
        button.classList.remove("copied");
    }, 2000);
}

function panelSekmesiDegistir(sekme) {
    const loginCard = document.getElementById("operatorLoginCard");
    const adminCard = document.getElementById("adminPanelCard");
    const fileCard = document.getElementById("fileUploadCard");
    const evrakCard = document.getElementById("evrakYonetimiCard");
    const mesafeCard = document.getElementById("mesafeOlcerCard");
    const kdvCard = document.getElementById("kdvHesaplayiciCard");
    const taksitCard = document.getElementById("taksitTablosuCard");
    const ibanCard = document.getElementById("ibanBilgisiCard");
    const uetdsCard = document.getElementById("uetdsCard");
    const durakCard = document.getElementById("durakListesiCard");
    const personelCard = document.getElementById("personelPaneliCard");
    const hizliMesajCard = document.getElementById("hizliMesajBariCard");
    
    const personelTab = document.getElementById("tabPersonel");
    const operatorTab = document.getElementById("tabOperator");
    const fileTab = document.getElementById("tabDosya");
    const evrakTab = document.getElementById("tabEvrak");
    const mesafeTab = document.getElementById("tabMesafe");
    const kdvTab = document.getElementById("tabKdv");
    const taksitTab = document.getElementById("tabTaksit");
    const ibanTab = document.getElementById("tabIban");
    const uetdsTab = document.getElementById("tabUetds");
    const durakTab = document.getElementById("tabDurak");

    if (personelTab) personelTab.classList.remove("active");
    if (operatorTab) operatorTab.classList.remove("active");
    if (fileTab) fileTab.classList.remove("active");
    if (evrakTab) evrakTab.classList.remove("active");
    if (mesafeTab) mesafeTab.classList.remove("active");
    if (kdvTab) kdvTab.classList.remove("active");
    if (taksitTab) taksitTab.classList.remove("active");
    if (ibanTab) ibanTab.classList.remove("active");
    if (uetdsTab) uetdsTab.classList.remove("active");
    if (durakTab) durakTab.classList.remove("active");

    if (loginCard) loginCard.style.display = "none";
    if (adminCard) adminCard.style.display = "none";
    if (fileCard) fileCard.style.display = "none";
    if (evrakCard) evrakCard.style.display = "none";
    if (mesafeCard) mesafeCard.style.display = "none";
    if (kdvCard) kdvCard.style.display = "none";
    if (taksitCard) taksitCard.style.display = "none";
    if (ibanCard) ibanCard.style.display = "none";
    if (uetdsCard) uetdsCard.style.display = "none";
    if (durakCard) durakCard.style.display = "none";
    if (personelCard) personelCard.style.display = "none";
    if (hizliMesajCard) hizliMesajCard.style.display = "none";

    if (sekme === "personel") {
        if (personelTab) personelTab.classList.add("active");
        if (personelCard) personelCard.style.display = "block";
        if (hizliMesajCard) hizliMesajCard.style.display = "block";
        return;
    }

    if (sekme === "taksit") {
        if (taksitTab) taksitTab.classList.add("active");
        if (taksitCard) taksitCard.style.display = "block";
        taksitArayuzunuHazirla();
        return;
    }

    if (sekme === "iban") {
        if (ibanTab) ibanTab.classList.add("active");
        if (ibanCard) ibanCard.style.display = "block";
        return;
    }

    if (sekme === "uetds") {
        if (uetdsTab) uetdsTab.classList.add("active");
        if (uetdsCard) uetdsCard.style.display = "block";
        uetdsInit();
        return;
    }

    if (sekme === "durak") {
        if (durakTab) durakTab.classList.add("active");
        if (durakCard) durakCard.style.display = "block";
        return;
    }

    if (sekme === "dosya") {
        if (fileTab) fileTab.classList.add("active");
        if (fileCard) fileCard.style.display = "block";
        return;
    }

    if (sekme === "evrak") {
        if (evrakTab) evrakTab.classList.add("active");
        if (evrakCard) evrakCard.style.display = "block";
        return;
    }

    if (sekme === "mesafe") {
        if (mesafeTab) mesafeTab.classList.add("active");
        if (mesafeCard) mesafeCard.style.display = "block";
        haritayiIlklendir();
        canliFiyatlariGoster();
        return;
    }

    if (sekme === "kdv") {
        if (kdvTab) kdvTab.classList.add("active");
        if (kdvCard) kdvCard.style.display = "block";
        const kdvInp = document.getElementById("kdvTutar");
        if (kdvInp) kdvInp.focus();
        return;
    }

    if (operatorTab) operatorTab.classList.add("active");

    if (operatorOturumuAcik) {
        if (adminCard) adminCard.style.display = "block";
        taksitOranGuncellemeGridCiz();
    } else {
        if (loginCard) loginCard.style.display = "block";
        const uInp = document.getElementById("operatorUsername");
        if (uInp) uInp.focus();
    }
}

async function operatorGirisYap() {
    const kullaniciAdi = document.getElementById("operatorUsername").value.trim().toLowerCase();
    const sifre = document.getElementById("operatorPassword").value.trim();
    const hata = document.getElementById("operatorLoginError");
    const btn = document.getElementById("btnOperatorGiris");

    hata.style.display = "none";
    hata.textContent = "";

    if (!kullaniciAdi || !sifre) {
        hata.textContent = "Lütfen kullanıcı adı ve şifreyi girin.";
        hata.style.display = "block";
        return;
    }

    if (kullaniciAdi === OPERATOR_KULLANICI_ADI && sifre === OPERATOR_SIFRE) {
        btn.disabled = true;
        btn.innerHTML = `<span class="spinner"></span> Giriş Yapılıyor...`;

        await new Promise(resolve => setTimeout(resolve, 1500));

        btn.className = "btn-orange btn-success-anim";
        btn.innerHTML = `✅ Giriş Onaylandı`;

        await new Promise(resolve => setTimeout(resolve, 800));

        operatorOturumuAcik = true;
        document.getElementById("operatorLoginCard").style.display = "none";
        document.getElementById("adminPanelCard").style.display = "block";
        document.getElementById("operatorStatus").style.display = "inline-block";
        document.getElementById("cikisYapBtnUst").style.display = "inline-flex";
        
        btn.disabled = false;
        btn.className = "btn-orange";
        btn.innerHTML = "🔓 Giriş Yap";

        taksitOranGuncellemeGridCiz();
    } else {
        hata.textContent = "Kullanıcı adı veya şifre hatalı.";
        hata.style.display = "block";
        document.getElementById("operatorPassword").value = "";
    }
}

async function operatorCikisYap() {
    const btn = document.getElementById("cikisYapBtnUst");
    if (btn) {
        btn.disabled = true;
        btn.innerHTML = `<span class="spinner"></span> Çıkış Yapılıyor...`;
        
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        btn.className = "btn-red btn-small btn-danger-anim";
        btn.innerHTML = `🔒 Oturum Kapatıldı`;
        
        await new Promise(resolve => setTimeout(resolve, 600));
        
        btn.disabled = false;
        btn.className = "btn-red btn-small";
        btn.innerHTML = "🔒 Çıkış Yap";
    }

    operatorOturumuAcik = false;
    document.getElementById("operatorUsername").value = "";
    document.getElementById("operatorPassword").value = "";
    document.getElementById("operatorLoginError").style.display = "none";
    document.getElementById("operatorStatus").style.display = "none";
    document.getElementById("cikisYapBtnUst").style.display = "none";
    
    panelSekmesiDegistir("personel");
}

/* ============================================================
   TUR TAKSİT MOTORU & JSON FİYAT/ORAN YÖNETİMİ
   ============================================================ */
let TAKSIT_ORANLARI = [
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
            turFiyatVerisiniUygula(veri);
            console.log("✅ turfiyatlari.json otomatik yüklendi");
        })
        .catch(() => {
            console.warn("⚠️ turfiyatlari.json bulunamadı, dahili liste devrede.");
        });
}

function turFiyatVerisiniUygula(veri) {
    if (veri.fiyatlar && typeof veri.fiyatlar === 'object') {
        SEZONLUK_TUR_FIYATLARI = veri.fiyatlar;
    } else if (typeof veri === 'object' && !veri.oranlar) {
        SEZONLUK_TUR_FIYATLARI = veri;
    }
    
    if (veri.oranlar && Array.isArray(veri.oranlar)) {
        TAKSIT_ORANLARI = veri.oranlar;
    }
    
    taksitArayuzunuHazirla();
    if (operatorOturumuAcik) {
        taksitOranGuncellemeGridCiz();
    }
}

function turFiyatlariniYukle(event) {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = function(e) {
        try {
            const veri = JSON.parse(e.target.result);
            turFiyatVerisiniUygula(veri);
            alert("turfiyatlari.json başarıyla yüklendi ve güncellendi!");
        } catch (err) {
            alert("Dosya okunamadı veya JSON formatı geçersiz.");
        }
    };
    reader.readAsText(file);
    event.target.value = "";
}

function turFiyatlariniDisariAktar() {
    const paket = {
        oranlar: TAKSIT_ORANLARI,
        fiyatlar: SEZONLUK_TUR_FIYATLARI
    };
    const jsonStr = JSON.stringify(paket, null, 2);
    dosyaIndir(jsonStr, "turfiyatlari.json", "application/json");
}

function taksitOranGuncellemeGridCiz() {
    const container = document.getElementById("taksitOranGuncellemeGrid");
    if (!container) return;
    container.innerHTML = "";

    TAKSIT_ORANLARI.forEach((item, index) => {
        const div = document.createElement("div");
        div.style.background = "#ffffff";
        div.style.border = "1px solid #cbd5e1";
        div.style.borderRadius = "6px";
        div.style.padding = "8px 10px";

        div.innerHTML = `
            <span style="font-size:12px; font-weight:700; color:var(--dark); display:block; margin-bottom:4px;">${item.taksit} Taksit:</span>
            <div style="display:flex; align-items:center; gap:4px;">
                <span style="font-weight:700; color:#64748b; font-size:13px;">%</span>
                <input type="number" step="0.01" value="${item.oran}" 
                    style="margin:0; padding:6px; font-size:13px; font-weight:700;" 
                    oninput="taksitOraniDegisti(${index}, this.value)">
            </div>
        `;
        container.appendChild(div);
    });
}

function taksitOraniDegisti(index, yeniDeger) {
    const val = parseFloat(yeniDeger);
    if (!isNaN(val) && val >= 0) {
        TAKSIT_ORANLARI[index].oran = val;
        taksitHesapla();
    }
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
    if (!bolgeSelect) return;
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
    const bazGosterge = document.getElementById('taksitBazTutarGosterge');
    if (bazGosterge) bazGosterge.innerText = paraFormatla(toplamBazTutar);

    const tabloGovdesi = document.getElementById('taksitTabloGovdesi');
    if (!tabloGovdesi) return;
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
   CANLI ÖNERİLİ MESAFE MOTORU & OTOBÜS SÜRE HESABI + CANLI FİYAT WİDGETİ
   ============================================================ */
let secilenKalkisVerisi = { lat: 36.9167, lon: 34.8953, isim: "Tarsus" };
let secilenVarisVerisi = null;

const OZEL_ACENTA_DURAKLARI = [
    { baslik: "Üstünbus Turizm - Şehitler Tepesi Ofis", detay: "Tarsus / Mersin", lat: 36.9248, lon: 34.8985 },
    { baslik: "Üstünbus Turizm - Kleopatra Kapısı", detay: "Tarsus / Mersin", lat: 36.9141, lon: 34.8912 },
    { baslik: "Vipol AVM", detay: "Mersin Kalkış Noktası", lat: 36.7820, lon: 34.5510 },
    { baslik: "Forum AVM", detay: "Mersin Kalkış Noktası", lat: 36.7990, lon: 34.6070 },
    { baslik: "Duygu Kafe", detay: "Adana Barajyolu Kalkış Noktası", lat: 37.0210, lon: 35.3190 }
];

function haritayiIlklendir() {
    otomatikTamamlaAyarla('rotaKalkis', 'kalkisOneriler', (secilen) => {
        secilenKalkisVerisi = secilen;
    });

    otomatikTamamlaAyarla('rotaVaris', 'varisOneriler', (secilen) => {
        secilenVarisVerisi = secilen;
        rotaHesapla();
    });
    
    canliFiyatlariGoster();
}

// ⚡ SORGUDAN ÖNCE ANLIK OPET FİYATLARINI WİDGET (Mini İkonlu & Logolu Başlık)
async function canliFiyatlariGoster() {
    const konteyner = document.getElementById("canliFiyatlarIcerik");
    if (!konteyner) return;

    try {
        const res = await fetch("prices.json", { cache: "no-store" });
        if (!res.ok) throw new Error("prices.json okunamadı");
        const data = await res.json();

        let hedefBolge = null;
        if (Array.isArray(data)) {
            hedefBolge = data.find(d => d.districtName && d.districtName.toLocaleUpperCase('tr-TR').includes("TARSUS"));
            if (!hedefBolge && data.length > 0) hedefBolge = data[0];
        }

        if (hedefBolge && hedefBolge.prices && Array.isArray(hedefBolge.prices)) {
            // Başlığı Mersin/Tarsus [Logo] Pompa Fiyatları olarak güncelleyelim
            const widgetCard = document.getElementById("canliFiyatlarWidget");
            if (widgetCard) {
                const h4 = widgetCard.querySelector("h4");
                if (h4) {
                    h4.innerHTML = `⛽ Mersin/Tarsus <img src="opetlogo.png" alt="Opet Logo" style="width: 48px; height: 48px; object-fit: contain; vertical-align: middle; margin: 0 4px;"> Pompa Fiyatları`;
                }
            }

            let html = "";
            hedefBolge.prices.forEach(p => {
                let imgFile = "";
                let displayName = p.productName;

                const nameUp = p.productName.toLocaleUpperCase('tr-TR');
                
                if (nameUp.includes("BENZİN") || nameUp.includes("KURS")) {
                    imgFile = "opetbenzin.png";
                    displayName = "Kurşunsuz Benzin 95 Oktan";
                } else if (nameUp.includes("ECOFORCE")) {
                    imgFile = "opetecoforce.webp";
                    displayName = "Motorin EcoForce";
                } else if (nameUp.includes("ULTRAFORCE")) {
                    imgFile = "opetdizelultra.webp";
                    displayName = "Motorin UltraForce";
                }

                html += `
                    <div style="background: #fff; padding: 12px; border-radius: 6px; border: 1px solid #e2e8f0; flex: 1; min-width: 160px; text-align: center; display: flex; flex-direction: column; align-items: center; justify-content: space-between;">
                        ${imgFile ? `<img src="${imgFile}" alt="${displayName}" style="width: 28px; height: 28px; object-fit: contain; margin-bottom: 6px;">` : ''}
                        <span style="font-size: 11px; color: #64748b; font-weight: 600; line-height: 1.2; margin-bottom: 4px;">${displayName}</span>
                        <strong style="color: var(--dark); font-size: 16px; display: block;">${paraFormatla(p.amount)}</strong>
                    </div>
                `;
            });
            konteyner.innerHTML = html;
        } else {
            konteyner.innerHTML = `<span style="color: #e74c3c; font-size: 13px;">Fiyat verisi bulunamadı.</span>`;
        }
    } catch (err) {
        konteyner.innerHTML = `<span style="color: #e74c3c; font-size: 13px;">prices.json yüklenemedi.</span>`;
        console.warn("Canlı fiyat yükleme hatası:", err);
    }
}

function otomatikTamamlaAyarla(inputId, dropdownId, secimGeriBildirimi) {
    const input = document.getElementById(inputId);
    const dropdown = document.getElementById(dropdownId);
    if (!input || !dropdown) return;
    let beklemeZamani = null;

    input.addEventListener("input", function() {
        const sorgu = input.value.trim();
        clearTimeout(beklemeZamani);

        if (sorgu.length < 2) {
            dropdown.innerHTML = "";
            dropdown.style.display = "none";
            return;
        }

        beklemeZamani = setTimeout(async () => {
            dropdown.innerHTML = "";
            
            const ozelEslenenler = OZEL_ACENTA_DURAKLARI.filter(yer => 
                yer.baslik.toLocaleLowerCase('tr').includes(sorgu.toLocaleLowerCase('tr'))
            );

            ozelEslenenler.forEach(item => {
                const div = document.createElement("div");
                div.className = "autocomplete-item";
                div.style.background = "#fffbeb";
                div.innerHTML = `<strong>🏢 ${item.baslik}</strong><span style="font-size:11px; color:#92400e;">${item.detay}</span>`;
                div.onclick = function() {
                    input.value = item.baslik;
                    dropdown.innerHTML = "";
                    dropdown.style.display = "none";
                    secimGeriBildirimi({ lat: item.lat, lon: item.lon, isim: item.baslik });
                };
                dropdown.appendChild(div);
            });

            try {
                const url = `https://nominatim.openstreetmap.org/search?format=json&countrycodes=tr&limit=6&q=${encodeURIComponent(sorgu)}`;
                const yanit = await fetch(url, { headers: { "Accept-Language": "tr" } });
                const sonuclar = await yanit.json();

                if (sonuclar && sonuclar.length > 0) {
                    sonuclar.forEach(item => {
                        const parcalar = item.display_name.split(",");
                        const anaBaslik = parcalar[0];
                        const detayAdres = parcalar.slice(1, 4).join(",");

                        const div = document.createElement("div");
                        div.className = "autocomplete-item";
                        div.innerHTML = `<strong>📍 ${anaBaslik}</strong><span style="font-size:11px; color:#64748b;">${detayAdres}</span>`;

                        div.onclick = function() {
                            input.value = anaBaslik + " " + detayAdres;
                            dropdown.innerHTML = "";
                            dropdown.style.display = "none";
                            secimGeriBildirimi({
                                lat: parseFloat(item.lat),
                                lon: parseFloat(item.lon),
                                isim: input.value
                            });
                        };
                        dropdown.appendChild(div);
                    });
                }
            } catch (err) {
                console.error("Öneri alınamadı:", err);
            }

            if (dropdown.children.length > 0) {
                dropdown.style.display = "block";
            } else {
                dropdown.style.display = "none";
            }
        }, 250);
    });

    document.addEventListener("click", function(e) {
        if (e.target !== input && e.target !== dropdown) {
            dropdown.style.display = "none";
        }
    });
}

async function tekilKonumBul(adres) {
    const ozel = OZEL_ACENTA_DURAKLARI.find(y => y.baslik.toLocaleLowerCase('tr').includes(adres.toLocaleLowerCase('tr')));
    if (ozel) return { lat: ozel.lat, lon: ozel.lon };

    try {
        const url = `https://nominatim.openstreetmap.org/search?format=json&countrycodes=tr&limit=1&q=${encodeURIComponent(adres)}`;
        const res = await fetch(url, { headers: { "Accept-Language": "tr" } });
        const data = await res.json();
        if (data && data.length > 0) {
            return { lat: parseFloat(data[0].lat), lon: parseFloat(data[0].lon) };
        }
    } catch (e) {
        console.error(e);
    }
    return null;
}

// ⛽ OTOBÜS YAKIT MALİYETİ VE %5.25 İNDİRİM HESAPLAMA MOTORU
async function motorinMaliyetiniHesapla(km) {
    const kutu = document.getElementById("rotaYakitMaliyetiKutusu");
    if (!kutu) return;

    try {
        const res = await fetch("prices.json", { cache: "no-store" });
        if (!res.ok) throw new Error("prices.json okunamadı");
        const data = await res.json();

        let hedefBolge = null;
        if (Array.isArray(data)) {
            hedefBolge = data.find(d => d.districtName && d.districtName.toLocaleUpperCase('tr-TR').includes("TARSUS"));
            if (!hedefBolge && data.length > 0) hedefBolge = data[0];
        }

        if (hedefBolge && hedefBolge.prices && Array.isArray(hedefBolge.prices)) {
            const motorinObj = hedefBolge.prices.find(f => 
                f.productCode === "A121" || f.productCode === "A128" || 
                (f.productName && f.productName.toLocaleUpperCase('tr-TR').includes("MOTORIN"))
            );

            if (motorinObj && motorinObj.amount !== null && motorinObj.amount !== undefined) {
                const normalLitreFiyati = parseFloat(motorinObj.amount);
                
                // %5.25 İndirimli Litre Fiyatı
                const indirimOrani = 0.0525;
                const indirimliLitreFiyati = normalLitreFiyati * (1 - indirimOrani);

                // Toplam Litre Tüketimi (100 km'de 30 Litre)
                const toplamLitre = (km / 100) * 30; 

                // Maliyetler
                const normalMaliyet = toplamLitre * normalLitreFiyati;
                const indirimliMaliyet = toplamLitre * indirimliLitreFiyati;

                // Alanlara yazdır
                document.getElementById("normalLitreFiyati").innerText = paraFormatla(normalLitreFiyati) + " / Lt";
                document.getElementById("indirimliLitreFiyati").innerText = paraFormatla(indirimliLitreFiyati) + " / Lt";
                document.getElementById("toplamLitre").innerText = toplamLitre.toFixed(1) + " Litre";
                document.getElementById("normalToplamMaliyet").innerText = paraFormatla(normalMaliyet);
                document.getElementById("indirimliToplamMaliyet").innerText = paraFormatla(indirimliMaliyet);
                
                kutu.style.display = "block";
                return;
            }
        }
        kutu.style.display = "none";
    } catch (err) {
        console.warn("Motorin maliyeti hesaplanamadı:", err);
        kutu.style.display = "none";
    }
}

async function rotaHesapla() {
    const kalkisInp = document.getElementById("rotaKalkis");
    const varisInp = document.getElementById("rotaVaris");
    const iframe = document.getElementById("gmapsIframe");
    const btn = document.getElementById("btnRotaHesapla");
    const yukleniyorGosterge = document.getElementById("rotaYukleniyorGosterge");
    const sonucKutusu = document.getElementById("rotaSonucKutusu");

    const baslangic = kalkisInp ? kalkisInp.value.trim() : "Tarsus, Mersin";
    const bitis = varisInp ? varisInp.value.trim() : "";

    if (!bitis) {
        if (iframe) iframe.src = `https://maps.google.com/maps?q=Tarsus,+Mersin&output=embed`;
        if (sonucKutusu) sonucKutusu.style.display = "none";
        if (yukleniyorGosterge) yukleniyorGosterge.style.display = "none";
        return;
    }

    if (btn) btn.innerText = "Hesaplanıyor...";
    if (yukleniyorGosterge) yukleniyorGosterge.style.display = "block";
    if (sonucKutusu) sonucKutusu.style.display = "none";

    const embedUrl = `https://maps.google.com/maps?saddr=${encodeURIComponent(baslangic)}&daddr=${encodeURIComponent(bitis)}&output=embed`;
    if (iframe) iframe.src = embedUrl;

    try {
        const k1 = (secilenKalkisVerisi && secilenKalkisVerisi.isim.includes(baslangic)) 
            ? secilenKalkisVerisi 
            : await tekilKonumBul(baslangic);

        const k2 = (secilenVarisVerisi && secilenVarisVerisi.isim.includes(bitis)) 
            ? secilenVarisVerisi 
            : await tekilKonumBul(bitis);

        if (k1 && k2) {
            const osrmUrl = `https://router.project-osrm.org/route/v1/driving/${k1.lon},${k1.lat};${k2.lon},${k2.lat}?overview=false`;
            const yanit = await fetch(osrmUrl);
            const rotaData = await yanit.json();

            if (rotaData.routes && rotaData.routes.length > 0) {
                const metre = rotaData.routes[0].distance;
                const saniye = rotaData.routes[0].duration;

                const km = (metre / 1000).toFixed(0);

                const otomobilSaat = Math.floor(saniye / 3600);
                const otomobilDk = Math.round((saniye % 3600) / 60);

                const otobusToplamSaat = (metre / 1000) / 80;
                const otobusSaat = Math.floor(otobusToplamSaat);
                const otobusDk = Math.round((otobusToplamSaat - otobusSaat) * 60);

                document.getElementById("sonucKm").innerText = `${km} km`;
                document.getElementById("sonucSureOtobus").innerText = `~${otobusSaat} sa ${otobusDk} dk`;
                document.getElementById("sonucSureNormal").innerText = `~${otomobilSaat} sa ${otomobilDk} dk`;

                // Yakıt maliyeti hesaplamasını tetikle
                await motorinMaliyetiniHesapla(parseFloat(km));
            }
        }
    } catch (err) {
        console.warn("KM süre hesabı alınamadı ancak harita güncellendi:", err);
    } finally {
        if (yukleniyorGosterge) yukleniyorGosterge.style.display = "none";
        if (sonucKutusu) sonucKutusu.style.display = "block";
        if (btn) btn.innerText = "🔍 Mesafeyi ve Rotayı Hesapla";
    }
}

function hizliHedefSec(hedefAdi) {
    const varisInp = document.getElementById("rotaVaris");
    if (varisInp) {
        varisInp.value = hedefAdi;
        secilenVarisVerisi = null;
        rotaHesapla();
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
                            console.warn("⚠️ Otomatik duyuru dosyası bulunamadı.");
                        }
                    };
                    script.onerror = function() {
                        console.warn("⚠️ Otomatik duyuru dosyası bulunamadı.");
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

/* ============================================================
   TUR LİSTESİ VE PERSONEL YÖNETİMİ
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
            console.warn("⚠️ tur_listesi.json fetch ile okunamadı. tur_listesi.js deneniyor.", err);
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
    console.warn("⚠️ Otomatik tur listesi yüklenemedi — manuel JSON seçebilirsiniz.");
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
    if (!btn) return;
    if (btn.dataset.zamanlayici) clearTimeout(Number(btn.dataset.zamanlayici));

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

// --- U-ETDS ENTEGRASYONU VE ŞOFÖR HAVUZU ---
const UETDS_API_URL = "";

const UETDS_SOFORLER = [
    { id: "ahmet_beyduz", ad: "Ahmet Beydüz" },
    { id: "turgay_kosar", ad: "Turgay Koşar" },
    { id: "mehmet_goze", ad: "Mehmet Göze" },
    { id: "veis_eren", ad: "Veis Eren" },
    { id: "emin_ustun", ad: "Emin Üstün" },
    { id: "selcuk_ustun", ad: "Selçuk Üstün" },
    { id: "ali_hasan_otsekin", ad: "Ali Hasan Otsekin" },
    { id: "cengiz_erbektas", ad: "Cengiz Erbektaş" }
];

const UETDS_ARACLAR = {
    "33EU101": { sofor1: "mehmet_goze", sofor2: "veis_eren" },
    "33AZA008": { sofor1: "ali_hasan_otsekin", sofor2: "cengiz_erbektas" },
    "33EU288": { sofor1: "ahmet_beyduz", sofor2: "turgay_kosar" },
};

let uetdsYuklenenYolcular = [];

function uetdsInit() {
    const aracSelect = document.getElementById("uetdsAracSecim");
    if (aracSelect && aracSelect.dataset.hazir !== "true") {
        const manuelSecenek = aracSelect.querySelector('option[value="diger"]');
        Object.keys(UETDS_ARACLAR).forEach(plaka => {
            const etiket = plaka.replace(/^(\d{2})([A-Z]+)(\d+)$/, "$1 $2 $3");
            aracSelect.add(new Option(etiket, plaka), manuelSecenek);
        });
        aracSelect.dataset.hazir = "true";
    }

    ["uetdsSofor1Secim", "uetdsSofor2Secim"].forEach(id => {
        const select = document.getElementById(id);
        if (!select || select.dataset.hazir === "true") return;

        const placeholder = new Option("-- Şoför Seçin --", "");
        select.add(placeholder);
        UETDS_SOFORLER.forEach(sofor => select.add(new Option(sofor.ad, sofor.id)));
        select.add(new Option("✍️ Manuel T.C. Girişi", "manuel"));
        select.dataset.hazir = "true";
    });
}

function uetdsAracDegisti(plaka) {
    const manuelPlaka = document.getElementById("uetdsManuelPlaka");
    const manuelMi = plaka === "diger";
    manuelPlaka.style.display = manuelMi ? "block" : "none";
    if (manuelMi) {
        document.getElementById("uetdsSofor1Secim").value = "";
        document.getElementById("uetdsSofor2Secim").value = "";
        uetdsSoforDegisti(1, "");
        uetdsSoforDegisti(2, "");
        manuelPlaka.focus();
        return;
    }
    manuelPlaka.value = "";

    const soforler = UETDS_ARACLAR[plaka];
    if (!soforler) return;
    document.getElementById("uetdsSofor1Secim").value = soforler.sofor1;
    document.getElementById("uetdsSofor2Secim").value = soforler.sofor2;
    uetdsSoforDegisti(1, soforler.sofor1);
    uetdsSoforDegisti(2, soforler.sofor2);
}

function uetdsSoforDegisti(no, val) {
    const manuelInput = document.getElementById(no === 1 ? "uetdsSofor1ManuelTc" : "uetdsSofor2ManuelTc");
    const manuelMi = val === "manuel";
    manuelInput.style.display = manuelMi ? "block" : "none";
    if (manuelMi) {
        manuelInput.focus();
    } else {
        manuelInput.value = "";
    }
}

document.addEventListener("DOMContentLoaded", uetdsInit);

function uetdsBaslikNormallestir(deger) {
    return String(deger || "")
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .toLocaleLowerCase("tr-TR")
        .replace(/ı/g, "i")
        .replace(/[^a-z0-9]/g, "");
}

function uetdsHucreDegeri(satir, basliklar) {
    const anahtarlar = Object.keys(satir);
    for (const baslik of basliklar) {
        const aranan = uetdsBaslikNormallestir(baslik);
        const anahtar = anahtarlar.find(k => uetdsBaslikNormallestir(k) === aranan);
        if (anahtar && satir[anahtar] !== undefined && satir[anahtar] !== null) {
            return String(satir[anahtar]).trim();
        }
    }
    return "";
}

function uetdsCinsiyetNormallestir(deger) {
    const cinsiyet = uetdsBaslikNormallestir(deger);
    if (["k", "kadin", "f", "female"].includes(cinsiyet)) return "K";
    if (["e", "erkek", "m", "male"].includes(cinsiyet)) return "E";
    return "";
}

function uetdsExcelOku(event) {
    const file = event.target.files[0];
    if (!file) return;

    const alan = document.getElementById("uetdsYolcuAlan");
    const sonuc = document.getElementById("uetdsBildirimSonuc");
    uetdsYuklenenYolcular = [];
    alan.style.display = "none";
    sonuc.style.display = "none";
    document.getElementById("uetdsYolcuGovde").replaceChildren();
    document.getElementById("btnUetdsGonder").disabled = true;

    if (typeof XLSX === "undefined") {
        uetdsSonucGoster("Excel okuma kütüphanesi yüklenemedi. İnternet bağlantısını kontrol edip sayfayı yenileyin.", false);
        return;
    }

    const reader = new FileReader();
    reader.onload = function(evt) {
        try {
            const workbook = XLSX.read(evt.target.result, { type: "array" });
            const sheet = workbook.Sheets[workbook.SheetNames[0]];
            const rows = XLSX.utils.sheet_to_json(sheet, { defval: "", raw: false });
            if (rows.length === 0) throw new Error("Excel sayfasında okunabilir yolcu satırı bulunamadı.");

            uetdsYuklenenYolcular = rows.map((row, index) => {
                const tc = uetdsHucreDegeri(row, ["T.C. / Pasaport No", "TC Kimlik", "T.C.", "TC", "Pasaport No", "Pasaport"]);
                const adSoyad = uetdsHucreDegeri(row, ["Ad Soyad", "Yolcu Adı Soyadı", "Yolcu Adı", "Adı Soyadı"]) ||
                    [uetdsHucreDegeri(row, ["Ad", "İsim"]), uetdsHucreDegeri(row, ["Soyad", "Soyadı"])].filter(Boolean).join(" ");
                const cinsiyet = uetdsCinsiyetNormallestir(uetdsHucreDegeri(row, ["Cinsiyet", "Gender"]));
                const yolcu = {
                    koltukNo: uetdsHucreDegeri(row, ["Koltuk", "Koltuk No"]) || String(index + 1),
                    tcKimlikPasaportNo: tc,
                    adiSoyadi: adSoyad,
                    cinsiyet,
                    telefon: uetdsHucreDegeri(row, ["Telefon", "GSM", "Tel"])
                };

                const errors = [];
                if (!yolcu.tcKimlikPasaportNo) errors.push("Kimlik/pasaport no eksik");
                if (!yolcu.adiSoyadi) errors.push("Ad soyad eksik");
                if (!yolcu.cinsiyet) errors.push("Cinsiyet E/K olmalı");
                yolcu.hatalar = errors;
                return yolcu;
            });

            const kimlikler = new Set();
            uetdsYuklenenYolcular.forEach(yolcu => {
                const kimlik = yolcu.tcKimlikPasaportNo.toLocaleUpperCase("tr-TR");
                if (kimlik && kimlikler.has(kimlik)) yolcu.hatalar.push("Kimlik/pasaport no tekrarlı");
                if (kimlik) kimlikler.add(kimlik);
            });

            const tbody = document.getElementById("uetdsYolcuGovde");
            uetdsYuklenenYolcular.forEach(yolcu => {
                const tr = document.createElement("tr");
                [yolcu.koltukNo, yolcu.tcKimlikPasaportNo, yolcu.adiSoyadi,
                    yolcu.cinsiyet === "K" ? "Kadın" : yolcu.cinsiyet === "E" ? "Erkek" : "",
                    yolcu.telefon, yolcu.hatalar.length ? `❌ ${yolcu.hatalar.join("; ")}` : "✅ Gerekli alanlar uygun"]
                    .forEach((deger, index) => {
                        const td = document.createElement("td");
                        td.textContent = deger;
                        if (index === 5 && !yolcu.hatalar.length) td.style.color = "#15803d";
                        if (index === 5 && yolcu.hatalar.length) td.style.color = "#b91c1c";
                        tr.appendChild(td);
                    });
                tbody.appendChild(tr);
            });

            document.getElementById("uetdsYolcuSayi").textContent = String(uetdsYuklenenYolcular.length);
            alan.style.display = "block";
            document.getElementById("btnUetdsGonder").disabled = !UETDS_API_URL || uetdsYuklenenYolcular.some(y => y.hatalar.length > 0);
            if (uetdsYuklenenYolcular.some(y => y.hatalar.length > 0)) {
                uetdsSonucGoster("Hatalı satırları Excel'de düzeltip dosyayı yeniden yükleyin. Liste tamamen geçerli olmadan gönderim yapılamaz.", false);
            }
        } catch (error) {
            uetdsSonucGoster(error.message || "Excel dosyası okunamadı.", false);
        }
    };
    reader.onerror = () => uetdsSonucGoster("Dosya okunurken bir hata oluştu.", false);
    reader.readAsArrayBuffer(file);
}

function uetdsSonucGoster(mesaj, basarili) {
    const sonuc = document.getElementById("uetdsBildirimSonuc");
    sonuc.style.display = "block";
    sonuc.style.background = basarili ? "#dcfce7" : "#fee2e2";
    sonuc.style.border = basarili ? "1px solid #86efac" : "1px solid #fca5a5";
    sonuc.style.color = basarili ? "#15803d" : "#b91c1c";
    sonuc.textContent = mesaj;
}

async function uetdsBildirimiGonder() {
    if (!UETDS_API_URL) {
        return uetdsSonucGoster("U-ETDS SOAP backend adresi yapılandırılmadı; hiçbir veri gönderilmedi.", false);
    }

    const aracSecim = document.getElementById("uetdsAracSecim").value;
    const plaka = aracSecim === "diger" ? document.getElementById("uetdsManuelPlaka").value.trim() : aracSecim;
    const sofor1Id = document.getElementById("uetdsSofor1Secim").value;
    const sofor2Id = document.getElementById("uetdsSofor2Secim").value;
    const sofor1ManuelTc = document.getElementById("uetdsSofor1ManuelTc").value.trim();
    const sofor2ManuelTc = document.getElementById("uetdsSofor2ManuelTc").value.trim();
    const kalkisZaman = document.getElementById("uetdsKalkisZaman").value;
    const varisZaman = document.getElementById("uetdsVarisZaman").value;

    if (!plaka) return uetdsSonucGoster("Lütfen araç plakasını seçin veya girin.", false);
    if (!sofor1Id || (sofor1Id === "manuel" && !sofor1ManuelTc)) return uetdsSonucGoster("Lütfen 1. kaptanı seçin veya T.C. kimlik numarasını girin.", false);
    if (sofor1Id === "manuel" && !/^\d{11}$/.test(sofor1ManuelTc)) return uetdsSonucGoster("1. kaptan T.C. kimlik numarası 11 haneli olmalı.", false);
    if (sofor2Id === "manuel" && !/^\d{11}$/.test(sofor2ManuelTc)) return uetdsSonucGoster("2. kaptan T.C. kimlik numarası 11 haneli olmalı.", false);
    if (!kalkisZaman || !varisZaman) return uetdsSonucGoster("Lütfen kalkış ve tahmini varış tarih/saatini girin.", false);
    if (new Date(varisZaman) <= new Date(kalkisZaman)) return uetdsSonucGoster("Tahmini varış zamanı kalkış zamanından sonra olmalı.", false);
    if (!uetdsYuklenenYolcular.length || uetdsYuklenenYolcular.some(y => y.hatalar.length > 0)) return uetdsSonucGoster("Gönderim için hatasız yolcu listesi yükleyin.", false);

    const btn = document.getElementById("btnUetdsGonder");
    btn.disabled = true;
    btn.textContent = "Bildirim yapılıyor, lütfen bekleyin...";

    try {
        const payload = {
            plaka,
            sofor1_id: sofor1Id === "manuel" ? "" : sofor1Id,
            sofor2_id: sofor2Id === "manuel" ? "" : sofor2Id,
            manuel_sofor1_tc: sofor1ManuelTc,
            manuel_sofor2_tc: sofor2ManuelTc,
            kalkisZaman,
            varisZaman,
            yolcular: uetdsYuklenenYolcular.map(({ hatalar, ...yolcu }) => yolcu)
        };
        const response = await fetch(UETDS_API_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload)
        });
        const data = await response.json();
        if (!response.ok || !data.success) throw new Error(data.message || `Sunucu hatası (${response.status}).`);

        const ref = data.seferRefNo ? ` Referans: ${data.seferRefNo}` : "";
        uetdsSonucGoster(`${data.message || "Sunucu bildirimi kabul etti."}${ref}`, true);
    } catch (error) {
        uetdsSonucGoster(`Bildirim gönderilemedi: ${error.message}`, false);
    } finally {
        btn.textContent = "🚀 U-ETDS Sistemine Gönder ve Seferi Kaydet";
        btn.disabled = !UETDS_API_URL || uetdsYuklenenYolcular.length === 0 || uetdsYuklenenYolcular.some(y => y.hatalar.length > 0);
    }
}

document.addEventListener("DOMContentLoaded", () => {
    const excelInput = document.getElementById("uetdsExcelInput");
    if (excelInput) excelInput.addEventListener("change", uetdsExcelOku);
});

/* ============================================================
   U-ETDS EXCEL AYRIŞTIRICI & T.C. BOŞLUK TEMİZLEME MOTORU
   ============================================================ */
function uedtsSayfasiniAyristirVeIndir() {
    const fileInput = document.getElementById('uedtsAyristiriciInput');
    const durum = document.getElementById('uedtsAyristiriciDurum');
    const onizlemeAlani = document.getElementById('uedtsAyristiriciOnizleme');
    const filtreUygula = document.getElementById('uedtsBoslariAyarla')?.checked ?? true;

    if (!fileInput || !fileInput.files || fileInput.files.length === 0) {
        alert("Lütfen önce ayrıştırılacak tur Excel dosyasını seçin.");
        return;
    }

    const file = fileInput.files[0];
    const reader = new FileReader();

    durum.style.display = 'block';
    durum.style.background = '#eff6ff';
    durum.style.border = '1px solid #bfdbfe';
    durum.style.color = '#1e40af';
    durum.innerHTML = '⏳ Dosya inceleniyor, UEDTS sayfası ayrıştırılıyor ve T.C./telefon boşlukları temizleniyor...';
    if (onizlemeAlani) onizlemeAlani.style.display = 'none';

    reader.onload = function(e) {
        try {
            const data = new Uint8Array(e.target.result);
            // raw: false sayesinde formüllü alanların ekrandaki net değerini alır
            const wb = XLSX.read(data, { type: 'array', cellDates: true, raw: false });

            // UEDTS sayfasını bul
            const sayfaAdi = wb.SheetNames.find(ad => {
                const norm = ad.trim().toUpperCase();
                return norm === 'UEDTS' || norm === 'U-ETDS' || norm.startsWith('UEDTS');
            });

            if (!sayfaAdi) {
                throw new Error(`Excel içinde "UEDTS" sayfası bulunamadı. Mevcut sayfalar: [${wb.SheetNames.join(', ')}]`);
            }

            const sheet = wb.Sheets[sayfaAdi];
            const satirlar = XLSX.utils.sheet_to_json(sheet, { header: 1, defval: '' });

            if (satirlar.length === 0) {
                throw new Error(`"${sayfaAdi}" sayfası boş görünüyor.`);
            }

            // Başlık satırını bul
            let headerIdx = satirlar.findIndex(r => 
                r.some(c => {
                    const txt = String(c).toUpperCase();
                    return txt.includes('ÜLKE') || txt.includes('ADI') || txt.includes('TC');
                })
            );
            if (headerIdx === -1) headerIdx = 0;

            const basliklar = satirlar[headerIdx].map(h => String(h).trim());
            const tcCol = basliklar.findIndex(h => h.toUpperCase().includes('TC') || h.toUpperCase().includes('PASAPORT'));
            const adCol = basliklar.findIndex(h => h.toUpperCase() === 'ADI' || h.toUpperCase().includes('AD'));
            const soyadCol = basliklar.findIndex(h => h.toUpperCase().includes('SOYAD'));
            const telCol = basliklar.findIndex(h => h.toUpperCase().includes('TEL'));

            const temizVeriler = [basliklar];
            let yolcuSayisi = 0;

            for (let i = headerIdx + 1; i < satirlar.length; i++) {
                let row = [...satirlar[i]];

                // Boş satır kontrolü
                const doluMu = row.some(v => v !== null && String(v).trim() !== '' && String(v).trim() !== '-');
                if (!doluMu) continue;

                // 1. T.C. / Pasaport Boşluk ve Ondalık Temizliği
                if (tcCol !== -1 && row[tcCol] !== undefined && row[tcCol] !== null) {
                    let tcHam = String(row[tcCol]).trim();
                    tcHam = tcHam.replace(/\.0$/, '').replace(/\s+/g, '');
                    row[tcCol] = tcHam;
                }

                // 2. Telefon Boşluk ve Format Temizliği
                if (telCol !== -1 && row[telCol] !== undefined && row[telCol] !== null) {
                    let telHam = String(row[telCol]).trim();
                    telHam = telHam.replace(/\.0$/, '').replace(/\s+/g, '').replace(/[()\-]/g, '');
                    row[telCol] = (telHam === '' || telHam === '-') ? '-' : telHam;
                }

                // 3. Ad & Soyad Boşluk Kırpma
                if (adCol !== -1 && row[adCol]) row[adCol] = String(row[adCol]).trim();
                if (soyadCol !== -1 && row[soyadCol]) row[soyadCol] = String(row[soyadCol]).trim();

                // Filtreleme (Boş koltuk, REHBER, ACENTA veya geçersiz TC ayıklama)
                if (filtreUygula) {
                    const adVal = adCol !== -1 ? String(row[adCol] || '').toUpperCase() : '';
                    const tcVal = tcCol !== -1 ? String(row[tcCol] || '').replace(/\D/g, '') : '';

                    if (adVal === 'REHBER' || adVal === 'ACENTA' || adVal === 'ACENTE') continue;
                    if (tcCol !== -1 && tcVal.length < 5) continue;
                }

                temizVeriler.push(row);
                yolcuSayisi++;
            }

            // Yeni temiz Çalışma Kitabı oluştur
            const yeniWb = XLSX.utils.book_new();
            const yeniWs = XLSX.utils.aoa_to_sheet(temizVeriler, { raw: true });

            // T.C. sütununu metin ('string') formatına sabitle (bilimsel gösterim bozulmasını önler)
            if (tcCol !== -1) {
                for (let r = 1; r < temizVeriler.length; r++) {
                    const hucreAdresi = XLSX.utils.encode_cell({ r: r, c: tcCol });
                    if (yeniWs[hucreAdresi]) {
                        yeniWs[hucreAdresi].t = 's';
                        yeniWs[hucreAdresi].z = '@';
                    }
                }
            }

            yeniWs['!cols'] = [
                { wch: 8 },  // ÜLKE
                { wch: 18 }, // ADI
                { wch: 18 }, // SOYADI
                { wch: 24 }, // TC KİMLİK / PASAPORT NO
                { wch: 10 }, // CİNSİYET
                { wch: 18 }  // TELEFON
            ];

            XLSX.utils.book_append_sheet(yeniWb, yeniWs, "U-ETDS");

            const dosyaKok = file.name.replace(/\.[^/.]+$/, "").replace(/\s+/g, '_');
            const yeniDosyaAdi = `${dosyaKok}_UEDTS_Listesi.xlsx`;

            // Temiz dosyayı bilgisayara indir
            XLSX.writeFile(yeniWb, yeniDosyaAdi);

            durum.style.background = '#f0fdf4';
            durum.style.border = '1px solid #bbf7d0';
            durum.style.color = '#166534';
            durum.innerHTML = `✅ <strong>Ayrıştırma Başarılı:</strong> <em>"${sayfaAdi}"</em> sayfası çekildi. T.C. kimlik ve telefonlardaki boşluklar silindi.<br>Toplam <strong>${yolcuSayisi}</strong> yolcu ile <strong>"${yeniDosyaAdi}"</strong> oluşturuldu ve indirildi.`;

            // Ayrıştırılan veriyi tabloda önizlet
            uedtsAyristirmaOnizlemeCiz(temizVeriler, tcCol);
            document.getElementById('uedtsAyristirilanSayi').innerText = yolcuSayisi;
            if (onizlemeAlani) onizlemeAlani.style.display = 'block';

        } catch (err) {
            console.error("Ayrıştırma hatası:", err);
            durum.style.background = '#fef2f2';
            durum.style.border = '1px solid #fecaca';
            durum.style.color = '#b91c1c';
            durum.innerHTML = `❌ <strong>Hata:</strong> ${err.message || 'Dosya işlenemedi.'}`;
        }
    };

    reader.readAsArrayBuffer(file);
}

function uedtsAyristirmaOnizlemeCiz(veriler, tcCol) {
    const table = document.getElementById('uedtsAyristirmaTablosu');
    if (!table || veriler.length === 0) return;

    const thead = table.querySelector('thead');
    const tbody = table.querySelector('tbody');
    thead.innerHTML = '';
    tbody.innerHTML = '';

    const trHead = document.createElement('tr');
    veriler[0].forEach(baslik => {
        const th = document.createElement('th');
        th.style.textAlign = 'left';
        th.textContent = baslik || '-';
        trHead.appendChild(th);
    });
    thead.appendChild(trHead);

    for (let r = 1; r < veriler.length; r++) {
        const tr = document.createElement('tr');
        veriler[r].forEach((deger, colIdx) => {
            const td = document.createElement('td');
            td.style.textAlign = 'left';
            if (colIdx === tcCol && deger && deger !== '-') {
                td.innerHTML = `<span style="font-family: monospace; font-weight: 700; color: #0369a1; background: #e0f2fe; padding: 2px 6px; border-radius: 4px;">${deger}</span>`;
            } else {
                td.textContent = deger || '-';
            }
            tr.appendChild(td);
        });
        tbody.appendChild(tr);
    }
}

/* ============================================================
   RESMİ GÜZERGAH DURAK AYRIŞTIRICI & TEK SAYFA DOCX MOTORU
   ============================================================ */
const RESMI_ROTA_DURAKLARI = [
    // 1. MERSİN
    { sehir: "MERSİN", kod: "mersin_vipol", ad: "Mersin - Vipol", anahtarlar: ["VIPOL", "VİPOL"] },
    { sehir: "MERSİN", kod: "mersin_forum", ad: "Mersin - Forum", anahtarlar: ["FORUM", "FORM"] },
    { sehir: "MERSİN", kod: "mersin_eski_devlet", ad: "Mersin - Eski Devlet Hastanesi", anahtarlar: ["ESKI DEVLET", "ESKİ DEVLET", "DEVLET HASTANE", "HASTANE"] },
    
    // 2. TARSUS
    { sehir: "TARSUS", kod: "tarsus_ofis", ad: "Tarsus - Ofis", anahtarlar: ["OFIS", "OFİS", "SEHITLER TEPESI", "ŞEHİTLER TEPESİ"] },
    { sehir: "TARSUS", kod: "tarsus_madame_home", ad: "Tarsus - Madame Home", anahtarlar: ["MADAME", "MADAM", "HOME", "VATAN", "ESKI VATAN", "ESKİ VATAN"] },
    { sehir: "TARSUS", kod: "tarsus_cengiz_topel", ad: "Tarsus - Cengiz Topel", anahtarlar: ["CENGIZ TOPEL", "CENGİZ TOPEL", "CENGIZ", "CENGİZ", "TOPEL"] },
    { sehir: "TARSUS", kod: "tarsus_kleopatra", ad: "Tarsus - Kleopatra", anahtarlar: ["KLEOPATRA", "KLOPATRA", "KLEO"] },
    { sehir: "TARSUS", kod: "tarsus_shell", ad: "Tarsus - Shell", anahtarlar: ["SHELL", "SEL", "ŞHEL"] },
    { sehir: "TARSUS", kod: "tarsus_gemi", ad: "Tarsus - Gemi", anahtarlar: ["GEMI", "GEMİ", "NUSRET MAYIN", "NUSRET"] },
    
    // 3. ADANA
    { sehir: "ADANA", kod: "adana_duygu_kafe", ad: "Adana - Duygu Kafe", anahtarlar: ["DUYGU", "DUYGU KAFE", "BARAJYOLU", "BARAJ YOLU"] }
];

let durakAktifWorkbook = null;
let durakDosyaAdiTemiz = "";
let durakTespitEdilenAracSayfalari = [];
let durakAktifAyrismisVeri = null;

function durakMetinNormallestir(str) {
    return String(str || "")
        .toLocaleUpperCase('tr-TR')
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/\s+/g, ' ')
        .trim();
}

function durakTelefonTemizle(hamTel) {
    if (!hamTel) return "";
    let t = String(hamTel).replace(/\.0$/, '').replace(/\s+/g, '').replace(/[()\-]/g, '');
    return (t && t !== '-' && t.length >= 7) ? t : "";
}

function durakAdiniEslestir(hamDurak) {
    if (!hamDurak) return { sehir: "DİĞER", ad: "Belirtilmemiş / Diğer" };
    let d = String(hamDurak).trim();
    if (/^\d{10,11}$/.test(d.replace(/\D/g, ''))) return { sehir: "DİĞER", ad: "Belirtilmemiş / Diğer" };
    
    const upper = durakMetinNormallestir(d);

    for (const rota of RESMI_ROTA_DURAKLARI) {
        for (const key of rota.anahtarlar) {
            if (upper.includes(key)) {
                return { sehir: rota.sehir, ad: rota.ad, kod: rota.kod };
            }
        }
    }
    return { sehir: "DİĞER", ad: "Belirtilmemiş / Diğer" };
}

function durakDosyasiniIsle() {
    const input = document.getElementById('durakExcelInput');
    const durum = document.getElementById('durakBildirimKutusu');
    const sonucAlani = document.getElementById('durakSonucAlani');
    const btnDocx = document.getElementById('btnDurakDocxIndir');

    if (!input.files || input.files.length === 0) {
        alert("Lütfen bir Excel dosyası seçin.");
        return;
    }

    const file = input.files[0];
    durakDosyaAdiTemiz = file.name.replace(/\.[^/.]+$/, "");
    const reader = new FileReader();

    durum.style.display = "block";
    durum.style.background = "#eff6ff";
    durum.style.border = "1px solid #bfdbfe";
    durum.style.color = "#1e40af";
    durum.innerHTML = "⏳ Excel taranıyor, duraklar resmi güzergaha göre (Mersin -> Tarsus -> Adana) tasnif ediliyor...";
    sonucAlani.style.display = "none";
    if (btnDocx) btnDocx.style.display = "none";

    reader.onload = function(e) {
        try {
            const data = new Uint8Array(e.target.result);
            durakAktifWorkbook = XLSX.read(data, { type: 'array', cellDates: true, raw: false });

            // Araç koltuk sayfalarını tespit et
            durakTespitEdilenAracSayfalari = durakAktifWorkbook.SheetNames.filter(name => {
                const n = durakMetinNormallestir(name);
                return !n.includes('ÖDEME') && !n.includes('ODEME') && 
                       !n.includes('UEDTS') && !n.includes('UETDS') && !n.includes('U-ETDS') &&
                       !n.includes('DURAK');
            });

            if (durakTespitEdilenAracSayfalari.length === 0) {
                durakTespitEdilenAracSayfalari = [durakAktifWorkbook.SheetNames[0]];
            }

            const selectEl = document.getElementById('durakSelectAracSayfa');
            const kutuAracSecici = document.getElementById('durakKutuAracSecici');
            selectEl.innerHTML = '';
            
            durakTespitEdilenAracSayfalari.forEach(sName => {
                const opt = document.createElement('option');
                opt.value = sName;
                opt.textContent = sName;
                selectEl.appendChild(opt);
            });

            kutuAracSecici.style.display = (durakTespitEdilenAracSayfalari.length > 1) ? 'inline-flex' : 'none';

            durakSayfasiniAyristir(durakTespitEdilenAracSayfalari[0]);

            if (durakAktifAyrismisVeri.toplamYolcu === 0) {
                durum.style.background = "#fffbeb";
                durum.style.border = "1px solid #fde68a";
                durum.style.color = "#92400e";
                durum.innerHTML = `⚠️ <strong>Bilgi:</strong> "<em>${durakAktifAyrismisVeri.aktifSayfa}</em>" şablonu algılandı fakat biniş yapacak yolcu kaydı bulunamadı (şablon boş).`;
                sonucAlani.style.display = "none";
                if (btnDocx) btnDocx.style.display = "none";
                return;
            }

            durum.style.background = "#f0fdf4";
            durum.style.border = "1px solid #bbf7d0";
            durum.style.color = "#166534";
            durum.innerHTML = `✅ <strong>Ayrıştırma Başarılı:</strong> "<em>${durakAktifAyrismisVeri.aktifSayfa}</em>" planından toplam <strong>${durakAktifAyrismisVeri.toplamYolcu} yolcu</strong> rota sırasına göre il il tasnif edildi.`;
            sonucAlani.style.display = "block";
            if (btnDocx) btnDocx.style.display = "inline-block";

        } catch (err) {
            console.error(err);
            durum.style.background = "#fef2f2";
            durum.style.border = "1px solid #fecaca";
            durum.style.color = "#b91c1c";
            durum.innerHTML = `❌ <strong>Hata:</strong> ${err.message || 'Excel dosyası işlenirken bir sorun oluştu.'}`;
        }
    };

    reader.readAsArrayBuffer(file);
}

function durakAracSayfasiDegisti() {
    const secilenSayfa = document.getElementById('durakSelectAracSayfa').value;
    durakSayfasiniAyristir(secilenSayfa);
}

function durakSayfasiniAyristir(sayfaAdi) {
    if (!durakAktifWorkbook || !durakAktifWorkbook.Sheets[sayfaAdi]) return;

    const wsKoltuk = durakAktifWorkbook.Sheets[sayfaAdi];
    const koltukSatirlari = XLSX.utils.sheet_to_json(wsKoltuk, { header: 1, defval: '' });

    const telefonHaritasiKoltuk = {};
    const telefonHaritasiIsim = {};

    // A) ÖDEME Sayfası
    const odemeSayfaAdi = durakAktifWorkbook.SheetNames.find(s => {
        const u = durakMetinNormallestir(s);
        return u.includes('ÖDEME') || u.includes('ODEME');
    });

    if (odemeSayfaAdi) {
        const wsOdeme = durakAktifWorkbook.Sheets[odemeSayfaAdi];
        const odemeSatirlari = XLSX.utils.sheet_to_json(wsOdeme, { header: 1, defval: '' });

        let oHeaderIdx = odemeSatirlari.findIndex(r => r.some(c => durakMetinNormallestir(c).includes('TELEFON') || durakMetinNormallestir(c).includes('İSİM')));
        if (oHeaderIdx === -1) oHeaderIdx = 0;

        const oHeader = odemeSatirlari[oHeaderIdx].map(c => durakMetinNormallestir(c));
        const telCol = oHeader.findIndex(c => c.includes('TELEFON') || c.includes('TEL'));
        const isimCol = oHeader.findIndex(c => c.includes('İSİM') || c.includes('ISIM') || c.includes('AD'));

        for (let r = oHeaderIdx + 1; r < odemeSatirlari.length; r++) {
            const row = odemeSatirlari[r];
            const kNo = parseInt(row[0], 10);
            const isim = isimCol !== -1 ? durakMetinNormallestir(row[isimCol]) : "";
            const tel = telCol !== -1 ? durakTelefonTemizle(row[telCol]) : "";

            if (!isNaN(kNo) && tel) telefonHaritasiKoltuk[kNo] = tel;
            if (isim && tel) telefonHaritasiIsim[isim] = tel;
        }
    }

    // B) UEDTS / UETDS Sayfası
    const uetdsSayfaAdi = durakAktifWorkbook.SheetNames.find(s => {
        const u = durakMetinNormallestir(s);
        return u.includes('UEDTS') || u.includes('UETDS') || u.includes('U-ETDS');
    });

    if (uetdsSayfaAdi) {
        const wsUetds = durakAktifWorkbook.Sheets[uetdsSayfaAdi];
        const uSatirlar = XLSX.utils.sheet_to_json(wsUetds, { header: 1, defval: '' });
        if (uSatirlar.length > 1) {
            const uHead = uSatirlar[0].map(c => durakMetinNormallestir(c));
            const adC = uHead.findIndex(c => c === 'ADI' || c === 'AD');
            const soyadC = uHead.findIndex(c => c.includes('SOYAD'));
            const telC = uHead.findIndex(c => c.includes('TEL'));

            for (let r = 1; r < uSatirlar.length; r++) {
                const row = uSatirlar[r];
                const tamAd = `${row[adC] || ''} ${row[soyadC] || ''}`.trim();
                const tel = telC !== -1 ? durakTelefonTemizle(row[telC]) : "";
                if (tamAd && tel) telefonHaritasiIsim[durakMetinNormallestir(tamAd)] = tel;
            }
        }
    }

    // Tur Üst Bilgileri
    let turAdi = "", hareketTarihi = "", hareketSaati = "", hareketYeri = "";
    for (let r = 0; r < Math.min(10, koltukSatirlari.length); r++) {
        const row = koltukSatirlari[r];
        for (let c = 0; c < row.length; c++) {
            const val = durakMetinNormallestir(row[c]);
            if (val === 'TUR ADI') turAdi = String(row[c+1] || row[c+2] || row[c+3] || '').trim();
            if (val === 'HAREKET TARİHİ') hareketTarihi = String(row[c+1] || row[c+2] || row[c+3] || '').trim();
            if (val === 'HAREKET SAATİ') hareketSaati = String(row[c+1] || row[c+2] || row[c+3] || '').trim();
            if (val === 'HAREKET YERİ') hareketYeri = String(row[c+1] || row[c+2] || row[c+3] || '').trim();
        }
    }

    // Sütun İndekslerini Dinamik Yakala
    let baslikSatirNo = koltukSatirlari.findIndex(r => r.some(c => durakMetinNormallestir(c).includes('AD SOYAD')));
    if (baslikSatirNo === -1) baslikSatirNo = 6;

    const bRow = koltukSatirlari[baslikSatirNo];
    let koltukCol = -1;
    let adCol = -1;
    let durakCol = -1;

    bRow.forEach((c, idx) => {
        const t = durakMetinNormallestir(c);
        if (t.includes('AD SOYAD') || (t.includes('AD') && t.includes('SOYAD'))) {
            koltukCol = idx;
            adCol = idx + 1;
        }
        if (t.includes('BİNİŞ') || t.includes('BINIS') || t.includes('DURAK')) {
            durakCol = idx;
        }
    });

    if (koltukCol === -1) koltukCol = 6;
    if (adCol === -1) adCol = 7;
    if (durakCol === -1) durakCol = 11;

    const sehirGruplari = {
        "MERSİN": {},
        "TARSUS": {},
        "ADANA": {},
        "DİĞER": {}
    };

    let toplamYolcu = 0;

    for (let r = baslikSatirNo + 1; r < koltukSatirlari.length; r++) {
        const row = koltukSatirlari[r];
        const rawKoltuk = row[koltukCol];
        const rawAd = row[adCol];
        const rawDurak = row[durakCol];

        const koltukNo = parseInt(rawKoltuk, 10);
        const yolcuAdi = String(rawAd || '').trim();

        if (!yolcuAdi || isNaN(koltukNo)) continue;

        const adNorm = durakMetinNormallestir(yolcuAdi);
        if (['REHBER', 'ACENTA', 'ACENTE', 'KAPTAN', 'SOFOR', 'ŞOFÖR'].includes(adNorm)) continue;

        const eslesme = durakAdiniEslestir(rawDurak);
        const sehir = eslesme.sehir;
        const durakAdi = eslesme.ad;

        let tel = telefonHaritasiKoltuk[koltukNo] || telefonHaritasiIsim[adNorm] || "";
        if (!tel && String(rawDurak).length >= 10 && !isNaN(rawDurak)) {
            tel = durakTelefonTemizle(rawDurak);
        }

        if (!sehirGruplari[sehir][durakAdi]) {
            sehirGruplari[sehir][durakAdi] = [];
        }

        sehirGruplari[sehir][durakAdi].push({
            koltukNo,
            adSoyad: yolcuAdi,
            telefon: tel
        });

        toplamYolcu++;
    }

    durakAktifAyrismisVeri = {
        turAdi: turAdi || durakDosyaAdiTemiz,
        aktifSayfa: sayfaAdi,
        hareketTarihi,
        hareketSaati,
        hareketYeri,
        toplamYolcu,
        sehirGruplari
    };

    durakEkranaCiz();
}

function durakEkranaCiz() {
    if (!durakAktifAyrismisVeri) return;

    document.getElementById('durakOzetTurAdi').innerText = `🚌 ${durakAktifAyrismisVeri.turAdi} (${durakAktifAyrismisVeri.aktifSayfa})`;
    document.getElementById('durakOzetHareket').innerText = `Kalkış: ${durakAktifAyrismisVeri.hareketTarihi || '-'} ${durakAktifAyrismisVeri.hareketSaati ? '- ' + durakAktifAyrismisVeri.hareketSaati : ''} [${durakAktifAyrismisVeri.hareketYeri || 'Tarsus'}]`;
    document.getElementById('durakOzetToplamYolcu').innerText = `${durakAktifAyrismisVeri.toplamYolcu} Kişi`;

    const container = document.getElementById('durakSehirlerKapsayici');
    container.innerHTML = "";

    const sehirSiralamasi = ["MERSİN", "TARSUS", "ADANA", "DİĞER"];

    sehirSiralamasi.forEach(sehir => {
        const duraklarObj = durakAktifAyrismisVeri.sehirGruplari[sehir];
        const durakAdlari = Object.keys(duraklarObj);

        if (durakAdlari.length === 0) return;

        let sehirToplamYolcu = 0;
        durakAdlari.forEach(d => sehirToplamYolcu += duraklarObj[d].length);

        const sehirDiv = document.createElement('div');
        sehirDiv.className = "sehir-bolumu";

        let sehirIkon = "📍";
        if (sehir === "MERSİN") sehirIkon = "🌊 MERSİN DURAKLARI";
        else if (sehir === "TARSUS") sehirIkon = "🏛️ TARSUS DURAKLARI";
        else if (sehir === "ADANA") sehirIkon = "🏙️ ADANA DURAKLARI";
        else sehirIkon = "❓ DİĞER / BELİRTİLMEMİŞ NOKTALAR";

        sehirDiv.innerHTML = `
            <div class="sehir-baslik">
                <span>${sehirIkon}</span>
                <span style="font-size:13px; color:#1e40af; font-weight:700;">Toplam: ${sehirToplamYolcu} Yolcu</span>
            </div>
            <div class="durak-grid" id="grid_durak_${sehir}"></div>
        `;

        container.appendChild(sehirDiv);
        const gridEl = sehirDiv.querySelector(`#grid_durak_${sehir}`);

        durakAdlari.sort((a, b) => {
            const idxA = RESMI_ROTA_DURAKLARI.findIndex(r => r.ad === a);
            const idxB = RESMI_ROTA_DURAKLARI.findIndex(r => r.ad === b);
            if (idxA !== -1 && idxB !== -1) return idxA - idxB;
            return a.localeCompare(b, 'tr');
        });

        durakAdlari.forEach(durak => {
            const yolcular = duraklarObj[durak];
            const card = document.createElement('div');
            card.className = "durak-karti";

            let listeHtml = yolcular.map(y => `
                <li class="yolcu-item">
                    <span class="koltuk-no">No:${y.koltukNo}</span>
                    <span class="yolcu-ad">${y.adSoyad}</span>
                    <span class="yolcu-tel">${y.telefon || '-'}</span>
                </li>
            `).join('');

            card.innerHTML = `
                <div class="durak-karti-baslik">
                    <span>🚏 ${durak}</span>
                    <span class="durak-sayac">${yolcular.length} Yolcu</span>
                </div>
                <ul class="yolcu-listesi">${listeHtml}</ul>
            `;
            gridEl.appendChild(card);
        });
    });
}

/**
 * docx.js: 9'luktan 54'lüğe resmi güzergah sırasıyla TEK SAYFA A4 Word üretir.
 */
async function resmiRotaDocxOlustur() {
    if (!durakAktifAyrismisVeri || durakAktifAyrismisVeri.toplamYolcu === 0) return;

    const { Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell, WidthType, AlignmentType, BorderStyle } = docx;
    const { turAdi, hareketTarihi, hareketSaati, hareketYeri, toplamYolcu, sehirGruplari, aktifSayfa } = durakAktifAyrismisVeri;

    let yaziBoyutu = 13.5;
    let durakBaslikBoyutu = 15;
    let sehirBaslikBoyutu = 17;
    let boslukOnce = 40;
    let sayfaMargin = 320;

    if (toplamYolcu <= 18) {
        yaziBoyutu = 16;
        durakBaslikBoyutu = 18;
        sehirBaslikBoyutu = 20;
        boslukOnce = 80;
        sayfaMargin = 450;
    } else if (toplamYolcu >= 46) {
        yaziBoyutu = 12;
        durakBaslikBoyutu = 14;
        sehirBaslikBoyutu = 15;
        boslukOnce = 25;
        sayfaMargin = 280;
    }

    const siraliDurakKoleksiyonu = [];
    const sehirSirasi = ["MERSİN", "TARSUS", "ADANA", "DİĞER"];

    sehirSirasi.forEach(sehir => {
        const duraklarObj = sehirGruplari[sehir];
        const durakAdlari = Object.keys(duraklarObj);

        if (durakAdlari.length === 0) return;

        durakAdlari.sort((a, b) => {
            const idxA = RESMI_ROTA_DURAKLARI.findIndex(r => r.ad === a);
            const idxB = RESMI_ROTA_DURAKLARI.findIndex(r => r.ad === b);
            if (idxA !== -1 && idxB !== -1) return idxA - idxB;
            return a.localeCompare(b, 'tr');
        });

        durakAdlari.forEach(durakAdi => {
            siraliDurakKoleksiyonu.push({
                sehir,
                durakAdi,
                yolcular: duraklarObj[durakAdi]
            });
        });
    });

    const solBlok = [];
    const sagBlok = [];
    let solAgirlik = 0, sagAgirlik = 0;

    siraliDurakKoleksiyonu.forEach(item => {
        const agirlik = item.yolcular.length + 2;
        if (solAgirlik <= sagAgirlik) {
            solBlok.push(item);
            solAgirlik += agirlik;
        } else {
            sagBlok.push(item);
            sagAgirlik += agirlik;
        }
    });

    function sutunIcerigiUret(blokDizisi) {
        const paragraflar = [];
        let sonSehir = "";

        blokDizisi.forEach(item => {
            if (item.sehir !== sonSehir) {
                sonSehir = item.sehir;
                let sehirBaslikText = `📍 ${item.sehir} DURAKLARI`;
                if (item.sehir === "DİĞER") sehirBaslikText = `❓ DİĞER / BELİRTİLMEMİŞ DURAKLAR`;

                paragraflar.push(
                    new Paragraph({
                        children: [
                            new TextRun({ text: sehirBaslikText, bold: true, size: sehirBaslikBoyutu, color: "0f172a" })
                        ],
                        spacing: { before: boslukOnce + 15, after: 10 }
                    })
                );
            }

            paragraflar.push(
                new Paragraph({
                    children: [
                        new TextRun({ text: `🚏 ${item.durakAdi} `, bold: true, size: durakBaslikBoyutu, color: "1e40af" }),
                        new TextRun({ text: `(${item.yolcular.length} Yolcu)`, bold: true, size: durakBaslikBoyutu - 2, color: "0284c7" })
                    ],
                    spacing: { before: boslukOnce, after: 10 }
                })
            );

            const tableRows = [
                new TableRow({
                    children: [
                        new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: "K.", bold: true, size: yaziBoyutu })] })], width: { size: 10, type: WidthType.PERCENTAGE } }),
                        new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: "YOLCU ADI", bold: true, size: yaziBoyutu })] })], width: { size: 55, type: WidthType.PERCENTAGE } }),
                        new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: "TELEFON", bold: true, size: yaziBoyutu })] })], width: { size: 35, type: WidthType.PERCENTAGE } }),
                    ]
                })
            ];

            item.yolcular.forEach(y => {
                tableRows.push(
                    new TableRow({
                        children: [
                            new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: String(y.koltukNo), size: yaziBoyutu, bold: true })] })] }),
                            new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: y.adSoyad, size: yaziBoyutu })] })], width: { size: 55, type: WidthType.PERCENTAGE } }),
                            new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: y.telefon || "-", size: yaziBoyutu - 1 })] })], width: { size: 35, type: WidthType.PERCENTAGE } }),
                        ]
                    })
                );
            });

            paragraflar.push(
                new Table({
                    rows: tableRows,
                    width: { size: 100, type: WidthType.PERCENTAGE },
                    borders: {
                        top: { style: BorderStyle.SINGLE, size: 1, color: "cbd5e1" },
                        bottom: { style: BorderStyle.SINGLE, size: 1, color: "cbd5e1" },
                        left: { style: BorderStyle.NONE },
                        right: { style: BorderStyle.NONE },
                        insideHorizontal: { style: BorderStyle.DOTTED, size: 1, color: "e2e8f0" },
                        insideVertical: { style: BorderStyle.NONE },
                    }
                })
            );

            paragraflar.push(new Paragraph({ text: "", spacing: { after: 15 } }));
        });

        return paragraflar;
    }

    const anaTablo = new Table({
        rows: [
            new TableRow({
                children: [
                    new TableCell({
                        children: sutunIcerigiUret(solBlok),
                        width: { size: 50, type: WidthType.PERCENTAGE },
                        borders: { top: { style: BorderStyle.NONE }, bottom: { style: BorderStyle.NONE }, left: { style: BorderStyle.NONE }, right: { style: BorderStyle.NONE } }
                    }),
                    new TableCell({
                        children: sutunIcerigiUret(sagBlok),
                        width: { size: 50, type: WidthType.PERCENTAGE },
                        borders: { top: { style: BorderStyle.NONE }, bottom: { style: BorderStyle.NONE }, left: { style: BorderStyle.NONE }, right: { style: BorderStyle.NONE } }
                    })
                ]
            })
        ],
        width: { size: 100, type: WidthType.PERCENTAGE },
        borders: { top: { style: BorderStyle.NONE }, bottom: { style: BorderStyle.NONE }, left: { style: BorderStyle.NONE }, right: { style: BorderStyle.NONE }, insideVertical: { style: BorderStyle.NONE }, insideHorizontal: { style: BorderStyle.NONE } }
    });

    const doc = new Document({
        sections: [{
            properties: {
                page: {
                    margin: { top: sayfaMargin, bottom: sayfaMargin, left: sayfaMargin, right: sayfaMargin }
                }
            },
            children: [
                new Paragraph({
                    children: [
                        new TextRun({ text: "ÜSTÜNBUS TURİZM - RESMİ GÜZERGAH BİNİŞ VE DURAK LİSTESİ", bold: true, size: 18, color: "0f172a" })
                    ],
                    alignment: AlignmentType.CENTER,
                    spacing: { after: 20 }
                }),
                new Paragraph({
                    children: [
                        new TextRun({ text: `Tur: ${turAdi} (${aktifSayfa})  |  `, bold: true, size: 13 }),
                        new TextRun({ text: `Tarih: ${hareketTarihi} ${hareketSaati}  |  `, size: 13 }),
                        new TextRun({ text: `Güzergah: Mersin ➔ Tarsus ➔ Adana  |  `, size: 13 }),
                        new TextRun({ text: `Yolcu: ${toplamYolcu}`, bold: true, color: "16a34a", size: 13 })
                    ],
                    alignment: AlignmentType.CENTER,
                    spacing: { after: 50 }
                }),
                anaTablo,
                new Paragraph({
                    children: [
                        new TextRun({ text: "* Lütfen misafirleri yalnızca teyit edilen durak noktalarından alınız. İyi yolculuklar dileriz!", italics: true, size: 11, color: "64748b" })
                    ],
                    alignment: AlignmentType.CENTER,
                    spacing: { before: 35 }
                })
            ]
        }]
    });

    const blob = await Packer.toBlob(doc);
    const temizDosya = turAdi.replace(/[^a-zA-Z0-9çğıöşüÇĞİÖŞÜ]/g, "_");
    saveAs(blob, `${temizDosya}_Resmi_Durak_Listesi.docx`);
}