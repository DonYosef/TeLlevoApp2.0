import { Component, OnInit } from '@angular/core';
import { User } from 'src/app/models/user.model';
import { FirebaseService } from 'src/app/services/firebase.service';
import { UtilsService } from 'src/app/services/utils.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit {


  user = {} as User;
  login: boolean = false;

  constructor(
    private firebaseSvc: FirebaseService,
    private utilsSvc: UtilsService
  ) {
    this.firebaseSvc.getAuthState().subscribe(res => {
      if(res && res.uid){
        this.login = true;
        this.getDatosUser(res.uid);

      } else {
        this.login = false;
      }
    })
   }

  ngOnInit() {
  }

  signOut() {

    this.utilsSvc.presentAlert({
      header: 'Cerrar sesión',
      message: '¿Quieres cerrar sesión',
      mode: 'ios',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
        }, {
          text: 'Sí, cerrar',
          handler: () => {
            this.firebaseSvc.signOut();
          }
        }
      ]
    })
  }

  getDatosUser(uid: string){
    const path = 'users';
    const id = uid;
    this.firebaseSvc.getDoc<User>(path, id).subscribe(res => {
      if(res){
        this.user = res;
      }
    });
  }

}
