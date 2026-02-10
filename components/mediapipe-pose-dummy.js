
export class Pose {
  constructor() {
    console.warn("Dummy Pose loaded via alias. @mediapipe/pose features are disabled.");
  }
  close() { return Promise.resolve(); }
  onResults() {}
  initialize() { return Promise.resolve(); }
  send() { return Promise.resolve(); }
  setOptions() {}
  reset() {}
}
