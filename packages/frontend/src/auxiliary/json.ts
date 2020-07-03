class SafeJSON {
    static parse = <T>(input: any, defaultValue: T): T => {
        if (input == null) {
            return defaultValue;
        }

        try {
            return JSON.parse(input);
        } catch {
            return defaultValue;
        }
    };
}

export {SafeJSON};
