export class DeviceUtil {

  public static generateDeviceIdentifier() {
    // Generate a random string
    function generateRandomString() {
      return Math.random().toString(36).substring(2, 10);
    }

    // Get device information
    const userAgent = navigator.userAgent;
    const screenWidth = window.screen.width;
    const screenHeight = window.screen.height;
    const devicePixelRatio = window.devicePixelRatio;

    // Generate the device identifier string
    const baseUid = `${userAgent}-${screenWidth}-${screenHeight}-${devicePixelRatio}-${generateRandomString()}`;
    return this.base64Encode(baseUid);
  }

  static base64Encode(str: string): string {
    const encodedStr = encodeURIComponent(str);
    return btoa(encodedStr);
  }
}
