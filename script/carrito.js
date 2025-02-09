// Carrito

document.querySelectorAll('#restar').forEach(boton => {
    boton.addEventListener('click', (event) => operacion("resta", event));
});

document.querySelectorAll('#sumar').forEach(boton => {
    boton.addEventListener('click', (event) => operacion("suma", event));
});

document.querySelectorAll('.precio').forEach(div => {
    const link = div.querySelector('a');
    link.addEventListener('click', (event) => {
        event.preventDefault();
        borrarProductoLink(event.target.closest('a'));
    });
});

document.querySelectorAll('.check-producto').forEach(check => {
    check.addEventListener('change', () => {
        calcularTotal();
        activarBotones();
    })});

const botonAtras = document.getElementById('botones').children[0];
const botonContinuar = document.getElementById('botones').children[1];

document.getElementById('pasos').addEventListener('click', (event) => {
    let elemento = event.target.closest('.paso.pasado');
    
    calcularPaso(elemento);
    mover();
});

let paso = 1;
botonAtras.disabled = true;

botonContinuar.addEventListener('click', () => {
    paso += 1;
    mover();
});

botonAtras.addEventListener('click', () => {
    paso -= 1;
    mover();
});

let subtotalAside = document.getElementById('subtotal');
let IGICAside = document.getElementById('impuestos');
let totalAside = document.getElementById('total');

activarBotones();
fueraDeStock();
calcularTotal();

function calcularPaso(elemento) {
    let destino = parseInt(elemento.querySelector('span').textContent);
    let posicion = parseInt(document.querySelector('.paso.activo span').textContent);
    
    paso -= (posicion - destino);
}

function borrarProductoCantidad(boton) {
    let checkbox = boton.parentElement.parentElement.parentElement.previousElementSibling.previousElementSibling.children[0].children[0];
    let div = boton.parentElement.parentElement.parentElement.parentElement;
    checkbox.checked = false;
    div.remove();
    calcularTotal();
    activarBotones();
}

function borrarProductoLink(a) {
    let checkbox = a.parentElement.parentElement.parentElement.previousElementSibling.previousElementSibling.children[0].children[0];
    let div = a.parentElement.parentElement.parentElement.parentElement;
    checkbox.checked = false;
    div.remove();
    calcularTotal();
    activarBotones();
}

function calcularTotal() {
    let divPrecios = document.querySelectorAll('.unitario');

    let subtotal = 0;
    let IGIC = 0;
    let total = 0;

    divPrecios.forEach(div => {
        let checkbox = div.parentElement.parentElement.parentElement.previousElementSibling.previousElementSibling.children[0].children[0];
        let precio = parseFloat(div.textContent.slice(1));

        if (checkbox.checked === true) {
            subtotal += precio;
        }
    })

    IGIC = subtotal * 0.07;
    total = IGIC + subtotal;

    subtotalAside.textContent = `Subtotal: €${subtotal.toFixed(2)}`;
    IGICAside.textContent = `IGIC (7%): €${IGIC.toFixed(2)}`;
    totalAside.textContent = `Total: €${total.toFixed(2)}`;
}

function calcularPrecio(precioUnitario, precioProducto, accion) {
    let nuevoPrecio = accion === "resta" 
        ? precioUnitario - precioProducto 
        : precioUnitario + precioProducto;

    return nuevoPrecio.toFixed(2); // Siempre devuelve dos decimales
}

