/**
 * Documentation for the Animal class.
 */
class Animal {
  /**
   * The animal's name
   */
  public name: string;
  /**
   * Move some distance.
   */
  public move(distanceInMeters: number = 0) {
    console.log(`Animal moved ${distanceInMeters}m.`);
  }
}

/**
 * Documentation for the Mammal class.
 * @noInheritDoc
 */
class Mammal extends Animal implements WarmBlooded {
  /**
   * The type of hair the mammal has.
   */
  public hairType: string;

  public generateHeat(): void {
    console.log('Warm up.');
  }
}

/**
 * Documentation for the Reptile class.
 */
class Reptile extends Animal implements ColdBlooded {
  /**
   * Lay an egg.
   */
  public absorbHeat(): void {
    console.log('Absorb heat.');
  }
}

/**
 * Documentation for the Dog class.
 */
class Dog extends Mammal {
  /**
   * The breed of the dog.
   */
  public breed: string;
  /**
   * Vocalize.
   */
  public bark() {
    console.log('Woof! Woof!');
  }
}

/**
 * Docmentation for the Crocodile class.
 * @noInheritDoc
 */
class Crocodile extends Reptile {
  /**
   * Surprise unsuspecting prey.
   */
  public stealthAttack(): void {
    console.log('Stealth attack!');
  }
}

interface WarmBlooded {
  /**
   * Generate heat to keep body temperature up.
   */
  generateHeat(): void;
}

interface ColdBlooded {
  /**
   * Take in heat from the environment.
   */
  absorbHeat(): void;
}