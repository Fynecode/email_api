import { InvalidEmailError } from "../errors/invalid-email-error.js";

export class EmailAddress {

    private readonly value: string;


    constructor(value: string) {

        if (!this.isValid(value)) {
            throw new InvalidEmailError(
                value
            );
        }

        this.value = value;
    }


    private isValid(email:string):boolean {

        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/
            .test(email);

    }


    getValue():string {
        return this.value;
    }

}