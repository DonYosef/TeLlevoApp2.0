import { Component, OnInit } from '@angular/core';
import { FirebaseService } from 'src/app/services/firebase.service';
import { UtilsService } from 'src/app/services/utils.service';
import { User } from 'src/app/models/user.model';
import { Viajes } from 'src/app/models/viajes.model';

@Component({
  selector: 'app-viajes',
  templateUrl: './viajes.page.html',
  styleUrls: ['./viajes.page.scss'],
})
export class ViajesPage implements OnInit {

  login: boolean;
  user = {} as User;

  viaje: Viajes = {
    origen: null,
    destino: null,
    capacidad: null,
    tarifa: null
  }

  constructor(
    private firebaseSvc: FirebaseService,
    private utilsSvc: UtilsService
  ) {
    this.firebaseSvc.getAuthState().subscribe(res => {
      if(res && res.uid){
        this.login = true;
        this.getDatosUser(res.uid);
      }
    })
  }

  ngOnInit() {

  }

  async crearViaje(){
    const path = 'viajes';
    const id = this.user.uid;
    await this.firebaseSvc.createDoc(this.viaje, path, id)


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
