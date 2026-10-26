// Importar estilos y Bootstrap para procesamiento de Webpack
import '../css/b5.css';
import '../css/main.css';
import './b5.js';

// Eventos del DOM
document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('btn-buscar')?.addEventListener('click', (e) => {
        e.preventDefault();
        buscarPalabra();
    });
    document.getElementById('btn-limpiar')?.addEventListener('click', limpiarPantalla);
    document.getElementById('form-buscador')?.addEventListener('submit', (e) => {
        e.preventDefault();
        buscarPalabra();
    });
});

// Función principal para buscar y contar palabras
function buscarPalabra() {
    const textoInput = document.getElementById('texto-captura')?.value || '';
    const palabraInput = document.getElementById('palabra-busqueda')?.value || '';

    limpiarAlertas();

    // Validar campos obligatorios
    if (!textoInput.trim()) {
        mostrarAlerta('Por favor, ingresa un texto para procesar.', 'warning');
        return;
    }

    if (!palabraInput.trim()) {
        mostrarAlerta('Por favor, ingresa la palabra que deseas buscar.', 'warning');
        return;
    }

    // Escapar caracteres especiales para usar en la expresión regular
    const palabraEscapada = escaparRegExp(palabraInput.trim());

    // Expresión regular insensible a mayúsculas/minúsculas con límites de palabra
    const regex = new RegExp(`(${palabraEscapada})`, 'gi');

    // Contar coincidencias
    const coincidencias = textoInput.match(regex);
    const totalCoincidencias = coincidencias ? coincidencias.length : 0;

    // Escapar texto base para evitar inyecciones HTML y resaltar coincidencias
    const textoSeguro = escaparHTML(textoInput);
    const palabraSegura = escaparRegExp(escaparHTML(palabraInput.trim()));
    const regexSeguro = new RegExp(`(${palabraSegura})`, 'gi');
    const textoResaltado = textoSeguro.replace(regexSeguro, '<mark class="resaltado">$1</mark>');

    // Mostrar u ocultar sección de resultados
    const contenedorResultado = document.getElementById('contenedor-resultado');
    const spanContador = document.getElementById('numero-coincidencias');
    const divTextoProcesado = document.getElementById('texto-procesado');

    if (spanContador) spanContador.textContent = totalCoincidencias;
    if (divTextoProcesado) divTextoProcesado.innerHTML = textoResaltado;

    if (contenedorResultado) {
        contenedorResultado.classList.remove('d-none');
    }

    // Alertas según el resultado
    if (totalCoincidencias === 0) {
        mostrarAlerta(`No se encontraron coincidencias para la palabra: "${palabraInput.trim()}".`, 'secondary');
    } else {
        const mensaje = totalCoincidencias === 1
            ? 'Se encontró 1 coincidencia.'
            : `Se encontraron ${totalCoincidencias} coincidencias.`;
        mostrarAlerta(mensaje, 'success');
    }
}

// Limpiar formulario y resultados sin recargar la página
function limpiarPantalla() {
    document.getElementById('form-buscador')?.reset();

    const contenedorResultado = document.getElementById('contenedor-resultado');
    if (contenedorResultado) contenedorResultado.classList.add('d-none');

    const spanContador = document.getElementById('numero-coincidencias');
    if (spanContador) spanContador.textContent = '0';

    const divTextoProcesado = document.getElementById('texto-procesado');
    if (divTextoProcesado) divTextoProcesado.innerHTML = '';

    limpiarAlertas();
}

// Mostrar alertas personalizadas en el contenedor
function mostrarAlerta(mensaje, tipo = 'primary') {
    const contenedor = document.getElementById('contenedor-alertas');
    if (!contenedor) return;

    contenedor.innerHTML = `
        <div class="alert alert-${tipo} alert-dismissible fade show alerta-personalizada" role="alert">
            <span>${mensaje}</span>
            <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Cerrar"></button>
        </div>
    `;
}

// Limpiar alertas activas
function limpiarAlertas() {
    const contenedor = document.getElementById('contenedor-alertas');
    if (contenedor) contenedor.innerHTML = '';
}

// Escapar caracteres reservados de expresiones regulares
function escaparRegExp(cadena) {
    return cadena.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

// Escapar caracteres HTML para renderizado seguro
function escaparHTML(texto) {
    const mapa = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#039;'
    };
    return texto.replace(/[&<>"']/g, m => mapa[m]);
}
