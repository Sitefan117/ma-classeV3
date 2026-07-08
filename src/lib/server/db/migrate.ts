import { getDatabasePath, getSqlite } from './client';

getSqlite();
console.log(`SQLite classroom database is ready: ${getDatabasePath()}`);
