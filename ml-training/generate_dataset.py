import pandas as pd

easy_words = [
    "Hallo", "Danke", "Bitte", "Haus", "Wasser", "Brot", "Hund", "Katze",
    "Apfel", "Auto", "Buch", "Stuhl", "Tisch", "Milch", "Schule"
]

medium_sentences = [
    "Ich bin ein Student",
    "Das Haus ist groß",
    "Der Hund ist schnell",
    "Ich trinke Wasser",
    "Sie geht zur Schule",
    "Er liest ein Buch",
    "Wir essen Brot",
    "Das Auto ist neu",
    "Ich habe einen Hund",
    "Sie spielt im Park"
]

hard_sentences = [
    "Obwohl er müde war, ging er weiter",
    "Das Haus, das er gekauft hat, ist sehr alt",
    "Während sie studierte, arbeitete sie nebenbei",
    "Er ging nach Hause, nachdem er gegessen hatte",
    "Wenn es regnet, bleiben wir zu Hause",
    "Nachdem er das Buch gelesen hatte, schrieb er eine Zusammenfassung",
    "Obwohl das Wetter schlecht war, spielten sie weiter",
    "Während er arbeitete, hörte er Musik"
]

data = []

# generate easy
for _ in range(40):
    for w in easy_words:
        data.append([w, "easy"])

# generate medium
for _ in range(25):
    for s in medium_sentences:
        data.append([s, "medium"])

# generate hard
for _ in range(20):
    for s in hard_sentences:
        data.append([s, "hard"])

df = pd.DataFrame(data, columns=["text", "difficulty"])
df.to_csv("difficulty_dataset.csv", index=False)

print(f"✅ Dataset generated with {len(df)} samples")
