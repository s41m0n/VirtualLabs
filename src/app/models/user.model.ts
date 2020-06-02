export class User {
    email : string;
    accessToken: string;
    role : string;

    constructor(email: string, accessToken: string, role: string){
        this.email = email;
        this.accessToken = accessToken;
        this.role = role;
    }
  }