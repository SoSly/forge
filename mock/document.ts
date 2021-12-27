import { MockMethod } from 'vite-plugin-mock';
import { forge } from '../html/src/types';
import { addDocumentToFolder } from './folder';
import { mockDocuments, mockFolders } from './store';
import { readFileSync } from 'fs';

export function createMockDocument(folderId: string, name: string, type: 'markdown' | 'stylesheet', contents: string): forge.Document {
    const newDocument = {
        id: `${++process.currentDocumentId}`,
        name,
        current: {
            id: `${++process.currentContentId}`,
            contents: contents
        } as forge.DocumentContents,
        folderId,
        createdAt: new Date(),
        updatedAt: new Date(),
        type,
        size: contents.length
    } as forge.Document;
    addDocumentToFolder(folderId, newDocument);
    mockDocuments.set(newDocument.id, newDocument);
    return newDocument;
}

export function getDocumentNode(document: forge.Document): forge.DocumentNode {
    const {id, name, createdAt, updatedAt} = document;
    const size = document.current.contents.length;
    return {id, name, createdAt, updatedAt, size} as forge.DocumentNode;
}

export function deleteDocument(id: string) {
    const document = mockDocuments.get(id);
    const folder = mockFolders.get(document.folderId);
    folder.documents = folder.documents.filter(({id}) => id != document.id);
    mockFolders.set(folder);
    mockDocuments.delete(id);
}

export default [
    {
        url: '/api/document/:id',
        method: 'get',
        response: (req) => {
            const {id} = req.query;
            return mockDocuments.get(id);            
        }
    },
    {
        url: '/api/document',
        method: 'post',
        response: (req) => {
            const {folderId, name} = req.body;
            const newDocument = createMockDocument(folderId, name, 'markdown', '');
            return getDocumentNode(newDocument);
        },
        statusCode: 201
    },
    {
        url: '/api/document/:id',
        method: 'patch',
        response: (req) => {
            const {id} = req.query;
            const document: forge.Document = mockDocuments.get(id);
            Object.keys(req.body).forEach(k => document[k] = req.body[k]);
            mockDocuments.set(id, document);
            addDocumentToFolder(document.folderId, document);
        }
    },
    {
        url: '/api/document/:id',
        method: 'delete',
        response: (req) => {
            const {id} = req.query;
            deleteDocument(id);
        }
    }
] as MockMethod[];