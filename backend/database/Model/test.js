class QuizResult {
    constructor(studentId, studentName, studentEmail, quizTitle, lessonId, lessonTitle, answers = [], comentariu = '', nota = null) {
      this.studentId = studentId;
      this.studentName = studentName;
      this.studentEmail = studentEmail;
      this.quizTitle = quizTitle;
      this.lessonId = lessonId;
      this.lessonTitle = lessonTitle;
      this.answers = answers; 
      this.comentariu = comentariu;
      this.nota = nota;
      this.submittedAt = new Date();
      this.evaluat = false;
      this.evaluatLa = null;
    }
  
    afiseazaRezumat() {
      console.log(`Quiz: ${this.quizTitle}`);
      console.log(`Student: ${this.studentName}`);
      console.log(`Lecție: ${this.lessonId}`);
      console.log(`Răspunsuri:`);
      this.answers.forEach((a, i) => {
        console.log(`  ${i + 1}. ${a.intrebare}`);
        console.log(`     Răspuns elev: ${a.raspunsStudent}`);
        console.log(`     Răspuns corect: ${a.raspunsCorect}`);
      });
      console.log(`Comentariu: ${this.comentariu}`);
      console.log(`Notă: ${this.nota !== null ? this.nota : 'Neacordată'}`);
      console.log(`Evaluat: ${this.evaluat ? 'DA' : 'NU'}`);
      console.log(`Evaluat la: ${this.evaluatLa ? this.evaluatLa.toLocaleString() : 'N/A'}`);
    }
  }
  
  module.exports = QuizResult;
  