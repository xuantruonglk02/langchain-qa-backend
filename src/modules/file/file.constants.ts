export enum FileType {
    DOCUMENT = 'document',
}

export enum DocumentExtension {
    CSV = 'csv',
    DOCX = 'docx',
    PDF = 'pdf',
    TXT = 'txt',
}

export const S3FilePath = {
    [FileType.DOCUMENT]: 'documents',
};

export const S3FileNamePrefix = {
    [FileType.DOCUMENT]: 'd_',
};
