import * as css from './TimePicker.scss';
import { TimePickerBody as uuiTimePickerBody, TimePickerBodyProps } from '@epam/uui-components';
import { withMods } from '@epam/uui';
import { ReactComponent as ArrowIcon } from './../icons/folding-arrow-24.svg';

export const TimePickerBody = withMods<TimePickerBodyProps, any>(uuiTimePickerBody, () => [css.root], () => ({ addIcon: ArrowIcon, subtractIcon: ArrowIcon }));