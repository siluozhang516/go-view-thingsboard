import { Ace } from 'ace-builds';
export type tbMetaType = 'object' | 'function' | 'service' | 'property' | 'argument';
export type TbEditorCompletions = {
    [name: string]: TbEditorCompletion;
};
export interface FunctionArgType {
    type?: string;
    description?: string;
}
export interface FunctionArg extends FunctionArgType {
    name: string;
    type?: string;
    description?: string;
    optional?: boolean;
}
export interface TbEditorCompletion {
    meta: tbMetaType;
    description?: string;
    type?: string;
    args?: FunctionArg[];
    return?: FunctionArgType;
    children?: TbEditorCompletions;
}
interface TbEditorAceCompletion extends Ace.Completion {
    isTbEditorAceCompletion: true;
    snippet: string;
    description?: string;
    type?: string;
    args?: FunctionArg[];
    return?: FunctionArgType;
}
export declare class TbEditorCompleter implements Ace.Completer {
    private editorCompletions;
    identifierRegexps: RegExp[];
    constructor(editorCompletions: TbEditorCompletions);
    getCompletions(editor: Ace.Editor, session: Ace.EditSession, position: Ace.Point, prefix: string, callback: Ace.CompleterCallback): void;
    private resolvePath;
    private prepareCompletions;
    private toAceCompletionsList;
    private toAceCompletion;
    getDocTooltip(completion: TbEditorAceCompletion): {
        docHTML: string;
    };
    private createDocHTML;
}
export {};
