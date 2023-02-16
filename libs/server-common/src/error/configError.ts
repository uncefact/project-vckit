/**
 * This class is a JavaScript [[Error]] used to indicate that something has
 * gone wrong when attempting to retrieve application configuration using a
 * [[ConfigFactory]].
 */
class ConfigError extends Error {

    /**
     * Constructs a new [[ConfigError]].
     *
     * @param {string} message A description of the configuration error.
     */
    constructor(message?: string) {
        super(message);
    }
}

export { ConfigError };

