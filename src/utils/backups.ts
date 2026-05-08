import { execFile } from 'child_process';
import fs from 'fs/promises';
import path from 'path';

type BackupOptions = {
  strapi: any;
};

const ONE_DAY_MS = 24 * 60 * 60 * 1000;

const execFileAsync = (
  command: string,
  args: string[],
  options: { env?: NodeJS.ProcessEnv; cwd?: string } = {}
) =>
  new Promise<void>((resolve, reject) => {
    execFile(command, args, options, (error, stdout, stderr) => {
      if (error) {
        reject(new Error(`${command} falló: ${stderr || stdout || error.message}`));
        return;
      }

      resolve();
    });
  });

const exists = async (filePath: string) => {
  try {
    await fs.access(filePath);
    return true;
  } catch {
    return false;
  }
};

const timestamp = () => new Date().toISOString().replace(/[:.]/g, '-');

const getBackupDir = () =>
  path.resolve(process.cwd(), process.env.BACKUP_DIR || 'backups');

const getDocumentsPaths = async () => {
  const configuredPaths = (process.env.BACKUP_DOCUMENTS_PATHS || 'public/uploads,data/uploads')
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean);

  const existingPaths: string[] = [];

  for (const configuredPath of configuredPaths) {
    const absolutePath = path.resolve(process.cwd(), configuredPath);

    if (await exists(absolutePath)) {
      existingPaths.push(configuredPath);
    }
  }

  return existingPaths;
};

const backupDocuments = async (backupDir: string, strapi: any) => {
  const documentsPaths = await getDocumentsPaths();

  if (documentsPaths.length === 0) {
    strapi.log.warn('Backup de documentos omitido: no existen carpetas configuradas.');
    return;
  }

  const output = path.join(backupDir, `documents-${timestamp()}.tar.gz`);
  await execFileAsync('tar', ['-czf', output, ...documentsPaths], { cwd: process.cwd() });
};

const backupPostgres = async (backupDir: string) => {
  const output = path.join(backupDir, `database-${timestamp()}.dump`);
  const databaseUrl = process.env.DATABASE_URL;
  const args = databaseUrl
    ? [databaseUrl, '-F', 'c', '-f', output]
    : [
        '-h',
        process.env.DATABASE_HOST || 'localhost',
        '-p',
        process.env.DATABASE_PORT || '5432',
        '-U',
        process.env.DATABASE_USERNAME || 'strapi',
        '-d',
        process.env.DATABASE_NAME || 'strapi',
        '-F',
        'c',
        '-f',
        output,
      ];

  await execFileAsync('pg_dump', args, {
    env: {
      ...process.env,
      PGPASSWORD: process.env.DATABASE_PASSWORD || '',
    },
  });
};

const backupMysql = async (backupDir: string) => {
  const output = path.join(backupDir, `database-${timestamp()}.sql`);
  const args = [
    '-h',
    process.env.DATABASE_HOST || 'localhost',
    '-P',
    process.env.DATABASE_PORT || '3306',
    '-u',
    process.env.DATABASE_USERNAME || 'strapi',
    `--password=${process.env.DATABASE_PASSWORD || ''}`,
    process.env.DATABASE_NAME || 'strapi',
  ];

  const dump = await new Promise<string>((resolve, reject) => {
    execFile('mysqldump', args, (error, stdout, stderr) => {
      if (error) {
        reject(new Error(`mysqldump falló: ${stderr || error.message}`));
        return;
      }

      resolve(stdout);
    });
  });

  await fs.writeFile(output, dump);
};

const backupSqlite = async (backupDir: string) => {
  const databaseFile = path.resolve(
    process.cwd(),
    process.env.DATABASE_FILENAME || '.tmp/data.db'
  );

  if (!(await exists(databaseFile))) {
    throw new Error(`No existe la base SQLite: ${databaseFile}`);
  }

  await fs.copyFile(databaseFile, path.join(backupDir, `database-${timestamp()}.sqlite`));
};

const backupDatabase = async (backupDir: string) => {
  const client = process.env.DATABASE_CLIENT || 'sqlite';

  if (client === 'postgres') {
    await backupPostgres(backupDir);
    return;
  }

  if (client === 'mysql') {
    await backupMysql(backupDir);
    return;
  }

  if (client === 'sqlite') {
    await backupSqlite(backupDir);
    return;
  }

  throw new Error(`Cliente de base de datos no soportado para backup: ${client}`);
};

const pruneOldBackups = async (backupDir: string, retentionDays: number, strapi: any) => {
  const entries = await fs.readdir(backupDir, { withFileTypes: true });
  const maxAgeMs = retentionDays * ONE_DAY_MS;
  const now = Date.now();

  await Promise.all(
    entries.map(async (entry) => {
      const entryPath = path.join(backupDir, entry.name);
      const stats = await fs.stat(entryPath);

      if (now - stats.mtimeMs <= maxAgeMs) {
        return;
      }

      await fs.rm(entryPath, { recursive: true, force: true });
      strapi.log.info(`Backup eliminado por retención: ${entry.name}`);
    })
  );
};

export const runBackup = async ({ strapi }: BackupOptions) => {
  const backupDir = getBackupDir();
  const retentionDays = Number(process.env.BACKUP_RETENTION_DAYS || 7);

  await fs.mkdir(backupDir, { recursive: true });

  strapi.log.info('Iniciando backup automático de base de datos y documentos.');

  await backupDatabase(backupDir);
  await backupDocuments(backupDir, strapi);
  await pruneOldBackups(backupDir, retentionDays, strapi);

  strapi.log.info(`Backup automático finalizado. Retención configurada: ${retentionDays} días.`);
};

const getNextRunDelay = () => {
  const [hour = '2', minute = '0'] = (process.env.BACKUP_TIME || '02:00').split(':');
  const parsedHour = Number(hour);
  const parsedMinute = Number(minute);
  const nextRun = new Date();

  nextRun.setHours(
    Number.isInteger(parsedHour) ? parsedHour : 2,
    Number.isInteger(parsedMinute) ? parsedMinute : 0,
    0,
    0
  );

  if (nextRun.getTime() <= Date.now()) {
    nextRun.setDate(nextRun.getDate() + 1);
  }

  return nextRun.getTime() - Date.now();
};

export const startBackupScheduler = ({ strapi }: BackupOptions) => {
  if (process.env.BACKUP_ENABLED === 'false') {
    strapi.log.info('Backups automáticos desactivados por BACKUP_ENABLED=false.');
    return;
  }

  const scheduleNextRun = () => {
    const delay = getNextRunDelay();

    setTimeout(async () => {
      try {
        await runBackup({ strapi });
      } catch (error) {
        strapi.log.error('Error ejecutando backup automático:', error);
      } finally {
        scheduleNextRun();
      }
    }, delay);
  };

  scheduleNextRun();

  if (process.env.BACKUP_RUN_ON_START === 'true') {
    setImmediate(async () => {
      try {
        await runBackup({ strapi });
      } catch (error) {
        strapi.log.error('Error ejecutando backup inicial:', error);
      }
    });
  }

  strapi.log.info(
    `Backups automáticos activos. Hora diaria: ${process.env.BACKUP_TIME || '02:00'}; retención: ${
      process.env.BACKUP_RETENTION_DAYS || 7
    } días.`
  );
};
