class Lectie {
    constructor(titlu, continut, fisier, articole = []) {
      this.titlu = titlu;
      this.continut = continut;
      this.fisier = fisier;
      this.articole = articole;
    }
  
    afiseazaDetalii() {
      console.log(`Titlu: ${this.titlu}`);
      console.log(`Continut: ${this.continut}`);
      console.log(`Fisier: ${this.fisier}`);
    }
  }
  
  module.exports = Lectie;
