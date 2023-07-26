import { Directive, Input } from '@angular/core';
import { NgControl } from '@angular/forms';

@Directive({
  selector: '[disableFormControl]'
})
export class DisableFormControlDirective {

  @Input() set disableFormControl(condition: boolean) {
    const action = condition ? 'disable' : 'enable';
    setTimeout(() => {
      if (this.ngControl.control) {
        this.ngControl.control[action]();
      }
    });
  }

  constructor(private ngControl: NgControl) { }
}
