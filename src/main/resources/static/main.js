/**
 * Cafetin Smart - Sistema de Notificaciones
 * Implementacion de Heuristica #1 de Nielsen: Visibilidad del Estado del Sistema
 */

// ============================================
// SISTEMA DE NOTIFICACIONES TOAST
// ============================================

const ToastSystem = {
  container: null,

  /**
   * Inicializa el contenedor de toasts si no existe
   */
  init() {
    if (!this.container) {
      this.container = document.createElement('div');
      this.container.className = 'toast-container';
      this.container.setAttribute('role', 'status');
      this.container.setAttribute('aria-live', 'polite');
      this.container.setAttribute('aria-label', 'Notificaciones del sistema');
      document.body.appendChild(this.container);
    }
  },

  /**
   * Muestra una notificacion toast
   * @param {Object} options - Opciones del toast
   * @param {string} options.message - Mensaje principal
   * @param {string} options.type - Tipo: 'success', 'info', 'warning', 'error'
   * @param {string} options.title - Titulo opcional
   * @param {number} options.duration - Duracion en ms (default: 3000)
   */
  show({ message, type = 'success', title = '', duration = 3000 }) {
    this.init();

    const toast = document.createElement('div');
    toast.className = `toast-notification toast-${type}`;
    toast.setAttribute('role', 'alert');

    // Iconos segun el tipo
    const icons = {
      success: 'bi-check-circle-fill',
      info: 'bi-info-circle-fill',
      warning: 'bi-exclamation-triangle-fill',
      error: 'bi-x-circle-fill'
    };

    toast.innerHTML = `
      <i class="bi ${icons[type]} toast-icon" aria-hidden="true"></i>
      <div class="toast-content">
        ${title ? `<div class="toast-title">${title}</div>` : ''}
        <div class="toast-message">${message}</div>
      </div>
    `;

    this.container.appendChild(toast);

    // Forzar reflow para activar animacion
    toast.offsetHeight;

    // Usamos ambas clases para compatibilidad con CSS actual
    toast.classList.add('show');
    toast.classList.add('animate-in');

    // Auto-remover despues de la duracion
    setTimeout(() => {
      toast.classList.remove('show');
      toast.classList.remove('animate-in');
      toast.classList.add('hide');
      toast.classList.add('animate-out');

      setTimeout(() => {
        if (toast.parentNode) {
          toast.parentNode.removeChild(toast);
        }
      }, 300);
    }, duration);
  },

  // Metodos de conveniencia para diferentes tipos de notificaciones
  success(message, title = '') {
    this.show({ message, type: 'success', title });
  },

  info(message, title = '') {
    this.show({ message, type: 'info', title });
  },

  warning(message, title = '') {
    this.show({ message, type: 'warning', title });
  },

  error(message, title = '') {
    this.show({ message, type: 'error', title });
  }
};

// ============================================
// MENSAJES DE FEEDBACK DEL SISTEMA
// ============================================

const SystemFeedback = {
  // Muestra feedback segun la accion realizada
  showStatus(action, details = '') {
    const messages = {
      'add_cart': {
        message: 'Producto agregado al carrito',
        title: 'Agregado',
        type: 'success'
      },
      'remove_cart': {
        message: 'Producto eliminado del carrito',
        title: 'Eliminado',
        type: 'info'
      },
      'update_quantity': {
        message: `Cantidad actualizada: ${details}`,
        title: 'Actualizado',
        type: 'info'
      },
      'select_payment': {
        message: `Metodo de pago: ${details}`,
        title: 'Seleccionado',
        type: 'info'
      },
      'confirm_order': {
        message: 'Pedido confirmado exitosamente',
        title: 'Confirmado',
        type: 'success'
      },
      'filter_category': {
        message: `Mostrando: ${details}`,
        title: 'Filtrado',
        type: 'info'
      },
      'order_sent': {
        message: 'Tu pedido ha sido enviado a la cocina',
        title: 'Pedido enviado',
        type: 'success'
      }
    };

    const config = messages[action];
    if (config) {
      ToastSystem.show(config);
    }
  }
};

