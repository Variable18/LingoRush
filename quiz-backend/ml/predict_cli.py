import sys
import joblib

# Load model + vectorizer
model = joblib.load("ml/difficulty_model.pkl")
vectorizer = joblib.load("ml/vectorizer.pkl")

# Read input text from CLI
text = sys.argv[1] if len(sys.argv) > 1 else ""

# Predict difficulty
X = vectorizer.transform([text])
prediction = model.predict(X)[0]

print(prediction)