function operacion(accion, event) {
    const boton = event.target; // Capturamos el botón al que hacemos click.
    const divPrecioUnitario = boton.parentElement.previousElementSibling.children[0];
    const divPrecioProducto = boton.parentElement.previousElementSibling.children[1];

    let precioUnitario = parseFloat(divPrecioUnitario.textContent.slice(1)); // Accedemos al valor del precio unitario
    let precioProducto = parseFloat(divPrecioProducto.textContent.slice(1, -6)); // Accedemos al valor del precio por producto
    
    let cantidadSpan = boton.nextElementSibling || boton.previousElementSibling; // JS detecta automáticamente cuál es el elemento correcto
    let cantidad = parseInt(cantidadSpan.textContent);


    if (accion === "resta" && cantidad > 1) {
        cantidad--;
    } else if (accion === "suma" && cantidad < 99) {
        cantidad++;
    } else if (accion === "resta" && cantidad === 1) {
        const confirmacion = window.confirm("¿Está seguro de que desea borrar este elemento?")

        if (confirmacion) {
            borrarProductoCantidad(boton);
            calcularTotal();
        }

        else {
            return;
        }
    }
    else {
        return;
    }

    cantidadSpan.textContent = cantidad;
    divPrecioUnitario.textContent = `€${calcularPrecio(precioUnitario, precioProducto, accion)}`;
    calcularTotal();
}

function fueraDeStock() {
    const productoAgotado = document.querySelector('.producto-agotado');
    const inputsBotones = productoAgotado.querySelectorAll('input, button');

    inputsBotones.forEach(inputBoton => {
        inputBoton.disabled = true;
    })
}

function activarBotones() {
    let cuentaProductos = Array.from(document.querySelectorAll('.check-producto')).filter(checkbox => checkbox.checked).length;

    cuentaProductos < 1 ? botonContinuar.disabled = true : botonContinuar.disabled = false;
}

function pasarPagina() {
    paso += 1;
    mover();
}

function retrocederPagina() {
    paso -= 1;
    mover();
}

function mover() {
    let carrito = document.getElementById('carrito');
    let datosCliente = document.getElementById('datos-cliente');
    let sistemasPago = document.getElementById('sistemas-pago');
    let confirmacionCompra = document.getElementById('confirmacion-compra');
    let pasos = document.querySelectorAll('.paso');

    function actualizarPasos(paso) {
        pasos.forEach((p, index) => {
            p.classList.remove("activo", "pasado", "bloqueado");

            if (index < paso - 1) {
                p.classList.add("pasado");
            } else if (index === paso - 1) {
                p.classList.add("activo");
            } else {
                p.classList.add("bloqueado");
            }
        });
    }

    if (paso === 1) {
        carrito.style.display = "block";
        datosCliente.style.display = "none";
        sistemasPago.style.display = "none";
        confirmacionCompra.style.display = "none";

        botonAtras.disabled = true;
        botonContinuar.disabled = false;

        actualizarPasos(1);
    }
    
    if (paso === 2) {
        carrito.style.display = "none";
        datosCliente.style.display = "block";
        sistemasPago.style.display = "none";
        confirmacionCompra.style.display = "none";

        botonAtras.disabled = false;
        botonContinuar.disabled = false;

        actualizarPasos(2);
        comprobarValidezCliente();
    }
    
    if (paso === 3) {
        carrito.style.display = "none";
        datosCliente.style.display = "none";
        sistemasPago.style.display = "block";
        confirmacionCompra.style.display = "none";
        
        botonAtras.disabled = false;
        botonContinuar.disabled = false;

        actualizarPasos(3);
        validarPago();
    }
    
    if (paso === 4) {
        carrito.style.display = "none";
        datosCliente.style.display = "none";
        sistemasPago.style.display = "none";
        confirmacionCompra.style.display = "block";

        botonAtras.disabled = false;
        botonContinuar.disabled = false;

        actualizarPasos(4);
        rellenarConfirmacion();

        botonContinuar.addEventListener('click', finalizar);    

        function finalizar() {
            if (paso === 5) {
                alert("¡El proceso de compra ha finalizado exitosamente!");
                setTimeout(() => {
                window.location.href = "catalogo.html";
            }, 2000);}
        }
    }
}

// Datos del cliente
const camposObligatorios = document.querySelector('#checkout-form').querySelectorAll('input[required], select[required]');

camposObligatorios.forEach(campo => {
    campo.addEventListener('change', comprobarValidezCliente);
});

const paisEnvio = document.getElementById('pais_envio');
const zonaEnvio = document.getElementById('zona_envio');

