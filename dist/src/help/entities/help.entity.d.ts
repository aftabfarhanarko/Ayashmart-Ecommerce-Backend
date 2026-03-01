export declare enum SupportStatus {
    PENDING = "pending",
    IN_PROGRESS = "in_progress",
    RESOLVED = "resolved"
}
export declare class Help {
    id: number;
    email: string;
    issue: string;
    status: SupportStatus;
    companyId: string;
    priority: string;
    tags: string[];
    attachments: string[];
    replies: Array<{
        message: string;
        author: string;
        createdAt: string;
    }>;
    createdAt: Date;
    updatedAt: Date;
    deletedAt?: Date;
}
