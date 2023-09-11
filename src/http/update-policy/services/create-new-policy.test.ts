import { db } from '../../../../data/knex';
import { AiPolicy } from '../../../shared';
import { createNewPolicy } from './'; // Update the path appropriately
import { test, expect, mock } from 'bun:test';

const mockId = '1234';
const mockPolicy = {
  id: 'Generated UUIDv4',
  heading: 'Course information like title, number, instructor, etc.',
  sections: [
    {
      id: 'Generated UUIDv4',
      title: 'Section heading',
    },
  ],
} as AiPolicy;

const mockDb = mock(async () => await createNewPolicy(mockId, mockPolicy));

test('should insert a new policy and return its ID', async () => {
  console.log({ mockDb: await mockDb() });
});
