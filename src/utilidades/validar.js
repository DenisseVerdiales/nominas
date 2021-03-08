export function soloLetras(evento) {
    const pattern = /^[a-zA-Z\s]*$/;
    if (!pattern.test(evento.target.value)) {
        evento.target.value = evento.target.value.replace(/[^a-zA-Z\s]/g, "");

    }
}

export function NumerosLetras (evento) {
    const pattern = /^[a-zA-Z0-9-.#\s@_]*$/;
    if (!pattern.test(evento.target.value)) {
        evento.target.value = evento.target.value.replace(/[^a-zA-Z0-9-.#\s@_]/g, "");

    }
}