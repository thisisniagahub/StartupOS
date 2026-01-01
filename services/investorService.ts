import { Investor, FundingRound } from '../types';
import { db } from './localStorageDb';

const SEED_INVESTORS: Investor[] = [
  { id: '1', name: 'Sarah Ventures', firm: 'Redwood Capital', status: 'DUE_DILIGENCE', checkSize: '$500k', lastContact: '2 days ago', notes: 'Asking for cohort analysis.' },
  { id: '2', name: 'Mike Angel', firm: 'Angel Syndicate', status: 'COMMITTED', checkSize: '$50k', lastContact: '1 week ago', notes: 'Signed SAFE.' },
  { id: '3', name: 'Global Tech Fund', firm: 'GTF', status: 'MEETING', checkSize: '$1M', lastContact: 'Yesterday', notes: 'Intro via LinkedIn.' },
  { id: '4', name: 'Early Bird', firm: 'Avian VC', status: 'PROSPECT', checkSize: 'Unknown', lastContact: 'Never', notes: 'Top target for Series A.' },
];

const SEED_ROUND: FundingRound = {
  id: 'r1',
  name: 'Seed Round',
  targetAmount: 2000000,
  raisedAmount: 450000,
  preMoneyValuation: 8000000,
  status: 'OPEN'
};

export const getInvestors = async (): Promise<Investor[]> => {
  return db.get<Investor[]>('investors', SEED_INVESTORS);
};

export const addInvestor = async (investor: Investor): Promise<Investor[]> => {
    return db.addItem('investors', investor, SEED_INVESTORS);
};

export const getCurrentRound = async (): Promise<FundingRound> => {
  return db.get<FundingRound>('round', SEED_ROUND);
};

export const updateInvestorStatus = async (id: string, status: string): Promise<void> => {
    db.updateItem('investors', id, { status: status as any }, SEED_INVESTORS);
};