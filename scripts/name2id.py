import os

# Create a dictionary to map category names to IDs
category_mapping = {
    'Physics': 1, 'Types_of_Barbie_dolls': 2, 'History': 3, 'Music': 4,
    'Movies': 5, 'Mathematics': 6, 'Computer_Science': 7, 'Astronomy': 8,
    'Geography': 9, 'Literature': 10, 'Chemistry': 11, 'Biology': 12,
    'Psychology': 13, 'Philosophy': 14, 'Art': 15, 'Sport': 16, 'Cooking': 17,
    'Fashion': 18, 'Business_and_Finance': 19, 'Pop_Culture': 20, 'Television': 21,
    'Religion': 22, 'Health_and_Medicine': 23, 'Environment': 24, 'Current_Affairs': 25,
    'Politics': 26, 'Celebrities': 27, 'Automobiles': 28, 'Technology': 29,
    'Video_Games': 30, 'Comic_Books': 31, 'Science_Fiction': 32, 'Anime_and_Manga': 33,
    'Board_Games': 34, 'Card_Games': 35, 'Travel': 36, 'Languages': 37,
    'Anthropology': 38, 'Archaeology': 39, 'Architecture': 40, 'Space_Exploration': 41,
    'Fantasy_Literature': 42, 'Photography': 43, 'Cinema': 44, 'Wildlife': 45,
    'Cuisine': 46, 'Painting': 47, 'Sculpture': 48, 'Dance': 49, 'Classical_Music': 50,
    'Classical_Literature': 51, 'Mythology': 52, 'Astrophysics': 53, 'Horticulture': 54,
    'Viticulture': 55, 'Quantum_Mechanics': 56, 'Robotics': 57, 'Graphic_Design': 58,
    'Jazz_Music': 59, 'Opera': 60, 'Meteorology': 61, 'Marine_Biology': 62,
    'Paleontology': 63, 'Geology': 64, 'Sociology': 65, 'Ethics': 66, 'Neuroscience': 67,
    'Cartography': 68, 'Cryptology': 69, 'Archery': 70, 'Numismatics': 71,
    'Philately': 72, 'Radio_Broadcasting': 73, 'Tea_Culture': 74, 'Coffee_Culture': 75,
    'Ballet': 76, 'Modern_Art': 77, 'Cryptozoology': 78, 'Ufology': 79, 'Kinesiology': 80,
    'Gemology': 81, 'Esports': 82, 'Forestry': 83, 'Astrology': 84, 'Agriculture': 85,
    'Medieval_History': 86, 'Microbiology': 87, 'Stand-Up_Comedy': 88, 'Folk_Music': 89,
    'Musical_Theatre': 90, 'Calligraphy': 91, 'Ornithology': 92, 'Futurology': 93,
    'Cryptocurrency': 94, 'Podcasts': 95, 'Origami': 96, 'Fencing': 97,
    'Bonsai_Cultivation': 98, 'Brewing': 99, 'Entomology': 100,
}

# Path to the directory containing the categories
path = '.'

# Iterate over all directories in the given path
for category_dir in os.listdir(path):
    category_path = os.path.join(path, category_dir)

    if os.path.isdir(category_path):
        # Find the corresponding ID from the category name
        category_id = category_mapping.get(category_dir, None)
        if category_id is not None:
            # Determine the corresponding directory name
            directory = str(category_id).zfill(3)  # Pad with leading zeros

            # Determine the new path for the directory
            new_directory_path = os.path.join(path, directory)

            # Rename the directory
            os.rename(category_path, new_directory_path)
            print(f"Renamed directory {category_dir} to {directory}")
        else:
            print(f"Warning: No matching category found for {category_dir}")
