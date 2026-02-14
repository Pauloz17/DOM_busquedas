/**
 * ============================================
 * EJERCICIO DE MANIPULACIÓN DEL DOM
 * ============================================
 * 
 * Objetivo: Aplicar conceptos del DOM para seleccionar elementos,
 * responder a eventos y crear nuevos elementos dinámicamente.
 * 
 * Autor: [Tu nombre aquí]
 * Fecha: [Fecha actual]
 * ============================================
 */

// ============================================
// 1. SELECCIÓN DE ELEMENTOS DEL DOM
// ============================================

/**
 * Seleccionamos los elementos del DOM que necesitamos manipular.
 * Usamos getElementById para obtener referencias a los elementos únicos.
 */

// Formulario
const messageForm = document.getElementById('messageForm');

// Campos de entrada
const userNameInput = document.getElementById('userName');
const userMessageInput = document.getElementById('userMessage');

// Botón de envío
const submitBtn = document.getElementById('submitBtn');
const btnText = document.getElementById('btnText');
const btnIcon = document.getElementById('btnIcon');

// Elementos para mostrar errores
const userNameError = document.getElementById('userNameError');
const userMessageError = document.getElementById('userMessageError');

// Contenedor donde se mostrarán los mensajes
const messagesContainer = document.getElementById('messagesContainer');

// Estado vacío (mensaje que se muestra cuando no hay mensajes)
const emptyState = document.getElementById('emptyState');

// Contador de mensajes
const messageCount = document.getElementById('messageCount');

// Elemento para mostrar mensajes de búsqueda
const searchMessage = document.getElementById('searchMessage');

// Búsqueda de usuarios
const userDataDisplay = document.getElementById('userDataDisplay');
const documentoInput = document.getElementById('documento');
const usuarioForm = document.getElementById('usuario');

// Variable para llevar el conteo de mensajes
let totalMessages = 0;


// ============================================
// 2. FUNCIONES AUXILIARES
// ============================================

/**
 * Valida que un campo no esté vacío ni contenga solo espacios en blanco
 * @param {string} value - El valor a validar
 * @returns {boolean} - true si es válido, false si no lo es
 */
function isValidInput(value) {
    return value.trim().length > 0;
}

/**
 * Muestra un mensaje de error en un elemento específico
 * @param {HTMLElement} errorElement - Elemento donde mostrar el error
 * @param {string} message - Mensaje de error a mostrar
 */
function showError(errorElement, message) {
    errorElement.textContent = message;
}

/**
 * Limpia el mensaje de error de un elemento específico
 * @param {HTMLElement} errorElement - Elemento del que limpiar el error
 */
function clearError(errorElement) {
    errorElement.textContent = '';
}

/**
 * Valida todos los campos del formulario
 * @returns {boolean} - true si todos los campos son válidos, false si alguno no lo es
 */
function validateForm() {
    const userName = userNameInput.value;
    const userMessage = userMessageInput.value;
    let isValid = true;
    
    if (!isValidInput(userName)) {
        showError(userNameError, 'El nombre es obligatorio');
        userNameInput.classList.add('error');
        isValid = false;
    } else {
        clearError(userNameError);
        userNameInput.classList.remove('error');
    }
    
    if (!isValidInput(userMessage)) {
        showError(userMessageError, 'El mensaje es obligatorio');
        userMessageInput.classList.add('error');
        isValid = false;
    } else {
        clearError(userMessageError);
        userMessageInput.classList.remove('error');
    }
    
    return isValid;
}

/**
 * Obtiene la fecha y hora actual formateada
 * @returns {string} - Fecha y hora en formato legible
 */
function getCurrentTimestamp() {
    const now = new Date();
    const options = { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    };
    return now.toLocaleDateString('es-ES', options);
}

/**
 * Obtiene las iniciales de un nombre
 * @param {string} name - Nombre completo
 * @returns {string} - Iniciales en mayúsculas
 */
