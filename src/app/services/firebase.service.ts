import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { User } from './../models/user.model';
import { getAuth, updateProfile } from 'firebase/auth';
import { UtilsService } from './utils.service';
import { Observable, map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FirebaseService {

  constructor(
    private auth: AngularFireAuth,
    private db: AngularFirestore,
    private utilsSvc: UtilsService
  ) { }

  //===========AUTH================

  // async getUid(){
  //   const user = await this.auth.currentUser;
  //   return user.uid;
  // }

  createDoc(data: any, path: string, id: string){
    const collection = this.db.collection(path);
    return collection.doc(id).set(data);
  }

  getUserInfo(uid: string) {
    return this.db.collection('users').doc(uid).valueChanges() as Observable<User>;
  }

  login(user: User){
    return this.auth.signInWithEmailAndPassword(user.email, user.password);
  }

  signUp(user: User){
    return this.auth.createUserWithEmailAndPassword(user.email, user.password);
  }

  updateUser(user: any){
    const auth = getAuth();
    return updateProfile(auth.currentUser, user);
  }

  getAuthState(){
    return this.auth.authState;
  }

  getDoc<tipo>(path: string, id: string){
    return this.db.collection(path).doc<tipo>(id).valueChanges();
  }

  // getDocViaje<tipo>(path: string){
  //   return this.db.collection(path).valueChanges();
  // }

  getCollection<tipo>(path: string): Observable<tipo[]> {
    return this.db.collection<tipo>(path).snapshotChanges().pipe(
      map(actions => {
        return actions.map(a => {
          const data = a.payload.doc.data() as tipo;
          const id = a.payload.doc.id;
          return { id, ...data } as tipo;
        });
      })
    );
  }

  getDocViaje<tipo>(path: string): Observable<tipo[]> {
    return this.getCollection<tipo>(path);
  }

  async signOut(){
    await this.auth.signOut();
    this.utilsSvc.routerLink('/auth')
    localStorage.removeItem('user');
  }

  updateDoc<tipo>(path: string, data: tipo): Promise<void> {
    const docRef = this.db.doc<tipo>(path);
    return docRef.update(data);
  }


}