function comprobarValidezCliente() {
    let completo = true;

    camposObligatorios.forEach(campo => {
        if (!campo.checkValidity()) {
            completo = false;
        }
    });

    if (paisEnvio.value === "Otro" || zonaEnvio.selectedIndex === 0) {
        completo = false;
    }

    completo === false ? botonContinuar.disabled = true : botonContinuar.disabled = false;
};

const checkbox = document.getElementById('facturacion_envio');
const datosEnvio = document.getElementById('datos_envio').querySelectorAll('input, select');

checkbox.addEventListener('change', rellenarFacturacion);
datosEnvio.forEach(dato => {
    dato.addEventListener('change', rellenarFacturacion);
});

function rellenarFacturacion() {
    const datosFacturacion = document.getElementById('datos_facturacion').querySelectorAll('input, select');

    if (checkbox.checked) {
        datosEnvio.forEach((dato, index) => {
            datosFacturacion[index + 1].disabled = false;
            datosFacturacion[index + 1].value = dato.value;
            datosFacturacion[index + 1].disabled = true;
        });
    }

    else {
        datosEnvio.forEach((dato, index) => {
            datosFacturacion[index + 1].disabled = false;
    });
}};

paisEnvio.addEventListener('change', limitarMetodos);

function limitarMetodos() {
    const opcionesEnvio = zonaEnvio.querySelectorAll('option');
    const errorEnvio = document.getElementById('error-envio');
    let valor = paisEnvio.value;
    
    if (valor === "España") {
        opcionesEnvio.forEach((option, index) => {
            if (index !== 0) {
                option.disabled = false;
            }
        })
        errorEnvio.style.display = "none";
        zonaEnvio.selectedIndex = 0;
        zonaEnvio.disabled = false;
    } 
    
    else if (valor === "Otro") {
        opcionesEnvio.forEach(option => {
            option.disabled = true;
        });
        errorEnvio.style.display = "block";
        zonaEnvio.selectedIndex = 0;
        zonaEnvio.disabled = true;
        comprobarValidezCliente();
    }
    
    else {
        opcionesEnvio.forEach((option, index) => {
            if (index == 2) {
                option.disabled = false;
            } else {
                option.disabled = true;
            }
        })
        errorEnvio.style.display = "none";
        zonaEnvio.disabled = false;
    }
};

const ecologicos = document.getElementById('ecologicos');
const reciclado = document.getElementById('reciclado');
const ecologicosTotal = document.getElementById('ecologicos-total');
const recicladoTotal = document.getElementById('reciclado-total');

ecologicos.addEventListener('change', calcEcologicos);
reciclado.addEventListener('change', calcReciclado);

let subtotal = document.getElementById('subtotal').textContent.slice(11);

function calcEcologicos() {
    let porcentaje;

    if (ecologicos.checked) {
        porcentaje = parseFloat(subtotal) * 0.1;
        ecologicosTotal.textContent = `Muebles ecológicos: + €${porcentaje.toFixed(2)}`;
        ecologicosTotal.style.display = "block";
    } else {
        ecologicosTotal.textContent = `Muebles ecológicos: + €0`;
        ecologicosTotal.style.display = "none";
    }

    sumaFinal();
}

function calcReciclado() {
    let porcentaje;

    if (reciclado.checked) {
        porcentaje = parseFloat(subtotal) * -0.1;
        recicladoTotal.textContent = `Muebles reciclados: - €${(porcentaje * -1).toFixed(2)}`;
        recicladoTotal.style.display = "block";
    } else {
        recicladoTotal.textContent = `Muebles reciclados: - €0`;
        recicladoTotal.style.display = "none";
    }

    sumaFinal();
}

let costeEnvio;
const envioTotal = document.getElementById('envio-total');

zonaEnvio.addEventListener('change', calcEnvio);

