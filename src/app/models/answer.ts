export class Answer {
    id: number = -1;
    questionId: number = -1;
    answer: string = "";
    correct: boolean = false;
    questionText: string = "";
    quizId: number = -1;
    userId: number = -1;

    constructor() {
        this.id = -1;
        this.questionId = -1;
        this.answer = "";
        this.correct = false;
        this.questionText = "";
        this.quizId = -1;
        this.userId = -1;
    }

    copyAnswer(answer: Answer) {
        this.id = answer.id;
        this.questionId = answer.questionId;
        this.answer = answer.answer;
        this.correct = answer.correct;
        this.questionText = answer.questionText;
        this.quizId = answer.quizId;
        this.userId = answer.userId;
    }
}