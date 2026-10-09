# Sơ đồ quan hệ cơ sở dữ liệu

Nguồn: [`prisma/schema.prisma`](../prisma/schema.prisma). Sơ đồ phản ánh **49 model và 80 quan hệ `@relation(fields: ...)`** trong schema hiện tại.

Mỗi sơ đồ chỉ hiển thị khóa chính (`PK`), khóa ngoại (`FK`) và một số trường nghiệp vụ quan trọng để dễ đọc. Các cột còn lại nằm trong `schema.prisma`. Tên entity là tên **Prisma model**; tên bảng PostgreSQL thực tế được chỉ định bởi `@@map`.

Ký hiệu: `||` = đúng một; `|o` ở đầu trái hoặc `o|` ở đầu phải = không hoặc một; `o{` = không hoặc nhiều. Đường nối ghi tên trường FK ở bảng con. Với FK tùy chọn, đầu bảng cha là `|o`. Bảng liên kết (ví dụ `UserRole`, `PaymentAttachment`) biểu diễn quan hệ nhiều-nhiều bằng hai khóa ngoại.

## Luồng tài chính của thẻ “Giải ngân 2026”

`Project` → `AnnualCapitalPlan` (kế hoạch theo dự án, nguồn, năm); `Project` → `Payment` (các đợt thanh toán thực tế). `AnnualCapitalPlan` **không có FK trực tiếp tới** `Payment`; KPI đối chiếu hai tập dữ liệu theo năm và phạm vi dự án.

## Người dùng, phân quyền, tiến độ và thủ tục

11 model · 15 quan hệ.

```mermaid
erDiagram
    Permission {
        string id PK
    }
    ProcedureStepEvent {
        string id PK
        string projectStepId FK
        string changedById FK
    }
    ProcedureStepTemplate {
        string id PK
        string parentId FK
    }
    Project {
        string id PK
        string code
        string name
        projectstatus status
        decimal totalInvestment
    }
    ProjectAssignment {
        string id PK
        string projectId FK
        string userId FK
        string assignedById FK
    }
    ProjectProcedureStep {
        string id PK
        string projectId FK
        string templateId FK
        string updatedById FK
    }
    ProjectProgressUpdate {
        string id PK
        string projectId FK
        string updatedById FK
    }
    Role {
        string id PK
    }
    RolePermission {
        string roleId PK, FK
        string permissionId PK, FK
    }
    User {
        string id PK
    }
    UserRole {
        string userId PK, FK
        string roleId PK, FK
    }

    User ||--o{ UserRole : userId
    Role ||--o{ UserRole : roleId
    Role ||--o{ RolePermission : roleId
    Permission ||--o{ RolePermission : permissionId
    Project ||--o{ ProjectAssignment : projectId
    User ||--o{ ProjectAssignment : userId
    User |o--o{ ProjectAssignment : assignedById
    Project ||--o{ ProjectProgressUpdate : projectId
    User ||--o{ ProjectProgressUpdate : updatedById
    ProcedureStepTemplate |o--o{ ProcedureStepTemplate : parentId
    Project ||--o{ ProjectProcedureStep : projectId
    ProcedureStepTemplate ||--o{ ProjectProcedureStep : templateId
    User |o--o{ ProjectProcedureStep : updatedById
    ProjectProcedureStep ||--o{ ProcedureStepEvent : projectStepId
    User ||--o{ ProcedureStepEvent : changedById
```

## Kế hoạch vốn, hợp đồng, giải ngân và quyết toán

12 model · 14 quan hệ.

```mermaid
erDiagram
    AnnualCapitalPlan {
        string id PK
        string projectId FK
        string fundingSourceId FK
        int year
        decimal approvedAmount
        decimal currentAmount
    }
    CapitalPlanAdjustment {
        string id PK
        string capitalPlanId FK
        decimal amountChange
        string createdById FK
    }
    Contract {
        string id PK
        string projectId FK
        string procurementPackageId FK
        string contractorId FK
        decimal contractValue
    }
    Contractor {
        string id PK
    }
    FundingSource {
        string id PK
    }
    Payment {
        string id PK
        string projectId FK
        string contractId FK
        string treasuryAccountId FK
        decimal amount
        decimal disbursedAmount
        datetime disbursedAt
        paymentstatus status
        string createdById FK
    }
    PaymentApproval {
        string id PK
        string paymentId FK
        string approverId FK
    }
    ProcurementPackage {
        string id PK
        string projectId FK
        string winnerId FK
    }
    Project {
        string id PK
        string code
        string name
        projectstatus status
        decimal totalInvestment
    }
    ProjectSettlement {
        string id PK
        string projectId FK
    }
    TreasuryAccount {
        string id PK
    }
    User {
        string id PK
    }

    Project ||--o{ AnnualCapitalPlan : projectId
    FundingSource ||--o{ AnnualCapitalPlan : fundingSourceId
    AnnualCapitalPlan ||--o{ CapitalPlanAdjustment : capitalPlanId
    User ||--o{ CapitalPlanAdjustment : createdById
    Project ||--o{ Contract : projectId
    ProcurementPackage |o--o{ Contract : procurementPackageId
    Contractor ||--o{ Contract : contractorId
    Project ||--o{ Payment : projectId
    Contract |o--o{ Payment : contractId
    TreasuryAccount ||--o{ Payment : treasuryAccountId
    User ||--o{ Payment : createdById
    Payment ||--o{ PaymentApproval : paymentId
    User ||--o{ PaymentApproval : approverId
    Project ||--o| ProjectSettlement : projectId
```

