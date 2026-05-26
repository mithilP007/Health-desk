import os

# CORRECT DOCUMENTS PATH
documents_path = r"D:\healthdesk-p10\backend\documents"

print("\n🔍 Checking PDF files...\n")

# CHECK FOLDER EXISTS
if not os.path.exists(documents_path):
    print(f"❌ Folder not found: {documents_path}")
    exit()

# GET ALL PDF FILES
pdf_files = [f for f in os.listdir(documents_path) if f.endswith(".pdf")]

if not pdf_files:
    print("❌ No PDF files found!")
    exit()

print(f"📚 Found {len(pdf_files)} PDF files\n")

# CHECK EACH PDF
for filename in pdf_files:

    filepath = os.path.join(documents_path, filename)

    try:
        with open(filepath, "rb") as f:
            header = f.read(20)

        # REAL PDFs START WITH %PDF
        if header.startswith(b"%PDF"):

            print(f"✅ VALID PDF: {filename}")

        else:

            print(f"❌ INVALID PDF: {filename}")

            with open(filepath, "rb") as f:
                content = f.read(500)

            # HTML DETECTION
            if b"<html" in content.lower():
                print("   → Downloaded HTML page instead of PDF")

            elif b"<!doctype html" in content.lower():
                print("   → This is an HTML webpage")

            else:
                print("   → Corrupted or incomplete PDF")

    except Exception as e:

        print(f"⚠️ ERROR checking {filename}")
        print(f"   {e}")

print("\n✅ PDF checking completed\n")