/**
 * An adapter for the ts-log interface that pushes logging to gulplog with optional arguments JSON encoded.
 * @packageDocumentation
 */

import * as GulpLog from "gulplog";
import { Logger } from "ts-log";

function log(prefix: string, logFn: (...args: any[]) => void, message: any, args: any[]) {
    // Handle args
    let processedArgs: null|string = null;
    if (args.length > 0) {
        // There are args, stringify them
        processedArgs = JSON.stringify(args);
    }

    // Handle message
    let processedMessage: string = prefix;
    if (typeof message === "string") {
        // All is well
        processedMessage += message;
    } else if (typeof message === "undefined") {
        // Make it clear the message is undefined
        processedMessage += "(undefined)";
    } else if (message === null) {
        // Make it clear the message is null
        processedMessage += "(null)";
    } else {
        // Final case, stringify it
        processedMessage += JSON.stringify(message);
    }

    if (processedArgs) {
        // Scenario 1, args provided
        logFn(processedMessage, processedArgs);
    } else {
        // Just a message
        logFn(processedMessage);
    }
}

/**
 * `gulplog` logging adapter.
 * @public
 */
export class GulpLogLogger implements Logger {
    private prefix: string;

    /**
     * @param prefix - Optionally annotate logs with a prefix such as the package name to identify log source.
     */
    constructor(prefix?: string) {
        if (prefix) {
            this.prefix = `${prefix}: `;
        } else {
            this.prefix = "";
        }
    }

    trace = (message?: any, ...optionalParams: any[]): void => {
        // Trace doesn't exist in gulplog so we need to note the actual log level and throw into debug
        function traceDecorate(message: any, ...args: any[]) {
            GulpLog.debug(`TRACE ${message}`, ...args);
        }
        log(this.prefix, traceDecorate, message, optionalParams);
    }
    debug = (message?: any, ...optionalParams: any[]): void => {
        log(this.prefix, GulpLog.debug, message, optionalParams);
    }
    info = (message?: any, ...optionalParams: any[]): void => {
        log(this.prefix, GulpLog.info, message, optionalParams);
    }
    warn = (message?: any, ...optionalParams: any[]): void => {
        log(this.prefix, GulpLog.warn, message, optionalParams);
    }
    error = (message?: any, ...optionalParams: any[]): void => {
        log(this.prefix, GulpLog.error, message, optionalParams);
    }
}
