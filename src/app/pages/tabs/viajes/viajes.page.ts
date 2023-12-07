import { Component, OnInit } from '@angular/core';
import { FirebaseService } from 'src/app/services/firebase.service';
import { UtilsService } from 'src/app/services/utils.service';
import { User } from 'src/app/models/user.model';
import { Viajes } from 'src/app/models/viajes.model';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-viajes',
  templateUrl: './viajes.page.html',
  styleUrls: ['./viajes.page.scss'],
})
export class ViajesPage implements OnInit {

  login: boolean;
  botonDesactivado: boolean = false;
  user = {} as User;
  viajes = {} as Viajes;

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

  constructor(
    private firebaseSvc: FirebaseService,
    private utilsSvc: UtilsService,
    private formBuilder: FormBuilder
  ) {
    this.firebaseSvc.getAuthState().subscribe(res => {
      if(res && res.uid){
        this.login = true;
        this.getDatosUser(res.uid);
      }
    })
  }

  formulario = new FormGroup({
    origen: new FormControl('', [
      Validators.required,
    ]),
    destino: new FormControl('', [
      Validators.required,
    ]),
    hora: new FormControl('', [
      Validators.required,
    ]),
    capacidad: new FormControl('', [
      Validators.required
    ]),
    tarifa: new FormControl('', [
      Validators.required
    ]),
  });

  ngOnInit() {
    console.log(this.formulario)
    this.getDatosViaje();
  }

async crearViaje() {
  if (this.user && this.user.uid) {

    this.viaje.id = this.user.uid;
    this.viaje.origen = this.formulario.value.origen;
    this.viaje.destino = this.formulario.value.destino;
    this.viaje.hora = this.formulario.value.hora;
    this.viaje.capacidad = parseInt(this.formulario.value.capacidad)
    this.viaje.tarifa = parseInt(this.formulario.value.tarifa)
    this.viaje.telefono = this.user.phoneNumber;

    const path = 'viajes';
    const id = this.user.uid;
    await this.firebaseSvc.createDoc(this.viaje, path, id);

    this.formulario.reset();

    this.utilsSvc.presentToast({
      message: 'Viaje creado correctamente',
      duration: 1000,
      color: 'success',
      icon: 'person-circle-outline'
    });
  } else {
    this.utilsSvc.presentToast({
      message: 'Debe llenar todos los campos',
      duration: 1000,
      color: 'danger',
      icon: 'person-circle-outline'
    });
  }
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

  viajesList: Viajes[] = [];


  getDatosViaje() {
    const path = 'viajes';
    this.firebaseSvc.getCollection<Viajes>(path).subscribe(res => {
      this.viajesList = res.map(viaje => {
        viaje.pasajeros = viaje.pasajeros || [];
        return viaje;
      });
    });
  }

  async reservarViaje(viaje: Viajes) {
    if (viaje.capacidad > 0) {
      if (viaje.pasajeros.indexOf(this.user.uid) === -1) {
        viaje.pasajeros.push(this.user.name + ' ' + this.user.phoneNumber);
        viaje.capacidad--;

        const path = `viajes/${viaje.id}`;
        await this.firebaseSvc.updateDoc(path, viaje);
        this.utilsSvc.presentToast({
          message: 'Viaje reservado correctamente',
          duration: 1000,
          color: 'success',
          icon: 'person-circle-outline'
        });
      } else {
        this.utilsSvc.presentToast({
          message: 'Viaje ya reservado',
          duration: 1000,
          color: 'warning',
          icon: 'person-circle-outline'
        });

      }
    } else {
      this.utilsSvc.presentToast({
        message: 'Viaje sin asientos disponibles',
        duration: 1000,
        color: 'warning',
        icon: 'person-circle-outline'
      });
    }
  }

}
