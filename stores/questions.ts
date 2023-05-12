import { defineStore } from "pinia";
export interface questionInterface {
  choices: {
    id: string;
    title: string;
    image: string | null;
  }[];
  selectedAnswer: string;
  id: string;
  title: string;
  image: string | null;
}
export interface responseInterface
{
  questionId : string;
  choiceId : string;
}
export interface stateInterface {
  questionList: questionInterface[];
  queue : responseInterface[];
  testTakerId : string;
  examId : string;
  timeTracker : number;
  currentQuestion: number;

}
export const useQuestionListStore = defineStore("questionList", {
  state: () => {
 return  {  
    questionList: [] as questionInterface[] ,
    // queue : [] as responseInterface[],
    testTakerId : '',
    examId : '',
    timeTracker : 0,
    currentQuestion: 0,
    }
  },  
  getters: {
    // getTimeTracker : (state: stateInterface) => {
    //   return state.timeTracker;
    // },
 
   
    
  },

  actions: {
    setTimeTracker(timeTracker : number){
      this.timeTracker = timeTracker;
    },
    decrementTimeTracker(){
      if(this.timeTracker > 0)
      {
          this.timeTracker  = this.timeTracker - 3;
      }    
    },
    setTestTaker(testTakerId : string){
      this.testTakerId = testTakerId;
    },
    setExamId(examId : string){
      this.examId = examId;
    },
    regiseterResponse(questionId: string, choiceId: string) {
      if(this.timeTracker > 0 ){
        const question = this.questionList.find((obj) => obj.id === questionId);
        if (question) {
          question.selectedAnswer = choiceId;
        }
        // this.queue.push({questionId,choiceId});
      }
    },
    setQuestions(questions: questionInterface[]) {
     this.questionList = questions;
    },
    getAllQuestions() {
        return this.questionList;
    },
    getQuestionsLength() {
      return this.questionList.length;
    },
    getCurrentQuestion() {
      return this.questionList[this.currentQuestion];
    },
    setPrevQuestion() {
      if (this.currentQuestion > 0) {
        this.currentQuestion--;
      }
    },
    setNextQuestion() {
      if (this.currentQuestion < this.questionList.length - 1) {
        this.currentQuestion++;
      }
     
    },
    // getQueue(){
    //   return this.queue;
    // },
    // getQueueLength(){
    //   return this.queue.length;
    // },
    // getFirstItem(){
    //   return this.queue[0];
    // },
    // removeFirstItem(){
    //   this.queue.shift();
    // }
    
  
 
  },
  
  persist: {
    storage: persistedState.localStorage,
  },
}
);
