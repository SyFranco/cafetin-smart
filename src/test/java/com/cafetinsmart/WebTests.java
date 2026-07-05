package com.cafetinsmart;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import org.springframework.web.context.WebApplicationContext;

import static org.springframework.security.test.web.servlet.setup.SecurityMockMvcConfigurers.springSecurity;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;


@SpringBootTest
class WebTests {

    @Autowired
    WebApplicationContext context;

    MockMvc mvc;

    @BeforeEach
    void preparar () {
        mvc = MockMvcBuilders.webAppContextSetup(context)
                .apply(springSecurity())
                .build();

    }

    @Test // PW-01: La pagina de login carga correctamente (HTTP 200)
    void paginaLoginCarga() throws Exception {
        mvc.perform(get("/login"))
           .andExpect(status().isOk());
    }

    @Test // PW-02: Sin sesion, la pagina de pago redirige al login
    void pagoSinSesionRedirigeALogin() throws Exception {
        mvc.perform(get("/pago"))
           .andExpect(status().is3xxRedirection())
           .andExpect(redirectedUrl("/login"));
    }

    @Test // PW-03: Con un usuario autenticado, la pagina de pago responde
    @WithMockUser(username = "clientePrueba")
    void pagoConCarritoVacioRedirigeAlMenu() throws Exception {
        mvc.perform(get("/pago"))
           .andExpect(status().is3xxRedirection())
           .andExpect(redirectedUrl("/menu"));
    }

    @Test // PW-04: El menu del cafetin es accesible
    void menuCarga() throws Exception {
        mvc.perform(get("/menu"))
           .andExpect(status().isOk());
    }

    @Test // pw-5 un ticket inexitetente redirige a la pagina principal
    @WithMockUser (username = "clientePrueba")
    void ticketInexistenteRedirigeAlInicio()throws Exception {
        mvc.perform(get("/ticket/999999"))
           .andExpect(status().is3xxRedirection())
           .andExpect(redirectedUrl("/"));


    }



}