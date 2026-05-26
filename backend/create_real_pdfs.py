import os
import fitz
import requests
from bs4 import BeautifulSoup

SAVE_DIR = r"D:\healthdesk-p10\backend\documents"

os.makedirs(SAVE_DIR, exist_ok=True)

pages = {
    "dengue": "https://www.who.int/news-room/fact-sheets/detail/dengue-and-severe-dengue",
    "malaria": "https://www.who.int/news-room/fact-sheets/detail/malaria",
    "tuberculosis": "https://www.who.int/news-room/fact-sheets/detail/tuberculosis",
    "hiv": "https://www.who.int/news-room/fact-sheets/detail/hiv-aids",
    "diabetes": "https://www.who.int/news-room/fact-sheets/detail/diabetes",
    "hypertension": "https://www.who.int/news-room/fact-sheets/detail/hypertension",
    "asthma": "https://medlineplus.gov/asthma.html",
    "stroke": "https://medlineplus.gov/stroke.html",
    "heart_disease": "https://medlineplus.gov/heartdiseases.html",
    "cancer": "https://medlineplus.gov/cancer.html"
}

headers = {
    "User-Agent": "Mozilla/5.0"
}

print("\n📥 Creating REAL PDFs...\n")

for name, url in pages.items():

    try:
        response = requests.get(url, headers=headers, timeout=60)

        soup = BeautifulSoup(response.text, "html.parser")

        text = soup.get_text(separator="\n")

        text = "\n".join(
            line.strip()
            for line in text.splitlines()
            if line.strip()
        )

        pdf_path = os.path.join(SAVE_DIR, f"{name}.pdf")

        doc = fitz.open()

        page = doc.new_page()

        page.insert_text(
            (50, 50),
            text[:35000],
            fontsize=10
        )

        doc.save(pdf_path)
        doc.close()

        print(f"✅ Created: {name}.pdf")

    except Exception as e:
        print(f"❌ Failed: {name} -> {e}")

print("\n✅ ALL PDFs CREATED")