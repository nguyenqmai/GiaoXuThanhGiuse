import {EventInfo} from "./eventinfo.model";

export interface EventGroup {
    displayName: string,
    order: number,
    expanded: boolean,
    events: EventInfo[]

}
