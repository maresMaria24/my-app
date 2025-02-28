class Raspuns {
    constructor(text, autor, intrebareId) {
      this.text = text;
      this.autor = autor;
      this.dataCreare = new Date(); 
    }
  
    // Method to display details about the answer
    afiseazaDetalii() {
      console.log(`Raspuns: ${this.text}`);
      console.log(`Autor: ${this.autor}`);
      console.log(`Intrebare ID: ${this.intrebareId}`);
      console.log(`Data Creare: ${this.dataCreare}`);
      console.log(`Email: ${this.email}`);
    }
  }
  
  module.exports = Raspuns;
  