function calcEnvio() {
    if (zonaEnvio.selectedIndex === 1) {
        costeEnvio = 9.99;
        envioTotal.textContent = `Envío: + €${costeEnvio}`
        envioTotal.style.display = "block";
    } else if (zonaEnvio.selectedIndex === 2) {
        costeEnvio = 4.99;
        envioTotal.textContent = `Envío: + €${costeEnvio}`
        envioTotal.style.display = "block";
    } else {
        envioTotal.textContent = `Envío: `
        envioTotal.style.display = "none";
        comprobarValidezCliente();
    }

    sumaFinal();
}

function sumaFinal() {
    let total = parseFloat(subtotalAside.textContent.slice(11)) + parseFloat(IGICAside.textContent.slice(12));

    if (ecologicos.checked) {
        total += parseFloat(ecologicosTotal.textContent.slice(23));
    }

    if (reciclado.checked) {
        total -= parseFloat(recicladoTotal.textContent.slice(23));
    }

    if (zonaEnvio.selectedIndex != 0) {
        total += parseFloat(envioTotal.textContent.slice(10));
    }

    totalAside.textContent = `Total: €${total.toFixed(2)}`;
}

const selectMetodosPago = document.getElementById('select-metodos-pago');

selectMetodosPago.addEventListener('change', mostrarPago);

const divTarjeta = document.getElementById('div-tarjeta');
const divPaypal = document.getElementById('div-paypal');
const divTransferencia = document.getElementById('div-transferencia');

const tarjetaInputs = divTarjeta.querySelectorAll('input');
const paypalInputs = divPaypal.querySelectorAll('input');
const transferenciaInputs = divTransferencia.querySelectorAll('input');

function mostrarPago() {
    if (selectMetodosPago.selectedIndex === 1) {
        divTarjeta.style.display = "block";
        divPaypal.style.display = "none";
        divTransferencia.style.display = "none";

        tarjetaInputs.forEach(input => {
            input.required = true;
        })

        paypalInputs.forEach(input => {
            input.required = false;
        })

        transferenciaInputs.forEach(input => {
            input.required = false;
        })

    } else if (selectMetodosPago.selectedIndex === 2) {
        divTarjeta.style.display = "none";
        divPaypal.style.display = "block";
        divTransferencia.style.display = "none";

        tarjetaInputs.forEach(input => {
            input.required = false;
        })

        paypalInputs.forEach(input => {
            input.required = true;
        })

        transferenciaInputs.forEach(input => {
            input.required = false;
        })
    } else if (selectMetodosPago.selectedIndex === 3) {
        divTarjeta.style.display = "none";
        divPaypal.style.display = "none";
        divTransferencia.style.display = "block";

        tarjetaInputs.forEach(input => {
            input.required = false;
        })

        paypalInputs.forEach(input => {
            input.required = false;
        })

        transferenciaInputs.forEach(input => {
            input.required = true;
        })
    } else {
        divTarjeta.style.display = "none";
        divPaypal.style.display = "none";
        divTransferencia.style.display = "none";
    }

    validarPago();
}

const datosPago = document.getElementById('datos-pago');
const inputsPago = datosPago.querySelectorAll('input');

inputsPago.forEach(input => {
    input.addEventListener('input', validarPago);
});

function validarPago() {
    let valido = true;

    inputsPago.forEach(input => {
        if (!input.checkValidity()) {
            valido = false;
        }
    }); 

    valido === true ? botonContinuar.disabled = false : botonContinuar.disabled = true;
}