// ============================================
// FUNCIONES DEL CARRITO
// ============================================

const Cart = {
  items: [],

  addProduct(productName, price) {
    this.items.push({ name: productName, price: price });
    SystemFeedback.showStatus('add_cart');
    this.updateCartBadge();
  },

  removeProduct(productName) {
    const index = this.items.findIndex(item => item.name === productName);
    if (index > -1) {
      this.items.splice(index, 1);
      SystemFeedback.showStatus('remove_cart');
      this.updateCartBadge();
    }
  },

  updateQuantity(productName, newQuantity) {
    SystemFeedback.showStatus('update_quantity', newQuantity);
  },

  updateCartBadge() {
    const badge = document.querySelector('.cart-badge, .badge');
    if (badge) {
      badge.textContent = this.items.length;
    }
  }
};

// ============================================
// INICIALIZACION Y EVENT LISTENERS
// ============================================

// ============================================
// ACCESIBILIDAD: ALTO CONTRASTE Y TAMAÑO DE TEXTO
// ============================================

/* =============================================================================
   ATAJOS DE TECLADO - ACCESIBILIDAD
   =============================================================================
   RF-A1: El sistema debe permitir navegación completa mediante teclado.

   Atajos disponibles:
   - Alt + C: Ir al carrito
   - Alt + M: Ir al menú
   - Alt + H: Ir al inicio (home)
   - Alt + K: Activar/desactivar alto contraste
   - Alt + A: Aumentar tamaño de texto
   - Alt + R: Restablecer tamaño de texto
   - ?: Mostrar ayuda de atajos (solo en páginas principales)

   Nota: Usamos Alt en lugar de Ctrl para evitar conflictos con atajos del navegador.
   ============================================================================= */

