export interface IEscalation {
    id: number;
    submittedByNTID: String;
    submittedByName: String;
    email: String;
    orderNumber: String;
    siteName: String;
    deliveryOrg: String;
    requestType: String;
    details: String;
    reviewed?: boolean;
    reviewer?: String;
    reviewerNote?: String;
    reviewerEmail?: String;
    reviewerStatus?: String;
    reviewedDate?: Date;
    resolvedDate?: Date;
    hidden?: boolean;
    submittedDate?: Date;
    resolvedNote?: String;
    resolved?: String;
    resolution: String;
}
