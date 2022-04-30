export function getBlock(modName, name) {
    return {
        'variants': {
            '': {
                'model': `${modName}:block/${name}`
            }
        }
    };
}

export function getWall(modName, name) {
    return {
        'multipart': [
            {
                'when': {
                    'up': 'true'
                },
                'apply': {
                    'model': `${modName}:block/${name}_wall_post`
                }
            },
            {
                'when': {
                    'north': 'low'
                },
                'apply': {
                    'model': `${modName}:block/${name}_wall_side`,
                    'uvlock': true
                }
            },
            {
                'when': {
                    'east': 'low'
                },
                'apply': {
                    'model': `${modName}:block/${name}_wall_side`,
                    'y': 90,
                    'uvlock': true
                }
            },
            {
                'when': {
                    'south': 'low'
                },
                'apply': {
                    'model': `${modName}:block/${name}_wall_side`,
                    'y': 180,
                    'uvlock': true
                }
            },
            {
                'when': {
                    'west': 'low'
                },
                'apply': {
                    'model': `${modName}:block/${name}_wall_side`,
                    'y': 270,
                    'uvlock': true
                }
            },
            {
                'when': {
                    'north': 'tall'
                },
                'apply': {
                    'model': `${modName}:block/${name}_wall_side_tall`,
                    'uvlock': true
                }
            },
            {
                'when': {
                    'east': 'tall'
                },
                'apply': {
                    'model': `${modName}:block/${name}_wall_side_tall`,
                    'y': 90,
                    'uvlock': true
                }
            },
            {
                'when': {
                    'south': 'tall'
                },
                'apply': {
                    'model': `${modName}:block/${name}_wall_side_tall`,
                    'y': 180,
                    'uvlock': true
                }
            },
            {
                'when': {
                    'west': 'tall'
                },
                'apply': {
                    'model': `${modName}:block/${name}_wall_side_tall`,
                    'y': 270,
                    'uvlock': true
                }
            }
        ]
    };
}

export function getSlab(modName, name) {
    return {
        'variants': {
            'type=bottom': {
                'model': `${modName}:block/${name}_slab`
            },
            'type=top': {
                'model': `${modName}:block/${name}_slab_top`
            },
            'type=double': {
                'model': `${modName}:block/${name}`
            }
        }
    };
}

