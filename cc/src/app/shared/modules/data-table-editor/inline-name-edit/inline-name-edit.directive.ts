import { Directive } from '@angular/core';
import { NG_VALIDATORS, Validator, AbstractControl } from '@angular/forms';

@Directive({
    selector: '[appName]',
    providers: [{provide: NG_VALIDATORS, useExisting: NameValidatorDirective, multi: true}]
})
export class NameValidatorDirective implements Validator {

    validate(control: AbstractControl): {[key: string]: any} {
        return (control.value || '').trim().length === 0 ? { name: true } : null;
    }
}
