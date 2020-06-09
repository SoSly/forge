export default {
    namespaced: true,
    state: {
        folder: {
            id: '1233',
            name: 'folder',
            path: [
                {id: '1231', name: 'path'},
                {id: '1232', name: 'to'}
            ],
            children: [
                {id: '1234', lastModified: 1591067500000, type: 'folder', name: 'subfolder1'},
                {id: '1235', lastModified: 1591067500000, type: 'folder', name: 'subfolder2'},
                {id: '1236', lastModified: 1591067500000, type: 'folder', name: 'subfolder3'},
                {id: '1237', lastModified: 1591067500000, type: 'document', name: 'A document', size: 128000},
                {id: '1238', lastModified: 1591067500000, type: 'document', name: 'Another document', size: 156000000},
                {id: '1239', lastModified: 1591067500000, type: 'document', name: 'A third document', size: 15000},
                {id: '1240', lastModified: 1591067500000, type: 'image', name: 'An image', size: 10240},
                {id: '1241', lastModified: 1591067500000, type: 'document', name: 'A fourth document', size: 13000},
                {id: '1242', lastModified: 1591067500000, type: 'image', name: 'A second image', size: 13920}
            ]
        }
    }
};
