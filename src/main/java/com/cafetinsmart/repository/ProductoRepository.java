package com.cafetinsmart.repository;

import java.util.List;

import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.cafetinsmart.model.Producto;

@Repository
public interface ProductoRepository extends JpaRepository<Producto, Long> {

    // Spring Data JPA crea la query "SELECT * FROM productos WHERE categoria = ?" automáticamente
    List<Producto> findByCategoriaIgnoreCase(String categoria, Sort sort);

}