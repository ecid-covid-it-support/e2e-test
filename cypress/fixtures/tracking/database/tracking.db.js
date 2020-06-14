const mongoose = require('mongoose')
const EventEmitter = require('events')
require('dotenv').config()

class TrackingDb {
    constructor() {
        this.options = {
            useNewUrlParser: true,
            useCreateIndex: true,
            useFindAndModify: false,
            bufferMaxEntries: 0,
            useUnifiedTopology: true
        };
        this._eventConnection = new EventEmitter();
    }

    async connect(retries, interval) {
        const _this = this;
        await this.createConnection(retries ? retries : 0, interval ? interval : 1000)
            .then((connection) => {
                this._connection = connection;
                this.connectionStatusListener(this._connection);
                this._eventConnection.emit('connected');
            })
            .catch((err) => {
                this._connection = undefined;
                this._eventConnection.emit('disconnected');
                console.log(`Error trying to connect for the first time with mongoDB: ${err.message}`);
                setTimeout(async () => {
                    _this.connect(retries, interval).then();
                }, 2000);
            });
    }

    createConnection(retries, interval) {
        return new Promise((resolve, reject) => {
            mongoose.createConnection(this.getURL(), this.options)
                .then((result) => resolve(result))
                .catch(err => reject(err));
        });
    }
    getURL() {
        return process.env.IOT_TRACKING_DB_URI
    }
    get connection() {
        return this._connection;
    }

    connectionStatusListener(connection) {
        if (!connection) {
            this._connection = undefined;
            this._eventConnection.emit('disconnected');
            return;
        }
        connection.on('connected', () => {
            this._eventConnection.emit('connected');
        });
        connection.on('disconnected', () => {
            this._connection = undefined;
            this._eventConnection.emit('disconnected');
        });
    }

    async dispose() {
        if (this._connection)
            await this._connection.removeAllListeners();
        if (this._connection)
            await this._connection.close();
        this._connection = undefined;
    }

    _deleteCollection(name) {
        return new Promise((resolve, reject) => {
            if (this._connection) {
                this._connection.db
                    .collection(name)
                    .deleteMany({})
                    .then(() => resolve(true))
                    .catch(reject);
            }
            else {
                return resolve(false);
            }
        });
    }

    deleteEnviroments() {
        return this._deleteCollection('environments');
    }

    deletePhysicalActivities() {
        return this._deleteCollection('physicalactivities');
    }

    deletePhysicalActivitiesLogs() {
        return this._deleteCollection('logs');
    }

    deleteSleepsRecords() {
        return this._deleteCollection('sleeps');
    }

    deleteMeasurements() {
        return this._deleteCollection('measurements');
    }

    async removeCollections() {
        if (this._connection) {
            const result = await this._connection.db
                .listCollections({
                    $or: [
                        { name: 'environments' },
                        { name: 'physicalactivities' },
                        { name: 'logs' },
                        { name: 'measurements' },
                        { name: 'sleeps' }
                    ]
                })
                .toArray();
            let errors = [];
            for (let c of result) {
                try {
                    await this._deleteCollection(c.name);
                }
                catch (err) {
                    errors.push(`Error in ${c.name}. ${err.message}`);
                }
            }
            if (errors.length > 0)
                return Promise.reject(errors);
            return Promise.resolve(true);
        }
        return Promise.reject(false);
    }
}
module.exports = new TrackingDb()