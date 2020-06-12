'use strict'
const fs = require('fs')
const path = require('path')
const Sequelize = require('sequelize')
const TableName = require('./table.name')
require('dotenv').config()

class MissionsDb {
    MISSIONS_DB_HOST = process.env.MISSIONS_DB_HOST
    MISSIONS_DB_PORT = process.env.MISSIONS_DB_PORT
    MISSIONS_DB_NAME = process.env.MISSIONS_DB_NAME
    MISSIONS_DB_USER = process.env.MISSIONS_DB_USER
    MISSIONS_DB_PASS = process.env.MISSIONS_DB_PASS

    options = {
        host: this.MISSIONS_DB_HOST,
        port: this.MISSIONS_DB_PORT,
        dialect: 'mysql',
        logging: false,
        define: {
            timestamps: false
        }
    }

    constructor() {
        this.sequelize = new Sequelize(
            this.MISSIONS_DB_NAME, this.MISSIONS_DB_USER, this.MISSIONS_DB_PASS, this.options
        )
    }

    connect() {
        console.log('########## ', TableName.ROBOT_RESULT)
        return this.sequelize.authenticate()
    }

    close() {
        return new Promise((resolve, reject) => {
            if (!this.sequelize) return resolve(true)
            this.sequelize.close()
                .then(() => resolve(true))
                .catch(reject)
        })
    }

    deleteAllRobotResult() {
        return new Promise((resolve, reject) => {
            this.sequelize.getQueryInterface().bulkDelete(TableName.ROBOT_RESULT, {})
                .then(() => resolve(true))
                .catch(reject)
        })
    }

    deleteAllFoodRecognition() {
        return new Promise((resolve, reject) => {
            this.sequelize.getQueryInterface().bulkDelete(TableName.FOOD_RECOGNITION, {})
                .then(() => resolve(true))
                .catch(reject)
        })
    }

    deleteAllEducatorMissions() {
        return new Promise((resolve, reject) => {
            this.sequelize.getQueryInterface().bulkDelete(TableName.EDUCATOR_MISSION, {})
                .then(() => resolve(true))
                .catch(reject)
        })
    }

    showTables() {
        return this.sequelize.getQueryInterface().showAllSchemas()
    }

    restore() {
        const fileDump = path.resolve(process.cwd(), 'cypress', 'fixtures', 'missions', 'database', 'backup.sql')
        const queries = fs.readFileSync(fileDump, {encoding: 'UTF-8'}).split(';\n')

        // Setup the DB to import data in bulk.
        let promise = this.sequelize.query('SET FOREIGN_KEY_CHECKS=0')
            .then(() => {
                return this.sequelize.query('SET UNIQUE_CHECKS=0')
            })
            .then(() => {
                return this.sequelize.query('SET SQL_MODE=\'NO_AUTO_VALUE_ON_ZERO\'')
            }).then(() => {
                return this.sequelize.query('SET SQL_NOTES=0')
            })

        for (let query of queries) {
            query = query.trim()
            if (query.length !== 0 && !query.match(/\/\*/)) {
                promise = promise.then(() => {
                    return this.sequelize.query(query, {raw: true})
                })
            }
        }

        return promise.then(() => {
            return Promise.resolve()
        })
            .then(() => {
                console.timeEnd(`Restore of the "${this.MISSIONS_DB_NAME}" database completed successfully`)
            })
            .catch(e => console.log(`Error restoring database "${this.MISSIONS_DB_NAME}".`, e.message))

    };
}

module.exports = new MissionsDb()
