import os
import json

directory_path = "frontend/public/static/img/category_images"
categories = [f for f in os.listdir(directory_path) if os.path.isdir(os.path.join(directory_path, f))]
images_by_category = {}

for category in categories:
    images = [
        f"/static/img/category_images/{category}/{file}"
        for file in os.listdir(os.path.join(directory_path, category))
        if file.endswith(".jpeg") or file.endswith(".jpg")
    ]
    images_by_category[category] = images

with open('frontend/manifest.json', 'w') as file:
    json.dump(images_by_category, file, indent=2)