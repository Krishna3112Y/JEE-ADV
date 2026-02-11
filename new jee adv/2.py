import os

folder = r"C:\Users\new\OneDrive\Desktop\new jee adv\images"
files = os.listdir(folder)
files.sort()  # ensures consistent order

for i, filename in enumerate(files, start=1):
    ext = os.path.splitext(filename)[1]  # keep .jpg or .png
    new_name = f"q{i}{ext}"
    os.rename(os.path.join(folder, filename),
              os.path.join(folder, new_name))

print("Renaming complete!")