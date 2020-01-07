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
        return this.accessToken['claims']['notifications'];
            // && this.accessToken['claims']['notifications'].length > 0;
    }

    public canSendNotificationToTopic(parentGroupId: string, topicId: string): boolean {
        return (this.accessToken['claims']['notifications'][parentGroupId] &&
                        (<string[]>this.accessToken['claims']['notifications'][parentGroupId]).includes('CAN_SEND_MSG'))
            || (this.accessToken['claims']['notifications'][topicId] &&
                        (<string[]>this.accessToken['claims']['notifications'][topicId]).includes('CAN_SEND_MSG'));
    }

    public canAddTopic(parentGroupId: string): boolean {
        return (this.accessToken['claims']['notifications'][parentGroupId] &&
            (<string[]>this.accessToken['claims']['notifications'][parentGroupId]).includes('CAN_ADD_TOPIC'));
    }
    public getExpireTime(): number {
        return this.idToken['exp'];
    }
}


