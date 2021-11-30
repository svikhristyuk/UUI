import { withMods } from '@epam/uui';
import * as css from './Burger.scss';
import { Burger as uuiBurger, BurgerProps } from '@epam/uui-components';
import { ReactComponent as BurgerIcon } from '../../../icons/burger.svg';
import { ReactComponent as CrossIcon } from '../../../icons/burger-close.svg';

export interface BurgerMods {
}

function applyBurgerMods(mods: BurgerMods) {
    return [css.root];
}

export const Burger = withMods<BurgerProps, BurgerMods>(uuiBurger, applyBurgerMods, (props) => ({
    BurgerIcon,
    CrossIcon,
    burgerContentCx: css.burgerContent,
}));
