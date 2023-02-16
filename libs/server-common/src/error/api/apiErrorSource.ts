/**
 * An enumeration used to describe the location of the data in error within a
 * [[ApiErrorSource]].
 *
 * Note that these have been defined as string enums so that they can be printed out
 * in a human readable format.
 *
 * @see {@link "https://www.typescriptlang.org/docs/handbook/enums.html#string-enums"}
 */
enum ApiErrorLocation {

    /**
     * Indicates the message relates to a property within the request
     * object. The pointer property should be populated in this case.
     */
    REQUEST = 'REQUEST',

    /**
     * Indicates the message relates to a query parameter. The parameter
     * property should be populated in this case.
     */
    QUERY = 'QUERY',

    /**
     * Indicates the message relates to the identifier of the REST resource. The
     * parameter property may optionally be populated in this case.
     */
    ID = 'ID'
}

/**
 * An object containing references to the source of an API error within an
 * [[ApiError]] object.
 */
class ApiErrorSource {

    /** A JSON Pointer [RFC6901] to the associated entity in the request document. */
    public pointer?: string;

    /** An (optional) string indicating the URI query parameter that caused the error. */
    public parameter?: string;

    /**
     * An [[ApiErrorLocation]] describing the place within the incoming HTTP
     * request { `REQUEST`, `QUERY`, `ID` } within which the error was detected.
     */
    public location?: ApiErrorLocation;

    /**
     *
     * @param {ApiErrorLocation} location An [[ApiErrorLocation]] describing the
     * place within the incoming HTTP request within which the error was detected.
     * @param {string} pointer A JSON Pointer [RFC6901] to the associated entity
     * in the request document.
     * @param {string} parameter A string indicating the URI query parameter
     * that caused the error.
     */
    public constructor(location: ApiErrorLocation, pointer?: string, parameter?: string) {
        this.location = location;
        this.pointer = pointer;
        this.parameter = parameter;
    }

}

export { ApiErrorSource, ApiErrorLocation };

