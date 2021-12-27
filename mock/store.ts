process.mockFolders = process.mockFolders || new Map();
process.mockDocuments = process.mockDocuments || new Map();
process.currentDocumentId = process.currentDocumentId || 0;
process.currentContentId = process.currentContentId || 0;
process.currentFolderId = process.currentFolderId || 0;

export const mockFolders = process.mockFolders;
export const mockDocuments = process.mockDocuments;

import { readFileSync } from "fs";
import { createMockDocument } from "./document";
import { createMockFolder } from "./folder";

if (!process.mockFolders.has("1")) {
    const rootFolder = createMockFolder("Your Workbench", null);
    const tibbit = createMockDocument(rootFolder.id, "Tibbit", 'markdown', readFileSync('./mock/tibbit.md').toString());
    const ua = createMockDocument(rootFolder.id, "Unearthed Arcana Styles", 'stylesheet', readFileSync('./mock/unearthed-arcana.css').toString());
}