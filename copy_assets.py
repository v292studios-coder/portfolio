import os
import shutil

src_root = r"C:\Users\Vishnu\.gemini\antigravity\scratch\resume"
dest_root = r"C:\Users\Vishnu\.gemini\antigravity\scratch\vishnu-kumar-portfolio\images\work"

folders = {
    "santos": [
        os.path.join(src_root, "Santos", "First half"),
        os.path.join(src_root, "Santos", "second half")
    ],
    "graduation": [
        os.path.join(src_root, "Jades Graduation", "Final")
    ],
    "headshots": [
        os.path.join(src_root, "headshots")
    ],
    "birthdays": [
        os.path.join(src_root, "Birthdays", "Edited"),
        os.path.join(src_root, "Birthdays", "Odeal 25 bday shoot"),
        os.path.join(src_root, "Birthdays", "rose")
    ],
    "creative": [
        os.path.join(src_root, "Photoshoot 1 finals")
    ]
}

os.makedirs(dest_root, exist_ok=True)

for category, src_dirs in folders.items():
    dest_dir = os.path.join(dest_root, category)
    os.makedirs(dest_dir, exist_ok=True)
    print(f"Copying files for {category}...")
    for src_dir in src_dirs:
        if not os.path.exists(src_dir):
            print(f"Warning: {src_dir} does not exist.")
            continue
        for item in os.listdir(src_dir):
            src_path = os.path.join(src_dir, item)
            if os.path.isdir(src_path):
                continue
            if item.lower().endswith(('.png', '.jpg', '.jpeg')):
                dest_path = os.path.join(dest_dir, item)
                shutil.copy2(src_path, dest_path)
                print(f"  Copied: {item}")

print("Copy completed successfully!")
