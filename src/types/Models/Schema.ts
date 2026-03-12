import { z } from "zod";
import { ContributorType } from "../Enums.js";

export const IdentifiedSchema = z.object({
    _id: z.string().optional(),
    createdAt: z.iso.datetime().optional(),
    updatedAt: z.iso.datetime().optional(),
});

export const ContributorSchema = z.object({
    contributorType: z.enum(ContributorType),
    email: z.email(),
});

export const DocumentSchema = IdentifiedSchema.extend({
    name: z.string().min(1, "Name is required"),
    serializedCRDTState: z.string(),
    ownerId: z.string().optional(),
    contributors: z.array(ContributorSchema).default([]),
    projectId: z.string().optional(),
});

export const ProjectSchema = IdentifiedSchema.extend({
    name: z.string().min(1, "Name is required"),
    ownerId: z.string().optional(),
    documentIds: z.array(z.string()).default([]),
    contributors: z.array(ContributorSchema).default([]),
});

export const CommentSchema = IdentifiedSchema.extend({
    text: z.string().min(1, "text is required for a comment"),
    userId: z.string().optional(),
    parentCommentId: z.string().optional(), //the comment that a comment is responding to
    documentId: z.string(),
    resolved: z.boolean().default(false),
    from: z.number(),
    to: z.number()
});

export type Identified = z.infer<typeof IdentifiedSchema>;
export type Contributor = z.infer<typeof ContributorSchema>;
export type Document = z.infer<typeof DocumentSchema>;
export type Project = z.infer<typeof ProjectSchema>;
export type CommentType = z.infer<typeof CommentSchema>;
export type ProjectWithDocuments = {
    project: Project;
    documents: Document[];
};
