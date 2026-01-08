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
