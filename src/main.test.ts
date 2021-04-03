import test from "ava";
import glogg from "glogg";
import { GulpLogLogger } from "@userfrosting/ts-log-adapter-gulplog";

const gloggChannel = glogg("gulplog");

test("Validate exports", t => {
    t.assert(typeof GulpLogLogger === "function", "GulpLogLogger named export is wrong type");
});

test("Behavior", t => {
    function assert(testFn: () => void, expected: { event: string, message: string }) {
        let caught = false;
        function assess(event: any) {
            caught = true;
            t.is(event, expected.message);
        }
        gloggChannel.on(expected.event, assess);
        testFn();
        gloggChannel.off(expected.event, assess);
        if (!caught) t.fail("No log was caught from glogg");
    }

    const logger = new GulpLogLogger();
    const loggerAnnotated = new GulpLogLogger("pkg");

    function createAssertions(logFn: (message?: any, ...optionalArgs: any[]) => void, gulpLogLevel: string, messagePrefix?: string) {
        messagePrefix = messagePrefix ?? "";
        assert(() => logFn(), { event: gulpLogLevel, message: messagePrefix + "(undefined)"});
        assert(() => logFn(undefined), { event: gulpLogLevel, message: messagePrefix + "(undefined)"});
        assert(() => logFn(null), { event: gulpLogLevel, message: messagePrefix + "(null)"});
        assert(() => logFn(123), { event: gulpLogLevel, message: messagePrefix + "123" });
        assert(() => logFn("trace-message"), { event: gulpLogLevel, message: messagePrefix + "trace-message" });
        assert(() => logFn("trace-message", 123, { foo: "bar" }), { event: gulpLogLevel, message: messagePrefix + `trace-message [123,{"foo":"bar"}]` });
        assert(() => logFn({ foo: "bar" }), { event: gulpLogLevel, message: messagePrefix + `{"foo":"bar"}` });
        assert(() => logFn({ foo: "bar" }, { alpha: "beta" }), { event: gulpLogLevel, message: messagePrefix + `{"foo":"bar"} [{"alpha":"beta"}]` });
    }

    // Trace
    createAssertions(logger.trace, "debug", "TRACE ");
    createAssertions(loggerAnnotated.trace, "debug", "TRACE pkg: ");

    // Debug
    createAssertions(logger.debug, "debug");
    createAssertions(loggerAnnotated.debug, "debug", "pkg: ");

    // Info
    createAssertions(logger.info, "info");
    createAssertions(loggerAnnotated.info, "info", "pkg: ");

    // Warn
    createAssertions(logger.warn, "warn");
    createAssertions(loggerAnnotated.warn, "warn", "pkg: ");

    // Error
    createAssertions(logger.error, "error");
    createAssertions(loggerAnnotated.error, "error", "pkg: ");
});
