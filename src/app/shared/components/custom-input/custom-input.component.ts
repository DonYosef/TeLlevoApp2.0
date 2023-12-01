import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-custom-input',
  templateUrl: './custom-input.component.html',
  styleUrls: ['./custom-input.component.scss'],
})
export class CustomInputComponent  implements OnInit {

  @Input() control: FormControl;
  @Input() label: string;
  @Input() icon: string;
  @Input() type : string;
  @Input() autocomplete: string;
  @Input() radioOptions: string[];

  isPassword: boolean;
  isRadio: boolean;
  hide: boolean = true;

  constructor() { }

  ngOnInit() {
    if(this.type === 'password'){
      this.isPassword = true;
    }
    if(this.type === 'radio'){
      this.isRadio = true;
    }
  }

  showEyePassword(){
    this.hide = !this.hide;

    if(this.hide){
      this.type = 'password';
    }else{
      this.type = 'text';
    }
  }

  radioChanged(event: CustomEvent) {
    const selectedValue = event.detail.value;
    this.control.setValue(selectedValue);
  }
}
