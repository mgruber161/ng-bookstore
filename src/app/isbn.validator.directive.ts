import { Directive } from '@angular/core';
import { AbstractControl, ValidationErrors, Validator, NG_VALIDATORS } from '@angular/forms';

@Directive({
  selector: '[isbn-Validator]',
  providers: [{provide:NG_VALIDATORS, useExisting: IsbnValidatorDirective, multi:true}]
})
export class IsbnValidatorDirective implements Validator {

  constructor() { }
  validate(control: AbstractControl<any, any>): ValidationErrors | null {
    if(control.value.length!=10) return {error:"length has to be 10 characters."};
    const validationError = this.getIsbnValidationErrer(control.value);

    

    return null;
  }
  getIsbnValidationErrer(value: any) {
    throw new Error('Method not implemented.');
  }
  registerOnValidatorChange(isbn:string): string {
    let weight = 10  // Startgewicht
    let sum = 0
    for (let index = 0; index < 10; index++) {
      let ch = isbn[index]
      let number = 0
      if (ch >= '0' || ch <= '9') {
        number = Number(ch)
      }
      else  // keine Ziffer  => x oder X an letzter Stelle
      {
        if (index != 9) {
          return 'Nur Ziffern und x an letzter Stelle erlaubt'
        }
        if (ch == 'x' || ch == 'X') {
          number = 10
        }
        else {
          return 'Nur x an letzter Stelle erlaubt'
        }
      }
      // zahl enthält gültigen Wert
      sum += number * weight
      weight--
    }
    if (sum % 11 != 0) {
      return `isbn checksum is ${sum % 11} (should be 0!")`
    }
    return '';
  }

}
