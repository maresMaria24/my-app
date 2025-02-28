class Intrebare {
    constructor(titlu, descriere, autor,curs, comentarii = []) {
      this.titlu = titlu;
      this.descriere = descriere;
      this.autor = autor;
      this.curs = curs;
      this.comentarii = comentarii; // Array to hold IDs of comments
      this.dataCreare = new Date(); // Automatically set the creation date
    }
  
    // Method to display details about the question
    afiseazaDetalii() {
      console.log(`Titlu: ${this.titlu}`);
      console.log(`Descriere: ${this.descriere}`);
      console.log(`Autor: ${this.autor}`);
      console.log(`Data Creare: ${this.dataCreare}`);
    }
  }
  
  module.exports = Intrebare;
  