import { ExceptionConverter, type Dictionary, type DriverException } from '@mikro-orm/core';
export declare class MongoExceptionConverter extends ExceptionConverter {
    /**
     * @link https://gist.github.com/rluvaton/a97a8da46ab6541a3e5702e83b9d357b
     */
    convertException(exception: Error & Dictionary): DriverException;
}
