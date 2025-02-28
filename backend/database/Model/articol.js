class Articol {
    constructor(titlu, continut, fisier) {
        this.titlu = titlu;
        this.continut = continut;
        this.fisier = fisier;
    }

    afiseazaDetalii() {
        console.log(`Articol: ${this.titlu}`);
        console.log(`Continut: ${this.continut}`);
        console.log(`Autor: ${this.autor}`);
    }
}

module.exports = Articol;