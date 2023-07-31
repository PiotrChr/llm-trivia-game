import os

categories = [
    'Physics', 'Types of Barbie dolls', 'History', 'Music', 'Movies',
    'Mathematics', 'Computer Science', 'Astronomy', 'Geography', 'Literature',
    'Chemistry', 'Biology', 'Psychology', 'Philosophy', 'Art', 'Sport', 'Cooking',
    'Fashion', 'Business & Finance', 'Pop Culture', 'Television', 'Religion',
    'Health & Medicine', 'Environment', 'Current Affairs', 'Politics', 'Celebrities',
    'Automobiles', 'Technology', 'Video Games', 'Comic Books', 'Science Fiction',
    'Anime & Manga', 'Board Games', 'Card Games', 'Travel', 'Languages', 'Anthropology',
    'Archaeology', 'Architecture', 'Space Exploration', 'Fantasy Literature', 'Photography',
    'Cinema', 'Wildlife', 'Cuisine', 'Painting', 'Sculpture', 'Dance', 'Classical Music',
    'Classical Literature', 'Mythology', 'Astrophysics', 'Horticulture', 'Viticulture',
    'Quantum Mechanics', 'Robotics', 'Graphic Design', 'Jazz Music', 'Opera', 'Meteorology',
    'Marine Biology', 'Paleontology', 'Geology', 'Sociology', 'Ethics', 'Neuroscience',
    'Cartography', 'Cryptology', 'Archery', 'Numismatics', 'Philately', 'Radio Broadcasting',
    'Tea Culture', 'Coffee Culture', 'Ballet', 'Modern Art', 'Cryptozoology', 'Ufology',
    'Kinesiology', 'Gemology', 'Esports', 'Forestry', 'Astrology', 'Agriculture',
    'Medieval History', 'Microbiology', 'Stand-Up Comedy', 'Folk Music', 'Musical Theatre',
    'Calligraphy', 'Ornithology', 'Futurology', 'Cryptocurrency', 'Podcasts', 'Origami',
    'Fencing', 'Bonsai Cultivation', 'Brewing', 'Entomology'
]

for category_name in categories:
    # Replace any characters that may be invalid in a folder name
    safe_category_name = category_name.replace(' ', '_').replace('&', 'and')

    # Create a folder with the category name if it does not exist
    if not os.path.exists(safe_category_name):
        os.makedirs(safe_category_name)
        print(f"Folder '{safe_category_name}' created.")
    else:
        print(f"Folder '{safe_category_name}' already exists.")