const KeyboardShortcuts = {
  /**
   * Inicializa los atajos de teclado del sistema
   */
  init() {
    document.addEventListener('keydown', (e) => {
      // Ignorar si el usuario está escribiendo en un input
      if (this.isTyping(e)) return;

      // Alt + tecla para atajos principales
      if (e.altKey) {
        switch (e.key.toLowerCase()) {
          case 'c':
            // Alt + C: Ir al carrito
            e.preventDefault();
            this.navigateTo('carrito.html', 'Navegando al carrito');
            break;

          case 'm':
            // Alt + M: Ir al menú
            e.preventDefault();
            this.navigateTo('menu.html', 'Navegando al menú');
            break;

          case 'h':
            // Alt + H: Ir al inicio
            e.preventDefault();
            this.navigateTo('index.html', 'Navegando al inicio');
            break;

          case 'k':
            // Alt + K: Toggle alto contraste
            e.preventDefault();
            const contrastBtn = document.getElementById('btn-toggle-contrast');
            if (contrastBtn) contrastBtn.click();
            break;

          case 'a':
            // Alt + A: Aumentar texto
            e.preventDefault();
            const increaseBtn = document.getElementById('btn-increase-font');
            if (increaseBtn) increaseBtn.click();
            break;

          case 'r':
            // Alt + R: Restablecer texto
            e.preventDefault();
            const resetBtn = document.getElementById('btn-reset-font');
            if (resetBtn) resetBtn.click();
            break;
        }
      }

      // Tecla ? para mostrar ayuda (sin modificadores)
      if (e.key === '?' && !e.altKey && !e.ctrlKey && !e.metaKey) {
        e.preventDefault();
        this.showHelp();
      }
    });

    // Mostrar mensaje de bienvenida con info de atajos
    console.log('Atajos de teclado habilitados. Presiona ? para ver la ayuda.');
  },

  /**
   * Verifica si el usuario está escribiendo en un campo de texto
   */
  isTyping(e) {
    const target = e.target;
    const tagName = target.tagName.toLowerCase();
    return (
      tagName === 'input' ||
      tagName === 'textarea' ||
      tagName === 'select' ||
      target.isContentEditable
    );
  },

  /**
   * Navega a una página y muestra notificación
   */
  navigateTo(page, message) {
    ToastSystem.info(message, 'Atajo de teclado');
    // Pequeño delay para que el usuario vea el toast
    setTimeout(() => {
      window.location.href = page;
    }, 300);
  },

  /**
   * Muestra modal de ayuda con todos los atajos disponibles
   */
  showHelp() {
    // Verificar si ya existe el modal
    let modal = document.getElementById('keyboard-help-modal');

    if (!modal) {
      // Crear el modal de ayuda
      modal = document.createElement('div');
      modal.id = 'keyboard-help-modal';
      modal.className = 'keyboard-help-modal';
      modal.setAttribute('role', 'dialog');
      modal.setAttribute('aria-labelledby', 'keyboard-help-title');
      modal.setAttribute('aria-modal', 'true');

      modal.innerHTML = `
        <div class="keyboard-help-content">
          <div class="keyboard-help-header">
            <h2 id="keyboard-help-title">
              <i class="bi bi-keyboard" aria-hidden="true"></i>
              Atajos de teclado
            </h2>
            <button type="button" class="keyboard-help-close" aria-label="Cerrar ayuda de atajos">
              <i class="bi bi-x-lg" aria-hidden="true"></i>
            </button>
          </div>
          <div class="keyboard-help-body">
            <h3>Navegación</h3>
            <ul class="keyboard-shortcuts-list">
              <li><kbd>Alt</kbd> + <kbd>C</kbd> <span>Ir al carrito</span></li>
              <li><kbd>Alt</kbd> + <kbd>M</kbd> <span>Ir al menú</span></li>
              <li><kbd>Alt</kbd> + <kbd>H</kbd> <span>Ir al inicio</span></li>
            </ul>

            <h3>Accesibilidad</h3>
            <ul class="keyboard-shortcuts-list">
              <li><kbd>Alt</kbd> + <kbd>K</kbd> <span>Alto contraste on/off</span></li>
              <li><kbd>Alt</kbd> + <kbd>A</kbd> <span>Aumentar texto</span></li>
              <li><kbd>Alt</kbd> + <kbd>R</kbd> <span>Restablecer texto</span></li>
            </ul>

            <h3>General</h3>
            <ul class="keyboard-shortcuts-list">
              <li><kbd>?</kbd> <span>Mostrar esta ayuda</span></li>
              <li><kbd>Tab</kbd> <span>Navegar entre elementos</span></li>
              <li><kbd>Enter</kbd> <span>Activar botón/enlace</span></li>
              <li><kbd>Esc</kbd> <span>Cerrar esta ventana</span></li>
            </ul>
          </div>
        </div>
      `;

      document.body.appendChild(modal);

      // Event listener para cerrar con botón X
      modal.querySelector('.keyboard-help-close').addEventListener('click', () => {
        this.hideHelp();
      });

      // Event listener para cerrar al hacer clic fuera
      modal.addEventListener('click', (e) => {
        if (e.target === modal) {
          this.hideHelp();
        }
      });
    }

    // Mostrar el modal
    modal.classList.add('show');
    modal.querySelector('.keyboard-help-close').focus();

    // Cerrar con Escape
    const escHandler = (e) => {
      if (e.key === 'Escape') {
        this.hideHelp();
        document.removeEventListener('keydown', escHandler);
      }
    };
    document.addEventListener('keydown', escHandler);

    ToastSystem.info('Presiona Esc para cerrar', 'Ayuda de atajos');
  },

  /**
   * Oculta el modal de ayuda
   */
  hideHelp() {
    const modal = document.getElementById('keyboard-help-modal');
    if (modal) {
      modal.classList.remove('show');
    }
  },

  /**
   * Inicializa el panel lateral de atajos (visible para lectores de pantalla)
   * Este panel es diferente al modal - está siempre en el DOM para que
   * el Narrador de Windows pueda leerlo.
   */
  initShortcutsPanel() {
    const showBtn = document.getElementById('btn-show-shortcuts');
    const panel = document.getElementById('keyboard-shortcuts-panel');
    const closeBtn = panel?.querySelector('.shortcuts-panel-close');

    if (!showBtn || !panel) return;

    // Crear overlay si no existe
    let overlay = document.querySelector('.shortcuts-overlay');
    if (!overlay) {
      overlay = document.createElement('div');
      overlay.className = 'shortcuts-overlay';
      overlay.setAttribute('aria-hidden', 'true');
      document.body.appendChild(overlay);
    }

    // Abrir panel
    showBtn.addEventListener('click', () => {
      panel.removeAttribute('hidden');
      panel.classList.add('show');
      overlay.classList.add('show');
      panel.setAttribute('aria-hidden', 'false');

      // Enfocar el primer elemento del panel para lectores de pantalla
      const firstFocusable = panel.querySelector('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
      if (firstFocusable) {
        firstFocusable.focus();
      }

      // Anunciar al lector de pantalla
      this.announceToScreenReader('Panel de atajos de teclado abierto. Use Tab para navegar.');
    });

    // Cerrar panel con botón X
    if (closeBtn) {
      closeBtn.addEventListener('click', () => {
        this.closeShortcutsPanel(panel, overlay, showBtn);
      });
    }

    // Cerrar panel al hacer clic en overlay
    overlay.addEventListener('click', () => {
      this.closeShortcutsPanel(panel, overlay, showBtn);
    });

    // Cerrar panel con Escape
    panel.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        this.closeShortcutsPanel(panel, overlay, showBtn);
      }
    });
  },

  /**
   * Cierra el panel de atajos
   */
  closeShortcutsPanel(panel, overlay, returnFocus) {
    panel.classList.remove('show');
    overlay.classList.remove('show');
    panel.setAttribute('aria-hidden', 'true');

    // Devolver foco al botón que abrió el panel
    if (returnFocus) {
      returnFocus.focus();
    }

    // Ocultar después de la animación
    setTimeout(() => {
      if (!panel.classList.contains('show')) {
        panel.setAttribute('hidden', '');
      }
    }, 300);

    this.announceToScreenReader('Panel de atajos cerrado.');
  },

  /**
   * Anuncia un mensaje al lector de pantalla usando aria-live
   */
  announceToScreenReader(message) {
    let announcer = document.getElementById('sr-announcer');

    if (!announcer) {
      announcer = document.createElement('div');
      announcer.id = 'sr-announcer';
      announcer.setAttribute('role', 'status');
      announcer.setAttribute('aria-live', 'polite');
      announcer.setAttribute('aria-atomic', 'true');
      announcer.className = 'visually-hidden';
      document.body.appendChild(announcer);
    }

    // Limpiar y luego agregar mensaje (para que se anuncie de nuevo)
    announcer.textContent = '';
    setTimeout(() => {
      announcer.textContent = message;
    }, 100);
  }
};

