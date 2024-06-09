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

  const ethicalGuidelines = additionalGuidelines
    ? QID25.slice(0, QID25.length - 1)
    : undefined; // If QID25_6_TEXT exists, extract QID25
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
      overallPolicyText: `This course imposes no restrictions on the use of generative AI, recognizing each student's unique learning methods. This flexibility empowers you to tailor your educational journey to your needs. However, while exploring these technological options, adherence to the department or school's academic integrity policies is essential. This ensures that while maximizing your learning potential, you also uphold our community's high standards of academic ethics.`,
      additionalPolicyText:
        "This policy document aims to provide clarity and transparency for the use of generative AI in our course. However, it's paramount to remember that students are also expected to adhere to all other policies specified in the course syllabus and those established by the school administration.",
    };
  }
  if (generativeAiPolicyMapper[QID15] === 'Allowed under conditions') {
    return {
      ...base,
      campusWidePolicy: QID12_1,
      departmentWidePolicy: QID12_2,
      academicIntegrityPolicy: QID12_3,
      otherPolicies: QID12_4,
      overallPolicyText: `We recognize the potential benefits of incorporating generative AI in the learning process. As such, we embrace the use of generative AI tools by our students. In this policy, we employ a "reasonable/not reasonable" system rather than a strict "allowed/not allowed" one (inspired by CS50 at Harvard). This approach fosters proactive thinking among students by encouraging them to understand context, evaluate implications, and make thoughtful decisions. `,
      additionalPolicyText:
        "This policy document is designed to clarify and transparently outline the use of generative AI in our course. It is crucial for students to also comply with all additional university-wide and school-wide policies listed below.",
    };
  }
  if (generativeAiPolicyMapper[QID15] === 'Strictly prohibited') {
    return {
      ...base,
      campusWidePolicy: QID12_1,
      academicIntegrityPolicy: QID12_3,
      overallPolicyText: `The use of generative AI is strictly prohibited in this course to optimize students' learning outcomes. This policy is instituted to inspire comprehensive engagement with the course content and foster a deep understanding of the subject matter. It provides an avenue for students to articulate their ideas, form personal connections with the material, and bolster their academic development.`,
      additionalPolicyText:
        "This policy document aims to provide clarity and transparency for the use of generative AI in our course. However, it's paramount to remember that students are also expected to adhere to all other policies specified in the course syllabus and those established by the school administration. The following represents a non-exhaustive list of institution-wide policies which all students must observe, some of which may touch on the use of generative AI. These policies are subject to modification at any point in time. It's incumbent upon the students to keep themselves updated and well-informed about these policies. ",
    };
  }
  throw new Error('Invalid policy');
};
