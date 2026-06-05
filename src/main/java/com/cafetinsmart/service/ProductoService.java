package com.cafetinsmart.service;

import java.util.Arrays;
import java.util.List;

import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import com.cafetinsmart.model.Producto;
import com.cafetinsmart.repository.ProductoRepository;

import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class ProductoService {

    private final ProductoRepository productoRepository;

    public List<Producto> obtenerTodos(Sort sort) {
        return productoRepository.findAll(sort);
    }

    //Por ejemplo devuelve bebidas ordenadas por precio menor.
    public List<Producto> obtenerPorCategoriaYOrden(String categoria, String orden) {
        Sort sort = mapOrdenToSort(orden);
        if (categoria == null || categoria.isEmpty() || categoria.equalsIgnoreCase("todos")) {
            return obtenerTodos(sort);
        }
        return productoRepository.findByCategoriaIgnoreCase(categoria, sort);
    }

    //convierte el orden de la vista en un Sort:
    private Sort mapOrdenToSort(String orden) {
        if (orden == null) return Sort.unsorted();
        switch (orden) {
            case "price-low": return Sort.by(Sort.Direction.ASC, "precio");
            case "price-high": return Sort.by(Sort.Direction.DESC, "precio");
            case "name": return Sort.by(Sort.Direction.ASC, "nombre");
            case "popular":
            default: return Sort.unsorted();
        }
    }

    // Se ejecuta automáticamente al levantar la App para llenar la BD si está vacía
    @PostConstruct
    public void inicializarDatosBase() {
        if (productoRepository.count() == 0) {
            List<Producto> productosIniciales = Arrays.asList(
                new Producto(null, "Café Americano", "Café negro preparado con granos colombianos. Tamaño mediano.", 1.50, "bebidas", "https://excelso77.com/wp-content/uploads/2024/05/por-que-el-cafe-americano-se-llama-asi-te-lo-contamos.webp"),
                new Producto(null, "Cappuccino", "Espresso con leche vaporizada y espuma cremosa.", 2.25, "bebidas", "https://images.unsplash.com/photo-1572442388796-11668a67e53d?w=400&h=300&fit=crop"),
                new Producto(null, "Jugo Natural", "Jugo de naranja recién exprimido. 100% natural.", 2.00, "bebidas", "https://images.unsplash.com/photo-1621506289937-a8e4df240d0b?w=400&h=300&fit=crop"),
                new Producto(null, "Sándwich Mixto", "Pan integral con jamón, queso, tomate y lechuga.", 3.00, "snacks", "https://images.unsplash.com/photo-1528735602780-2552fd46c7af?w=400&h=300&fit=crop"),
                new Producto(null, "Empanada de Carne", "Empanada horneada rellena de carne molida.", 1.50, "snacks", "https://images.unsplash.com/photo-1604467794349-0b74285de7e7?w=400&h=300&fit=crop"),
                new Producto(null, "Menú Ejecutivo", "Arroz con pollo, ensalada fresca, jugo natural y postre.", 5.50, "menus", "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&h=300&fit=crop"),
                new Producto(null, "Ensalada de Frutas", "Mix de frutas frescas de temporada con yogurt.", 2.25, "postres", "https://images.unsplash.com/photo-1490474418585-ba9bad8fd0ea?w=400&h=300&fit=crop")
            );
            productoRepository.saveAll(productosIniciales);
        }
    }
}
