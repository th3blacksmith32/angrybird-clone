export default class PhysicsValidator {
  static validateShot(shotReport) {
    const { initial, vector, pigsHit, boxesBroken } = shotReport;
    const predictedImpact = Math.abs(vector.x) + Math.abs(vector.y);
    const expectedDamage = predictedImpact * 10;
    const discrepancy = Math.abs(expectedDamage - (pigsHit * 100 + boxesBroken * 50));
    return discrepancy < 300;
  }
}
