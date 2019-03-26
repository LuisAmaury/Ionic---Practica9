import { ContactosProvider } from './../../providers/places/places';
import { Component } from '@angular/core';
import { Camera } from '@ionic-native/camera';
import { File, Entry, FileError } from '@ionic-native/file';
import { NgForm } from '@angular/forms';
import { ToastController } from 'ionic-angular';

declare var cordova: any;

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  imageUrl: string = '';

  constructor(
    private camera: Camera,
    private file:File,
    private contactoProv: ContactosProvider,
    private toastCtrl:ToastController) {
  }

  onSubmit(form: NgForm){
    this.contactoProv.agregarContacto(form.value.nombre, form.value.apellido,
      this.imageUrl);
    form.reset();
    this.imageUrl = '';
  }

  onTakePhoto(){
    this.camera.getPicture({
      encodingType: this.camera.EncodingType.JPEG,
      correctOrientation: true
    })
    .then(
      imageData =>{
        // this.webview.convertFileSrc(imageData);
        const currentName = imageData.replace(/^.*[\\\/]/, '');
        const path = imageData.replace(/[^\/]*$/, '');
        const newFileName = Date.now() + '.jpg';
        this.file.moveFile(path, currentName,
          cordova.file.dataDirectory, newFileName)
        .then(
          (data: Entry) =>{
            const win: any = window;
            this.imageUrl = win.Ionic.WebView.convertFileSrc(data.nativeURL);

            // this.camera.cleanup();
            this.file.removeFile(path,currentName);
          }
        )
        .catch(
          (err: FileError)=>{
            console.log(err);

            this.imageUrl = '';
            const toast = this.toastCtrl.create({
              message: 'Could not save image :(',
              duration: 2500
            });
            toast.present();
            this.camera.cleanup();
          });

        this.imageUrl = this.imageUrl;

      }
    )
    .catch(
      err =>{
        console.log(err);

        const toast = this.toastCtrl.create({
          message: 'No se guardo la imagen :(',
          duration: 2500
        });
        toast.present();
      }
    );
  }

}