export function getStairs(modName, name) {
    return {
        'variants': {
            'facing=east,half=bottom,shape=straight': {
                'model': `${modName}:block/${name}_stairs`
            },
            'facing=west,half=bottom,shape=straight': {
                'model': `${modName}:block/${name}_stairs`,
                'y': 180,
                'uvlock': true
            },
            'facing=south,half=bottom,shape=straight': {
                'model': `${modName}:block/${name}_stairs`,
                'y': 90,
                'uvlock': true
            },
            'facing=north,half=bottom,shape=straight': {
                'model': `${modName}:block/${name}_stairs`,
                'y': 270,
                'uvlock': true
            },
            'facing=east,half=bottom,shape=outer_right': {
                'model': `${modName}:block/${name}_stairs_outer`
            },
            'facing=west,half=bottom,shape=outer_right': {
                'model': `${modName}:block/${name}_stairs_outer`,
                'y': 180,
                'uvlock': true
            },
            'facing=south,half=bottom,shape=outer_right': {
                'model': `${modName}:block/${name}_stairs_outer`,
                'y': 90,
                'uvlock': true
            },
            'facing=north,half=bottom,shape=outer_right': {
                'model': `${modName}:block/${name}_stairs_outer`,
                'y': 270,
                'uvlock': true
            },
            'facing=east,half=bottom,shape=outer_left': {
                'model': `${modName}:block/${name}_stairs_outer`,
                'y': 270,
                'uvlock': true
            },
            'facing=west,half=bottom,shape=outer_left': {
                'model': `${modName}:block/${name}_stairs_outer`,
                'y': 90,
                'uvlock': true
            },
            'facing=south,half=bottom,shape=outer_left': {
                'model': `${modName}:block/${name}_stairs_outer`
            },
            'facing=north,half=bottom,shape=outer_left': {
                'model': `${modName}:block/${name}_stairs_outer`,
                'y': 180,
                'uvlock': true
            },
            'facing=east,half=bottom,shape=inner_right': {
                'model': `${modName}:block/${name}_stairs_inner`
            },
            'facing=west,half=bottom,shape=inner_right': {
                'model': `${modName}:block/${name}_stairs_inner`,
                'y': 180,
                'uvlock': true
            },
            'facing=south,half=bottom,shape=inner_right': {
                'model': `${modName}:block/${name}_stairs_inner`,
                'y': 90,
                'uvlock': true
            },
            'facing=north,half=bottom,shape=inner_right': {
                'model': `${modName}:block/${name}_stairs_inner`,
                'y': 270,
                'uvlock': true
            },
            'facing=east,half=bottom,shape=inner_left': {
                'model': `${modName}:block/${name}_stairs_inner`,
                'y': 270,
                'uvlock': true
            },
            'facing=west,half=bottom,shape=inner_left': {
                'model': `${modName}:block/${name}_stairs_inner`,
                'y': 90,
                'uvlock': true
            },
            'facing=south,half=bottom,shape=inner_left': {
                'model': `${modName}:block/${name}_stairs_inner`
            },
            'facing=north,half=bottom,shape=inner_left': {
                'model': `${modName}:block/${name}_stairs_inner`,
                'y': 180,
                'uvlock': true
            },
            'facing=east,half=top,shape=straight': {
                'model': `${modName}:block/${name}_stairs`,
                'x': 180,
                'uvlock': true
            },
            'facing=west,half=top,shape=straight': {
                'model': `${modName}:block/${name}_stairs`,
                'x': 180,
                'y': 180,
                'uvlock': true
            },
            'facing=south,half=top,shape=straight': {
                'model': `${modName}:block/${name}_stairs`,
                'x': 180,
                'y': 90,
                'uvlock': true
            },
            'facing=north,half=top,shape=straight': {
                'model': `${modName}:block/${name}_stairs`,
                'x': 180,
                'y': 270,
                'uvlock': true
            },
            'facing=east,half=top,shape=outer_right': {
                'model': `${modName}:block/${name}_stairs_outer`,
                'x': 180,
                'y': 90,
                'uvlock': true
            },
            'facing=west,half=top,shape=outer_right': {
                'model': `${modName}:block/${name}_stairs_outer`,
                'x': 180,
                'y': 270,
                'uvlock': true
            },
            'facing=south,half=top,shape=outer_right': {
                'model': `${modName}:block/${name}_stairs_outer`,
                'x': 180,
                'y': 180,
                'uvlock': true
            },
            'facing=north,half=top,shape=outer_right': {
                'model': `${modName}:block/${name}_stairs_outer`,
                'x': 180,
                'uvlock': true
            },
            'facing=east,half=top,shape=outer_left': {
                'model': `${modName}:block/${name}_stairs_outer`,
                'x': 180,
                'uvlock': true
            },
            'facing=west,half=top,shape=outer_left': {
                'model': `${modName}:block/${name}_stairs_outer`,
                'x': 180,
                'y': 180,
                'uvlock': true
            },
            'facing=south,half=top,shape=outer_left': {
                'model': `${modName}:block/${name}_stairs_outer`,
                'x': 180,
                'y': 90,
                'uvlock': true
            },
            'facing=north,half=top,shape=outer_left': {
                'model': `${modName}:block/${name}_stairs_outer`,
                'x': 180,
                'y': 270,
                'uvlock': true
            },
            'facing=east,half=top,shape=inner_right': {
                'model': `${modName}:block/${name}_stairs_inner`,
                'x': 180,
                'y': 90,
                'uvlock': true
            },
            'facing=west,half=top,shape=inner_right': {
                'model': `${modName}:block/${name}_stairs_inner`,
                'x': 180,
                'y': 270,
                'uvlock': true
            },
            'facing=south,half=top,shape=inner_right': {
                'model': `${modName}:block/${name}_stairs_inner`,
                'x': 180,
                'y': 180,
                'uvlock': true
            },
            'facing=north,half=top,shape=inner_right': {
                'model': `${modName}:block/${name}_stairs_inner`,
                'x': 180,
                'uvlock': true
            },
            'facing=east,half=top,shape=inner_left': {
                'model': `${modName}:block/${name}_stairs_inner`,
                'x': 180,
                'uvlock': true
            },
            'facing=west,half=top,shape=inner_left': {
                'model': `${modName}:block/${name}_stairs_inner`,
                'x': 180,
                'y': 180,
                'uvlock': true
            },
            'facing=south,half=top,shape=inner_left': {
                'model': `${modName}:block/${name}_stairs_inner`,
                'x': 180,
                'y': 90,
                'uvlock': true
            },
            'facing=north,half=top,shape=inner_left': {
                'model': `${modName}:block/${name}_stairs_inner`,
                'x': 180,
                'y': 270,
                'uvlock': true
            }
        }
    };
}

export function getFence(modName, name) {
    return {
        'multipart': [
            {
                'apply': {
                    'model': `${modName}:block/${name}_fence_post`
                }
            },
            {
                'when': {
                    'north': 'true'
                },
                'apply': {
                    'model': `${modName}:block/${name}_fence_side`,
                    'uvlock': true
                }
            },
            {
                'when': {
                    'east': 'true'
                },
                'apply': {
                    'model': `${modName}:block/${name}_fence_side`,
                    'y': 90,
                    'uvlock': true
                }
            },
            {
                'when': {
                    'south': 'true'
                },
                'apply': {
                    'model': `${modName}:block/${name}_fence_side`,
                    'y': 180,
                    'uvlock': true
                }
            },
            {
                'when': {
                    'west': 'true'
                },
                'apply': {
                    'model': `${modName
                        }:block/${name}_fence_side`,
                    'y': 270,
                    'uvlock': true
                }
            }
        ]
    };
}