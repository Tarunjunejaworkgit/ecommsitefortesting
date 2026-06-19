import { PrismaClient } from '@prisma/client';
import { PrismaMssql } from '@prisma/adapter-mssql';

const databaseUrl = process.env.DATABASE_URL || 'sqlserver://localhost:1433;database=dummy;user=dummy;password=dummy;encrypt=true;trustServerCertificate=true';

function parseSqlServerConnectionString(url: string) {
  try {
    // Strip protocol 'sqlserver://'
    const cleanUrl = url.replace(/^sqlserver:\/\//i, '');
    
    // Find the last '@' symbol in the authority part (before any query parameters)
    // This handles passwords containing the '@' character correctly
    const firstSemicolonIndex = cleanUrl.indexOf(';');
    const authorityPart = firstSemicolonIndex !== -1 
      ? cleanUrl.substring(0, firstSemicolonIndex) 
      : cleanUrl;
      
    const lastAtIndex = authorityPart.lastIndexOf('@');
    
    let credentials = '';
    let hostAndParams = '';
    
    if (lastAtIndex !== -1) {
      credentials = authorityPart.substring(0, lastAtIndex);
      const hostPart = authorityPart.substring(lastAtIndex + 1);
      hostAndParams = firstSemicolonIndex !== -1 
        ? hostPart + cleanUrl.substring(firstSemicolonIndex) 
        : hostPart;
    } else {
      hostAndParams = cleanUrl;
    }
    
    // Parse user and password from credentials
    let user = '';
    let password = '';
    if (credentials) {
      const firstColonIndex = credentials.indexOf(':');
      if (firstColonIndex !== -1) {
        user = decodeURIComponent(credentials.substring(0, firstColonIndex));
        password = decodeURIComponent(credentials.substring(firstColonIndex + 1));
      } else {
        user = decodeURIComponent(credentials);
      }
    }
    
    // Parse host and parameters
    const parts = hostAndParams.split(';');
    const hostPort = parts[0];
    const paramsList = parts.slice(1);
    
    const [server, portStr] = hostPort.split(':');
    const port = portStr ? parseInt(portStr, 10) : 1433;
    
    // Parse query params (e.g. database=xxx;encrypt=true;...)
    const params: Record<string, string> = {};
    for (const p of paramsList) {
      const equalsIndex = p.indexOf('=');
      if (equalsIndex !== -1) {
        const k = p.substring(0, equalsIndex).trim().toLowerCase();
        const v = p.substring(equalsIndex + 1).trim();
        params[k] = v;
      }
    }
    
    // Check parameters if credentials wasn't in URL authority
    if (!user && params['user']) user = params['user'];
    if (!password && params['password']) password = params['password'];
    
    const database = params['database'] || 'master';
    const encrypt = params['encrypt'] !== 'false'; // default to true for Azure
    const trustServerCertificate = params['trustservercertificate'] === 'true';
    
    return {
      server,
      port,
      database,
      user,
      password,
      options: {
        encrypt,
        trustServerCertificate,
      }
    };
  } catch (err) {
    console.error('Failed to parse SQL Server connection string:', err);
    throw new Error('Invalid DATABASE_URL configuration');
  }
}

let prismaInstance: PrismaClient;

if (process.env.NODE_ENV === 'production') {
  if (!databaseUrl) throw new Error('DATABASE_URL environment variable is not set');
  const config = parseSqlServerConnectionString(databaseUrl);
  const adapter = new PrismaMssql(config);
  prismaInstance = new PrismaClient({ adapter });
} else {
  const globalForPrisma = global as unknown as { prisma: PrismaClient };
  if (!globalForPrisma.prisma) {
    if (!databaseUrl) throw new Error('DATABASE_URL environment variable is not set');
    const config = parseSqlServerConnectionString(databaseUrl);
    const adapter = new PrismaMssql(config);
    globalForPrisma.prisma = new PrismaClient({ adapter });
  }
  prismaInstance = globalForPrisma.prisma;
}

export const prisma = prismaInstance;
export default prisma;
