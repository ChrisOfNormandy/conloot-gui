import v1_16_5 from './properties/1.16.5.json';
import v1_18_2 from './properties/1.18.2.json';

class BlockProperties {
    toString() {
        console.log(this.values);

        let str = '';

        Object.keys(this.values)
            .sort()
            .forEach((k) => {
                if (this.values[k].enabled) {
                    let paramStr = [];

                    if (this.values[k].params.length) {
                        this.values[k].params.forEach((param, i) => {
                            if (param.value !== null) {
                                switch (param.type) {
                                    case 'float': {
                                        paramStr[i] = param.value + 'f';
                                        break;
                                    }
                                    default: break;
                                }
                            }
                        });
                    }

                    str += `.${k}(${paramStr.join(', ')})`;
                }
            });

        return str;
    }

    constructor() {
        /**
         * @type {Object<string, Property>}
         */
        this.values = {};
    }
}

export class BlockProperties_v16_5 extends BlockProperties {
    constructor() {
        super();

        // eslint-disable-next-line no-undef
        this.values = structuredClone(v1_16_5);

        for (let k in this.values)
            this.values[k].enabled = false;
    }
}

export class BlockProperties_v18_2 extends BlockProperties {
    constructor() {
        super();

        // eslint-disable-next-line no-undef
        this.values = structuredClone(v1_18_2);

        for (let k in this.values)
            this.values[k].enabled = false;
    }
}

/**
 * @typedef Property
 * @property {boolean} enabled
 * @property {{type: string, default?: *, optional?: boolean}[]} params
 */