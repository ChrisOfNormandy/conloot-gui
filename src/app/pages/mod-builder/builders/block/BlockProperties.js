export default class BlockProperties {
    toString() {
        let str = '';
        for (let k in this.values) {
            if (this.values[k]._)
                str += this.values[k].f();
        }

        return str;
    }

    constructor() {
        this.of_ = {
            material: null,
            dyeColor: null,
            materialColor: null
        };

        this.copy_ = {
            source: null
        };

        this.values = {
            noCollission: {
                value: false,
                type: 'boolean',
                toString() {
                    return this.value
                        ? '.noCollision()'
                        : '';
                }
            },
            noOcclusion: {
                value: false,
                type: 'boolean',
                toString() {
                    return this.value
                        ? '.noOcclusion()'
                        : '';
                }
            },
            harvestLevel: {
                value: null,
                type: 'number',
                toString() {
                    return this.value !== null
                        ? `.harvestLevel(${this.value}f)`
                        : '';
                }
            },
            harvestTool: {
                value: null,
                type: 'string',
                toString() {
                    return this.value !== null
                        ? `.harvestTool(${this.value})`
                        : '';
                }
            },
            friction: {
                value: null,
                type: 'number',
                toString() {
                    return this.value !== null
                        ? `.friction(${this.value})`
                        : '';
                }
            },
            speedFactor: {
                value: null,
                type: 'number',
                toString() {
                    return this.value !== null
                        ? `.speedFactor(${this.value})`
                        : '';
                }
            },
            jumpFactor: {
                value: null,
                type: 'number',
                toString() {
                    return this.value !== null
                        ? `.jumpFactor(${this.value})`
                        : '';
                }
            },
            sound: {
                value: null,
                type: 'string',
                toString() {
                    return this.value !== null
                        ? `.sound(${this.value})`
                        : '';
                }
            },
            // lightLevel: {
            //     value: null,
            //     type: 'number',
            //     toString() {
            //         return this.value !== null
            //             ? `.lightLevel(new ToIntFunction<BlockState>() { @Override public int applyAsInt(BlockState value) { return ${this.value}; } })`
            //             : '';
            //     }
            // },
            strength: {
                value: null,
                type: 'number',
                toString() {
                    return this.value !== null
                        ? `.strength(${this.value}f)`
                        : '';
                }
            },
            randomTicks: {
                value: false,
                type: 'boolean',
                toString() {
                    return this.value
                        ? '.randomTicks()'
                        : '';
                }
            },
            dynamicShape: {
                value: false,
                type: 'boolean',
                toString() {
                    return this.value
                        ? '.dynamicShape()'
                        : '';
                }
            },
            noDrops: {
                value: false,
                type: 'boolean',
                toString() {
                    return this.value
                        ? '.noDrops()'
                        : '';
                }
            },
            // lootFrom: {
            //     value: null,
            //     type: 'string',
            //     toString() {
            //         return this.value !== null
            //             ? `.lootFrom(${this.value})`
            //             : '';
            //     } // Supplier<? extends Block> blockIn
            // },
            air: {
                value: false,
                type: 'boolean',
                toString() {
                    return this.value
                        ? '.air()'
                        : '';
                }
            },
            // isValidSpawn: {
            //     value: null,
            //     type: 'string',
            //     toString() {
            //         return this.value !== null
            //             ? `.isValidSpawn(${this.value})`
            //             : '';
            //     } // AbstractBlock.IExtendedPositionPredicate<EntityType<?>>
            // },
            // isRedstoneConductor: {
            //     value: null,
            //     type: 'number',
            //     toString() {
            //         return this.value !== null
            //             ? `.isRedstoneConductor(${this.value}f)`
            //             : '';
            //     } // AbstractBlock.IPositionPredicate
            // },
            // isSuffocating: {
            //     value: null,
            //     type: 'number',
            //     toString() {
            //         return this.value !== null
            //             ? `.isSuffocating(${this.values.isSuffocating.v}f)`
            //             : '';
            //     } // AbstractBlock.IPositionPredicate
            // }
        };
    }
}