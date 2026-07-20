import clsx from 'clsx';

import { PlusIcon } from '../icons';

const CheckboxIcon = (props: { isSelected: boolean }) => {
    const { isSelected } = props;

    return <PlusIcon className={clsx('checkbox__icon', isSelected && 'checkbox__icon--selected')} />;
};

export { CheckboxIcon };
