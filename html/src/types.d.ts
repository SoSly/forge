export module forge {
    export interface Store {
        profileMenu: boolean
        folder?: Folder
        user?: User
    }

    export interface Document {
        id: string
        name: string
        current: DocumentContents
        folderId: string
        createdAt: Date
        updatedAt: Date
        size: number
        type: 'markdown' | 'stylesheet'
    }

    export interface DocumentContents {
        id: string,
        contents: string
    }

    export interface DocumentNode {
        id: string
        name: string
        createdAt: Date
        updatedAt: Date
        size: number
    }

    export interface Folder {
        id: string
        name: string
        parent: Folder | NodeFolder | null
        createdAt: Date
        updatedAt: Date
        size: number
        children: Folder[] | NodeFolder[]
        documents: Document[]
    }

    export interface NodeFolder {
        id: string
        name: string
        parent: Folder | NodeFolder | null
        createdAt: Date
        updatedAt: Date
        size: number
    }

    export interface FolderItem {
        id: string
        name: string
        createdAt: Date
        updatedAt: Date
        size: number
        type: 'folder' | 'document'
    }

    export interface User {
        id: string | null
        username: string
        type: string
        avatar: string
        locale: string
        provider: string
        providerId: string
        rights?: UserRights
        settings: UserSettings
        usage: UserUsage
    }

    export interface UserRights {
        audit: boolean
        ban_user: boolean
        delete_content: boolean
        document_list: boolean
        grant: boolean
        user_list: boolean        
    }

    export interface UserSettings {
        darkmode: boolean
    }

    export interface UserUsage {
        current: number
        max: number
    }
}