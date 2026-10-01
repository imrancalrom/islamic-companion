/* Pure compass maths, kept free of native imports so it can be tested in Node. */

export type Vec = { x: number; y: number; z: number };

/**
 * Compass heading in degrees clockwise from MAGNETIC north, for a phone held in
 * portrait. Same maths as Android's SensorManager.getRotationMatrix + getOrientation,
 * so it is tilt-compensated. Returns null when the readings can't give a direction
 * (in free fall, or with the phone near a strong magnet).
 */
export function azimuth(acc: Vec, mag: Vec): number | null {
  // H = E × A points east; M = A × H points north (in the horizontal plane).
  let hx = mag.y * acc.z - mag.z * acc.y;
  let hy = mag.z * acc.x - mag.x * acc.z;
  let hz = mag.x * acc.y - mag.y * acc.x;
  const normH = Math.hypot(hx, hy, hz);
  const normA = Math.hypot(acc.x, acc.y, acc.z);
  if (normH < 0.1 || normA < 0.1) return null;
  hx /= normH;
  hy /= normH;
  hz /= normH;
  const ax = acc.x / normA;
  const az = acc.z / normA;
  const my = az * hx - ax * hz;
  const deg = (Math.atan2(hy, my) * 180) / Math.PI;
  return (deg + 360) % 360;
}

/** Magnetic declination (degrees east of true north) at a place, from the World Magnetic Model. */
export function declination(lat: number, lon: number, date = new Date()): number {
  try {
    // Loaded lazily: the model coefficients are only needed on this screen.
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const geomagnetism = require('geomagnetism');
    return geomagnetism.model(date, { allowOutOfBoundsModel: true }).point([lat, lon]).decl ?? 0;
  } catch {
    return 0;
  }
}
