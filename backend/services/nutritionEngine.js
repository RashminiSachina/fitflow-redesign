/**
 * Mock nutrition recognition. Replace with ML Kit / TensorFlow Lite later.
 */

const FOODS = [
  { name: 'Grilled chicken rice bowl', calories: 520, confidence: 0.86 },
  { name: 'Greek yogurt with berries', calories: 210, confidence: 0.91 },
  { name: 'Avocado toast', calories: 340, confidence: 0.78 },
  { name: 'Banana and peanut butter', calories: 280, confidence: 0.88 },
  { name: 'Lentil soup', calories: 310, confidence: 0.82 },
  { name: 'Salmon and steamed broccoli', calories: 430, confidence: 0.84 },
  { name: 'Oatmeal with banana', calories: 290, confidence: 0.9 },
  { name: 'Turkey sandwich', calories: 380, confidence: 0.8 },
];

function recognize(_payload) {
  const food = FOODS[Math.floor(Math.random() * FOODS.length)];
  return {
    ...food,
    source: 'mock-recognizer',
    note: 'Demo result. A camera model can replace this service later.',
  };
}

module.exports = { recognize, FOODS };
