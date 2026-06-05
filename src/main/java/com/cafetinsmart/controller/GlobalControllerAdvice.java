package com.cafetinsmart.controller;

import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ModelAttribute;
import com.cafetinsmart.service.CarritoService;
import lombok.RequiredArgsConstructor;

@ControllerAdvice
@RequiredArgsConstructor
public class GlobalControllerAdvice {

    private final CarritoService carritoService;

    // Esto hace que la variable 'cantidadCarrito' esté disponible en TODAS las vistas Thymeleaf automáticamente
    @ModelAttribute("cantidadCarrito")
    public int cantidadCarrito() {
        return carritoService.obtenerItems().stream()
                .mapToInt(item -> item.getCantidad())
                .sum();
    }
}
