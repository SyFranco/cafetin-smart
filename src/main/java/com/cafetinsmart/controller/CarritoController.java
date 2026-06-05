package com.cafetinsmart.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;
import com.cafetinsmart.model.Producto;
import com.cafetinsmart.repository.ProductoRepository;
import com.cafetinsmart.service.CarritoService;
import lombok.RequiredArgsConstructor;

@Controller
@RequestMapping("/carrito")
@RequiredArgsConstructor
public class CarritoController {

    private final CarritoService carritoService;
    private final ProductoRepository productoRepository;

    @GetMapping
    public String verCarrito(Model model) {
        model.addAttribute("items", carritoService.obtenerItems());
        model.addAttribute("total", carritoService.calcularTotal());
        return "carrito";
    }

    @PostMapping("/agregar/{id}")
    @ResponseBody
    public ResponseEntity<?> agregarProducto(@PathVariable Long id) {
        Producto producto = productoRepository.findById(id).orElse(null);
        if (producto != null) {
            carritoService.agregarProducto(producto, 1);
        }
        return construirRespuesta();
    }

    @PostMapping("/sumar/{id}")
    @ResponseBody
    public ResponseEntity<?> sumarProducto(@PathVariable Long id) {
        Producto producto = productoRepository.findById(id).orElse(null);
        if (producto != null) {
            carritoService.agregarProducto(producto, 1);
        }
        return construirRespuesta();
    }

    @PostMapping("/restar/{id}")
    @ResponseBody
    public ResponseEntity<?> restarProducto(@PathVariable Long id) {
        carritoService.restarProducto(id);
        return construirRespuesta();
    }

    @PostMapping("/eliminar/{id}")
    @ResponseBody
    public ResponseEntity<?> eliminarProducto(@PathVariable Long id) {
        carritoService.eliminarProducto(id);
        return construirRespuesta();
    }

    private ResponseEntity<?> construirRespuesta() {
        int cantidadTotal = carritoService.obtenerItems().stream()
                .mapToInt(item -> item.getCantidad())
                .sum();
                
        Double totalPagar = carritoService.calcularTotal();

        java.util.Map<String, Object> response = new java.util.HashMap<>();
        response.put("status", "ok");
        response.put("cantidadTotal", cantidadTotal);
        response.put("totalPagar", totalPagar);
        
        var itemsResumen = carritoService.obtenerItems().stream().map(item -> {
            java.util.Map<String, Object> itemData = new java.util.HashMap<>();
            itemData.put("id", item.getProducto().getId());
            itemData.put("cantidad", item.getCantidad());
            itemData.put("subtotal", item.getSubtotal());
            return itemData;
        }).toList();
        
        response.put("items", itemsResumen);

        return ResponseEntity.ok(response);
    }
}