## Giải phóng mặt bằng và bồi thường

9 model · 10 quan hệ.

```mermaid
erDiagram
    CompensationPlan {
        string id PK
        string projectId FK
    }
    Household {
        string id PK
        string projectId FK
    }
    HouseholdCompensationItem {
        string id PK
        string householdId FK
        string compensationPlanId FK
    }
    HouseholdPayment {
        string id PK
        string householdId FK
        string paymentId FK
        decimal amount
    }
    HouseholdStep {
        string id PK
        string householdId FK
        string updatedById FK
    }
    HouseholdStepEvent {
        string id PK
        string householdStepId FK
        string changedById FK
    }
    Payment {
        string id PK
        string projectId FK
        string contractId FK
        string treasuryAccountId FK
        decimal amount
        decimal disbursedAmount
        datetime disbursedAt
        paymentstatus status
        string createdById FK
    }
    Project {
        string id PK
        string code
        string name
        projectstatus status
        decimal totalInvestment
    }
    User {
        string id PK
    }

    Project ||--o{ Household : projectId
    Project ||--o{ CompensationPlan : projectId
    Household ||--o{ HouseholdCompensationItem : householdId
    CompensationPlan ||--o{ HouseholdCompensationItem : compensationPlanId
    Household ||--o{ HouseholdPayment : householdId
    Payment ||--o{ HouseholdPayment : paymentId
    Household ||--o{ HouseholdStep : householdId
    User |o--o{ HouseholdStep : updatedById
    HouseholdStep ||--o{ HouseholdStepEvent : householdStepId
    User ||--o{ HouseholdStepEvent : changedById
```

## Đấu thầu và bảo hành

9 model · 10 quan hệ.

```mermaid
erDiagram
    BidSubmission {
        string id PK
        string packageId FK
        string contractorId FK
    }
    Contract {
        string id PK
        string projectId FK
        string procurementPackageId FK
        string contractorId FK
        decimal contractValue
    }
    Contractor {
        string id PK
    }
    ProcureStep {
        string id PK
        string packageId FK
        string responsibleUserId FK
    }
    ProcurementPackage {
        string id PK
        string projectId FK
        string winnerId FK
    }
    Project {
        string id PK
        string code
        string name
        projectstatus status
        decimal totalInvestment
    }
    User {
        string id PK
    }
    Warranty {
        string id PK
        string projectId FK
        string contractId FK
    }
    WarrantyIncident {
        string id PK
        string warrantyId FK
        string contractorId FK
    }

    Project ||--o{ ProcurementPackage : projectId
    Contractor |o--o{ ProcurementPackage : winnerId
    ProcurementPackage ||--o{ ProcureStep : packageId
    User |o--o{ ProcureStep : responsibleUserId
    ProcurementPackage ||--o{ BidSubmission : packageId
    Contractor ||--o{ BidSubmission : contractorId
    Project ||--o{ Warranty : projectId
    Contract ||--o{ Warranty : contractId
    Warranty ||--o{ WarrantyIncident : warrantyId
    Contractor ||--o{ WarrantyIncident : contractorId
```

## Pháp lý, báo cáo, nhật ký và thông báo

7 model · 8 quan hệ.

```mermaid
erDiagram
    AuditLog {
        string id PK
        string actorUserId FK
    }
    LegalDocument {
        string id PK
    }
    Notification {
        string id PK
        string recipientUserId FK
        string projectId FK
    }
    Project {
        string id PK
        string code
        string name
        projectstatus status
        decimal totalInvestment
    }
    ProjectLegalDocument {
        string projectId PK, FK
        string legalDocumentId PK, FK
    }
    ReportDraft {
        string id PK
        string projectId FK
        string createdById FK
        string reviewedById FK
    }
    User {
        string id PK
    }

    Project ||--o{ ProjectLegalDocument : projectId
    LegalDocument ||--o{ ProjectLegalDocument : legalDocumentId
    Project |o--o{ ReportDraft : projectId
    User ||--o{ ReportDraft : createdById
    User |o--o{ ReportDraft : reviewedById
    User |o--o{ AuditLog : actorUserId
    User ||--o{ Notification : recipientUserId
    Project |o--o{ Notification : projectId
```

