const API_BASE = "http://badjgaming.store/api";
let currentProductId = null;

function showSection(sectionId) {
    const sections = ["loginSection", "productsSection", "paymentSection", "warrantySection", "adminSection"];
    sections.forEach(id => {
        const elem = document.getElementById(id);
        if (elem) {
            elem.style.display = (id === sectionId) ? "block" : "none";
        }
    });
}

async function loadProducts() {
    try {
        const response = await fetch(${API_BASE}/productos/);
        if (!response.ok) throw new Error(Error al obtener productos: ${response.status});
        const products = await response.json();

        const container = document.getElementById("productsList");
        container.innerHTML = "";

        if (!products || products.length === 0) {
            container.innerHTML = "<p>No hay productos disponibles.</p>";
            return;
        }

        let row = document.createElement("div");
        row.classList.add("row");

        products.forEach((prod, index) => {
            row.innerHTML += `
                <div class="col-md-4 mb-4">
                    <div class="card">
                        <div class="card-body">
                            <h5 class="card-title">${prod.nombre}</h5>
                            <p class="card-text"><strong>Marca:</strong> ${prod.marca}</p>
                            <p class="card-text"><strong>Modelo:</strong> ${prod.modelo}</p>
                            <p class="card-text"><strong>CPU:</strong> ${prod.cpu}</p>
                            <p class="card-text"><strong>RAM:</strong> ${prod.ram}</p>
                            <p class="card-text"><strong>Almacenamiento:</strong> ${prod.gb_almacenamiento} (${prod.tipo_almacenamiento})</p>
                            <p class="card-text"><strong>GPU:</strong> ${prod.gpu}</p>
                            <p class="card-text"><strong>Pantalla:</strong> ${prod.pantalla}</p>
                            <p class="card-text"><strong>Es táctil:</strong> ${prod.es_tactil}</p>
                            <p class="card-text"><strong>Precio:</strong> $${prod.precio}</p>
                            <p class="card-text"><strong>Garantía:</strong> ${prod.garantia}</p>
                            <p class="card-text"><strong>Stock:</strong> ${prod.stock}</p>
                            <button class="btn btn-primary" onclick="purchaseProduct(${prod.id})">Comprar</button>
                        </div>
                    </div>
                </div>
            `;
            if ((index + 1) % 3 === 0) {
                container.appendChild(row);
                row = document.createElement("div");
                row.classList.add("row");
            }
        });

        if (row.innerHTML.trim() !== "") {
            container.appendChild(row);
        }
    } catch (error) {
        console.error("Error al cargar productos:", error.message);
        document.getElementById("productsList").innerText = "Error al cargar productos.";
    }
}

async function processLogin(event) {
    event.preventDefault();
    const username = document.getElementById("username").value;
    const password = document.getElementById("passwordLogin").value;

    try {
        const response = await fetch(${API_BASE}/usuarios/${username}/${password});
        if (!response.ok) throw new Error(Error al iniciar sesión: ${response.status});
        const usuarioData = await response.json();
        localStorage.setItem("usuarioData", JSON.stringify(usuarioData));
        showSection("productsSection");
        loadProducts();
    } catch (error) {
        document.getElementById("loginError").innerText = "Error en el proceso de inicio de sesión.";
        console.error("Error en login:", error);
    }
}

document.getElementById("formLogin").addEventListener("submit", processLogin);

function purchaseProduct(productId) {
    currentProductId = productId;
    showSection("paymentSection");
}

// Función para procesar el pago
async function processPayment() {
    const usuarioData = JSON.parse(localStorage.getItem("usuarioData"));
    if (!usuarioData) {
        alert("No se encontró información del usuario.");
        return;
    }

    const cardNumber = document.getElementById("cardNumber").value;
    const expiryDate = document.getElementById("expiryDate").value;
    const cvv = document.getElementById("cvv").value;

    try {
        const response = await fetch(${API_BASE}/envios/, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                usuario: usuarioData.usuario,
                metodo_pago: "Tarjeta",
                numero_tarjeta: cardNumber,
                fecha_caducidad: expiryDate,
                codigo_cvv: cvv,
                producto_id: currentProductId
            })
        });
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || "Error en el registro del envío");
        }
        const result = await response.json();
        alert(result.message);

        // Registra la garantía una vez realizada la compra
        await registerWarranty(usuarioData.usuario, currentProductId);
        document.getElementById("paymentForm").reset();
        showSection("productsSection");
    } catch (error) {
        console.error("Error en el pago:", error.message);
        alert("Error en el pago: " + error.message);
    }
}

async function registerWarranty(usuario, productId) {
    try {
        const response = await fetch(${API_BASE}/garantias/, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ usuario, producto_id: productId })
        });
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || "Error en el registro de la garantía.");
        }
        alert("Garantía registrada con éxito.");
    } catch (error) {
        console.error("Error al registrar garantía:", error.message);
        alert("Error al registrar garantía: " + error.message);
    }
}

async function loadWarranty() {
    try {
        const usuarioData = JSON.parse(localStorage.getItem("usuarioData"));
        if (!usuarioData) {
            alert("No se encontró información del usuario.");
            return;
        }
        const response = await fetch(${API_BASE}/garantias/${usuarioData.usuario});
        if (!response.ok) throw new Error("Error al obtener garantías.");

        let garantiaData = await response.json();

        // Si garantiaData no es un arreglo, lo convertimos en arreglo
        if (!Array.isArray(garantiaData)) {
            garantiaData = [garantiaData];
        }

        const warrantyContainer = document.getElementById("warrantyInfo");
        warrantyContainer.innerHTML = "";

        if (!garantiaData || garantiaData.length === 0) {
            warrantyContainer.innerHTML = "<p>No tienes garantías registradas.</p>";
        } else {
            garantiaData.forEach(garantia => {
                warrantyContainer.innerHTML += `
                    <div class="card mb-3">
                        <div class="card-body">
                            <h5 class="card-title">Garantía para Producto ID: ${garantia.producto_id}</h5>
                            <p class="card-text"><strong>Fecha de compra:</strong> ${garantia.fecha_compra}</p>
                            <p class="card-text"><strong>Fecha de expiración:</strong> ${garantia.fecha_expiracion_garantia}</p>
                            <p class="card-text"><strong>Estado:</strong> ${garantia.estado}</p>
                        </div>
                    </div>
                `;
            });
        }
        showSection("warrantySection");
    } catch (error) {
        console.error("Error al cargar garantías:", error.message);
        alert("Error al cargar garantías: " + error.message);
    }
}

function showWarranty() {
    loadWarranty();
}

function logout() {
    localStorage.removeItem("usuarioData");
    showSection("loginSection");
}

document.addEventListener("DOMContentLoaded", () => {
    showSection("loginSection");
});
