// Keep this reporter beside the default reporter: it emits counts only and
// never serializes test modules, error messages, titles, or assertion values.
export default class VitestMetricsReporter {
    /**
     * @param {ReadonlyArray<unknown>} _testModules
     * @param {ReadonlyArray<unknown>} unhandledErrors
     */
    onTestRunEnd(_testModules, unhandledErrors) {
        process.stdout.write(`Unhandled errors: ${unhandledErrors.length}\n`);
    }
}
