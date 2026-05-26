import os
import fitz

DOCS = r"D:\healthdesk-p10\backend\documents"

files = os.listdir(DOCS)

for file in files:

    path = os.path.join(DOCS, file)

    if file.endswith(".pdf"):
        continue

    try:
        with open(path, "r", encoding="utf-8", errors="ignore") as f:
            text = f.read()

        pdf_name = file.replace(".html", "").replace(".txt", "") + ".pdf"
        pdf_path = os.path.join(DOCS, pdf_name)

        doc = fitz.open()
        page = doc.new_page()

        page.insert_text(
            (50, 50),
            text[:30000],
            fontsize=11
        )

        doc.save(pdf_path)
        doc.close()

        print(f"✅ Created PDF: {pdf_name}")

    except Exception as e:
        print(f"❌ Failed: {file} -> {e}")

print("\n✅ PDF conversion completed")