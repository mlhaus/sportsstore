"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Validator = void 0;
exports.isValid = isValid;
exports.getData = getData;
const validation_types_1 = require("./validation_types");
class Validator {
    rules;
    breakOnInvalid;
    constructor(rules, breakOnInvalid = true) {
        this.rules = rules;
        this.breakOnInvalid = breakOnInvalid;
    }
    async validate(data) {
        const vdata = Object.entries(this.rules).map(async ([key, rules]) => {
            const status = new validation_types_1.ValidationStatus(data?.[key] ?? "");
            const rs = (Array.isArray(rules) ? rules : [rules]);
            for (const r of rs) {
                if (!status.isInvalid || !this.breakOnInvalid) {
                    await r(status);
                }
            }
            return [key, status];
        });
        const done = await Promise.all(vdata);
        return Object.fromEntries(done);
    }
    validateOriginal(data) {
        const vdata = Object.entries(this.rules).map(([key, rules]) => {
            const status = new validation_types_1.ValidationStatus(data?.[key] ?? "");
            (Array.isArray(rules) ? rules : [rules])
                .forEach(async (rule) => {
                if (!status.isInvalid || !this.breakOnInvalid) {
                    await rule(status);
                }
            });
            return [key, status];
        });
        return Object.fromEntries(vdata);
    }
}
exports.Validator = Validator;
function isValid(result) {
    return Object.values(result)
        .every(r => r.isInvalid === false);
}
function getData(result) {
    return Object.fromEntries(Object.entries(result)
        .map(([key, status]) => [key, status.value]));
}
