package fr.jbellion.shoppinglist;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableAsync;

@SpringBootApplication
@EnableAsync(proxyTargetClass = true)
public class ShoppingListApplication {

  public static void main(String[] args) {
    SpringApplication.run(ShoppingListApplication.class, args);
  }

}
