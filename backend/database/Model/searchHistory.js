class searchHistory {
    constructor(user, query, matched_courses, timestamp) {
      this.user = user;
      this.query = query;
      this.matched_courses = matched_courses;
      this.timestamp = timestamp;
     
    }
  
    // Metodă pentru a afișa detalii despre curs
    afiseazaDetalii() {
      console.log('User ', `${this.user}`);
    }
  }
  
  module.exports = searchHistory;
  