const Accessibility = {
  init() {
    const contrastBtn = document.getElementById('btn-toggle-contrast');
    const increaseFontBtn = document.getElementById('btn-increase-font');
    const resetFontBtn = document.getElementById('btn-reset-font');

    // === MODO ALTO CONTRASTE ===
    if (contrastBtn) {
      const storedContrast = localStorage.getItem('cafetin_high_contrast') === 'true';

      if (storedContrast) {
        document.body.classList.add('high-contrast');
        contrastBtn.setAttribute('aria-pressed', 'true');
      }

      contrastBtn.addEventListener('click', () => {
        const enabled = document.body.classList.toggle('high-contrast');
        contrastBtn.setAttribute('aria-pressed', enabled ? 'true' : 'false');
        localStorage.setItem('cafetin_high_contrast', enabled);

        ToastSystem.info(
          enabled
            ? 'Modo de alto contraste activado.'
            : 'Modo de alto contraste desactivado.',
          'Accesibilidad'
        );
      });
    }

    // === TAMAÑO DE TEXTO ===
    if (increaseFontBtn && resetFontBtn) {
      const storedScale = parseFloat(localStorage.getItem('cafetin_font_scale')) || 1;
      this.applyFontScale(storedScale);

      if (storedScale > 1) {
        increaseFontBtn.setAttribute('aria-pressed', 'true');
      }

      increaseFontBtn.addEventListener('click', () => {
        let currentScale = parseFloat(document.documentElement.dataset.fontScale || '1');
        // Límite 1.5x para no romper la estructura
        currentScale = Math.min(currentScale + 0.15, 1.5);

        this.applyFontScale(currentScale);
        localStorage.setItem('cafetin_font_scale', currentScale);

        increaseFontBtn.setAttribute('aria-pressed', currentScale > 1 ? 'true' : 'false');
        ToastSystem.info('Se aumentó el tamaño del texto.', 'Accesibilidad');
      });

      resetFontBtn.addEventListener('click', () => {
        this.applyFontScale(1);
        localStorage.setItem('cafetin_font_scale', 1);

        increaseFontBtn.setAttribute('aria-pressed', 'false');
        ToastSystem.info('Se restableció el tamaño del texto.', 'Accesibilidad');
      });
    }
  },

  applyFontScale(scale) {
    // 16px = tamaño base de Bootstrap
    document.documentElement.style.fontSize = (16 * scale) + 'px';
    document.documentElement.dataset.fontScale = String(scale);
  }
};


