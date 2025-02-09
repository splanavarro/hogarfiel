function cambiarLuz() {
    document.documentElement.classList.toggle('dark-mode');
    const isDarkMode = document.documentElement.classList.contains('dark-mode');
    localStorage.setItem('dark-mode', isDarkMode);
}

function cambiarContraste() {
    document.documentElement.classList.toggle('contrast-mode');
    const isContrastMode = document.documentElement.classList.contains('contrast-mode');
    localStorage.setItem('contrast-mode', isContrastMode);
}

function cambiarTexto() {
    document.querySelector(".cambio-texto").style.display === "none" ? document.querySelector(".cambio-texto").style.display = "flex" : document.querySelector(".cambio-texto").style.display = "none";
}

let textoMedida = 1;

// Al cargar la página, recupera el valor del tamaño de la fuente desde el localStorage si existe
window.addEventListener('load', () => {
    const darkMode = localStorage.getItem('dark-mode') === 'true';
    const contrastMode = localStorage.getItem('contrast-mode') === 'true';

    const storedSize = localStorage.getItem('texto-medida');

    if (darkMode) {
        document.documentElement.classList.add('dark-mode');
    }
    if (contrastMode) {
        document.documentElement.classList.add('contrast-mode');
    }

    if (storedSize) {
        textoMedida = parseFloat(storedSize);
        document.documentElement.style.setProperty('--texto-medida', `${textoMedida}em`);
    }
});

function reducirTexto() {
    textoMedida > 0.8 ? textoMedida -= 0.1 : null;
    document.documentElement.style.setProperty('--texto-medida', `${textoMedida}em`);
    localStorage.setItem('texto-medida', textoMedida); // Guardamos el tamaño en el localStorage
}

function aumentarTexto() {
    textoMedida < 1.2 ? textoMedida += 0.1 : null;
    document.documentElement.style.setProperty('--texto-medida', `${textoMedida}em`);
    localStorage.setItem('texto-medida', textoMedida);
}

function restablecerTexto() {
    document.documentElement.style.setProperty('--texto-medida', '1em');
    textoMedida = 1;
    localStorage.setItem('texto-medida', textoMedida);
}