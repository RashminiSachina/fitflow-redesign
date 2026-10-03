# FitFlow AI Service

This folder is reserved for on-device and server-side intelligence.

The current HCI lab MVP does **not** run a real model. Workout recommendations and food recognition are rule-based mocks in:

- `backend/services/workoutEngine.js`
- `backend/services/nutritionEngine.js`
- `frontend/src/services/workoutEngine.js` (offline fallback)

## Planned plug-in points

| Folder | Purpose |
| --- | --- |
| `models/` | Exported TensorFlow Lite or similar model files |
| `workout-engine/` | Personalized plan selection using a real model |
| `nutrition-recognition/` | Camera-based food classification |
| `tensorflow-lite/` | Android/iOS TFLite wrappers |

Do not commit large binary models. Keep credentials and cloud API keys in environment files that are gitignored.
