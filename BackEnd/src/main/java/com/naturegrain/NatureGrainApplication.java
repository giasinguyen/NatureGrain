package com.naturegrain;

import io.github.cdimascio.dotenv.Dotenv;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.domain.EntityScan;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;

@SpringBootApplication
@EntityScan(basePackages = "com.naturegrain.entity")
@EnableJpaRepositories(basePackages = "com.naturegrain.repository")
public class NatureGrainApplication {

	static {
		// Load environment variables from .env file before Spring context is initialized
		Dotenv dotenv = Dotenv.configure()
				.directory(".")
				.ignoreIfMissing()
				.load();

		// Set system properties for Spring to use
		System.setProperty("CLOUDINARY_CLOUD_NAME", 
				dotenv.get("CLOUDINARY_CLOUD_NAME", System.getProperty("CLOUDINARY_CLOUD_NAME", "")));
		System.setProperty("CLOUDINARY_API_KEY", 
				dotenv.get("CLOUDINARY_API_KEY", System.getProperty("CLOUDINARY_API_KEY", "")));
		System.setProperty("CLOUDINARY_API_SECRET", 
				dotenv.get("CLOUDINARY_API_SECRET", System.getProperty("CLOUDINARY_API_SECRET", "")));
		System.setProperty("CLOUDINARY_FOLDER", 
				dotenv.get("CLOUDINARY_FOLDER", System.getProperty("CLOUDINARY_FOLDER", "")));
		System.setProperty("JWT_SECRET", 
				dotenv.get("JWT_SECRET", System.getProperty("JWT_SECRET", "")));
	}

	public static void main(String[] args) {
		SpringApplication.run(NatureGrainApplication.class, args);
	}

}
