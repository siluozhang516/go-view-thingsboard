import { AuthUser, User } from '../../shared/models/user.model';
import { UserSettings } from '../../shared/models/user-settings.models';
export interface SysParamsState {
    userTokenAccessEnabled: boolean;
    allowedDashboardIds: string[];
    edgesSupportEnabled: boolean;
    hasRepository: boolean;
    tbelEnabled: boolean;
    persistDeviceStateToTelemetry: boolean;
    mobileQrEnabled: boolean;
    userSettings: UserSettings;
    maxResourceSize: number;
}
export interface SysParams extends SysParamsState {
    maxDatapointsLimit: number;
}
export interface AuthPayload extends SysParamsState {
    authUser: AuthUser;
    userDetails: User;
    forceFullscreen: boolean;
}
export interface AuthState extends AuthPayload {
    isAuthenticated: boolean;
    isUserLoaded: boolean;
    lastPublicDashboardId: string;
}
