import {Auth} from "@domain/UserEntity";
import {Folder} from "@domain/FolderEntity";

export function getUsageMax(type: string): number {
    switch (type) {
        case 'unlimited': 
            return Infinity;
        case 'free': 
        default:
            return 100 * 1024 * 1024;
    }
}

export async function isOverLimit(auth: Auth): Promise<boolean> {
    const folder = await Folder.getRootFolder(auth);
    const max = getUsageMax(auth.type);
    return folder!.size > max;
}
