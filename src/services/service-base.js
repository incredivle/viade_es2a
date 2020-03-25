import data from '@solid/query-ldflex';
import { AccessControlList } from '@inrupt/solid-react-components';
import { errorToaster, permissionHelper } from '@utils';

import auth from 'solid-auth-client';
import FileClient from 'solid-file-client';

const PATH_BASE = process.env.REACT_APP_VIADE_PATH_BASE;
const ROUTES_PATH = PATH_BASE + process.env.REACT_APP_ROUTES_PATH;
const GROUPS_PATH = PATH_BASE + process.env.REACT_APP_GROUPS_PATH;

export default class ServiceBase {

    buildPathFromWebId(webId, path) {
        if (!webId) return false;
        const domain = new URL(typeof webId === 'object' ? webId.webId : webId).origin;
        return `${domain}/${path}`;
    }

    async getStorage(webId, path) {
        const podStoragePath = await data[webId].storage;
        let podStoragePathValue =
            podStoragePath && podStoragePath.value.trim().length > 0 ? podStoragePath.value : '';

        if (podStoragePathValue && !podStoragePathValue.endsWith('/'))
            podStoragePathValue = `${podStoragePathValue}/`;

        if (!podStoragePathValue || podStoragePathValue.trim().length === 0)
            return this.buildPathFromWebId(webId, path);

        return `${podStoragePathValue}${path}`;
    }

    async getRouteStorage(webId) { return await this.getStorage(webId, ROUTES_PATH); }

    async getGroupStorage(webId) { return await this.getStorage(webId, GROUPS_PATH); }

    async createInitialFiles(webId) {
        return await this.tryOperation(async client => {
            const hasWritePermission = await permissionHelper.checkSpecificAppPermission(
                webId,
                AccessControlList.MODES.WRITE
            );

            if (!hasWritePermission) return;

            const routesUrl = await this.getRouteStorage(webId);
            const groupsUrl = await this.getGroupStorage(webId);

            const routesDirExists = await client.itemExists(routesUrl);
            const groupsDirExists = await client.itemExists(groupsUrl);

            if (!routesDirExists)
                await client.createFolder(routesUrl);

            if (!groupsDirExists)
                await client.createFolder(groupsUrl);

            return true;
        });
    }

    async existsResource(path) {
        return await this.tryOperation(async client => await client.itemExists(path));
    }

    async tryOperation(operation) {
        try {
            return await operation(await this.getFileClient());
        } catch (error) {
            errorToaster(error.message, 'Error');
            console.log(error);
            return false;
        }
    }

    async getFileClient() {
        const fileClient = new FileClient(auth);
        let session = await auth.currentSession()
        if (!session)
            session = await auth.login()

        return fileClient;
    }
}