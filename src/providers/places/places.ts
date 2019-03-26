import { Contacto } from './../../models/contacto';
import { File } from '@ionic-native/file';
import { Storage } from '@ionic/storage';
import { Injectable } from '@angular/core';

declare var cordova: any;

@Injectable()
export class ContactosProvider {
  private contactos: Contacto[] = [];
  index: number;

  constructor(
    private storage: Storage  ){

  }

  agregarContacto(
    nombre: string,
    apellido: string,
    urlImagen: string,
    ){
      const contacto = new Contacto();
      contacto.nombre = nombre;
      contacto.apellido = apellido;
      contacto.urlImagen = urlImagen;
      this.contactos.push(contacto);
      this.storage.set('contactos',this.contactos)
        .then()
        .catch((err)=>{
          this.contactos.splice(this.contactos.indexOf(contacto),1);
        })
    }

    cargarContactos(){
      return this.contactos.slice();
    }

    obtenerContactos(){
      return this.storage.get('contactos')
        .then((contactos: Contacto[])=>{
          this.contactos = contactos != null ? contactos : [];
          return this.contactos.slice();
        })
        .catch(err =>{
          console.log(err);
        })
    }

}
