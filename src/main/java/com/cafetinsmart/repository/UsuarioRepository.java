package com.cafetinsmart.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.cafetinsmart.model.Usuario;

@Repository
public interface UsuarioRepository extends JpaRepository<Usuario, Long> {
    
    //Se usa para buscar al usuario cuando inicia sesión.
    Optional<Usuario> findByUsername(String username);
    
}
