export enum FileType {
    DOCUMENT = 'document',
}

export enum DocumentExtension {
    DOCX = 'docx',
    PDF = 'pdf',
}

export const S3FilePath = {
    [FileType.DOCUMENT]: 'documents',
};

export const S3FileNamePrefix = {
    [FileType.DOCUMENT]: 'd_',
};
