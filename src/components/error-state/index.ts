import { ErrorStateActions } from './error-state-actions';
import { ErrorStateRoot } from './error-state-root';
import { ErrorStateSubtitle } from './error-state-subtitle';
import { ErrorStateTitle } from './error-state-title';

const ErrorState = {
    Root: ErrorStateRoot,
    Title: ErrorStateTitle,
    Subtitle: ErrorStateSubtitle,
    Actions: ErrorStateActions,
};

export { ErrorState };
export type {
    ErrorStateRootProps,
    ErrorStateTitleProps,
    ErrorStateSubtitleProps,
    ErrorStateActionsProps,
} from './error-state.types';
