package com.cafetinsmart.security;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
            .authorizeHttpRequests(auth -> auth
                .requestMatchers("/", "/menu", "/carrito/**").permitAll()
                .requestMatchers("/styles.css", "/main.js", "/images/**").permitAll()
                .requestMatchers("/pago", "/ticket").authenticated()
                .anyRequest().authenticated()
            )
            //La página de login personalizada es /login.
            //Si el login es correcto, manda al usuario a /menu.
            .formLogin(form -> form
                .loginPage("/login")
                .defaultSuccessUrl("/menu", true)
                .permitAll()
            )
            .logout(logout -> logout
                .logoutSuccessUrl("/")
                .permitAll()
            )
            // Deshabilitamos CSRF para la API del carrito (AJAX) para simplificar
            .csrf(csrf -> csrf.disable());
            
        return http.build();
    }

    //Este mismo PasswordEncoder lo usa UsuarioService para guardar contraseñas encriptadas.
    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
}