function getInitials(name) {
    const parts = name.trim().split(' ');
    return parts.length > 1 
        ? (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
        : name.substring(0, 2).toUpperCase();
}

/**
 * Actualiza el contador de mensajes
 */
function updateMessageCount() {
    const text = totalMessages === 1 ? 'mensaje' : 'mensajes';
    messageCount.textContent = `${totalMessages} ${text}`;
}

/**
 * Oculta el estado vacío (mensaje cuando no hay mensajes)
 */
function hideEmptyState() {
    emptyState.classList.add('hidden');
}

/**
 * Muestra el estado vacío (mensaje cuando no hay mensajes)
 */
function showEmptyState() {
    emptyState.classList.remove('hidden');
}

// Busca usuario por documento en db.json
async function buscarUsuario(documento) {
    try {
        const response = await fetch('db.json'); // Consulta db.json
        if (!response.ok) throw new Error('Error al cargar db.json');
        
        const data = await response.json(); // Convierte a JSON
        const usuario = data.usuarios.find(u => u.documento === documento); // Busca usuario
        
        if (usuario) {
            document.getElementById('displayNombre').textContent = usuario.nombre; // Asigna nombre
            document.getElementById('displayApellido').textContent = usuario.apellido; // Asigna apellido
            document.getElementById('displayDocumento').textContent = usuario.documento; // Asigna documento
            document.getElementById('displayEmail').textContent = usuario.email; // Asigna email
            document.getElementById('userDataDisplay').style.display = 'block'; // Muestra datos
            
            // Muestra mensaje de éxito
            searchMessage.textContent = ` Usuario encontrado: ${usuario.nombre} ${usuario.apellido}`;
            searchMessage.style.backgroundColor = '#c8e6c9';
            searchMessage.style.color = '#2e7d32';
            searchMessage.style.display = 'block';
        } else {
            document.getElementById('userDataDisplay').style.display = 'none'; // Oculta datos
            
            // Muestra mensaje de no encontrado
            searchMessage.textContent = ' El usuario no está registrado en el sistema';
            searchMessage.style.backgroundColor = '#ffcdd2';
            searchMessage.style.color = '#c62828';
            searchMessage.style.display = 'block';
        }
    } catch (error) {
        console.error('Error:', error);
    }
}


// ============================================
// 3. CREACIÓN DE ELEMENTOS
// ============================================

/**
 * Crea un nuevo elemento de mensaje en el DOM
 * @param {string} userName - Nombre del usuario
 * @param {string} message - Contenido del mensaje
 */
function createMessageElement(userName, message) {
    const messageDiv = document.createElement('div');
    messageDiv.className = 'message-card';
    
    messageDiv.innerHTML = `
        <div class="message-card__header">
            <div class="message-card__user">
                <div class="message-card__avatar">${getInitials(userName)}</div>
                <span class="message-card__username">${userName}</span>
            </div>
            <span class="message-card__timestamp">${getCurrentTimestamp()}</span>
        </div>
        <div class="message-card__content">${message}</div>
    `;
    
    messagesContainer.insertBefore(messageDiv, emptyState.nextSibling);
    
    totalMessages++;
    updateMessageCount();
    hideEmptyState();
}


// ============================================
// 4. MANEJO DE EVENTOS
// ============================================

/**
 * Maneja el evento de envío del formulario sin recargar la página
 * @param {Event} event - Evento del formulario
 */
// Esta función se ejecuta cuando el usuario envía el formulario
function handleFormSubmit(event) {
    event.preventDefault();
    
    if (!validateForm()) return;
    
    const userName = userNameInput.value.trim();
    const userMessage = userMessageInput.value.trim();
    
    createMessageElement(userName, userMessage);
    messageForm.reset();
    clearError(userNameError);
    clearError(userMessageError);
}

/**
 * Limpia los errores cuando el usuario empieza a escribir
 */
function handleInputChange(event) {
    const input = event.target;
    input.classList.remove('error');
    
    if (input.id === 'userName') {
        clearError(userNameError);
    } else if (input.id === 'userMessage') {
        clearError(userMessageError);
    }
}


// ============================================
// 5. REGISTRO DE EVENTOS
// ============================================

/**
 * Aquí registramos todos los event listeners
 */

messageForm.addEventListener('submit', handleFormSubmit);
userNameInput.addEventListener('input', handleInputChange);
userMessageInput.addEventListener('input', handleInputChange);

// Busca usuario al enviar el formulario
usuarioForm.addEventListener('submit', function(event) {
    event.preventDefault();
    const documento = documentoInput.value.trim();
    
    if (documento === '') return;
    
    buscarUsuario(documento);
    documentoInput.value = ''; // Limpia input después de buscar
});


// ============================================
// 6. REFLEXIÓN Y DOCUMENTACIÓN
// ============================================

/**
 * PREGUNTAS DE REFLEXIÓN:
 * 
 * 1. ¿Qué elemento del DOM estás seleccionando?
 *    R: Formulario, inputs de nombre y mensaje, botones, contenedores y sección de usuario
 * 
 * 2. ¿Qué evento provoca el cambio en la página?
 *    R: El evento 'submit' del formulario y 'input' de los campos de texto
 * 
 * 3. ¿Qué nuevo elemento se crea?
 *    R: Un div con clase 'message-card' que contiene avatar, nombre, mensaje y timestamp
 * 
 * 4. ¿Dónde se inserta ese elemento dentro del DOM?
 *    R: Dentro del messagesContainer, antes del emptyState
 * 
 * 5. ¿Qué ocurre en la página cada vez que repites la acción?
 *    R: Se agrega un nuevo mensaje, se incrementa el contador y se oculta el estado vacío
 */


// ============================================
// 7. INICIALIZACIÓN (OPCIONAL)
// ============================================

/**
 * Esta función se ejecuta cuando el DOM está completamente cargado
 */
document.addEventListener('DOMContentLoaded', function() {
    console.log('✅ DOM completamente cargado');
    console.log('📝 Aplicación de registro de mensajes iniciada');
    
    showEmptyState();
});


// ============================================
// 8. FUNCIONALIDADES ADICIONALES (BONUS)
// ============================================

/**
 * RETOS ADICIONALES OPCIONALES:
 * 
 * 1. Agregar un botón para eliminar mensajes individuales
 * 2. Implementar localStorage para persistir los mensajes
 * 3. Agregar un contador de caracteres en el textarea
 * 4. Implementar un botón para limpiar todos los mensajes
 * 5. Agregar diferentes colores de avatar según el nombre del usuario
 * 6. Permitir editar mensajes existentes
 * 7. Agregar emojis o reacciones a los mensajes
 * 8. Implementar búsqueda/filtrado de mensajes
 */