"""Conteúdo verbal da marca (fonte única para manual, Behance e peças)."""

TAGLINE = "BEYOND THE ORDINARY."
STUDIO = "Studio Matteu"
PROJECT = "VÉRTICE — Brand Identity & Launch Campaign"
NOTE = "Conceptual, self-initiated branding project by Studio Matteu. VÉRTICE is a fictional brand."

ESSENCE = "The point where everything converges."
ESSENCE_LONG = ("A vertex is the highest point of a form — the exact place where two lines meet and a direction is decided. "
                "VÉRTICE is built on that idea: the meeting point between curation and culture, between the object and the person who wears it.")
MISSION = "To select sneakers that deserve to be seen as objects of design, culture and identity."
VISION = "To be the reference point for those who treat what they wear as a point of view."
POSITIONING = ("VÉRTICE is a premium sneaker boutique built on curation. Not a stockroom, but a gallery of choices: "
               "a short, deliberate selection of pairs presented with the care of a fashion house.")

MANIFESTO = [
    "We don't sell everything.",
    "We choose.",
    "Every pair here was chosen with intention —",
    "for its design, its material, its story.",
    "Because a sneaker is never just a product.",
    "It is a signature. A memory. A point of view.",
    "This is where culture meets craft.",
    "This is VÉRTICE.",
]

PERSONALITY = [
    ("Precise", "Every detail is considered. Nothing is accidental."),
    ("Discreet", "Luxury that whispers. Confidence without noise."),
    ("Cultured", "Fluent in design, fashion and sneaker history."),
    ("Intentional", "Fewer pairs, better reasons."),
]
IS_NOT = [("Exclusive", "not elitist"), ("Cultured", "not hype-driven"), ("Minimal", "not cold"), ("Confident", "not loud")]

AUDIENCE = ("Design-literate people, 25 to 45, who see sneakers as part of a personal language: collectors, creatives and "
            "fashion-minded professionals who value authenticity, edition, material and story over volume.")

PILLARS = [
    ("01", "Curation", "Selected with intention."),
    ("02", "Authenticity", "Every pair inspected before it reaches the shelf."),
    ("03", "Culture", "The story behind the silhouette matters."),
    ("04", "Experience", "From the first glance to the last fold of tissue."),
]

VOICE = ["Short. Declarative. Uppercase for statements, sentence case for stories.",
         "Speak like a curator, not a salesperson.",
         "Never shout. Never use urgency tactics.",
         "Let the product and the silence around it do the work."]

LINES = ["BEYOND THE ORDINARY.", "SELECTED WITH INTENTION.", "CULTURE IN EVERY STEP.", "A DIFFERENT POINT OF VIEW."]

COLLECTIONS = [
    {"key": "ESSENTIAL", "code": "ESS", "n": "01", "photo": "01_essential_hero", "detail": "02_essential_detail",
     "line": "The quiet foundation.", "desc": "Minimal silhouettes, premium leather, neutral tones and timeless design.",
     "attrs": ["Premium leather", "Neutral tones", "Timeless"], "blades": 1, "tone": "ivory"},
    {"key": "URBAN", "code": "URB", "n": "02", "photo": "03_urban_hero", "detail": "04_urban_campaign",
     "line": "Character in the shadows.", "desc": "Urban silhouettes, technical materials, dark tones and a strong personality.",
     "attrs": ["Technical materials", "Dark tones", "Strong character"], "blades": 2, "tone": "obsidian"},
    {"key": "ARCHIVE", "code": "ARC", "n": "03", "photo": "05_archive_hero", "detail": "06_archive_detail",
     "line": "Memory, reworked.", "desc": "Retro references, suede, earthy tones and a classic aesthetic.",
     "attrs": ["Suede", "Earth tones", "Retro reference"], "blades": 3, "tone": "concrete"},
    {"key": "LIMITED", "code": "LTD", "n": "04", "photo": "07_limited_hero", "detail": "08_limited_gallery",
     "line": "The highest point.", "desc": "Special pieces, unusual silhouettes and exclusive releases.",
     "attrs": ["Special editions", "Sculptural silhouettes", "Numbered"], "blades": 0, "tone": "champagne"},
]

# numeração de produto: VRT · <coleção> · <temporada> · <nº do par>/<tiragem>
def product_code(code, season="FW26", n=14):
    return f"VRT·{code}·{season}·{n:03d}"
