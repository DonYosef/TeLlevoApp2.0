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

  public tipo: string = 'ok';

  form = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [
      Validators.required,
      Validators.minLength(6),
    ]),
  });

  uid: string = null;

  constructor(
      private firebaseSvc: FirebaseService,
      private utilSvc: UtilsService
  ) {}

  async ngOnInit() {

  }

  submit() {

    if (this.form.valid) {
      this.utilSvc.presentLoading({message: 'Autenticando...'});
      this.firebaseSvc.login(this.form.value as User).then(async res => {

        // this.uid = await this.firebaseSvc.getUid();
        // console.log('uid', this.uid);

        let user: User = {
          uid: res.user.uid,
          tipo: this.tipo,
          name: res.user.displayName,
          email: res.user.email
        }

        this.utilSvc.setElementLocalStorage('user', user);
        this.utilSvc.routerLink('/tabs/home');

        this.utilSvc.dismissLoading();

        this.utilSvc.presentToast({
          message: `Bienvenid@ ${user.name}!`,
          duration: 1500,
          color: 'success',
          icon: 'person-circle-outline'
        })
        this.form.reset();
      }, error => {
        this.utilSvc.dismissLoading();
        this.utilSvc.presentToast({
          message: error,
          duration: 2000,
          color: 'warning',
          icon: 'alert-circle-outline'
        })

      }
      );
    }
  }
}
