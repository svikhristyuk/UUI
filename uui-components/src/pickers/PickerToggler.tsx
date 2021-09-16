import * as React from 'react';
import { IPickerToggler, IHasIcon, IHasCX, ICanBeReadonly, Icon, uuiMod, uuiElement, uuiMarkers, DataRowProps, closest, cx, IHasRawProps } from '@epam/uui';
import { IconContainer } from '../layout';
import * as css from './PickerToggler.scss';
import { i18n } from "../../i18n";

export interface PickerTogglerProps<TItem, TId = any> extends IPickerToggler<TItem, TId>, IHasIcon, IHasCX, ICanBeReadonly, IHasRawProps<HTMLDivElement>, React.PropsWithRef<any> {
    cancelIcon?: Icon;
    dropdownIcon?: Icon;
    autoFocus?: boolean;
    renderItem?(props: DataRowProps<TItem, TId>): React.ReactNode;
    getName?: (item: DataRowProps<TItem, TId>) => string;
    entityName?: string;
    maxItems?: number;
    isSingleLine?: boolean;
    pickerMode: 'single' | 'multi';
    onKeyDown?(e: React.KeyboardEvent<HTMLElement>): void;
    onBlur?(e: React.FocusEvent<HTMLElement>): void;
    onFocus?(e?: React.FocusEvent<HTMLElement>): void;
    disableSearch?: boolean;
    disableClear?: boolean;
    minCharsToSearch?: number;
    editMode: 'dropdown' | 'modal';
}

interface PickerTogglerState {
    inFocus?: boolean;
    isActive?: boolean;
}

export class PickerToggler<TItem, TId> extends React.Component<PickerTogglerProps<TItem, TId>, PickerTogglerState> {
    state = {
        inFocus: false,
        isActive: false,
    };

    toggleContainer: HTMLDivElement | null = null;

    componentDidMount() {
        window.document.addEventListener('click', this.handleActive);
        if (this.props.autoFocus && !this.props.disableSearch) {
            this.handleFocus();
        }
    }

    componentWillUnmount() {
        window.document.removeEventListener('click', this.handleActive);
    }

    handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        this.props.onValueChange && this.props.onValueChange(e.target.value);
    };

    handleFocus = (e?: React.FocusEvent<HTMLInputElement>) => {
        this.props.onFocus && this.props.onFocus(e);
        this.updateFocus(true);
    }

    handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
        this.props.onBlur && this.props.onBlur(e);
        this.updateFocus(false);
    }

    handleActive = (e: Event) => {
        if (closest((e.target as HTMLElement), this.toggleContainer)) {
            this.setState({ isActive: true });
        }
        if (this.state.isActive && !closest((e.target as HTMLElement), this.toggleContainer)) {
            this.setState({ isActive: false });
        }
    }

    updateFocus = (value: boolean) => {
        this.setState({ ...this.state, inFocus: value });
    }

    handleKeyDown = (e: React.KeyboardEvent<HTMLElement>) => {
        this.props.onKeyDown && this.props.onKeyDown(e);
    }

    handleCrossIconClick = (e: React.SyntheticEvent<HTMLElement>) => {
        this.props.onClear && this.props.onClear();
        e.stopPropagation();
    }

    renderItems() {
        let maxItems = (this.props.maxItems || this.props.maxItems === 0) ? this.props.maxItems : 100;
        if (this.props.selection && this.props.selection.length > maxItems) {
            let item = {
                value: i18n.pickerToggler.createItemValue(this.props.selection.length, this.props.entityName || ''),
                onCheck: () => this.props.onClear && this.props.onClear(),
            };
            return this.props.renderItem && this.props.renderItem(item as any);
        } else {
            return this.props.selection && this.props.selection.map(row => this.props.renderItem && this.props.renderItem(row));
        }
    }

    renderInput() {
        let isActivePlaceholder = this.props.pickerMode === 'single' && this.props.selection && !!this.props.selection[0];
        let placeholder = isActivePlaceholder ? this.props.getName(this.props.selection[0]) : this.props.placeholder;

        if (this.props.disableSearch) {
            if (this.props.pickerMode === 'multi' && this.props.selection.length > 0) {
                return null;
            }

            return <input
                readOnly
                tabIndex={ 0 }
                aria-haspopup={ true }
                aria-expanded={ this.props.isOpen }
                aria-required={ this.props.isRequired }
                aria-disabled={ this.props.isDisabled }
                aria-readonly={ true }
                placeholder={ placeholder }
                className={ cx(
                    uuiElement.input,
                    this.props.selection.length === 0 && uuiElement.placeholder,
                    this.props.pickerMode === 'single' && css.singleInput,
                    css.toggler,
                ) }
            />
        }

        return <input
            type='text'
            tabIndex={ 0 }
            aria-haspopup={ true }
            aria-required={ this.props.isRequired }
            aria-disabled={ this.props.isDisabled }
            aria-readonly={ this.props.isReadonly }
            className={ cx(uuiElement.input,
                this.props.pickerMode === 'single' && css.singleInput,
                isActivePlaceholder && (!this.state.inFocus || this.props.isReadonly) && uuiElement.placeholder)
            }
            disabled={ this.props.isDisabled }
            placeholder={ placeholder }
            value={ this.props.value || '' }
            readOnly={ this.props.isReadonly }
            onChange={ this.handleChange }
        />;
    }

    togglerPickerOpened = () => {
        if (this.props.value && !this.props.disableSearch) return;
        this.props.onClick && this.props.onClick();
    }

    render() {
        const icon = this.props.icon && <IconContainer icon={ this.props.icon } onClick={ this.props.onIconClick } />;

        return (
            <div
                onMouseDown={ !this.props.isDisabled && !this.props.isReadonly ? this.togglerPickerOpened : null }
                ref={ el => this.toggleContainer = el }
                tabIndex={ -1 }
                className={ cx(css.container,
                    uuiElement.inputBox,
                    this.props.isDisabled && uuiMod.disabled,
                    this.props.isReadonly && uuiMod.readonly,
                    this.props.isInvalid && uuiMod.invalid,
                    (!this.props.isReadonly && !this.props.isDisabled && this.props.onClick) && uuiMarkers.clickable,
                    (!this.props.isReadonly && !this.props.isDisabled && this.state.inFocus) && uuiMod.focus,
                    (!this.props.isReadonly && !this.props.isDisabled && this.state.isActive) && uuiMod.active,
                    this.props.cx,
                ) }
                onKeyDown={ this.handleKeyDown }
                onFocus={ !this.props.isDisabled && !this.props.isReadonly && this.props.editMode !== 'modal' ? this.handleFocus : null }
                onBlur={ !this.props.isDisabled && !this.props.isReadonly && this.props.editMode !== 'modal' ? this.handleBlur : null }
                { ...this.props.rawProps }
            >
                <div className={ cx(css.body, !this.props.isSingleLine && this.props.pickerMode !== 'single' && css.multiline) }>
                    { this.props.iconPosition !== 'right' && icon }
                    { this.props.pickerMode !== 'single' && this.renderItems() }
                    { this.renderInput() }
                    { this.props.iconPosition === 'right' && icon }
                </div>
                <div className={ cx(css.actions) }>
                    { !this.props.disableClear && (this.props.value || this.props.selection && this.props.selection.length > 0) && <IconContainer
                        cx={ cx('uui-icon-cancel', uuiMarkers.clickable, (this.props.isReadonly || this.props.isDisabled) && css.hidden) }
                        isDisabled={ this.props.isDisabled }
                        icon={ this.props.cancelIcon }
                        tabIndex={ -1 }
                        onClick={ this.handleCrossIconClick }
                    /> }
                    { this.props.isDropdown && <IconContainer
                        onClick={ !this.props.isReadonly && !this.props.isDisabled ? (e) => {
                            e.stopPropagation();
                            this.togglerPickerOpened();
                        } : null }
                        icon={ this.props.dropdownIcon }
                        tabIndex={ -1 }
                        flipY={ this.props.isOpen }
                        cx={ (this.props.isReadonly || this.props.isDisabled) && css.hidden }
                    /> }
                </div>
            </div>
        );
    }
}
