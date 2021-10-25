import React from "react";
import PopUp from "./PopUp";

export default class PopupManager extends React.Component {

    getEnabledGroups() {
        return Array.from(this.state.popups.values()).filter(g => g.enabled).length;
    }

    collapseGroup(group) {
        group.popups.forEach(popup => {
            popup.minimizeEvent(group, popup);
            popup.enabled = false;
        });

        group.enabled = false;
    }

    /**
     * @param {{showGroups: number, show: boolean, popups: Map<string, {uuid: string, enabled: boolean, popups: {uuid: string, enabled: boolean, title: string, body: *, minimizeEvent: function, closeEvent: function}[]}>, pointer: number}}
     */
    updateGroups(state) {
        if (!state.show) {
            state.popups.forEach(group => {
                this.collapseGroup(group);
            });

            state.show = true;
            state.showGroups = 0;
            this.setState(state);
            return;
        }

        let x = 0;

        let f;
        state.popups.forEach(group => {
            f = false;

            group.popups.forEach(popup => {               
                if (popup.enabled) {
                    f = true;
                    return;
                }
            });

            group.enabled = f;

            if (group.enabled)
                x++;

            return group;
        });

        state.show = true;
        state.showGroups = x;

        this.setState(state);
    }

    componentDidUpdate() {
        if (this.state.showGroups !== this.getEnabledGroups())
            this.updateGroups(this.state);
    }

    render() {
        let groups = Array.from(this.state.popups.values());

        return (
            <div className='popup-manager'>
                <div className={`popup-manager-container ${this.state.showGroups > 0 ? '' : 'hidden'}`}>
                    <i
                        className='icon bi-chevron-left popup-group-chevron'
                        onClick={
                            () => {
                                if (this.state.pointer === 0)
                                    return;

                                let state = this.state;
                                let p = state.pointer;

                                state.pointer--;

                                while (state.pointer > -1 && !groups[state.pointer].enabled)
                                    state.pointer--;

                                if (state.pointer < 0)
                                    state.pointer = p;

                                this.updateGroups(state);
                            }
                        }
                    />

                    {groups.map((g, gi) =>
                        gi === this.state.pointer
                            ? (
                                <div
                                    id={`popup_${g.uuid}`}
                                    key={g.uuid}
                                    className='popup-group-container'
                                >
                                    <div
                                        className='popup-group-header'
                                    >
                                        <div
                                            className='popup-group-pointer-label'
                                        >
                                            {gi + 1}
                                        </div>

                                        <i
                                            className='icon bi-collection popup-btn'
                                            title='Collapse'
                                            onClick={
                                                () => {
                                                    this.collapseGroup(g);

                                                    let state = this.state;
                                                    if (gi > 0) {
                                                        state.pointer = gi - 1;
                                                        while (state.pointer > -1 && !groups[state.pointer].enabled)
                                                            state.pointer--;

                                                        if (state.pointer === -1) {
                                                            state.pointer = gi + 1;
                                                            while (state.pointer < groups.length && !groups[state.pointer].enabled)
                                                                state.pointer++;

                                                            if (state.pointer === groups.length)
                                                                state.show = false;
                                                        }
                                                    }
                                                    else {
                                                        state.pointer = gi + 1;
                                                        while (state.pointer < groups.length && !groups[state.pointer].enabled)
                                                            state.pointer++;

                                                        if (state.pointer === groups.length)
                                                            state.show = false;
                                                    }

                                                    this.updateGroups(this.state);
                                                }
                                            }
                                        />
                                    </div>

                                    <div
                                        className='popup-group-row'
                                    >
                                    {g.popups.map((v, i) => {
                                        return v.enabled
                                            ? (
                                                <PopUp
                                                    key={`${g.uuid}_${i}`}
                                                    title={v.title}
                                                    body={v.body}
                                                    closeEvent={
                                                        () => {
                                                            let state = this.state;

                                                            if (v.closeEvent !== null)
                                                                v.closeEvent(g, v);

                                                            delete state.popups.get(g.uuid).popups[i];
                                                            this.updateGroups(state);
                                                        }
                                                    }
                                                    minimizeEvent={
                                                        () => {
                                                            let state = this.state;

                                                            if (v.minimizeEvent !== null)
                                                                v.minimizeEvent(g, v);

                                                            let p = state.popups.get(g.uuid).popups[i];

                                                            p.enabled = false;

                                                            this.updateGroups(state);
                                                        }
                                                    }
                                                />
                                            )
                                            : null
                                    })}
                                    </div>
                                </div>
                            )
                            : null
                    )}
                    <i
                        className='icon bi-chevron-right popup-group-chevron'
                        onClick={
                            () => {
                                if (this.state.pointer === this.state.popups.size - 1)
                                    return;

                                let state = this.state;
                                let p = state.pointer;

                                state.pointer++;

                                while (state.pointer < state.popups.size && !groups[state.pointer].enabled)
                                    state.pointer++;

                                if (state.pointer === state.popups.size)
                                    state.pointer = p;

                                this.updateGroups(state);
                            }
                        }
                    />
                </div>

                <div className='popup-manager-ribbon'>
                    <button
                        onClick={
                            () => {
                                let state = this.state;
                                state.show = !state.show;
                                this.updateGroups(state);
                            }
                        }
                    >
                        Collapse All
                    </button>

                    {groups.map((g, gi) => (
                        <div
                            id={`popup_tab_${g.uuid}`}
                            key={g.uuid}
                        >
                            {g.popups.map((v, i) => {
                                if (v.tabName === null)
                                    console.log(v);

                                return v.enabled
                                    ? null
                                    : (
                                        <div
                                            key={`${g.uuid}_${i}`}
                                            id={`popup_tab_${g.uuid}_${i}`}
                                            className='popup-tab'
                                            title='Expand'
                                            onClick={
                                                () => {
                                                    let state = this.state;
                                                    state.popups.get(g.uuid).popups[i].enabled = true;
                                                    state.pointer = gi;
                                                    this.updateGroups(state);
                                                }
                                            }
                                        >
                                            <i className='icon bi-plus' />
                                            {
                                                v.tabName !== null
                                                    ? `${v.tabName}${v.tabDescription === null
                                                        ? ''
                                                        : ` ${v.tabDescription}`}`
                                                    : `Tab ${i}`
                                            }
                                        </div>
                                    )
                            })}
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    constructor(props) {
        super(props);

        /**
         * @type {{showGroups: number, show: boolean, popups: Map<string, {uuid: string, enabled: boolean, popups: {uuid: string, enabled: boolean, title: string, body: *, minimizeEvent: function, closeEvent: function}[]}>, pointer: number}}
         */
        this.state = {
            showGroups: 0,
            show: true,
            popups: props.map || new Map(),
            pointer: 0
        };
    }
}