import { Component, OnInit } from '@angular/core';
import { NativeStorage } from '@ionic-native/native-storage/ngx';
import * as Stomp from 'stompjs';
import * as SockJS from 'sockjs-client';

class Usuario {
  idUsuario?: number;
  nombreUsuario?: string;
  mensaje: string;
}

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {
  
  stompClient: any;
  usuario: Usuario;
  mensaje: string;
  cosa: string[] = [];
  constructor(private nativeStorage: NativeStorage) {
    this.usuario = new Usuario();
    
    this.usuario.idUsuario = 1;
    this.usuario.nombreUsuario = "Juan";
    this.usuario.mensaje = "Hola";
    
    localStorage.setItem('usuario', JSON.stringify(this.usuario));
    
    this.connect();
  }
  ngOnInit(): void {
    setTimeout(() => {
      this.sendName();
    }, 5000);
 
  }
  
  connect() {
    let socket = new SockJS ('http://localhost:8080/gs-guide-websocket');
    this.stompClient = Stomp.over(socket);
    this.stompClient.connect({}, () => {
      this.setConnected(true);
      this.stompClient.subscribe('/topic/greetings', (greeting) => {
        console.log(JSON.parse(greeting.body).content);
        this.cosa.push(JSON.parse(greeting.body).content);
      });
    });

  }

  setConnected(isConnected: boolean) {
    if (isConnected) {
      console.log("Conectado");
    } else {
      console.log("Desconectado");
    }
  }

  sendName() {
    let usuario = localStorage.getItem('usuario');

    this.stompClient.send("/app/hello", {}, JSON.stringify(this.usuario));
  }
}
