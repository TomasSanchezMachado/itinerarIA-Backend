"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MongoExceptionConverter = void 0;
const core_1 = require("@mikro-orm/core");
class MongoExceptionConverter extends core_1.ExceptionConverter {
    /* istanbul ignore next */
    /**
     * @link https://gist.github.com/rluvaton/a97a8da46ab6541a3e5702e83b9d357b
     */
    convertException(exception) {
        switch (exception.code) {
            case 48:
                return new core_1.TableExistsException(exception);
            case 11000:
                return new core_1.UniqueConstraintViolationException(exception);
        }
        return super.convertException(exception);
    }
}
exports.MongoExceptionConverter = MongoExceptionConverter;
