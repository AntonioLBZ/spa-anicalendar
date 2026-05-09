import { SettingsOption } from './settings-option';
import { SettingsOptionGroup } from './settings-option-group';
import { SettingsSection } from './settings-section';
import { SettingsSectionTitle } from './settings-section-title';
import { SettingsTrigger } from './settings-trigger';

const Settings = {
    Trigger: SettingsTrigger,
    Section: SettingsSection,
    SectionTitle: SettingsSectionTitle,
    OptionGroup: SettingsOptionGroup,
    Option: SettingsOption,
};

export { Settings };
export type {
    SettingsTriggerProps,
    SettingsSectionProps,
    SettingsSectionTitleProps,
    SettingsOptionGroupProps,
    SettingsOptionProps,
} from './settings.types';
