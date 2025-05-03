package com.naturegrain;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.domain.EntityScan;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;

@SpringBootApplication
@ComponentScan(basePackages = "com.naturegrain")
@EntityScan(basePackages = "com.naturegrain.entity") 
@EnableJpaRepositories(basePackages = "com.naturegrain.repository")
public class NatureGrainApplication {

	public static void main(String[] args) {
		SpringApplication.run(NatureGrainApplication.class, args);
	}

}
