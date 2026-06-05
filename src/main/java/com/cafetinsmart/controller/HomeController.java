package com.cafetinsmart.controller;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class HomeController {

    // Únicamente dedicado a la página principal de la App
    @GetMapping("/")
    public String index(Model model) {
        return "index"; 
    }

    @GetMapping("/login")
    public String login() {
        return "login";
    }
}
