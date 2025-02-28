class Cont {
    constructor(utilizator, email, parola,rol,acces=null,linkCv='',cursuri=[]) {
        this.utilizator = utilizator;
        this.email = email;
        this.parola = parola;
        this.rol = rol;
        this.acces = acces;
        this.linkCv=linkCv;
        this.cursuri=cursuri;
    }

    afiseazaDetalii() {
        console.log(`Utilizator: ${this.utilizator}`);
        console.log(`Email: ${this.email}`);
        console.log(`Parola: ${this.parola}`);
        console.log(`Rol: ${this.rol}`);
        console.log(`Acces: ${this.acces}`);
        console.log(`Link CV: ${this.linkCv}`);
        console.log(`Cursuri: ${this.cursuri}`);
    }
    
}
module.exports = Cont;