function rellenarConfirmacion() {
    const tablaCarrito = document.getElementById('tabla-carrito-confirmacion');
    const datosCliente = document.getElementById('lista-datos-cliente-confirmacion');
    const listaPago = document.getElementById('lista-pago-confirmacion');
    const checkoutForm = document.getElementById('checkout-form');
    const formPago = document.getElementById("sistemas-pago-form");

    tablaCarrito.innerHTML = "<tr><th>Nombre</th><th>Precio unitario</th><th>Total</th><th>Cantidad</th></tr>";

    const productosSeleccionados = document.querySelectorAll(".producto"); 

    productosSeleccionados.forEach(producto => {
        const checkbox = producto.querySelector(".check-producto");

        if (checkbox.checked) {
            const nombre = producto.querySelector(".nombre").textContent;
            const precioUnitario = producto.querySelector(".unitario").textContent.slice(1);
            const totalProducto = producto.querySelector(".total-producto").textContent.split(" ")[0].slice(1);
            const cantidad = producto.querySelector(".cantidad-inner").textContent;

            const tr = document.createElement("tr");
            tr.innerHTML = `
                <td>${nombre}</td>
                <td>€${precioUnitario}</td>
                <td>€${totalProducto}</td>
                <td>${cantidad}</td>
            `;
            tablaCarrito.appendChild(tr);
        }
    });

    datosCliente.innerHTML = '';

    const elementos = document.querySelectorAll('#checkout-form input, #checkout-form select');

    elementos.forEach(elemento => {
        if (elemento.name && (elemento.value || elemento.checked)) {
            let nombreCampo = elemento.closest('label')?.textContent.trim() || elemento.previousElementSibling.textContent.trim()
            let valorCampo = '';

            if (elemento.tagName === 'SELECT') {
                valorCampo = elemento.options[elemento.selectedIndex].text;
            } else if (elemento.type === 'checkbox') {
                valorCampo = elemento.checked ? 'Sí' : 'No';
            } else {
                valorCampo = elemento.value;
            }

            if (valorCampo) {
                const li = document.createElement('li');
                li.innerHTML = `<strong>${nombreCampo}</strong> ${valorCampo}`;
                datosCliente.appendChild(li);
            }
        }
    });

    listaPago.innerHTML = "";
    const metodoPago = document.getElementById("select-metodos-pago").value;
    const itemMetodo = document.createElement("li");
    itemMetodo.innerHTML = `<strong>Método de pago:</strong> ${metodoPago.charAt(0).toUpperCase() + metodoPago.slice(1)}`;
    listaPago.appendChild(itemMetodo);
    
    if (metodoPago === "tarjeta") {
        const numeroTarjeta = document.getElementById("numero-tarjeta").value;
        const titular = document.getElementById("titular").value;
        if (numeroTarjeta.length === 16) {
            const numeroOculto = "**** **** **** " + numeroTarjeta.slice(-4);
            const itemTarjeta = document.createElement("li");
            itemTarjeta.innerHTML = `<strong>Tarjeta:</strong> ${numeroOculto} (${titular})`;
            listaPago.appendChild(itemTarjeta);
        }
    } else if (metodoPago === "paypal") {
        const correoPaypal = document.getElementById("correo-paypal").value;
        if (correoPaypal.trim()) {
            const itemPaypal = document.createElement("li");
            itemPaypal.innerHTML = `<strong>PayPal:</strong> ${correoPaypal}`;
            listaPago.appendChild(itemPaypal);
        }
    } else if (metodoPago === "transferencia") {
        const itemTransferencia = document.createElement("li");
        itemTransferencia.innerHTML = `<strong>Transferencia bancaria:</strong> Confirmado`;
        listaPago.appendChild(itemTransferencia);
    }
}

const enlacesConfirmacion = document.getElementById('enlaces-confirmacion').querySelectorAll('button');

enlacesConfirmacion[0].addEventListener('click', () => {
    paso = 1;
    mover();
})

enlacesConfirmacion[1].addEventListener('click', () => {
    paso = 2;
    mover();
    
    const datosEnvio = document.getElementById('datos_envio');
    if (datosEnvio) {
        datosEnvio.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
});

enlacesConfirmacion[2].addEventListener('click', () => {
    paso = 2;
    mover();

    const datosFacturacion = document.getElementById('datos_facturacion');
    if (datosFacturacion) {
        datosFacturacion.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
})

enlacesConfirmacion[3].addEventListener('click', () => {
    paso = 2;
    mover();

    const datosContacto = document.getElementById('datos_contacto');
    if (datosContacto) {
        datosContacto.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
})

enlacesConfirmacion[4].addEventListener('click', () => {
    paso = 3;
    mover();
})