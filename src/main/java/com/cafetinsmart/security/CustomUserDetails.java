package com.cafetinsmart.security;

import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.User;
import java.util.Collection;

public class CustomUserDetails extends User {

    private final String nombre;
    private final String apellidos;

    public CustomUserDetails(String username, String password, Collection<? extends GrantedAuthority> authorities, String nombre, String apellidos) {
        super(username, password, authorities);
        this.nombre = nombre;
        this.apellidos = apellidos;
    }

    public String getNombre() {
        return nombre != null ? nombre : "Usuario";
    }

    public String getApellidos() {
        return apellidos != null ? apellidos : "";
    }
}
