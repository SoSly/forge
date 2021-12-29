import { MockMethod } from 'vite-plugin-mock';
import { forge } from '../html/src/types';
import { mockUser } from './user';
import { sample } from 'lodash';

const mockAuditLog = [];

(function generateAuditLogEntries() {
    const now = new Date();
    Array.from(Array(2000).keys()).forEach(id => {
        const action = sample(['set_user_type', 'ban_user', 'delete_user_content']);
        const createdAt = new Date(now);
        const note = sample(['dude was crazy', 'testing notes', '', '', '', 'uncool']);
        createdAt.setDate(createdAt.getDate() - id);
        mockAuditLog.push({
            id: `${id}`,
            user: mockUser,
            action,
            affected_user: mockUser,
            createdAt,
            detail: (action === 'set_user_type' ? sample(['free', 'unlimited']) : ''),
            note
        } as forge.AuditLog);
    });
})();

export default [
    {
        url: '/api/admin/audit',
        method: 'get',
        response: (req) => {
            const paginationSize = 50;
            const page = req.query.page ?? 1;
            const start = paginationSize * (page - 1);
            const end = paginationSize * page;

            return {
                page,
                entries: mockAuditLog.slice(start, end),
                pages: Math.ceil(mockAuditLog.length/paginationSize)
            }
        }
    }
] as MockMethod[];