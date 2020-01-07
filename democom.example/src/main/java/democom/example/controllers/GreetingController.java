package democom.example.controllers;

import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.util.HtmlUtils;

import democom.example.models.Greeting;
import democom.example.models.Message;

@RestController
@CrossOrigin(origins = "http://localhost:8100", methods= {RequestMethod.HEAD, RequestMethod.GET,RequestMethod.POST, RequestMethod.PUT, RequestMethod.PATCH, RequestMethod.OPTIONS})
public class GreetingController {

	
	@MessageMapping("/hello")
	@SendTo("/topic/greetings")
	public Greeting greeting(Message message) throws Exception {
		Thread.sleep(1000);
		Greeting gre = new Greeting();
		gre.setContent(message.getNombreUsuario());
		
		return new Greeting("Hello, " + gre.getContent());
	}
	
}
