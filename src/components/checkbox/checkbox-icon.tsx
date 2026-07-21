import clsx from 'clsx';

import { PlusIcon } from '../icons';

const CheckboxIcon = (props: { isSelected: boolean }) => {
    const { isSelected } = props;

    const checkboxIconClsx = clsx('checkbox__icon', isSelected && 'checkbox__icon--selected');

    return <PlusIcon className={checkboxIconClsx} />;
};

export { CheckboxIcon };
