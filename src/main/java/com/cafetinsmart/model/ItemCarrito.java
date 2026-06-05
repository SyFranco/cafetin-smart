package com.cafetinsmart.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ItemCarrito {
    private Producto producto;
    private int cantidad;
    
    public Double getSubtotal() {
        return producto.getPrecio() * cantidad;
    }
}
