import os
import subprocess

data_dir = os.path.join(os.path.dirname(os.path.dirname(__file__)), 'data')

for root, dirs, files in os.walk(data_dir):
    for f in files:
        if f.lower().endswith('.pdf'):
            pdf_path = os.path.join(root, f)
            cover_path = os.path.join(root, 'cover')
            # Check if cover already exists
            if not os.path.exists(cover_path + '-1.png'):
                print(f"Extracting {pdf_path}")
                try:
                    subprocess.run(['pdftoppm', '-png', '-f', '1', '-l', '1', '-scale-to', '800', pdf_path, cover_path], check=True)
                except Exception as e:
                    print(f"Error extracting {pdf_path}: {e}")

