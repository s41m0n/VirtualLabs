export class Course {
    id: number;
    name: string;
    path: string;

    constructor(id: number = 0, name: string = '', path: string = ''){
        this.id = id;
        this.name = name;
        this.path = path;
    }
  }