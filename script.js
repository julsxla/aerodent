
// AERODENT SYSTEM S.A.S.

// PRODUCTOS DISPONIBLES
const products = {
    dentall: {
        name: "DentAll - Kit dental portátil",
        price: 177955
    },
    cepillo: {
        name: "Cepillo eléctrico",
        price: 22488
    },
    cabezales: {
        name: "Cabezales",
        price: 10448
    },
    cable: {
        name: "Cable USB",
        price: 17971
    },
    toalla: {
        name: "Toalla de microfibra",
        price: 4909
    },
    enjuague: {
        name: "Enjuague bucal",
        price: 12649
    },
    crema: {
        name: "Crema dental",
        price: 13900
    },
    hilo: {
        name: "Hilo dental",
        price: 10585
    },
    raspador: {
        name: "Raspador de lengua",
        price: 7952
    },
    tiras: {
        name: "Tiras de blanqueamiento",
        price: 5285
    },
    espejo: {
        name: "Espejo",
        price: 10785
    }
};

// CONFIGURACIÓN
const whatsappNumber = "573229425275";

// FORMATO DE PRECIOS
const formatPrice = (price) => {
    return price.toLocaleString("es-CO", {
        style: "currency",
        currency: "COP",
        maximumFractionDigits: 0
    });
};

// CARGAR CARRITO GUARDADO
function loadCart() {
    try {
        const savedCart = JSON.parse(
            localStorage.getItem("aerodent-cart")
        ) || {};

        const validCart = {};

        Object.entries(savedCart).forEach(([id, amount]) => {
            if (
                products[id] &&
                Number.isInteger(amount) &&
                amount > 0
            ) {
                validCart[id] = amount;
            }
        });

        return validCart;

    } catch (error) {
        return {};
    }
}

let cart = loadCart();

// GUARDAR CARRITO
function saveCart() {
    try {
        localStorage.setItem(
            "aerodent-cart",
            JSON.stringify(cart)
        );
    } catch (error) {
        console.error("No se pudo guardar el carrito.", error);
    }
}

// MOSTRAR CARRITO
function renderCart() {
    const cartItems = document.getElementById("cart-items");
    const cartCount = document.getElementById("cart-count");
    const cartTotal = document.getElementById("cart-total");

    if (!cartItems || !cartCount || !cartTotal) return;

    let total = 0;
    let quantity = 0;

    cartItems.innerHTML = "";

    Object.entries(cart).forEach(([id, amount]) => {
        const product = products[id];

        if (!product || amount <= 0) return;

        const subtotal = product.price * amount;

        total += subtotal;
        quantity += amount;

        const item = document.createElement("div");
        item.className = "cart-item";

        item.innerHTML = `
            <div>
                <h3>${product.name}</h3>
                <p>${formatPrice(product.price)} por unidad</p>
                <strong>Subtotal: ${formatPrice(subtotal)}</strong>
            </div>

            <div class="cart-controls">
                <button type="button" data-action="minus" data-id="${id}" aria-label="Disminuir cantidad">−</button>

                <span>${amount}</span>

                <button type="button" data-action="plus" data-id="${id}" aria-label="Aumentar cantidad">+</button>

                <button type="button" data-action="remove" data-id="${id}">Eliminar</button>
            </div>
        `;

        cartItems.appendChild(item);
    });

    if (quantity === 0) {
        cartItems.innerHTML = "<p>Tu carrito está vacío.</p>";
    }

    cartCount.textContent = quantity;
    cartTotal.textContent = formatPrice(total);

    saveCart();
}

// AGREGAR PRODUCTOS
document.querySelectorAll(".add-to-cart").forEach(button => {

    button.addEventListener("click", () => {

        const id = button.dataset.id;

        if (!products[id]) return;

        cart[id] = (cart[id] || 0) + 1;

        renderCart();

        const originalText = "Agregar al carrito";

        button.textContent = "¡Agregado!";
        button.disabled = true;

        setTimeout(() => {
            button.textContent = originalText;
            button.disabled = false;
        }, 1000);

    });

});

// CAMBIAR CANTIDADES Y ELIMINAR PRODUCTOS
document.getElementById("cart-items").addEventListener("click", event => {

    const button = event.target.closest("button[data-action]");

    if (!button) return;

    const id = button.dataset.id;
    const action = button.dataset.action;

    if (!products[id]) return;

    if (action === "plus") {

        cart[id] = (cart[id] || 0) + 1;

    } else if (action === "minus") {

        cart[id]--;

        if (cart[id] <= 0) {
            delete cart[id];
        }

    } else if (action === "remove") {

        delete cart[id];

    }

    renderCart();

});

// IR AL CARRITO
document.getElementById("go-to-cart").addEventListener("click", () => {

    document.getElementById("carrito").scrollIntoView({
        behavior: "smooth"
    });

});

