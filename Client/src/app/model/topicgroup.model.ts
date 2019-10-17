import {TopicNode} from "./topicnode.model";

export interface TopicGroup {
    id: string;
    expanded: boolean;
    vietnameseName: string;
    englishName: string;
    subtopics: TopicNode[];
}
