import { MockMethod } from 'vite-plugin-mock';
import { forge } from '../html/src/types';
import { deleteDocument, getDocumentNode } from './document';
import { mockFolders } from './store';

function generateRandomSize(): number {
    return Math.pow(Math.floor(Math.random() * 1024), Math.floor(Math.random() * 5));
}

export function createMockFolder(name: string, parentId: string | null): forge.Folder {
    let parentFolder: forge.Folder | null = mockFolders.get(parentId) || null;
    const newFolder = {
        id: `${++process.currentFolderId}`,
        name,
        parent: parentFolder,
        createdAt: new Date(),
        updatedAt: new Date(),
        size: generateRandomSize(),
        children: [],
        documents: []
    } as forge.Folder;
    if (parentFolder) {
        parentFolder.children.push(newFolder);
        mockFolders.set(parentFolder.id, parentFolder);
    }
    mockFolders.set(newFolder.id, newFolder);
    return newFolder;
}

function serialize(folder: forge.Folder): forge.Folder {
    const destination = {...folder};
    destination.parent = destination.parent ? getFolderNode(destination.parent) : null;
    destination.children = destination.children ? destination.children.reduce((cur, child) => [...cur, getFolderNode(child)], []) : [];
    destination.documents = destination.documents ? destination.documents.reduce((cur, child) => [...cur, getDocumentNode(child)], []) : [];
    return destination as forge.Folder;
}


export function addChildToFolder(id: string, folder: forge.Folder) {
    if (!mockFolders.has(id)) {
        console.log(`Could not find folder ${id}`);
        return;
    }
    const parentFolder = mockFolders.get(id);
    removeChildFromFolder(id, folder);
    parentFolder.children.push(folder);
    mockFolders.set(id, parentFolder);
}

export function removeChildFromFolder(id: string, folder: forge.Folder) {
    if (!mockFolders.has(id)) {
        console.log(`Could not find folder ${id}`);
        return;
    }
    const parentFolder = mockFolders.get(id);
    parentFolder.children = parentFolder.children.filter(({id}) => id != folder.id);
    mockFolders.set(id, parentFolder);
}

export function addDocumentToFolder(id: string, document: forge.Document) {
    if (!mockFolders.has(id)) {
        console.log(`Could not find folder ${id}`);
        return;
    }
    const folder = mockFolders.get(id);
    removeDocumentFromFolder(id, document);
    folder.documents.push(document);
    mockFolders.set(id, folder);
}

export function removeDocumentFromFolder(id: string, document: forge.Document) {
    if (!mockFolders.has(id)) {
        console.log(`Could not find folder ${id}`);
        return;
    }
    const folder = mockFolders.get(id);
    folder.documents = folder.documents.filter(({id}) => id != document.id);
    mockFolders.set(id, folder);
}

function deleteFolder(folder: forge.Folder) {
    if (folder.parent) {
        mockFolders.get(folder.parent.id).children = mockFolders.get(folder.parent.id).children.filter(({id}) => id != folder.id); 
    }

    if (folder.children) {
        folder.children.forEach(({id}) => deleteFolder(mockFolders.get(id)));
    }

    if (folder.documents) {
        folder.documents.forEach(({id}) => deleteDocument(id));
    }

    mockFolders.delete(folder.id);
}

function getFolderNode(folder: forge.Folder | forge.NodeFolder): forge.NodeFolder {
    const {id, name, createdAt, updatedAt, size} = folder;
    const parent = folder.parent ? getFolderNode(folder.parent) : null;
    return {id, name, parent, createdAt, updatedAt, size} as forge.NodeFolder;
}

export default [
    {
        url: '/api/folder',
        method: 'get',
        response: () => {
            return serialize(mockFolders.get("1"))
        }
    },
    {
        url: '/api/folder/:id',
        method: 'get',
        response: (req) => {
            const {id} = req.query;
            return serialize(mockFolders.get(id));
        }
    },
    {
        url: '/api/folder',
        method: 'post',
        response: (req) => {
            const {name, parentId} = req.body;
            const newFolder = createMockFolder(name, parentId);
            return serialize(newFolder);
        },
        statusCode: 201
    },
    {
        url: '/api/folder/:id',
        method: 'patch',
        response: (req) => {
            const {id} = req.query;
            const folder: forge.Folder = mockFolders.get(id);
            
            if (!folder.parent) {
                console.error('cannot modify root folder');
                return;
            }
            const currentParentId = folder.parent.id;
            
            if (req.body.parentId) {
                const parentId = req.body.parentId;
                delete req.body.parentId;

                const parent = mockFolders.get(parentId);
                folder.parent = parent;

                removeChildFromFolder(currentParentId, folder);
                addChildToFolder(parentId, folder);
            }

            Object.keys(req.body).forEach(k => folder[k] = req.body[k]);
            mockFolders.set(id, folder);

        }
    },
    {
        url: '/api/folder/:id',
        method: 'delete',
        response: (req) => {
            const {id} = req.query;
            deleteFolder(mockFolders.get(id));
        }
    }
] as MockMethod[];
