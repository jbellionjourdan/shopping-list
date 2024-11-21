package fr.jbellion.shoppinglist.exception;

import lombok.NoArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(code = HttpStatus.NOT_FOUND)
@NoArgsConstructor
public class SPLNotFoundException extends RuntimeException{

    public SPLNotFoundException(String message){
        super(message);
    }
}
