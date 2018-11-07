/**
 * Documentation for the Animal class.
 */
class Animal {
  /**
   * The animal's name
   */
  public name: string;
  /**
   * Documentation for move() method.
   */
  public move(distanceInMeters: number = 0) {
    console.log(`Animal moved ${distanceInMeters}m.`);
  }
}

/**
 * Documentation for the Mammal class.
 */
class Mammal extends Animal {
  /**
   * The type of hair the mammal has.
   */
  public hairType: string;
}

/**
 * Documentation for the Dog class.
 * @noInheritDoc
 */
class Dog extends Mammal {
  /**
   * The breed of the dog.
   */
  public breed: string;
  /**
   * Documentation for bark() method.
   */
  public bark() {
    console.log('Woof! Woof!');
  }
}