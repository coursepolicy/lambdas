import { format } from 'date-fns';
import {
  CourseAiPolicy,
  CourseAiPolicyResponse,
  GenerativeAiPolicy,
} from '../../shared';

export const policyFormatter = (
  courseAiPolicy: CourseAiPolicy,
  {
    courseTitle,
    courseNumber,
    generatedAt,
    email,
    instructor,
  }: GenerativeAiPolicy
): CourseAiPolicyResponse => {
  return {
    header: `
      <div>
        <h1>
          ${courseNumber}: ${courseTitle}
        </h1>
        <p>
          Course Instructor: ${instructor}[${email}]
          <span>Generated on ${format(new Date(generatedAt), 'PPP')}</span>
        </p>
      </div>
    `,
    content: courseAiPolicy,
  };
};
