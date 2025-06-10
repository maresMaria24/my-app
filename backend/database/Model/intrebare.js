class Intrebare {
    constructor(titlu, descriere, autor,curs, comentarii = []) {
      this.titlu = titlu;
      this.descriere = descriere;
      this.autor = autor;
      this.curs = curs;
      this.comentarii = comentarii;
      this.dataCreare = new Date();
    }
    afiseazaDetalii() {
      console.log(`Titlu: ${this.titlu}`);
      console.log(`Descriere: ${this.descriere}`);
      console.log(`Autor: ${this.autor}`);
      console.log(`Data Creare: ${this.dataCreare}`);
    }
  }
  
  module.exports = Intrebare;
  