import re
import os
import requests

WHO_DOCS = {
    "who-dengue-guidelines-2023.pdf": "10665/355020",
    "who-malaria-factsheet.pdf": "10665/274382",
    "who-diabetes-guidelines.pdf": "10665/204871",
    "who-hypertension-2021.pdf": "10665/344424",
    "who-mental-health-2020.pdf": "10665/339620",
    "who-tuberculosis-2020.pdf": "10665/336324",
    "who-hiv-factsheet.pdf": "10665/342641",
    "who-pneumonia-2019.pdf": "10665/325319",
    "who-diarrhea-treatment.pdf": "10665/43209",
    "who-nutrition-guidelines.pdf": "10665/42717"
}

folder = r"C:\Users\mithil\healthdesk-p10\knowledge\documents"
os.makedirs(folder, exist_ok=True)

# Using simple User-Agent to bypass dynamic Angular SPA and force static SSR delivery
headers = {
    "User-Agent": "Mozilla/5.0"
}

for filename, handle in WHO_DOCS.items():
    landing_url = f"https://iris.who.int/handle/{handle}"
    print(f"Analyzing landing page: {landing_url} for {filename}...")
    try:
        r = requests.get(landing_url, headers=headers, timeout=30)
        if r.status_code != 200:
            print(f"  [ERROR] Failed to load landing page (status {r.status_code})")
            continue
            
        # Generic match for DSpace 7 bitstream URLs
        match = re.search(r'(server/api/core/bitstreams/[^/]+/content)', r.text)
        if match:
            direct_pdf_url = f"https://iris.who.int/{match.group(1)}"
            print(f"  Found direct PDF URL: {direct_pdf_url}")
            print(f"  Downloading real PDF to {filename}...")
            
            pdf_res = requests.get(direct_pdf_url, headers=headers, timeout=60)
            if pdf_res.status_code == 200:
                filepath = os.path.join(folder, filename)
                with open(filepath, "wb") as f:
                    f.write(pdf_res.content)
                print(f"  [SUCCESS] Saved PDF: {filename} ({len(pdf_res.content)} bytes)")
            else:
                print(f"  [ERROR] Failed to download PDF (status {pdf_res.status_code})")
        else:
            print("  [ERROR] No direct bitstream content URL found in HTML source.")
    except Exception as e:
        print(f"  [ERROR] Error occurred: {e}")

print("\nDirect WHO PDF extraction complete!")
