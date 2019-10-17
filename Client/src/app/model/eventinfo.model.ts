import {EventOccurrence} from "./eventoccurence.model";

export interface EventInfo {
    expanded: boolean;
    lastUpdated: number;

    id: string;
    displayOrder: number;
    displayName: string;
    note: string;
    tags: string[];
    occurrences: EventOccurrence[];
    contactIds: string[];

}
