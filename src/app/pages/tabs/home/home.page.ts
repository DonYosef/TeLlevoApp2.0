import { Component, OnInit } from '@angular/core';
import { FirebaseService } from 'src/app/services/firebase.service';
import { UtilsService } from 'src/app/services/utils.service';
import { User } from 'src/app/models/user.model';
import { Viajes } from 'src/app/models/viajes.model';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {

  viaje: Viajes = {
    id: null,
    origen: null,
    destino: null,
    hora: null,
    capacidad: null,
    tarifa: null,
    telefono: null,
    pasajeros: []
  }

  viajesList: Viajes[] = [];
  viajesListConductor: Viajes[] = [];

  login: boolean;
  user = {} as User;
  viajes = {} as Viajes;

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

  getDatosUser(uid: string){
    const path = 'users';
    const id = uid;
    this.firebaseSvc.getDoc<User>(path, id).subscribe(res => {
      if(res){
        this.user = res;
      }
    });
  }

  ngOnInit() {
    this.getDatosViaje();
  }

  getDatosViaje() {
    this.viaje.pasajeros = [];
    this.viajesList = [];
    const path = 'viajes';
    this.firebaseSvc.getCollection<Viajes>(path).subscribe(res => {
      this.viajesList = res.map(viaje => {
        viaje.pasajeros = viaje.pasajeros || [];
        return viaje;
      });

      // Filtrar viajes según el usuario
      if (this.user.tipo === 'Pasajero') {
        // Filtrar por pasajero
        this.viajesList = this.viajesList.filter(viaje => viaje.pasajeros.includes(this.user.uid));
      } else if (this.user.tipo === 'Conductor') {
        // Filtrar por conductor
        this.viajesList = this.viajesList.filter(viaje => viaje.id === this.user.uid);
      }
    });
  }

  shouldShowViaje(viaje: Viajes): boolean {
    if (this.user.tipo === 'Pasajero') {
      return viaje.pasajeros.includes(this.user.name +" "+ this.user.phoneNumber);
    } else if (this.user.tipo === 'Conductor') {
      return viaje.id === this.user.uid;
    }
    return false;
  }

}
