package com.cafetinsmart.service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;
import org.springframework.web.context.annotation.SessionScope;

import com.cafetinsmart.model.ItemCarrito;
import com.cafetinsmart.model.Producto;

@Service
@SessionScope //significa que el carrito pertenece a la sesión del usuario.
public class CarritoService {

    private final List<ItemCarrito> items = new ArrayList<>();

    public void agregarProducto(Producto producto, int cantidad) {
        Optional<ItemCarrito> itemExistente = items.stream()
                .filter(item -> item.getProducto().getId().equals(producto.getId()))
                .findFirst();

        if (itemExistente.isPresent()) {
            itemExistente.get().setCantidad(itemExistente.get().getCantidad() + cantidad);
        } else {
            items.add(new ItemCarrito(producto, cantidad));
        }
    }

    public void restarProducto(Long productoId) {
        Optional<ItemCarrito> itemExistente = items.stream()
                .filter(item -> item.getProducto().getId().equals(productoId))
                .findFirst();

        if (itemExistente.isPresent()) {
            int nuevaCantidad = itemExistente.get().getCantidad() - 1;
            if (nuevaCantidad > 0) {
                itemExistente.get().setCantidad(nuevaCantidad);
            } else {
                eliminarProducto(productoId);
            }
        }
    }

    public void eliminarProducto(Long productoId) {
        items.removeIf(item -> item.getProducto().getId().equals(productoId));
    }

    public List<ItemCarrito> obtenerItems() {
        return items;
    }

    public Double calcularTotal() {
        return items.stream()
                .mapToDouble(ItemCarrito::getSubtotal)
                .sum();
    }

    public void limpiarCarrito() {
        items.clear();
    }
}
