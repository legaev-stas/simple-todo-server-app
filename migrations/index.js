const path = require('path');
const Umzug = require('umzug');

const umzug = new Umzug({
    storage: 'json',

    logging: logUmzugEvent,

    migrations: {
        path: 'migrations/scripts',

        // The pattern that determines whether or not a file is a migration.
        pattern: /\.js$/,
    }
});

function logUmzugEvent(eventName) {
    return function(name, migration) {
        console.log(`${ name } ${ eventName }`);
    }
}
umzug.on('migrating', logUmzugEvent('migrating'));
umzug.on('migrated',  logUmzugEvent('migrated'));
umzug.on('reverting', logUmzugEvent('reverting'));
umzug.on('reverted',  logUmzugEvent('reverted'));

function cmdStatus() {
    let result = {};

    return umzug.executed()
        .then(executed => {
            result.executed = executed;
            return umzug.pending();
        }).then(pending => {
            result.pending = pending;
            return result;
        }).then(({ executed, pending }) => {

            executed = executed.map(m => {
                m.name = path.basename(m.file, '.js');
                return m;
            });
            pending = pending.map(m => {
                m.name = path.basename(m.file, '.js');
                return m;
            });

            const current = executed.length > 0 ? executed[0].file : '<NO_MIGRATIONS>';
            const status = {
                current: current,
                executed: executed.map(m => m.file),
                pending: pending.map(m => m.file),
            }

            console.log(JSON.stringify(status, null, 2))

            return { executed, pending };
        })
}

function cmdMigrate() {
    return umzug.up();
}

function cmdMigrateNext() {
    return cmdStatus()
        .then(({ executed, pending }) => {
            if (pending.length === 0) {
                return Promise.reject(new Error('No pending migrations'));
            }
            const next = pending[0].name;
            return umzug.up({ to: next });
        })
}

function cmdReset() {
    return umzug.down({ to: 0 });
}

function cmdResetPrev() {
    return cmdStatus()
        .then(({ executed, pending }) => {
            if (executed.length === 0) {
                return Promise.reject(new Error('Already at initial state'));
            }
            const prev = executed[executed.length - 1].name;
            return umzug.down({ to: prev });
        })
}


const cmd = process.argv[2].trim();
let executedCmd;

console.log(`${ cmd.toUpperCase() } BEGIN`);
switch(cmd) {
    case 'status':
        executedCmd = cmdStatus();
        break;

    case 'up':
        executedCmd = cmdMigrate();
        break;

    case 'next':
        executedCmd = cmdMigrateNext();
        break;

    case 'down':
        executedCmd = cmdReset();
        break;

    case 'prev':
        executedCmd = cmdResetPrev();
        break;

    default:
        console.log(`invalid cmd: ${ cmd }`);
        process.exit(1);
}

executedCmd
    .then((result) => {
        const doneStr = `${ cmd.toUpperCase() } DONE`;
        console.log(doneStr);
        console.log("=".repeat(doneStr.length));
    })
    .catch(err => {
        const errorStr = `${ cmd.toUpperCase() } ERROR`;
        console.log(errorStr);
        console.log("=".repeat(errorStr.length));
        console.log(err);
        console.log("=".repeat(errorStr.length));
    })
    .then(() => {
        if (cmd !== 'status') {
            return cmdStatus()
        }
        return Promise.resolve();
    })
    .then(() => process.exit(0))