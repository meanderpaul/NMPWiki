import json

# Load the JSON file
with open('data/episodes.json') as file:
    data = json.load(file)

# Extract guest names
guest_names = []
for episode in data:
    guest_names.extend(episode.get('guests', []))

# Sort guest names alphabetically by first name
sorted_guest_names = sorted(guest_names, key=lambda name: name.split()[0])

# Output the sorted guest names in a bullet list format
with open('sorted_guests.html', 'w') as output_file:
    output_file.write("<ul>\n")
    for name in sorted_guest_names:
        output_file.write(f"  <li>{name}</li>\n")
    output_file.write("</ul>\n")

print("Sorted guest names have been written to sorted_guests.html")
