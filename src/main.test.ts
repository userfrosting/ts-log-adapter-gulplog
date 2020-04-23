import test from "ava";
import glogg from "glogg";
import { GulpLogLogger } from "./main";

const gloggChannel = glogg("gulplog");

test("The lot", t => {
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
    createAssertions(logger.trace, "debug", "TRACE: ");

    // Debug
    createAssertions(logger.debug, "debug");

    // Info
    createAssertions(logger.info, "info");

    // Warn
    createAssertions(logger.warn, "warn");

    // Error
    createAssertions(logger.error, "error");
});
