import { FaceLandmarker, FilesetResolver } from '@mediapipe/tasks-vision';

export class FaceDetectionService {
  private faceLandmarker: any = null;
  private initialized = false;

  async initialize() {
    if (this.initialized) return;

    try {
      const vision = await FilesetResolver.forVisionTasks(
        'https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.3/wasm'
      );

      this.faceLandmarker = await FaceLandmarker.createFromOptions(vision, {
        baseOptions: {
          modelAssetPath: 'https://storage.googleapis.com/mediapipe-models/face_landmarker/face_landmarker/float16/1/face_landmarker.task',
          delegate: 'CPU'
        },
        runningMode: 'IMAGE',
        numFaces: 1,
        minFaceDetectionConfidence: 0.5,
      });

      this.initialized = true;
      console.log('✅ MediaPipe initialisé');
    } catch (error) {
      console.error('❌ Erreur:', error);
    }
  }

  async detectFace(imageData: any) {
    if (!this.initialized) await this.initialize();
    if (!this.faceLandmarker) return null;

    try {
      const result = this.faceLandmarker.detect(imageData);
      if (result?.faceLandmarks?.length > 0) {
        return { landmarks: result.faceLandmarks[0], confidence: 0.95 };
      }
      return null;
    } catch (error) {
      return null;
    }
  }

  isFaceValid(landmarks: any): boolean {
    return landmarks && landmarks.length > 0;
  }

  close() {
    if (this.faceLandmarker) {
      this.faceLandmarker.close();
      this.initialized = false;
    }
  }
}

export const faceDetection = new FaceDetectionService();