import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ApiFitechService } from '../services/api-fitech.service';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-bateriacalentamientohome',
  templateUrl: './bateriacalentamientohome.page.html',
  styleUrls: ['./bateriacalentamientohome.page.scss'],
})
export class BateriacalentamientohomePage  {

  @ViewChild('myVideo',{static:false}) txtVideo:ElementRef
  nombre:any
  dataRecibida:any
  tiempo:any
  tiemposegundo:any
  timeLeft: number = 30;
  mostrar:boolean = true
  numero:any
  final:any
  video
  private win: any = window;
  // URL:any
  path:any
  sonido = "../../../assets/sonido/reloj.mp3"
  sonido2 = "../../../assets/sonido/final.mp3"
  audio:any
  zero:any
  calentamiento:any

  constructor(private capturar:ActivatedRoute, private ApiService:ApiFitechService, private ruta:NavController) {

   }

   ionViewDidEnter(){
     
    this.dataRecibida = this.capturar.snapshot.paramMap.get('id')
    console.log("valor recibido del parametro", this.dataRecibida)

    //cantidad de ejericio faltante
    this.numero = parseInt(this.dataRecibida) + 1

    //comprobar longitud de la serie de ejercicio
    this.calentamiento = this.ApiService.calentamiento
    this.final = this.calentamiento.length
    console.log(this.calentamiento);

    
    //pasar a mostrar los datos
    this.nombre = this.calentamiento[this.dataRecibida]
    console.log(this.nombre);
    // console.log(this.nombre)

    // los videos
    this.video = `http://fittech247.com/fittech/videos/${this.nombre.cod}/${this.nombre.url}`
    console.log(this.video)
    this.timeLeft = 30;
    var b = setInterval(()=>{
          console.log(this.txtVideo.nativeElement.readyState)
      if(this.txtVideo.nativeElement.readyState === 4){
          console.log(this.txtVideo.nativeElement.readyState)
          //This block of code is triggered when the video is loaded

          //your code goes here
          this.txtVideo.nativeElement.play()
          //cronometro
          this.startTimer()
          //stop checking every half second
          clearInterval(b);

      }    

      },500);
   }

 /*  async ngOnInit() {

 
    this.dataRecibida = this.capturar.snapshot.paramMap.get('id')
    console.log("valor recibido del parametro", this.dataRecibida)

    //cantidad de ejericio faltante
    this.numero = parseInt(this.dataRecibida) + 1

    //comprobar longitud de la serie de ejercicio
    this.calentamiento = this.ApiService.calentamiento
    this.final = this.calentamiento.length
    console.log(this.calentamiento);

    
    //pasar a mostrar los datos
    this.nombre = this.calentamiento[this.dataRecibida]
    console.log(this.nombre);
    // console.log(this.nombre)

    // los videos
    this.video = `http://fittech247.com/fittech/videos/${this.nombre.cod}/${this.nombre.url}`
    console.log(this.video)

    var b = setInterval(()=>{
          console.log(this.txtVideo.nativeElement.readyState)
      if(this.txtVideo.nativeElement.readyState === 4){
          console.log(this.txtVideo.nativeElement.readyState)
          //This block of code is triggered when the video is loaded

          //your code goes here
          this.txtVideo.nativeElement.play()
          //cronometro
          this.startTimer()
          //stop checking every half second
          clearInterval(b);

      }    

      },500);


  } */




  //SE OBTIENE LA DURACION DEL VIDEO
  onMetadata(e, video) {
    console.log('metadata: ', e);
    console.log('cargado: ', e.target.readyState);


    // this.timeLeft = parseInt(e.target.duration)
    //tiempo del ejercicio
    //this.timeLeft =  30
    // this.timeLeft = this.ApiService.ratio
  }

  // SE LANZA ALA PANTALLA CORRESPONDIENTE 
  redirigir(){
    console.log(this.numero, "/" , this.final)
    if(this.numero == this.final){
      this.tiempo = setTimeout(()=>{
        clearInterval(this.tiemposegundo)
        this.pauseSonido()
        this.ruta.navigateRoot(["/bateriacalentamientofinalizar"])
      }, 1000)
    }else{
      clearInterval(this.tiemposegundo) 
      this.pauseSonido()
      this.ruta.navigateForward([`/bateriacalentamientoesperahome/${this.dataRecibida}`])
    }

  }
  
  //CONOMETRO
  startTimer() {
    this.tiemposegundo = setInterval(() => {

      if(this.timeLeft <= 10){
        console.log("activate")
        this.zero = 0
      } 

      if(this.timeLeft >= 1 && this.timeLeft < 10) {
          this.playSonido()
      }

      // if(this.timeLeft === 1) {
      //     this.playSonidoFinal()
      // }


       if(this.timeLeft > 0) {
         this.timeLeft--;
       } else {
         
         this.timeLeft = 0;
         this.redirigir()
         this.txtVideo.nativeElement.pause()
       }
     },1000)
   }
   
  pauseTimer() {
    clearInterval(this.tiemposegundo);
    this.mostrar = false
    this.txtVideo.nativeElement.pause()
  }

  playTimer(){
    this.startTimer()
    this.mostrar = true
    this.txtVideo.nativeElement.play()
  }

  playSonido(){
  this.audio = new Audio();
  this.audio.src = this.sonido;
  this.audio.load();
  this.audio.play();
  }

  // playSonidoFinal(){
  // this.audio = new Audio();
  // this.audio.src = this.sonido2;
  // this.audio.load();
  // this.audio.play();
  // }
  
  pauseSonido(){
    if(this.audio)
   this.audio.pause()
  }

  atras(){
        this.ruta.pop();
  }

  ionViewDidLeave(){
    clearInterval(this.tiemposegundo)
    if(this.audio){
      this.audio.pause();
    }
  }

}
