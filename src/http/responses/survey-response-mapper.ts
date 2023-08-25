import { v4 as uuidv4 } from 'uuid';
import { format } from 'date-fns';
import { toTitleCase } from './helpers';
import {
  CourseAiPolicy,
  CourseAiPolicyResponse,
  GenerativeAiPolicy,
  Labels,
  ResponseObject,
  SubSection,
  UseCases,
  generativeAiPolicyMapper,
} from '../../shared/types';

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
    useCases = QID16_DO.reduce(
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

export const surveyResponseMapper = ({
  values,
  labels,
}: ResponseObject): GenerativeAiPolicy => {
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

  // save button -> uuid or link sent to email

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

export const createCourseAiPolicyOutline = (
  response: GenerativeAiPolicy
): CourseAiPolicy => {
  const courseDescriptionSubSections: SubSection[] = [];
  const generativeAiPolicySubSections: SubSection[] = [];
  const additionalPoliciesSubSections: SubSection[] = [];

  // courseDescriptionSubSections
  courseDescriptionSubSections.push({
    id: uuidv4(),
    subSectionTitle: 'Introduction',
    content: `
    <section class="course-description-introduction-section">
      <h3>Course Description</h3>
      <p>${response.courseDescription}</p>
    </section>
    `,
  });
  // end of courseDescriptionSubSections

  // generativeAiPolicySubSections

  generativeAiPolicySubSections.push({
    id: uuidv4(),
    subSectionTitle: 'Introduction',
    miscData: { overallPolicy: response.overallPolicy },
    content: `
      <section class="policy-introduction-section">
        <h2>1. ${response.courseNumber} Generative AI Policy</h2>
        <p>${response.overallPolicyText}</p>
      </section>
    `,
  });

  if (response.useCases) {
    generativeAiPolicySubSections.push({
      id: uuidv4(),
      subSectionTitle: 'Use Cases',
      content: `
        <section class="policy-use-cases-section">
            <div>
              <h3>Reasonable Use Cases</h3>
              ${
                response.useCases.reasonable.length
                  ? `
              <ul>
                ${response.useCases.reasonable.reduce(
                  (acc, entry) =>
                    (acc += `
                  <li>
                    <strong>${entry.label}</strong>
                    <p>${entry.text}</p>
                  </li>
                `),
                  ''
                )}
              </ul>
              `
                  : '<p>None</p>'
              }
            </div>
            <div>
              <h3>Unreasonable Use Cases</h3>
              ${
                response.useCases.unreasonable.length
                  ? `
              <ul>
                ${response.useCases.unreasonable.reduce(
                  (acc, entry) =>
                    (acc += `
                <li>
                        <strong>${entry.label}</strong>
                        <p>${entry.text}</p>
                      </li>
                `),
                  ''
                )}
              </ul>
              `
                  : '<p>None</p>'
              }
            </div>
          </section>
      `,
    });
  }

  if (response.specificPoliciesForAssignments) {
    generativeAiPolicySubSections.push({
      id: uuidv4(),
      subSectionTitle: 'Assignment Specific AI Policies',
      content: `
        <section class="policy-assignment-specific-section">
          <h3>Assignment/Project Specific AI Policies</h3>
          <p>${response.specificPoliciesForAssignments}</p>
        </section>
      `,
    });
  }

  if (response.ethicalGuidelines) {
    generativeAiPolicySubSections.push({
      id: uuidv4(),
      subSectionTitle: 'Ethical Guidelines',
      content: `
      <section class="policy-ehtical-guidelines-section">
        <h3>Ethical guidelines for using generative AI for this course:</h3>
        ${response.ethicalGuidelines.reduce(
          (acc, text) => (acc += `<p>${text}</p>`),
          ''
        )}
        ${
          response.additionalGuidelines
            ? `<p>${response.additionalGuidelines}</p>`
            : ''
        }
      </section>
      `,
    });
  }

  if (response.generativeAiToolDeclarations) {
    generativeAiPolicySubSections.push({
      id: uuidv4(),
      subSectionTitle: 'Declaration',
      content: `
        <section class="policy-declaration-section">
          <h3>How to declare the use of generative tools:</h3>
          ${response.generativeAiToolDeclarations.reduce(
            (acc, text) => (acc += `<p>${text}</p>`),
            ''
          )}
          ${
            response.additionalGenerativeAiToolsDeclarations
              ? `<p>${response.additionalGenerativeAiToolsDeclarations}</p>`
              : ''
          }
        </section>
      `,
    });
  }

  generativeAiPolicySubSections.push({
    id: uuidv4(),
    subSectionTitle: 'Additional Notes',
    content: `
     <section class="policy-notes-section">
        <h3>Additional Notes</h3>
        ${response.additionalNotes ? `<p>${response.additionalNotes}</p>` : ''}
      </section>
    `,
  });

  // end of generativeAiPolicySubSections

  // additionalPoliciesSubSections
  additionalPoliciesSubSections.push({
    id: uuidv4(),
    subSectionTitle: 'Introduction',
    content: `
      <section class="additional-policies-introduction-section">
        <h2>2. Additional Policies</h2>
        <p>${response.additionalPolicyText}</p>
      </section>
    `,
  });

  if (response.overallPolicy !== 'No restrictions') {
    additionalPoliciesSubSections.push({
      id: uuidv4(),
      subSectionTitle: 'Policy Links',
      content: `
        <section class="additional-policies-policy-links-section">
            <ul>
              ${
                response.campusWidePolicy
                  ? `
                <li>
                  Campus-wide generative AI policy:
                  <span>
                    ${
                      response.campusWidePolicy.length
                        ? response.campusWidePolicy
                        : 'N/A'
                    }
                  </span>
                </li>
              `
                  : ''
              }
              ${
                response.departmentWidePolicy
                  ? `
                <li>
                  Department-wide generative AI policy:
                  <span>
                    ${
                      response.departmentWidePolicy.length
                        ? response.departmentWidePolicy
                        : 'N/A'
                    }
                  </span>
                </li>
              `
                  : ''
              }
              ${
                response.academicIntegrityPolicy
                  ? `
                <li>
                  Academic Integrity policy:
                  <span>
                    ${
                      response.academicIntegrityPolicy.length
                        ? response.academicIntegrityPolicy
                        : 'N/A'
                    }
                  </span>
                </li>
              `
                  : ''
              }
              ${
                response.otherPolicies
                  ? `
                <li>
                  Other policies:
                  <span>
                    ${
                      response.otherPolicies.length
                        ? response.otherPolicies
                        : 'N/A'
                    }
                  </span>
                </li>
              `
                  : ''
              }
            </ul>
          </section>
      
      `,
    });
  }
  // end of additionalPoliciesSubSections

  return [
    {
      // section
      id: uuidv4(),
      sectionTitle: 'Course Description',
      subSections: courseDescriptionSubSections,
    },
    {
      id: uuidv4(),
      sectionTitle: 'Generative AI Policy',
      subSections: generativeAiPolicySubSections,
    },
    {
      id: uuidv4(),
      sectionTitle: 'Additional Policies',
      subSections: additionalPoliciesSubSections,
    },
  ];
};

export const formatResponse = (
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
          Course Instructor: ${instructor}[
          ${email}]
          <span>Generated on ${format(new Date(generatedAt), 'PPP')}</span>
        </p>
      </div>
    `,
    content: courseAiPolicy,
  };
};
