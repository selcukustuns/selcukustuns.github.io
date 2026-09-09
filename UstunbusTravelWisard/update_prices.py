import json
import urllib.request

try:
  print("1. Opet iller listesi alınıyor...")
  url_provinces = "https://api.opet.com.tr/api/fuelprices/provinces"
  req = urllib.request.Request(
      url_provinces, headers={"User-Agent": "Mozilla/5.0"}
  )

  with urllib.request.urlopen(req) as response:
    provinces = json.loads(response.read().decode())

    mersin = next(
        (
            p
            for p in provinces
            if "MERSİN" in p["name"].upper() or "MERSIN" in p["name"].upper()
        ),
        None,
    )

    if mersin:
      province_code = str(mersin["code"])
      print(f"Mersin bulundu (Kod: {province_code}). İlçeler çekiliyor...")

      url_districts = f"https://api.opet.com.tr/api/fuelprices/provinces/{province_code}/districts"
      req_dist = urllib.request.Request(
          url_districts, headers={"User-Agent": "Mozilla/5.0"}
      )

      with urllib.request.urlopen(req_dist) as dist_res:
        districts = json.loads(dist_res.read().decode())

        tarsus = next(
            (d for d in districts if "TARSUS" in d["name"].upper()),
            districts[0] if districts else None,
        )

        if tarsus:
          raw_code = str(tarsus["code"])
          int_code = int(raw_code)

          # Opet'in olası tüm fiyat endpoint kombinasyonlarını test edelim
          urls_to_try = [
              f"https://api.opet.com.tr/api/fuelprices/prices?districtCode={raw_code}",
              f"https://api.opet.com.tr/api/fuelprices/prices?districtCode={int_code}",
              f"https://api.opet.com.tr/api/fuelprices/provinces/{province_code}/districts/{raw_code}/prices",
              f"https://api.opet.com.tr/api/fuelprices/provinces/{province_code}/districts/{int_code}/prices",
              f"https://api.opet.com.tr/api/fuelprices/prices?provinceCode={province_code}&districtCode={raw_code}",
          ]

          success = False
          for url_prices in urls_to_try:
            try:
              print(f"Deneniyor -> {url_prices}")
              req_prices = urllib.request.Request(
                  url_prices, headers={"User-Agent": "Mozilla/5.0"}
              )
              with urllib.request.urlopen(req_prices) as price_res:
                price_data = json.loads(price_res.read().decode())

                with open("prices.json", "w", encoding="utf-8") as f:
                  json.dump(price_data, f, ensure_ascii=False, indent=4)

                print("✅ Başarılı! Gerçek anlık fiyatlar prices.json dosyasına yazıldı.")
                success = True
                break
            except Exception as ex:
              print(f"   (Geçildi: {ex})")

          if not success:
            print("❌ Hiçbir fiyat endpoint'i eşleşmedi.")
        else:
          print("Tarsus ilçesi bulunamadı.")
    else:
      print("Mersin bulunamadı.")

except Exception as e:
  print(f"Genel Hata: {e}")