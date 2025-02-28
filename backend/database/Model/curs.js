class Curs {
  constructor(nume, descriere, nivel, autor, lectii = [],categorie) {
    this.nume = nume;
    this.descriere = descriere;
    this.nivel = nivel;
    this.autor = autor;
    this.lectii = lectii; // Adăugăm câmpul pentru lista de lecții
    this.categorie = categorie;
  }

  // Metodă pentru a afișa detalii despre curs
  afiseazaDetalii() {
    console.log(`Curs: ${this.nume}`);
    console.log(`Descriere: ${this.descriere}`);
    console.log(`Nivel: ${this.nivel}`);
    console.log(`Autor: ${this.autor}`);
  }
}

module.exports = Curs;
