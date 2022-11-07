const argon2 = require('argon2')

class Utils {
    static genConcatArr(value, options) {
        return `
        CONCAT(
            '[',
                GROUP_CONCAT(CONCAT(
                    '"',
                    ${value},
                    '"'
                ) ${options}),
            ']'
        )
        `
    }
    static async hashPass(pass) {
        try {
            const hash = await argon2.hash(pass, {
                type: argon2.argon2i
            })
            return hash
        } catch (error) {
            throw error
        }
    }

    static bigIntToJson(data) {
        if (data !== undefined) {
            return JSON.stringify(data, (_, v) => typeof v === 'bigint' ? `${v}#bigint` : v)
                .replace(/"(-?\d+)#bigint"/g, (_, a) => a);
        }
    }
     
}

module.exports = Utils