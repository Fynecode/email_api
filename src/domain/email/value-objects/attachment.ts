export class Attachment {

    constructor(
        public readonly filename:string,
        public readonly content:Buffer,
        public readonly contentType:string
    ){
        this.validate();
    }


    private validate(){

        if(!this.filename){
            throw new Error(
                "Attachment filename required"
            );
        }


        if(this.content.length === 0){
            throw new Error(
                "Attachment cannot be empty"
            );
        }

    }

}