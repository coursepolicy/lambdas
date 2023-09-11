import { isEmpty } from 'lodash';
import { db } from '../../../../data/knex';
import { AiPolicy } from '../../../shared';
import { createNewPolicy } from './create-new-policy';

const SAMPLE_POLICY = 'Sample_Policy_for_all';
const PolicyStatusEnum = {
  UPDATED: 'UPDATED',
  INSERTED: 'INSERTED',
  NONE: 'NONE',
} as const;

export const updatePolicy = async (
  id: string,
  policy: AiPolicy,
  generatedId?: string
): Promise<{
  id: string;
  policyStatus: (typeof PolicyStatusEnum)[keyof typeof PolicyStatusEnum];
}> => {
  if (generatedId && id === SAMPLE_POLICY) {
    const foundPolicyBygeneratedId = await db('survey_responses')
      .where({ id: generatedId })
      .first();

    if (!isEmpty(foundPolicyBygeneratedId)) {
      console.info('Policy already exists... generatedId was not inserted', {
        id: generatedId,
        policyStatus: 'NONE',
      });
      return { id: generatedId, policyStatus: 'NONE' };
    }

    console.info('Policy does not exist... generatedId was inserted', {
      id: generatedId,
      policyStatus: 'INSERTED',
    });
    const [createdId] = await createNewPolicy(generatedId, policy);
    return { id: createdId, policyStatus: 'INSERTED' };
  }

  const foundPolicyByid = await db('survey_responses').where({ id }).first();

  if (isEmpty(foundPolicyByid)) {
    console.info('Policy does not exist... nothing was updated', {
      id,
      policyStatus: 'NONE',
    });
    return { id, policyStatus: 'NONE' };
  }

  await db('survey_responses')
    .where({ id })
    .update({
      results: JSON.stringify(policy),
      updated_at: db.fn.now(),
    })
    .returning('id');
  console.info('Policy was updated', { id, policyStatus: 'UPDATED' });
  return { id, policyStatus: 'UPDATED' };
};
