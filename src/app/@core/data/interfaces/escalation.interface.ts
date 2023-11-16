export interface IEscalation {
    id: number;
    submittedByNTID: string;
    submittedByName: string;
    email: string;
    orderNumber: string;
    siteName: string;
    deliveryOrg: string;
    requestType: string;
    details: string;
    reviewed?: boolean;
    reviewer?: string;
    reviewerNote?: string;
    reviewerEmail?: string;
    reviewerStatus?: string;
    reviewedDate?: Date;
    resolvedDate?: Date;
    hidden?: boolean;
    submittedDate?: Date;
    resolvedNote?: string;
    resolved?: string;
    resolution: string;
}
