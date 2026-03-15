import type { ButtonProps as AriaButtonProps } from 'react-aria-components';

type SettingsTriggerProps = AriaButtonProps;

type SettingsSectionProps = React.ComponentPropsWithRef<'section'> & {
    isDisabled?: boolean;
};

type SettingsSectionTitleProps = React.ComponentPropsWithRef<'h3'>;

type SettingsOptionGroupProps = React.ComponentPropsWithRef<'div'>;

type SettingsOptionProps = React.ComponentPropsWithRef<'div'> & {
    isSelected?: boolean;
};

export type {
    SettingsTriggerProps,
    SettingsSectionProps,
    SettingsSectionTitleProps,
    SettingsOptionGroupProps,
    SettingsOptionProps,
};
