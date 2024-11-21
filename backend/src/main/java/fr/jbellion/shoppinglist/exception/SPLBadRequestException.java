package fr.jbellion.shoppinglist.exception;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(code = HttpStatus.BAD_REQUEST)
public class SPLBadRequestException extends RuntimeException{

	public SPLBadRequestException(String message) {
		super(message);
	}
}