document.addEventListener('DOMContentLoaded', function () {

  // Inicializar sistema de toasts
  ToastSystem.init();

  const pendingToast = sessionStorage.getItem('pendingToast');

  if (pendingToast) {
    const toastData = JSON.parse(pendingToast);
    ToastSystem.show(toastData);
    sessionStorage.removeItem('pendingToast');
  }

  //--------------------------------------------------------------
  //--------------------------------------------------------------

  const paymentForm = document.querySelector('form[action*="/pago/procesar"]');

  if (paymentForm) {
    paymentForm.addEventListener('submit', function () {
      sessionStorage.setItem('pendingToast', JSON.stringify({
        message: 'Tu pedido está siendo procesado',
        title: 'Procesando pago',
        type: 'success',
        duration: 3000
      }));
    });
  }

  // Inicializar accesibilidad (alto contraste + tamaño de texto)
  Accessibility.init();

  // Inicializar atajos de teclado (RF-A1: Navegación por teclado)
  KeyboardShortcuts.init();

  // Inicializar panel de atajos (visible para lectores de pantalla)
  KeyboardShortcuts.initShortcutsPanel();

  // === LÓGICA AJAX PARA EL CARRITO ===

  function actualizarCarritoDOM(data) {
    // 1. Actualizar Badge en el Header
    const badge = document.getElementById('cart-badge');
    if (badge) {
      badge.textContent = data.cantidadTotal;
      badge.style.display = data.cantidadTotal > 0 ? 'inline-block' : 'none';
    }

    // 2. Actualizar Resumen en carrito.html (si estamos ahí)
    const resumenArticulos = document.getElementById('resumen-articulos');
    const resumenSubtotal = document.getElementById('resumen-subtotal');
    const resumenTotal = document.getElementById('resumen-total');

    if (resumenArticulos && resumenSubtotal && resumenTotal) {
      resumenArticulos.textContent = `Subtotal (${data.cantidadTotal} artículos):`;
      resumenSubtotal.textContent = `$${data.totalPagar.toFixed(2)}`;
      resumenTotal.textContent = `$${data.totalPagar.toFixed(2)}`;
    }

    // 3. Recargar si el carrito se vació (para mostrar el mensaje de "vacío")
    if (data.cantidadTotal === 0 && window.location.pathname.includes('/carrito')) {
      window.location.reload();
    }
  }

  document.querySelectorAll('input[name="metodo"]').forEach(radio => {
    radio.addEventListener('change', function () {
      const label = document.querySelector(`label[for="${this.id}"]`);
      const metodoTexto = label ? label.textContent.trim() : this.value;

      SystemFeedback.showStatus('select_payment', metodoTexto);
    });
  });

  // BOTONES AÑADIR (menu.html)
  document.querySelectorAll('.btn-ajax-add').forEach(button => {
    button.addEventListener('click', function (e) {
      e.preventDefault();
      const productId = this.getAttribute('data-id');

      fetch(`/carrito/agregar/${productId}`, { method: 'POST' })
        .then(response => response.json())
        .then(data => {
          actualizarCarritoDOM(data);
          SystemFeedback.showStatus('add_cart');

          this.classList.add('btn-clicked');
          setTimeout(() => this.classList.remove('btn-clicked'), 200);
        });
    });
  });

  // BOTONES SUMAR (carrito.html)
  document.querySelectorAll('.btn-ajax-sumar').forEach(button => {
    button.addEventListener('click', function (e) {
      e.preventDefault();
      const productId = this.getAttribute('data-id');
      const displaySpan = this.parentElement.querySelector('.quantity-display');

      fetch(`/carrito/sumar/${productId}`, { method: 'POST' })
        .then(response => response.json())
        .then(data => {
          actualizarCarritoDOM(data);
          // Actualizar cantidad específica del item buscando en la lista
          const itemData = data.items.find(i => i.id == productId);
          if (itemData) displaySpan.textContent = itemData.cantidad;
          SystemFeedback.showStatus('update_quantity', itemData ? itemData.cantidad : '');
        });
    });
  });

  // BOTONES RESTAR (carrito.html)
  document.querySelectorAll('.btn-ajax-restar').forEach(button => {
    button.addEventListener('click', function (e) {
      e.preventDefault();
      const productId = this.getAttribute('data-id');
      const displaySpan = this.parentElement.querySelector('.quantity-display');
      const cartItemDiv = this.closest('.cart-item');

      fetch(`/carrito/restar/${productId}`, { method: 'POST' })
        .then(response => response.json())
        .then(data => {
          actualizarCarritoDOM(data);
          const itemData = data.items.find(i => i.id == productId);
          if (itemData) {
            displaySpan.textContent = itemData.cantidad;
            SystemFeedback.showStatus('update_quantity', itemData.cantidad);
          } else {
            // El item se eliminó (llegó a 0)
            cartItemDiv.remove();
            SystemFeedback.showStatus('remove_cart');
          }
        });
    });
  });

  // BOTONES ELIMINAR (carrito.html)
  document.querySelectorAll('.btn-ajax-eliminar').forEach(button => {
    button.addEventListener('click', function (e) {
      e.preventDefault();
      const productId = this.getAttribute('data-id');
      const cartItemDiv = this.closest('.cart-item');

      fetch(`/carrito/eliminar/${productId}`, { method: 'POST' })
        .then(response => response.json())
        .then(data => {
          actualizarCarritoDOM(data);
          cartItemDiv.remove();
          SystemFeedback.showStatus('remove_cart');
        });
    });
  });

  // === FILTROS DE CATEGORIA (menu.html) ===
  const categoryBadges = document.querySelectorAll('.category-badge');

  categoryBadges.forEach(badge => {
    badge.addEventListener('click', function () {
      const categoryName = this.textContent.trim();

      sessionStorage.setItem('pendingToast', JSON.stringify({
        message: `Mostrando: ${categoryName}`,
        title: 'Filtrado',
        type: 'info',
        duration: 2500
      }));
    });
  });

  // === BOTON CONFIRMAR PEDIDO (carrito.html) ===
  const proceedPaymentBtn = document.querySelector('a[href="/pago"].btn-primary-custom');

  if (proceedPaymentBtn) {
    proceedPaymentBtn.addEventListener('click', function () {
      sessionStorage.setItem('pendingToast', JSON.stringify({
        message: 'Continuando al proceso de pago',
        title: 'Pedido listo',
        type: 'success',
        duration: 2500
      }));
    });
  }

  // === BOTON FINALIZAR PEDIDO (pago.html) ===
  const finalizeBtn = document.querySelector('a[href="ticket.html"].btn-primary-custom');
  if (finalizeBtn) {
    finalizeBtn.addEventListener('click', function () {
      SystemFeedback.showStatus('order_sent');
    });
  }

  console.log('Cafetin Smart: Sistema de notificaciones inicializado');
});
