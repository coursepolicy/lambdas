import {
  generativeAiPolicyMapper,
  hgseUseCaseReasonabilityMapper, HgseUseCases,
  MappedSurveyResponse,
  SurveyResponse,
  useCasesMapper,
  Values
} from "../../../shared";
import {toTitleCase} from "../utils/helpers";

const formatUseCases = ({
  QID16_DO,
  QID19_TEXT,
  QID20_TEXT,
  values,
}: {
  QID16_DO?: string[];
  QID19_TEXT?: string;
  QID20_TEXT?: string;
  values: Values;
}): HgseUseCases | undefined => {
  let useCases;

  if (QID16_DO) {
    useCases = QID16_DO.reduce(
      (acc: HgseUseCases, item: string) => {
        let [label, text] = item.split(':');
        label = toTitleCase(label);
        text = text.trim();

        const key = useCasesMapper[label];
        const statusNum = values[key];
        const status = hgseUseCaseReasonabilityMapper[Number(statusNum)];

        const useCaseEntry = {
          label,
          text,
        };

        if (status === 'Not Applicable') {
          return acc;
        }

        if (status === 'Acceptable') {
          acc.acceptable.push(useCaseEntry);
          return acc;
        }

        if (status === 'Not Acceptable') {
          acc.unacceptable.push(useCaseEntry);
          return acc;
        }
        return acc;
      },
      {
        acceptable: [],
        unacceptable: [],
      }
    );

    if (QID19_TEXT) {
      useCases.acceptable.push({
        label: 'Additional examples',
        text: QID19_TEXT,
      });
    }

    if (QID20_TEXT) {
      useCases.unacceptable.push({
        label: 'Additional examples',
        text: QID20_TEXT,
      });
    }
  }

  return useCases;
};

export const hgseSurveyResponseMapper = ({
 values,
 labels,
}: SurveyResponse): MappedSurveyResponse<HgseUseCases> => {
  const {
    endDate,
    QID15,
    QID25_6_TEXT: additionalGuidelines,
    QID19_TEXT,
    QID20_TEXT,
    QID17_TEXT,
    QID26_3_TEXT,
    QID30_TEXT,
    QID4_3,
    QID13_TEXT,
    QID4_4,
    QID4_1,
    QID4_2,
    QID12_1,
    QID12_2,
    QID12_3,
    QID12_4,
  } = values;
  const { QID16_DO, QID26_DO, QID25 } = labels;

  const ethicalGuidelines = QID25.slice(0, QID25.length - 1);
  const generativeAiToolDeclarations = QID26_DO
    ? QID26_DO.slice(0, QID26_DO.length - 1)
    : undefined;
  const useCases = formatUseCases({
    QID19_TEXT,
    QID20_TEXT,
    QID16_DO,
    values,
  });

  const base = {
    id: QID13_TEXT,
    courseNumber: QID4_3,
    courseTitle: QID4_4,
    instructor: QID4_1,
    email: QID4_2,
    overallPolicy: generativeAiPolicyMapper[QID15],
    additionalGuidelines,
    ethicalGuidelines,
    useCases,
    specificPoliciesForAssignments: QID17_TEXT,
    generativeAiToolDeclarations,
    additionalGenerativeAiToolsDeclarations: QID26_3_TEXT,
    additionalNotes: QID30_TEXT,
    createdAt: endDate,
  };

  // save button -> ulid or link sent to email

  if (generativeAiPolicyMapper[QID15] === 'No restrictions') {
    return {
      ...base,
      overallPolicyText: 'This course encourages students to explore the use of generative artificial intelligence (GAI) tools such as ChatGPT for all assignments and assessments. Any such use must be appropriately acknowledged and cited. It is each student’s responsibility to assess the validity and applicability of any GAI output that is submitted; you bear the final responsibility. Violations of this policy will be considered academic misconduct.',
      additionalPolicyText:
        'This policy document aims to provide clarity and transparency for the use of generative AI in our course. However, it\'s paramount to remember that students are also expected to adhere to all other policies specified in the course syllabus and those established by the school administration.',
    };
  }
  if (generativeAiPolicyMapper[QID15] === 'Allowed under conditions') {
    return {
      ...base,
      campusWidePolicy: QID12_1,
      departmentWidePolicy: QID12_2,
      academicIntegrityPolicy: QID12_3,
      otherPolicies: QID12_4,
      overallPolicyText: 'In this course, the use of generative artificial intelligence (AI) tools such as ChatGPT is allowed under specific conditions. Students must follow the provided list of acceptable and not acceptable use cases. Any use of AI tools must be acknowledged and cited. Failure to comply with these conditions will be considered academic misconduct.',
      additionalPolicyText:
        'This policy document is designed to clarify and transparently outline the use of generative AI in our course. It is crucial for students to also comply with all additional university-wide and school-wide policies listed below.',
    };
  }
  if (generativeAiPolicyMapper[QID15] === 'Strictly prohibited') {
    return {
      ...base,
      campusWidePolicy: QID12_1,
      academicIntegrityPolicy: QID12_3,
      overallPolicyText: 'We expect that all work students submit for this course will be their own. In instances when collaborative work is assigned, we expect for the assignment to list all team members who participated. We specifically forbid the use of ChatGPT or any other generative artificial intelligence (AI) tools at all stages of the work process, including preliminary ones. Violations of this policy will be considered academic misconduct. We draw your attention to the fact that different classes at Harvard could implement different AI policies, and it is the student’s responsibility to conform to expectations for each course.',
      additionalPolicyText:
        'This policy document aims to provide clarity and transparency for the use of generative AI in our course. However, it\'s paramount to remember that students are also expected to adhere to all other policies specified in the course syllabus and those established by the school administration. The following represents a non-exhaustive list of institution-wide policies which all students must observe, some of which may touch on the use of generative AI. These policies are subject to modification at any point in time. It\'s incumbent upon the students to keep themselves updated and well-informed about these policies.',
    };
  }
  throw new Error('Invalid policy');
};
