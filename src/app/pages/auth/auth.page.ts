import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { User } from 'src/app/models/user.model';
import { FirebaseService } from 'src/app/services/firebase.service';
import { UtilsService } from 'src/app/services/utils.service';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.page.html',
  styleUrls: ['./auth.page.scss'],
})
export class AuthPage implements OnInit {
  form = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [
      Validators.required,
      Validators.minLength(6),
    ]),
  });
  constructor(
          private firebaseSvc: FirebaseService,
      private utilSvc: UtilsService
  ) {}

  ngOnInit() {}

  submit() {
    if (this.form.valid) {
      console.log(this.form.value);
      this.utilSvc.presentLoading({message: 'Autenticando...'});
      this.firebaseSvc.login(this.form.value as User).then(async res => {
        console.log(res);

        let user: User = {
          uid: res.user.uid,
          name: res.user.displayName,
          email: res.user.email
        }

        this.utilSvc.setElementLocalStorage('user', user);
        this.utilSvc.routerLink('/tabs/home');

        this.utilSvc.dismissLoading();

        this.utilSvc.presentToast({
          message: `Bienvenid@ ${user.name}!`,
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
