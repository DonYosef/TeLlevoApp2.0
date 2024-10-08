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
      tipo: new FormControl('', [
        Validators.required,
      ]),
      name: new FormControl('', [
        Validators.required,
        Validators.minLength(3),
      ]),
      email: new FormControl('', [
        Validators.required,
        Validators.email,
      ]),
      phoneNumber: new FormControl('', [
        Validators.required
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

    async submit() {
      if (this.form.valid) {
        this.utilSvc.presentLoading({ message: 'Registrando...' });

        try {
          const res = await this.firebaseSvc.signUp(this.form.value as User);

          await this.firebaseSvc.updateUser({ displayName: this.form.value.name });

          let user: User = {
            uid: res.user.uid,
            tipo: this.form.value.tipo,
            name: this.form.value.name,
            email: this.form.value.email,
            phoneNumber: this.form.value.phoneNumber,
          };

          const path = 'users';
          const id = res.user.uid;
          await this.firebaseSvc.createDoc(user, path, id);

          this.utilSvc.routerLink('/tabs/home');
          this.utilSvc.dismissLoading();

          this.utilSvc.presentToast({
            message: `¡Registro exitoso!, bienvenid@ ${user.name}!`,
            duration: 1500,
            color: 'primary',
            icon: 'person-circle-outline',
          });

          this.form.reset();
        } catch (error) {
          console.error('Error al registrar:', error);
          this.utilSvc.dismissLoading();
          this.utilSvc.presentToast({
            duration: 1500,
            color: 'warning',
            icon: 'alert-circle-outline',
          });
        }
      }
    }
  }
