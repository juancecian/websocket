import { Component, OnInit } from '@angular/core';
import { NativeStorage } from '@ionic-native/native-storage/ngx';
import * as Stomp from 'stompjs';
import * as SockJS from 'sockjs-client';
import { LocalNotifications } from '@ionic-native/local-notifications/ngx';
class Usuario {
  idUsuario?: number;
  nombreUsuario?: string;
  mensaje: string;
}

interface Message {
  idMessage: string;
  userSender: number;
  userRecieved: number;

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
  messages: string[] = [];
  message: Message;
  idUsuario: number;
  constructor(private localNotifications: LocalNotifications) {
    this.usuario = new Usuario();
    
    
  }
  ngOnInit(): void {
    this.connect();

  }
  
  connect() {
    let socket = new SockJS ('http://192.168.100.123:8080/gs-guide-websocket');
    this.stompClient = Stomp.over(socket);
    this.stompClient.connect({}, () => {
      this.setConnected(true);
      this.stompClient.subscribe('/topic/greetings', (greeting) => {
        this.usuario = greeting.body;
        //.log(JSON.parse(greeting.body).content);
        this.messages.push(JSON.parse(greeting.body));
        setTimeout(() => {
          this.localNotifications.schedule({
            id: 1,
            text: 'Notificacion de prueba',
            sound: 'file://sound.mp3',
            data: { text: 'Texto oculto' },
            led: '#DC2700',
          });
          
        }, 5000);
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

  registerUser() {
    let count = 1;
    this.usuario.idUsuario = count;
    localStorage.setItem('usuario', JSON.stringify(this.usuario));
    count++;

  }

  sendMessageAndNotification() {
    this.message.userSender = this.usuario.idUsuario;
    if (this.usuario.idUsuario == 1) {
      this.message.userRecieved = 2;
  }   else {
      this.message.userRecieved = 1;
    }
    this.stompClient.send("/app/hello", {}, JSON.stringify(this.message));
  }
}
