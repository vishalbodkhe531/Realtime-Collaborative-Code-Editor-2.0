export type SaveFileDataType = {
    name: string;
    description: string;
    code: string;
    language: string;
    roomId: string;
    username: string;
};


export type CodeFile = {
    _id: string;
    name: string;
    language: string;
    description: string;
    code: string;
    owner: string;
    roomId: string;
    createdAt: string;
    updatedAt: string;
};


//  EditorHeader component
export interface EditorHeaderProps {
    yUndoManager: any;
    language: string;
    roomId: string;
    copied: boolean;
    isRunning: boolean;
    onCopy: () => void;
    onRun: () => void;
    onLanguageChange: (lang: string) => void;
}

export interface EditorOutputProps {
    output: string;
    onClear: (isClearOtp: boolean) => void;
}

export interface EditorShellProps {
    username: string;
    roomId: string;
};


export type Member = {
    name: string;
    picture?: string;
    isTyping?: boolean;
};

export type AvatarsProps = {
    currentRoomId: string;
    currentUser: string;
};

export interface SidebarProps {
    roomId: string;
    username: string;
    onExit: () => void;
}


export type SavedFileProps = {
    code: string;
    language: string;
    readOnly?: boolean;
};