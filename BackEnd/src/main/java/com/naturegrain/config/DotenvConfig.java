package com.naturegrain.config;

import io.github.cdimascio.dotenv.Dotenv;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Profile;
import org.springframework.core.env.Environment;
import javax.annotation.PostConstruct;
import java.util.Arrays;

/**
 * Configuration class for loading environment variables from .env file
 * This ensures sensitive data like API keys and secrets don't need to be 
 * committed to source code.
 */
@Configuration
public class DotenvConfig {

    private final Environment springEnv;

    public DotenvConfig(Environment springEnv) {
        this.springEnv = springEnv;
    }

    @Bean
    @Profile("!test") // Don't load .env during tests
    public Dotenv dotenv() {
        return Dotenv.configure()
                .directory(".")  // Look for .env in the root directory
                .ignoreIfMissing() // Don't fail if .env is missing
                .load();
    }

    @PostConstruct
    public void logActiveProfiles() {
        System.out.println("Active Spring profiles: " + 
                Arrays.toString(springEnv.getActiveProfiles()));
        
        // Log that environment variables are being loaded
        System.out.println("Loading environment variables from .env file if present");
    }
}
