import editor from '../../../editor';

const fileContent = {
    '1.16.5': [
        'package com.%org_name%.%mod_name_lc%;',
        '',
        'import com.github.chrisofnormandy.conlib.block.generic.Standard;',
        '',
        'import net.minecraft.block.Blocks;',
        'import net.minecraft.block.AbstractBlock.Properties;',
        'import net.minecraft.item.ItemGroup;',
        '',
        'public class ModBlocks',
        '{',
        '%tab_1%public static void Init()',
        '%tab_1%{',
        '%tab_2%// ##MB_TAG##',
        '%tab_1%}',
        '}'
    ],
    '1.18.2': [
        'package com.%org_name%.%mod_name_lc%;',
        '',
        'import com.github.chrisofnormandy.conlib.block.generic.Standard;',
        '',
        'import net.minecraft.world.item.CreativeModeTab;',
        'import net.minecraft.world.level.block.Blocks;',
        'import net.minecraft.world.level.block.state.BlockBehaviour.Properties;',
        '',
        'public class ModBlocks',
        '{',
        '%tab_1%public static void Init()',
        '%tab_1%{',
        '%tab_2%// ##MB_TAG##',
        '%tab_1%}',
        '}'
    ]
};

/**
 *
 * @param {import('../../../../../common/file-system/FSManager').default} archive
 * @param {string} orgName
 * @param {string} modName
 * @returns {Promise<import('../../../../../common/file-system/FSManager').default>}
 */
export function modBlocks(archive, orgName, modName) {
    let src_main_java_com = archive.fetchDir('src/main/java/com');

    const modDir = src_main_java_com.getDir(orgName).getDir(modName.toLowerCase());

    return new Promise((resolve) => {
        const content = editor.tagRepl(fileContent['1.18.2'].join('\n'));

        modDir.addFile(
            'ModBlocks.java',
            new File([content],
                'ModBlocks.java',
                {
                    type: src_main_java_com
                        .getDir(orgName)
                        .getDir(modName.toLowerCase())
                        .getFile(modName + '.java').file.type
                }
            )
        );

        resolve(archive);
    });
}