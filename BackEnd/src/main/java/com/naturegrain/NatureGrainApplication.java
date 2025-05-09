package com.naturegrain;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.domain.EntityScan;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;

@SpringBootApplication
@EntityScan(basePackages = "com.naturegrain.entity")
@EnableJpaRepositories(basePackages = "com.naturegrain.repository")
public class NatureGrainApplication {

	public static void main(String[] args) {
		SpringApplication.run(NatureGrainApplication.class, args);
	}

}
