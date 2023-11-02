class GeneralError extends Error {
    constructor(errorCode,message) {
        super();
        
        this.errorCode=errorCode
        this.message = message;

        if(typeof message == 'undefined'){
        this.message = errorCode;
        this.errorCode = null;
        }
    }
    

    getCode() {
        if (this instanceof BadRequest) {
            return 400;
        } 
        else if (this instanceof NotFound) {
            return 404;
        }
        else if (this instanceof Forbidden) {
            return 403;
        } 
        else if (this instanceof Unauthorized) {
            return 401;
        }
        return 500;
    }
}

class BadRequest extends GeneralError { }
class NotFound extends GeneralError { }
class Forbidden extends GeneralError { }
class Unauthorized extends GeneralError { }
class InternalServerError extends GeneralError { }

module.exports = {
    GeneralError,
    BadRequest,
    NotFound,
    Forbidden,
    Unauthorized,
    InternalServerError
}