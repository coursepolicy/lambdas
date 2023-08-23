import { toTitleCase } from './helpers';
import {
  GenerativeAiPolicy,
  Labels,
  ResponseObject,
  UseCases,
  generativeAiPolicyMapper,
} from './types';

const formatUseCases = ({
  QID16_DO,
  QID19_TEXT,
  QID20_TEXT,
  labels,
}: {
  QID16_DO?: string[];
  QID19_TEXT?: string;
  labels: Labels;
  QID20_TEXT?: string;
}) => {
  let useCases;

  if (QID16_DO) {
    const useCases = QID16_DO.reduce(
      (acc: UseCases, item: string, index: number) => {
        let [label, text] = item.split(':');
        label = toTitleCase(label);
        text = text.trim();

        const key = `QID16_${index === 10 ? index + 2 : index + 1}`;
        const status = labels[key];

        const useCaseEntry = {
          label,
          text,
        };

        if (status === 'Reasonable') {
          acc.reasonable.push(useCaseEntry);
          return acc;
        }
        if (status === 'Not Reasonable') {
          acc.unreasonable.push(useCaseEntry);
          return acc;
        }
        return acc;
      },
      {
        reasonable: [],
        unreasonable: [],
      }
    );

    if (QID19_TEXT) {
      useCases.reasonable.push({
        label: 'Additional examples',
        text: QID19_TEXT,
      });
    }

    if (QID20_TEXT) {
      useCases.unreasonable.push({
        label: 'Additional examples',
        text: QID20_TEXT,
      });
    }
  }

  return useCases;
};

export const surveyResponseMapper = (
  surveyResponse: ResponseObject
): GenerativeAiPolicy => {
  const { values, labels } = surveyResponse;
  const {
    QID15,
    QID25_6_TEXT: additionalGuidelines,
    QID19_TEXT,
    QID20_TEXT,
    QID17_TEXT,
    QID26_3_TEXT,
    QID30_TEXT,
    endDate,
  } = values;
  const { QID16_DO, QID26_DO, QID25 } = labels;

  const ethicalGuidelines = additionalGuidelines
    ? QID25.slice(0, QID25.length - 1)
    : undefined;
  const generativeAiToolDeclarations = QID26_DO
    ? QID26_DO.slice(0, QID26_DO.length - 1)
    : undefined;
  const useCases = formatUseCases({ QID19_TEXT, QID20_TEXT, QID16_DO, labels });

  const base = {
    courseNumber: values.QID4_3,
    courseTitle: values.QID4_4,
    instructor: values.QID4_1,
    email: values.QID4_2,
    courseDescription: values.QID3_TEXT,
    overallPolicy: generativeAiPolicyMapper[QID15],
    additionalGuidelines,
    ethicalGuidelines,
    useCases,
    specificPoliciesForAssignments: QID17_TEXT,
    generativeAiToolDeclarations,
    additionalGenerativeAiToolsDeclarations: QID26_3_TEXT,
    additionalNotes: QID30_TEXT,
    generatedAt: endDate,
  };

  if (generativeAiPolicyMapper[QID15] === 'No restrictions') {
    return {
      ...base,
      overallPolicyText: `This course imposes no restrictions on the use of generative AI, recognizing each student's unique learning methods. This flexibility empowers you to tailor your educational journey to your needs. However, while exploring these technological options, adherence to the department or school's academic integrity policies is essential. This ensures that while maximizing your learning potential, you also uphold our community's high standards of academic ethics.`,
      additionalPolicyText:
        "This policy document aims to provide clarity and transparency for the use of generative AI in our course. However, it's paramount to remember that students are also expected to adhere to all other policies specified in the course syllabus and those established by the school administration.",
    };
  }
  if (generativeAiPolicyMapper[QID15] === 'Allowed under conditions') {
    return {
      ...base,
      campusWidePolicy: values.QID12_1,
      departmentWidePolicy: values.QID12_2,
      academicIntegrityPolicy: values.QID12_3,
      otherPolicies: values.QID12_4,
      overallPolicyText: `We recognize the potential benefits of incorporating generative AI in the learning process. As such, we embrace the use of generative AI tools by our students. In this policy, we employ a "reasonable/not reasonable" system rather than a strict "allowed/not allowed" one (inspired by CS50 at Harvard). This approach fosters proactive thinking among students by encouraging them to understand context, evaluate implications, and make thoughtful decisions. `,
      additionalPolicyText:
        "This policy document aims to provide clarity and transparency for the use of generative AI in our course. However, it's paramount to remember that students are also expected to adhere to all other policies specified in the course syllabus and those established by the school administration. The following represents a non-exhaustive list of institution-wide policies which all students must observe, some of which may touch on the use of generative AI. These policies are subject to modification at any point in time. It's incumbent upon the students to keep themselves updated and well-informed about these policies.",
    };
  }
  if (generativeAiPolicyMapper[QID15] === 'Strictly prohibited') {
    return {
      ...base,
      campusWidePolicy: values.QID12_1,
      academicIntegrityPolicy: values.QID12_3,
      overallPolicyText: `The use of generative AI is strictly prohibited in this course to optimize students' learning outcomes. This policy is instituted to inspire comprehensive engagement with the course content and foster a deep understanding of the subject matter. It provides an avenue for students to articulate their ideas, form personal connections with the material, and bolster their academic development.`,
      additionalPolicyText:
        "This policy document aims to provide clarity and transparency for the use of generative AI in our course. However, it's paramount to remember that students are also expected to adhere to all other policies specified in the course syllabus and those established by the school administration. The following represents a non-exhaustive list of institution-wide policies which all students must observe, some of which may touch on the use of generative AI. These policies are subject to modification at any point in time. It's incumbent upon the students to keep themselves updated and well-informed about these policies. ",
    };
  }
  throw new Error('Invalid policy');
};
