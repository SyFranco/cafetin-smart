package com.cafetinsmart.service;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.cafetinsmart.model.Usuario;
import com.cafetinsmart.repository.UsuarioRepository;

import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class UsuarioService {

    private final UsuarioRepository usuarioRepository;
    private final PasswordEncoder passwordEncoder;

    @PostConstruct
    public void inicializarUsuarios() {
        if (usuarioRepository.count() == 0) {
            Usuario admin = new Usuario();
            admin.setUsername("admin@cafetin.com");
            admin.setPassword(passwordEncoder.encode("12345"));
            admin.setRol("ROLE_ADMIN");
            admin.setNombre("Administrador");
            admin.setApellidos("Cafetin Smart");
            admin.setEdad(35);
            admin.setCarrera("Administración de Empresas");
            
            Usuario user = new Usuario();
            user.setUsername("n00345408@upn.pe");
            user.setPassword(passwordEncoder.encode("12345"));
            user.setRol("ROLE_USER");
            user.setNombre("Alonso");
            user.setApellidos("Villafan");
            user.setEdad(29);
            user.setCarrera("Ingeniería de Sistemas");
            
            usuarioRepository.save(admin);
            usuarioRepository.save(user);
        }
    }
}
