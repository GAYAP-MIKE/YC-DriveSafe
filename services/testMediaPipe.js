const vision = require('@mediapipe/tasks-vision');

console.log('🔍 Test MediaPipe...');
console.log('✅ MediaPipe chargé :', !!vision);
console.log('✅ Version :', vision.VERSION || 'inconnue');