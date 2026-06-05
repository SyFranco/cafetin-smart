package com.cafetinsmart.controller;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import java.util.List;
import com.cafetinsmart.model.Producto;
import com.cafetinsmart.service.ProductoService;
import lombok.RequiredArgsConstructor;

@Controller
@RequiredArgsConstructor
public class ProductoController {

    private final ProductoService productoService;

    // Funcionalidad CORE 1 y 2: Listado dinámico y Filtrado (Ahora desde MySQL)
    @GetMapping("/menu")
    public String menu(@RequestParam(name = "categoria", required = false) String categoria, 
                       @RequestParam(name = "orden", required = false) String orden,
                       Model model) {
        
        List<Producto> productosFiltrados = productoService.obtenerPorCategoriaYOrden(categoria, orden);
        
        // Manejamos la clase 'active' en el HTML
        if (categoria != null && !categoria.isEmpty() && !categoria.equals("todos")) {
            model.addAttribute("categoriaSeleccionada", categoria);
        } else {
            model.addAttribute("categoriaSeleccionada", "todos");
        }
        
        model.addAttribute("ordenSeleccionado", orden != null ? orden : "popular");
        
        model.addAttribute("productos", productosFiltrados);
        return "menu"; 
    }
}
