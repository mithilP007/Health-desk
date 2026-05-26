import os
import requests

SAVE_DIR = r"D:\healthdesk-p10\backend\documents"

os.makedirs(SAVE_DIR, exist_ok=True)

pdfs = {
    "dengue.pdf":
    "https://www.who.int/publications/i/item/9789240037571",

    "malaria.pdf":
    "https://www.who.int/news-room/fact-sheets/detail/malaria",

    "tuberculosis.pdf":
    "https://www.who.int/news-room/fact-sheets/detail/tuberculosis",

    "hiv.pdf":
    "https://www.who.int/news-room/fact-sheets/detail/hiv-aids",

    "diabetes.pdf":
    "https://www.who.int/news-room/fact-sheets/detail/diabetes",

    "hypertension.pdf":
    "https://www.who.int/news-room/fact-sheets/detail/hypertension",

    "asthma.pdf":
    "https://medlineplus.gov/asthma.html",

    "stroke.pdf":
    "https://medlineplus.gov/stroke.html",

    "heart_disease.pdf":
    "https://medlineplus.gov/heartdiseases.html",

    "cancer.pdf":
    "https://medlineplus.gov/cancer.html"
}

headers = {
    "User-Agent": "Mozilla/5.0"
}

print("\n📥 Downloading medical files...\n")

for filename, url in pdfs.items():
    try:
        response = requests.get(url, headers=headers, timeout=60)

        if response.status_code == 200:
            filepath = os.path.join(SAVE_DIR, filename)

            with open(filepath, "wb") as f:
                f.write(response.content)

            print(f"✅ Saved: {filename}")

        else:
            print(f"❌ Failed: {filename}")

    except Exception as e:
        print(f"❌ Error: {filename} -> {e}")

print("\n✅ Download completed")