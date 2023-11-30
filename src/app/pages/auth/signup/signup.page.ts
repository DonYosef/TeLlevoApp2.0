import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { User } from 'src/app/models/user.model';
import { FirebaseService } from 'src/app/services/firebase.service';
import { UtilsService } from 'src/app/services/utils.service';
import { CustomValidators } from 'src/app/utils/custom-validators';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.page.html',
  styleUrls: ['./signup.page.scss'],
})
export class SignupPage implements OnInit {


    form = new FormGroup({
      name: new FormControl('', [
        Validators.required,
        Validators.minLength(3),
      ]),
      email: new FormControl('', [
        Validators.required,
        Validators.email,
      ]),
      password: new FormControl('', [
        Validators.required
      ]),
      confirmPassword: new FormControl(''),
    });
    constructor(
      private firebaseSvc: FirebaseService,
      private utilSvc: UtilsService
    ) {}

    ngOnInit() {
      this.confirmPasswordValidator();
    }

    confirmPasswordValidator() {
      this.form.controls.confirmPassword.setValidators([
        Validators.required,
        CustomValidators.matchValues(this.form.controls.password)
      ])

      this.form.controls.confirmPassword.updateValueAndValidity();
    }

    submit() {
      if (this.form.valid) {
        console.log(this.form.value);
        this.utilSvc.presentLoading({message: 'Registrando...'});
        this.firebaseSvc.signUp(this.form.value as User).then(async res => {
          console.log(res);
          await this.firebaseSvc.updateUser({displayName: this.form.value.name});

          let user: User = {
            uid: res.user.uid,
            name: res.user.displayName,
            email: res.user.email
          }

          this.utilSvc.setElementLocalStorage('user', user);
          this.utilSvc.routerLink('/tabs/home');

          this.utilSvc.dismissLoading();

          this.utilSvc.presentToast({
            message: `¡Registro exitoso!, bienvenid@ ${user.name}!`,
            duration: 3000,
            color: 'primary',
            icon: 'person-circle-outline'
          })
          this.form.reset();
        }, error => {
          this.utilSvc.dismissLoading();
          this.utilSvc.presentToast({
            message: error,
            duration: 3000,
            color: 'warning',
            icon: 'alert-circle-outline'
          })

        }
        );
      }
    }
  }