## Tệp đính kèm

24 model · 23 quan hệ.

```mermaid
erDiagram
    Attachment {
        string id PK
        string uploadedById FK
    }
    CapitalAdjustmentAttachment {
        string adjustmentId PK, FK
        string attachmentId PK, FK
    }
    CapitalPlanAdjustment {
        string id PK
        string capitalPlanId FK
        decimal amountChange
        string createdById FK
    }
    CompensationPlan {
        string id PK
        string projectId FK
    }
    CompensationPlanAttachment {
        string compensationPlanId PK, FK
        string attachmentId PK, FK
    }
    DocumentTemplate {
        string id PK
    }
    DocumentTemplateAttachment {
        string documentTemplateId PK, FK
        string attachmentId PK, FK
    }
    HouseholdStep {
        string id PK
        string householdId FK
        string updatedById FK
    }
    HouseholdStepAttachment {
        string householdStepId PK, FK
        string attachmentId PK, FK
    }
    LegalDocument {
        string id PK
    }
    LegalDocumentAttachment {
        string legalDocumentId PK, FK
        string attachmentId PK, FK
    }
    Payment {
        string id PK
        string projectId FK
        string contractId FK
        string treasuryAccountId FK
        decimal amount
        decimal disbursedAmount
        datetime disbursedAt
        paymentstatus status
        string createdById FK
    }
    PaymentAttachment {
        string paymentId PK, FK
        string attachmentId PK, FK
    }
    ProcedureStepAttachment {
        string projectStepId PK, FK
        string attachmentId PK, FK
    }
    ProcureStep {
        string id PK
        string packageId FK
        string responsibleUserId FK
    }
    ProcureStepAttachment {
        string procureStepId PK, FK
        string attachmentId PK, FK
    }
    ProjectProcedureStep {
        string id PK
        string projectId FK
        string templateId FK
        string updatedById FK
    }
    ProjectSettlement {
        string id PK
        string projectId FK
    }
    ReportDraft {
        string id PK
        string projectId FK
        string createdById FK
        string reviewedById FK
    }
    ReportDraftAttachment {
        string reportDraftId PK, FK
        string attachmentId PK, FK
    }
    SettlementAttachment {
        string settlementId PK, FK
        string attachmentId PK, FK
    }
    User {
        string id PK
    }
    WarrantyIncident {
        string id PK
        string warrantyId FK
        string contractorId FK
    }
    WarrantyIncidentAttachment {
        string warrantyIncidentId PK, FK
        string attachmentId PK, FK
    }

    User ||--o{ Attachment : uploadedById
    ProjectProcedureStep ||--o{ ProcedureStepAttachment : projectStepId
    Attachment ||--o{ ProcedureStepAttachment : attachmentId
    Payment ||--o{ PaymentAttachment : paymentId
    Attachment ||--o{ PaymentAttachment : attachmentId
    CapitalPlanAdjustment ||--o{ CapitalAdjustmentAttachment : adjustmentId
    Attachment ||--o{ CapitalAdjustmentAttachment : attachmentId
    ProjectSettlement ||--o{ SettlementAttachment : settlementId
    Attachment ||--o{ SettlementAttachment : attachmentId
    CompensationPlan ||--o{ CompensationPlanAttachment : compensationPlanId
    Attachment ||--o{ CompensationPlanAttachment : attachmentId
    HouseholdStep ||--o{ HouseholdStepAttachment : householdStepId
    Attachment ||--o{ HouseholdStepAttachment : attachmentId
    ProcureStep ||--o{ ProcureStepAttachment : procureStepId
    Attachment ||--o{ ProcureStepAttachment : attachmentId
    WarrantyIncident ||--o{ WarrantyIncidentAttachment : warrantyIncidentId
    Attachment ||--o{ WarrantyIncidentAttachment : attachmentId
    LegalDocument ||--o{ LegalDocumentAttachment : legalDocumentId
    Attachment ||--o{ LegalDocumentAttachment : attachmentId
    DocumentTemplate ||--o{ DocumentTemplateAttachment : documentTemplateId
    Attachment ||--o{ DocumentTemplateAttachment : attachmentId
    ReportDraft ||--o{ ReportDraftAttachment : reportDraftId
    Attachment ||--o{ ReportDraftAttachment : attachmentId
```

## Kiểm tra độ đầy đủ

- Tổng cộng: **49 model, 80 quan hệ FK**.
- Mỗi quan hệ khai báo `@relation(fields: [...])` trong schema xuất hiện đúng một lần trong các sơ đồ trên.
- Các trường `sourceType`/`sourceId` trong `Notification` và `entityType`/`entityId` trong `AuditLog` là tham chiếu dạng chuỗi, không được schema khai báo là khóa ngoại nên không vẽ đường nối.
