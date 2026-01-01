import { 
    SOP, JobRole, Candidate, Ticket, DataSchema, 
    Experiment, InventoryItem, ComplianceItem, CommunityThread 
} from '../types';
import { db } from './localStorageDb';

// --- SEED DATA ---
const SEED_SOPS: SOP[] = [
    { id: '1', title: 'Employee Onboarding', category: 'HR', lastUpdated: '2 days ago', status: 'PUBLISHED' },
    { id: '2', title: 'Incident Response', category: 'Engineering', lastUpdated: '1 week ago', status: 'PUBLISHED' },
    { id: '3', title: 'Refund Policy', category: 'Support', lastUpdated: '1 month ago', status: 'DRAFT' },
];

const SEED_JOBS: JobRole[] = [
    { id: '1', title: 'Senior Frontend Engineer', department: 'Engineering', status: 'OPEN', candidatesCount: 12 },
    { id: '2', title: 'Product Manager', department: 'Product', status: 'OPEN', candidatesCount: 5 },
    { id: '3', title: 'Sales Rep', department: 'Sales', status: 'FILLED', candidatesCount: 0 },
];

const SEED_TICKETS: Ticket[] = [
    { id: '101', subject: 'Login failing on mobile', customer: 'Acme Corp', priority: 'HIGH', status: 'OPEN', created: '2 hours ago' },
    { id: '102', subject: 'Feature request: Dark mode export', customer: 'John Doe', priority: 'LOW', status: 'IN_PROGRESS', created: '1 day ago' },
    { id: '103', subject: 'Billing question', customer: 'Stark Ind', priority: 'MEDIUM', status: 'RESOLVED', created: '3 days ago' },
];

// --- OPERATIONS ---
export const getSOPs = async (): Promise<SOP[]> => db.get('sops', SEED_SOPS);

// --- HR ---
export const getJobRoles = async (): Promise<JobRole[]> => db.get('jobs', SEED_JOBS);
export const getCandidates = async (): Promise<Candidate[]> => db.get('candidates', [
    { id: '1', name: 'Alice Smith', roleId: '1', stage: 'INTERVIEW', email: 'alice@example.com' },
    { id: '2', name: 'Bob Jones', roleId: '1', stage: 'SCREENING', email: 'bob@example.com' },
]);

// --- SUPPORT ---
export const getTickets = async (): Promise<Ticket[]> => db.get('tickets', SEED_TICKETS);

// --- DATA ---
export const getDataSchemas = async (): Promise<DataSchema[]> => db.get('schemas', [
    { table: 'users', description: 'Core user identity data', rowCount: 15420, lastSync: '5 mins ago', status: 'HEALTHY' },
    { table: 'events', description: 'Raw clickstream events', rowCount: 1250000, lastSync: '1 min ago', status: 'SYNCING' },
]);

// --- LAB ---
export const getExperiments = async (): Promise<Experiment[]> => db.get('experiments', [
    { id: '1', name: 'New Pricing Tier', hypothesis: 'Adding a Pro tier increases ARPU by 10%', status: 'RUNNING', startDate: 'Oct 1' },
]);

// --- SUPPLY ---
export const getInventory = async (): Promise<InventoryItem[]> => db.get('inventory', [
    { id: '1', sku: 'HW-DEV-001', name: 'Developer Laptop (MacBook Pro)', stockLevel: 5, reorderPoint: 3, status: 'OK' },
]);

// --- SECURITY ---
export const getComplianceItems = async (): Promise<ComplianceItem[]> => db.get('compliance', [
    { id: '1', control: 'Data Encryption at Rest', framework: 'SOC2', status: 'PASS', lastAudit: 'Oct 20' },
]);

// --- COMMUNITY ---
export const getThreads = async (): Promise<CommunityThread[]> => db.get('threads', [
    { id: '1', title: 'Best practices for API rate limiting?', author: 'dev_guru', replies: 14, tags: ['api', 'dev'], lastActive: '10 mins ago' },
]);