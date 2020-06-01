export class User {
    email : string;
    accessToken: string;

    constructor(email: string, accessToken: string){
        this.email = email;
        this.accessToken = accessToken;
    }
  }