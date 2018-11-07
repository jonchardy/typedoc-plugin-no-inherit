class Animal {
  /**
   * Documentation for move() method.
   */
  public move(distanceInMeters: number = 0) {
    console.log(`Animal moved ${distanceInMeters}m.`);
  }
}

/**
 * Documentation for the Dog class. Shouldn't include docs for move().
 * @noInheritDoc
 */
class Dog extends Animal {
  /**
   * Documentation for bark() method.
   */
  public bark() {
    console.log('Woof! Woof!');
  }
}