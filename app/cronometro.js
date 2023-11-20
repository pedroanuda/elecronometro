export default class Cronometro {
    #elemento; #interval; #display;
    #horas = 0; #minutos = 0; #segundos = 0;

    /** @param {str} idElemento Id do span que servirá como display. */
    constructor (idElemento) {
        this.#elemento = document.getElementById(idElemento);
    }

    /** Inicia ou retoma o cronômetro. */
    iniciar() {
        if (this.#interval) return;

        this.#interval = setInterval(() => {
            this.#segundos++;

            if (this.#segundos >= 60) {this.#minutos++; this.#segundos = 0}
            if (this.#minutos >= 60) {this.#horas++; this.#minutos = 0}

            this.#display = Cronometro.tempoParaString(this.#horas, this.#minutos, this.#segundos);
            this.#elemento.textContent = this.#display;
        }, 1000);
    }

    /** Pausa o cronômetro. */
    pausar() {clearInterval(this.#interval); this.#interval = null}

    /** Para e reseta o cronômetro. */
    parar() {
        clearInterval(this.#interval);
        this.#interval = null;

        this.#segundos = 0;
        this.#minutos = 0;
        this.#horas = 0;

        this.#display = `00:00:00`
        this.#elemento.textContent = this.#display;
    }

    /**
     * Gera uma string no formato HH:MM:SS.
     * @param {number} hora Horas usadas.
     * @param {number} minutos Minutos usados.
     * @param {number} segundos Segundos usados.
     * @returns {string}
     */
    static tempoParaString(hora, minutos, segundos) {
        return `${hora < 10 ? 0 : ""}${hora}:${minutos < 10 ? 0 : ""}${minutos}:${segundos < 10 ? 0 : ""}${segundos}`;
    }
}