// MOSTRAR CARRITO AL CARGAR
renderCart();


// ABRIR FORMULARIO DE COMPRA

const checkoutButton = document.getElementById("checkout-button");
const checkoutSection = document.getElementById("checkout");

checkoutButton.addEventListener("click", () => {

    if (Object.keys(cart).length === 0) {

        alert("Tu carrito está vacío. Agrega algún producto primero.");
        return;

    }

    checkoutSection.hidden = false;

    checkoutSection.scrollIntoView({
        behavior: "smooth"
    });

});


// ESCAPAR TEXTO PARA MOSTRARLO DE FORMA SEGURA
function escapeHTML(text) {

    return String(text).replace(/[&<>"']/g, character => {

        const entities = {
            "&": "&amp;",
            "<": "&lt;",
            ">": "&gt;",
            '"': "&quot;",
            "'": "&#039;"
        };

        return entities[character];

    });

}


// CONFIRMAR Y ENVIAR PEDIDO POR WHATSAPP

document.getElementById("checkout-form").addEventListener("submit", event => {

    event.preventDefault();

    if (Object.keys(cart).length === 0) {

        alert("Tu carrito está vacío.");
        return;

    }

    const name = document.getElementById("customer-name").value.trim();
    const phone = document.getElementById("customer-phone").value.trim();
    const email = document.getElementById("customer-email").value.trim();
    const address = document.getElementById("customer-address").value.trim();
    const city = document.getElementById("customer-city").value.trim();
    const payment = document.getElementById("payment-method").value;

    let total = 0;
    let summary = "";

    Object.entries(cart).forEach(([id, amount]) => {

        const product = products[id];

        if (!product) return;

        const subtotal = product.price * amount;

        total += subtotal;

        summary += `${product.name} x ${amount} = ${formatPrice(subtotal)}\n`;

    });

    const message = `
¡Hola, AeroDent System S.A.S.!

Quiero realizar el siguiente pedido:

CLIENTE:
Nombre: ${name}
Teléfono: ${phone}
Correo: ${email}
Dirección: ${address}
Ciudad: ${city}

PRODUCTOS:
${summary}

TOTAL: ${formatPrice(total)}

MÉTODO DE PAGO:
${payment}

Quedo atento(a) a la confirmación de mi pedido.
`;

    const whatsappURL =
        "https://wa.me/" +
        whatsappNumber +
        "?text=" +
        encodeURIComponent(message);

    const confirmation = document.getElementById("order-confirmation");

    confirmation.innerHTML = `
        <h3>¡Tu pedido está preparado!</h3>

        <p>
            Hemos preparado el resumen de tu compra.
            Ahora puedes enviarlo a AeroDent System mediante WhatsApp.
        </p>

        <p><strong>Cliente:</strong> ${escapeHTML(name)}</p>

        <p><strong>Total:</strong> ${formatPrice(total)}</p>

        <a class="btn" href="${whatsappURL}" target="_blank" rel="noopener noreferrer">
            Enviar pedido por WhatsApp
        </a>
    `;

    confirmation.hidden = false;

    // Abrir WhatsApp directamente
    const whatsappWindow = window.open(whatsappURL, "_blank");

    // Si el navegador bloquea la ventana, queda disponible el enlace
    if (!whatsappWindow) {
        confirmation.scrollIntoView({
            behavior: "smooth"
        });
    }

});


// FORMULARIO DE CONTACTO POR WHATSAPP

document.getElementById("contact-form").addEventListener("submit", event => {

    event.preventDefault();

    const firstName = document.getElementById("first-name").value.trim();
    const lastName = document.getElementById("last-name").value.trim();
    const interest = document.getElementById("interest").value;
    const phone = document.getElementById("contact-phone").value.trim();

    const message = `
¡Hola, AeroDent System S.A.S.!

Mi nombre es ${firstName} ${lastName}.

Estoy interesado(a) en: ${interest}.

Mi número de contacto es: ${phone}.

Quisiera recibir más información sobre sus productos DentAll.
`;

    const whatsappURL =
        "https://wa.me/" +
        whatsappNumber +
        "?text=" +
        encodeURIComponent(message);

    window.open(whatsappURL, "_blank");

});


// ANIMACIONES AL DESPLAZARSE

if ("IntersectionObserver" in window) {

    const revealElements = document.querySelectorAll(
        ".about, .products, .cart-section, .contact-section, .footer"
    );

    const observer = new IntersectionObserver(entries => {

        entries.forEach(entry => {

            if (entry.isIntersecting) {

                entry.target.classList.add("visible");
                observer.unobserve(entry.target);

            }

        });

    }, {
        threshold: 0.08
    });

    revealElements.forEach(element => {

        element.classList.add("reveal");
        observer.observe(element);

    });

}

console.log("AeroDent System está funcionando correctamente.");
