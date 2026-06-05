package com.cafetinsmart.controller;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.PathVariable;
import com.cafetinsmart.model.Pedido;
import com.cafetinsmart.service.CarritoService;
import com.cafetinsmart.service.PedidoService;
import com.cafetinsmart.repository.UsuarioRepository;
import com.cafetinsmart.model.Usuario;
import java.security.Principal;
import lombok.RequiredArgsConstructor;

@Controller
@RequiredArgsConstructor
public class PedidoController {

    private final CarritoService carritoService;
    private final PedidoService pedidoService;
    private final UsuarioRepository usuarioRepository;

    @GetMapping("/pago")
    public String mostrarPago(Model model, Principal principal) {
        if (carritoService.obtenerItems().isEmpty()) {
            return "redirect:/menu";
        }
        
        if (principal != null) {
            Usuario usuario = usuarioRepository.findByUsername(principal.getName()).orElse(null);
            if (usuario != null) {
                String nombreCompleto = (usuario.getNombre() != null ? usuario.getNombre() : "") + " " + 
                                        (usuario.getApellidos() != null ? usuario.getApellidos() : "");
                model.addAttribute("nombreUsuario", nombreCompleto.trim());
            }
        }
        
        model.addAttribute("total", carritoService.calcularTotal());
        return "pago";
    }

    @PostMapping("/pago/procesar")
    public String procesarPago(@RequestParam("nombre") String nombre, 
                               @RequestParam("metodo") String metodo) {
        
        if (carritoService.obtenerItems().isEmpty()) {
            return "redirect:/menu";
        }

        // Crear el pedido en Base de Datos
        Pedido nuevoPedido = pedidoService.procesarPedido(
            carritoService.obtenerItems(), 
            nombre, 
            metodo, 
            carritoService.calcularTotal()
        );

        // Limpiar el carrito de la sesión
        carritoService.limpiarCarrito();

        // Redirigir al ticket
        return "redirect:/ticket/" + nuevoPedido.getId();
    }

    @GetMapping("/ticket/{id}")
    public String mostrarTicket(@PathVariable Long id, Model model) {
        Pedido pedido = pedidoService.obtenerPorId(id);
        if (pedido == null) {
            return "redirect:/";
        }
        model.addAttribute("pedido", pedido);
        return "ticket";
    }
}
