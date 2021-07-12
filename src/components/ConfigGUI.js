import React from 'react';

import '../styles/forms.css';
import '../styles/config-gui.css';

import { write, getObj } from '../app/config-builder/helpers/writeConfig';

export default class ConfigForm extends React.Component {

    fields = [];
    checkboxes = ['all', 'block', 'slab', 'stairs', 'wall', 'fence'];

    updateName(event) {
        let arr = this.state.values;
        let i = event.target.name.match(/(\d+)/)[1];

        if (!arr[i])
            arr[i] = {};
        arr[i].name = event.target.value

        this.setState({ values: arr });
    }

    updateMaterial(event) {
        let arr = this.state.values;
        let i = event.target.name.match(/(\d+)/)[1];

        if (!arr[i])
            arr[i] = {};
        arr[i].material = event.target.value

        this.setState({ values: arr });
    }

    addInput() {
        this.fields.push({
            key: this.fields.length,
            value: "",
            placeholder: `my_block_${this.fields.length}`
        });

        let arr = this.state.values;
        arr.push({});
        this.setState({ values: arr });
    }

    removeInput() {
        this.fields.splice(-1, 1);

        let arr = this.state.values;
        arr.splice(-1, 1);
        this.setState({ values: arr });
    }

    handleSubmit(event) {
        let submit = {};

        let blockList = getObj();

        this.state.values.forEach((item, i) => {
            if (!submit[item.name]) {
                submit[item.name] = item;
                if (!!item.all) {
                    if (item.material === 'wood')
                        blockList.Blocks.Suite['String Lists'].wood_suite_list.push(`"${item.name}"`);
                    else
                        blockList.Blocks.Suite['String Lists'].stone_suite_list.push(`"${item.name}"`);
                }
                else {
                    if (!!item.block)
                        blockList.Blocks.Generic['String Lists'].block_list.push(`"${item.name}"`);
                    if (!!item.slab)
                        blockList.Blocks.Generic['String Lists'].slab_list.push(`"${item.name}"`);
                    if (!!item.stairs)
                        blockList.Blocks.Generic['String Lists'].stairs_list.push(`"${item.name}"`)
                    if (!!item.wall)
                        blockList.Blocks.Generic['String Lists'].wall_list.push(`"${item.name}"`);
                    if (!!item.fence)
                        blockList.Blocks.Generic['String Lists'].fence_list.push(`"${item.name}"`);
                }
            }
        });

        alert('A name was submitted: ' + JSON.stringify(submit));
        event.preventDefault();

        write(blockList);
    }

    checkRow(index) {
        this.checkboxes.map((cb) => (document.getElementById(`${index}_cb_${cb}`).checked = true));
    }

    checkBox(event) {
        let m = event.target.name.match(/(\d+)_cb_(\w+)/);
        let index = m[1];
        let box = m[2];

        let arr = this.state.values;

        if (!arr[index])
            arr[index] = {};

        if (box === 'all') {
            if (event.target.checked) {
                this.checkRow(index);
                for (let i = 1; i < this.checkboxes.length; i++)
                    arr[index][this.checkboxes[i]] = true;
            }
        }

        arr[index][box] = event.target.checked;

        this.setState({ values: arr });
    }

    render() {
        return (
            <div className='config-gui-container'>
                <h1>Config Generator</h1>
                <div className='form-container'>
                    <a id='download_link' href='/file.txt' download style={{ display: 'none' }}>_</a>
                    <form className='form-body' onSubmit={this.handleSubmit}>
                        <ul className='form-input-list'>
                            {
                                this.fields.map((field) => (
                                    <li className='form-input-list-item' key={field.key}>
                                        <label htmlFor={field.key} >Block {field.key + 1}</label>
                                        <input
                                            className='form-input'
                                            key={field.key}
                                            name={`${field.key}_content`}
                                            defaultValue={field.value}
                                            placeholder={field.placeholder}
                                            onChange={this.updateName}
                                            required
                                            onKeyPress={(event) => {
                                                if (event.key.match(/[a-zA-Z_0-9]/) === null)
                                                    event.preventDefault();
                                            }}
                                        />

                                        <input
                                            className='form-input'
                                            key={`${field.key}_material`}
                                            name={`${field.key}_material`}
                                            defaultValue=''
                                            placeholder='stone | wood | etc...'
                                            onChange={this.updateMaterial}
                                        />

                                        <div className='form-checkbox-container'>
                                            {
                                                this.checkboxes.map((box) => (
                                                    <div key={`checkbox_group_${box}`}>
                                                        <label htmlFor={`${field.key}_rb_${box}`} >{`${box}`}</label>
                                                        <input
                                                            className='form-input-checkbox'
                                                            key={`${field.key}_cb_${box}`}
                                                            id={`${field.key}_cb_${box}`}
                                                            name={`${field.key}_cb_${box}`}
                                                            type='checkbox'
                                                            onChange={this.checkBox}
                                                        />
                                                    </div>
                                                ))
                                            }
                                        </div>
                                    </li>
                                ))
                            }
                        </ul>
                        <input className='form-input-submit' type="submit" value="Submit" />
                    </form>

                    <div className='form-button-container'>
                        <div className='form-button' onClick={(event) => {
                            this.addInput(event)
                        }}>
                            Add
                        </div>
                        <div className='form-button' onClick={(event) => {
                            this.removeInput(event);
                        }}>
                            Remove
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    constructor(props) {
        super(props);
        this.state = { values: [] };

        this.updateName = this.updateName.bind(this);
        this.updateMaterial = this.updateMaterial.bind(this);

        this.handleSubmit = this.handleSubmit.bind(this);
        this.checkBox = this.checkBox.bind(this);
        this.checkRow = this.checkRow.bind(this);
    }
}