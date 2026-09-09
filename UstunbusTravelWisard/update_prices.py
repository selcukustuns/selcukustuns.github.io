import json
import urllib.request

try:
  print("1. Opet altyapısından bölgeler çekiliyor...")
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
      print(f"✅ Mersin Kodu Bulundu: {mersin['code']}")

      url_districts = f"https://api.opet.com.tr/api/fuelprices/provinces/{mersin['code']}/districts"
      req_dist = urllib.request.Request(
          url_districts, headers={"User-Agent": "Mozilla/5.0"}
      )

      with urllib.request.urlopen(req_dist) as dist_res:
        districts_data = json.loads(dist_res.read().decode())

        with open("prices.json", "w", encoding="utf-8") as f:
          json.dump(districts_data, f, ensure_ascii=False, indent=4)

        print(
            "Başarılı! Tüm veriler 'prices.json' dosyasına kaydedildi."
        )
    else:
      print("Mersin listede bulunamadı.")

except Exception as e:
  print(f"Bir hata oluştu: {e}")