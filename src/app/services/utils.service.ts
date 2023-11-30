import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController, AlertOptions, LoadingController, LoadingOptions, ToastController, ToastOptions } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class UtilsService {

  constructor(
    private loadingController: LoadingController,
    private router: Router,
    private toastController: ToastController,
    private alertController: AlertController
  ) { }

    //=======PROCESO LOADING=======
    //Inicializar el loading
    async presentLoading(opts: LoadingOptions) {
      const loading = await this.loadingController.create(opts);
      await loading.present();
    }
    //dissmiss loading
    async dismissLoading(){
      return await this.loadingController.dismiss();
    }

    //=======PROCESO LOCALSTORAGE=======
    //set
    setElementLocalStorage(key: string, element: any){
      return localStorage.setItem(key, JSON.stringify(element));
    }
    //get
    getElementLocalStorage(key: string){
      return JSON.parse(localStorage.getItem(key));
    }

    //=======Router=======
    routerLink(url: string){
      this.router.navigate([url]);
    }

    //=======Toast=======
    async presentToast(opts: ToastOptions) {
      const toast = await this.toastController.create(opts);
      toast.present();
    }

    //=======Alerta para cerrar sesion=======
    async presentAlert(opts: AlertOptions) {
      const alert = await this.alertController.create(opts);

      await alert.present();
    }
}
