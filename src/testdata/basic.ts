/**
 * Documentation for the Animal class.
 */
export class Animal {
  /**
   * The animal's name
   */
  public name: string = "Bob";
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
export class Mammal extends Animal implements WarmBlooded {
  /**
   * The type of hair the mammal has.
   */
  public hairType: string = "Short";
  public pumpBlood(): void {
    console.log("Pump blood.");
  }
  public generateHeat(): void {
    console.log("Warm up.");
  }
}

/**
 * Documentation for the Reptile class.
 */
export class Reptile extends Animal implements ColdBlooded {
  /**
   * The type of skin the reptile has.
   */
  public skinType: string = "Scales";
  public pumpBlood(): void {
    console.log("Pump blood.");
  }
  /**
   * @inheritDoc
   */
  public absorbHeat(): void {
    console.log("Absorb heat.");
  }
}

/**
 * Documentation for the Dog class.
 */
export class Dog extends Mammal {
  /**
   * The breed of the dog.
   */
  public breed: string = "Labrador Retriever";
  /**
   * Vocalize.
   */
  public bark() {
    console.log("Woof! Woof!");
  }
}

/**
 * Docmentation for the Crocodile class.
 * @noInheritDoc
 */
export class Crocodile extends Reptile {
  /**
   * Surprise unsuspecting prey.
   */
  public stealthAttack(): void {
    console.log("Stealth attack!");
  }
}

export interface Blooded {
  /**
   * Pump blood.
   */
  pumpBlood(): void;
}

export interface WarmBlooded extends Blooded {
  /**
   * Generate heat to keep body temperature up.
   */
  generateHeat(): void;
}

/**
 * @noInheritDoc
 */
export interface ColdBlooded extends Blooded {
  /**
   * Take in heat from the environment.
   */
  absorbHeat(): void;
}

/**
 * Docs for SubErrorA.
 * @noInheritDoc
 */
export class SubErrorA extends Error {
  /**
   * propA docs
   */
  public propA: string = "propA";
}

/**
 * Docs for SubErrorB.
 */
export class SubErrorB extends SubErrorA {
  /**
   * propB docs
   */
  public propB: string = "propB";
}

/**
 * Docs for SubErrorC.
 */
export class SubErrorC extends Error {
  /**
   * propC docs
   */
  public propC: string = "propC";
}
