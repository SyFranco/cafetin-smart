package com.cafetinsmart.service;

import java.util.List;
import java.util.UUID;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.cafetinsmart.model.DetallePedido;
import com.cafetinsmart.model.ItemCarrito;
import com.cafetinsmart.model.Pedido;
import com.cafetinsmart.repository.DetallePedidoRepository;
import com.cafetinsmart.repository.PedidoRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class PedidoService {

    private final PedidoRepository pedidoRepository;
    private final DetallePedidoRepository detallePedidoRepository;

    //significa que todo el proceso debe guardarse como una sola operación. Si algo falla, se cancela todo para no dejar datos incompletos.
    @Transactional
    public Pedido procesarPedido(List<ItemCarrito> items, String nombreCliente, String metodoPago, Double total) {
        
        Pedido pedido = new Pedido();
        pedido.setNombreCliente(nombreCliente);
        pedido.setMetodoPago(metodoPago);
        pedido.setTotal(total);
        pedido.setEstado("PAGADO");
        
        // Generar un código de recojo único de 6 caracteres
        String codigo = UUID.randomUUID().toString().substring(0, 6).toUpperCase();
        pedido.setCodigoRecojo(codigo);

        // Guardar el pedido principal
        Pedido pedidoGuardado = pedidoRepository.save(pedido);

        // Guardar cada detalle del pedido
        for (ItemCarrito item : items) {
            DetallePedido detalle = new DetallePedido();
            detalle.setPedido(pedidoGuardado);
            detalle.setProducto(item.getProducto());
            detalle.setCantidad(item.getCantidad());
            detalle.setSubtotal(item.getSubtotal());
            
            detallePedidoRepository.save(detalle);
        }

        return pedidoGuardado;
    }
    
    public Pedido obtenerPorId(Long id) {
        return pedidoRepository.findById(id).orElse(null);
    }
}
