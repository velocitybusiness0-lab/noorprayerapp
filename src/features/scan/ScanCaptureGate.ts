/**
 * Ensures only one camera capture runs at a time so preview frames do not
 * stack up and flash white between detections.
 */
export class ScanCaptureGate {
  private inFlight = false;

  async run<T>(task: () => Promise<T>): Promise<T | null> {
    if (this.inFlight) return null;
    this.inFlight = true;
    try {
      return await task();
    } finally {
      this.inFlight = false;
    }
  }
}
