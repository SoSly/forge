import { MockMethod } from 'vite-plugin-mock';

let loggedOut = true;
export const mockUser = {
    "id":"1",
    "username":"Niv",
    "type":"unlimited",
    "avatar":"5c824a124a1c3a39128bf443c75df892",
    "locale":"en-US",
    "provider":"discord",
    "providerId":"60468942044405760",
    "settings":{"darkmode":true},
    "rights":{audit: true, ban_user: true, delete_content: true, document_list: true, grant: true, user_list: true},
    "usage":{"current":1140759,"max":null}
};

export default [
    {
        url: '/api/profile',
        method: 'get',
        response: ({query}) => loggedOut ? {} : mockUser
    },
    {
        url: '/api/settings',
        method: 'patch',
        response: (req) => mockUser.settings = req.body
    },
    {
        url: '/auth/login',
        method: 'get',
        rawResponse: async (req, res) => {
            loggedOut = false;
            res.setHeader('Location', '/');
            res.statusCode = 302;
            res.end();
        }
    },
    {
        url: '/auth/logout',
        method: 'get',
        rawResponse: async (req, res) => {
            loggedOut = true;
            res.setHeader('Location', '/');
            res.statusCode = 302;
            res.end();
        }
    }
] as MockMethod[];