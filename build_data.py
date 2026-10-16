import os
import json

def build_portfolio_data():
    base_dir = "images/Photos"
    categories = ["Studio", "Graduation", "headshots", "Beauty", "Automotive"]
    
    portfolio_data = {}
    
    # Process regular categories
    for category in categories:
        cat_path = os.path.join(base_dir, category)
        if not os.path.isdir(cat_path):
            continue
            
        portfolio_data[category] = []
        
        # Check for direct files in the category folder
        direct_images = []
        direct_cover = ""
        for item in os.listdir(cat_path):
            item_path = os.path.join(cat_path, item)
            if os.path.isfile(item_path) and item.lower().endswith(('.png', '.jpg', '.jpeg', '.webp')):
                img_path = f"images/Photos/{category}/{item}"
                direct_images.append(img_path)
                if item.startswith("cover-"):
                    direct_cover = img_path
                    
        if direct_images:
            if not direct_cover:
                direct_cover = direct_images[0]
            portfolio_data[category].append({
                "id": f"{category.lower()}-shoot",
                "title": category,
                "category": category,
                "coverImage": direct_cover,
                "images": direct_images
            })
            
        for shoot in os.listdir(cat_path):
            shoot_path = os.path.join(cat_path, shoot)
            if not os.path.isdir(shoot_path):
                continue
                
            shoot_id = f"{category.lower()}-{shoot.lower().replace(' ', '-')}"
            images = []
            cover_image = ""
            
            for img in os.listdir(shoot_path):
                if img.lower().endswith(('.png', '.jpg', '.jpeg', '.webp')):
                    img_path = f"images/Photos/{category}/{shoot}/{img}"
                    images.append(img_path)
                    if img.startswith("cover-"):
                        cover_image = img_path
                        
            if not cover_image and images:
                cover_image = images[0] # Fallback
            elif cover_image and cover_image in images:
                images.remove(cover_image)
                images.insert(0, cover_image)
                
            portfolio_data[category].append({
                "id": shoot_id,
                "title": shoot,
                "category": category,
                "coverImage": cover_image,
                "images": images
            })

    # Write to portfolio-data.js
    js_content = f"const portfolioData = {json.dumps(portfolio_data, indent=4)};\n"
    with open("portfolio-data.js", "w") as f:
        f.write(js_content)
        
    print("Successfully generated portfolio-data.js")

if __name__ == "__main__":
    build_portfolio_data()
