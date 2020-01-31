import * as jwt_decode from 'jwt-decode';

export class MyUser {
    userEmail: string;
    idToken: any;
    accessToken: any;

    constructor(userEmail: string, idToken: string, accessToken: string) {
        this.userEmail = userEmail;
        this.idToken = jwt_decode(idToken);
        this.accessToken = jwt_decode(accessToken);
    }

    public authorizedToWorkWithNotification(): boolean {
        return this.accessToken['claims'];
    }

    public authorizedToManageUsers(): boolean {
        return this.accessToken['claims']['users'];
    }

    public canAddNewUsers(): boolean {
        return this.accessToken['claims']['users'] && (this.accessToken['claims']['users'] as string[]).includes('CAN_ADD');
    }

    public canUpdateUsers(): boolean {
        return this.accessToken['claims']['users'] && (this.accessToken['claims']['users'] as string[]).includes('CAN_UPDATE');
    }

    public canDeleteUsers(): boolean {
        return this.accessToken['claims']['users'] && (this.accessToken['claims']['users'] as string[]).includes('CAN_DELETE');
    }

    public canSendNotificationToTopic(parentGroupId: string, topicId: string): boolean {
        return (this.accessToken['claims'][parentGroupId] &&
                        (<string[]>this.accessToken['claims'][parentGroupId]).includes('CAN_SEND_MSG'))
            || (this.accessToken['claims'][topicId] &&
                        (<string[]>this.accessToken['claims'][topicId]).includes('CAN_SEND_MSG'));
    }

    public canAddTopic(parentGroupId: string): boolean {
        return (this.accessToken['claims'][parentGroupId] &&
            (<string[]>this.accessToken['claims'][parentGroupId]).includes('CAN_ADD_TOPIC'));
    }

    public getExpireTime(): number {
        return this.idToken['exp'];
    }

    public hasValidTokens() {
        const now = Date.now() / 1000;
        return (this.idToken && this.idToken['exp'] > now && this.accessToken && this.accessToken['exp'] > now);
    }
}


