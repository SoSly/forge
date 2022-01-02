import { MockMethod } from 'vite-plugin-mock';
import { forge } from '../html/src/types';
import { mockUser, mockUser2 } from './user';
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


const paginationSize = 50;
export default [
    {
        url: '/api/admin/audit',
        method: 'get',
        response: (req) => {
            const page = req.query.page ?? 1;
            const start = paginationSize * (page - 1);
            const end = paginationSize * page;

            return {
                page,
                entries: mockAuditLog.slice(start, end),
                pages: Math.ceil(mockAuditLog.length/paginationSize)
            }
        }
    },
    {
        url: '/api/admin/users',
        method: 'get',
        response: (req) => {
            const page = req.query.page ?? 1;
            const start = paginationSize * (page - 1);
            const end = paginationSize * page;
            return {
                page,
                users: [mockUser, mockUser2],
                pages: Math.ceil(1/50)
            }
        }
    },
    {
        url: '/api/admin/users/:id',
        method: 'patch',
        response: (req) => {
            Object.keys(req.body).forEach(field => {
                switch (req.query.id) {
                    case '1': mockUser[field] = req.body[field]; break;
                    case '2': mockUser2[field] = req.body[field]; break;
                }
            });
        }
    },
    {
        url: '/api/admin/users/:id',
        method: 'delete',
        response: (req) => {}
    }
] as MockMethod[];