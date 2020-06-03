import { Team } from './team.model';

export class Student {
    id: number;
    serial : string;
    name: string;
    firstName: string;
    courseId : number;
    teamId: number;
    team?: Team;
    
    constructor(id:number = 0, name:string = '', firstName:string = '',
        courseId:number = 0, teamId: number = 0){
        this.id = id;
        this.name = name;
        this.firstName = firstName;
        this.courseId = courseId;
    }
    
    static export(student : Student) : Student {
        delete student.team;
        return student;
    }
  }