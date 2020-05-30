export class Student {
    id: number;
    serial : string;
    name: string;
    firstName: string;
    courseId : number;
    groupId : number; 
    

    constructor(id:number, name:string, firstName:string,
        courseId:number, groupId:number){
        this.id = id;
        this.name = name;
        this.firstName = firstName;
        this.courseId = courseId;
        this.groupId = groupId;
    }
  }