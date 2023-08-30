import { v4 as uuidv4 } from 'uuid';
import {
  PolicySections,
  AiPolicy,
  MappedSurveyResponse,
  PolicySection,
} from '../../../shared';

const policyFormatter = (
  courseAiPolicy: PolicySections,
  { courseTitle, courseNumber, email, instructor }: MappedSurveyResponse
): AiPolicy => {
  return {
    heading: `
      <div>
        <h1>
          AI Policy for ${courseNumber}: ${courseTitle}
        </h1>
        <p>
          Course Instructor: ${instructor} <a target="_blank" rel="noopener noreferrer nofollow" class="editor-links" href="mailto:${email}">${email}</a>
        </p>
      </div>
    `,
    sections: courseAiPolicy,
  };
};

export const createCoursePolicy = (
  response: MappedSurveyResponse
): AiPolicy => {
  const courseDescriptionSubSections: PolicySection[] = [];
  const generativeAiPolicySubSections: PolicySection[] = [];
  const additionalPoliciesSubSections: PolicySection[] = [];

  // courseDescriptionSubSections
  courseDescriptionSubSections.push({
    id: uuidv4(),
    title: 'Introduction',
    htmlContent: `
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
    title: 'Introduction',
    miscData: { overallPolicy: response.overallPolicy },
    htmlContent: `
      <section class="policy-introduction-section">
        <h2>1. ${response.courseNumber} Generative AI Policy</h2>
        <p>${response.overallPolicyText}</p>
      </section>
    `,
  });

  if (response.useCases) {
    generativeAiPolicySubSections.push({
      id: uuidv4(),
      title: 'Use Cases',
      htmlContent: [
        `<div>
          <h3>Reasonable Use Cases ✅</h3>
          ${
            response.useCases.reasonable.length
              ? `
            ${response.useCases.reasonable.reduce(
              (acc, entry) =>
                (acc += `
                <strong>${entry.label}</strong>
                <ul>
                  <li>
                    
                    <p>${entry.text}</p>
                  </li>
                </ul>
              `),
              ''
            )}
          `
              : '<p>None</p>'
          }
        </div>`,
        `<div>
          <h3>Unreasonable Use Cases ❌</h3>
          ${
            response.useCases.unreasonable.length
              ? `
            ${response.useCases.unreasonable.reduce(
              (acc, entry) =>
                (acc += `
                <strong>${entry.label}</strong>
                <ul>
                  <li>
                    <p>${entry.text}</p>
                  </li>
                </ul>
              `),
              ''
            )}
          `
              : '<p>None</p>'
          }
        </div>`,
      ],
    });
  }

  if (response.specificPoliciesForAssignments) {
    generativeAiPolicySubSections.push({
      id: uuidv4(),
      title: 'Assignment Specific AI Policies',
      htmlContent: `
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
      title: 'Ethical Guidelines',
      htmlContent: `
      <section class="policy-ehtical-guidelines-section">
        <h3>Ethical guidelines for using generative AI for this course:</h3>
        <ul>
          ${response.ethicalGuidelines.reduce(
            (acc, text) => (acc += `<li>${text}</li>`),
            ''
          )}
          ${
            response.additionalGuidelines
              ? `<li>${response.additionalGuidelines}</li>`
              : ''
          }
        </ul>
      </section>
      `,
    });
  }

  if (response.generativeAiToolDeclarations) {
    generativeAiPolicySubSections.push({
      id: uuidv4(),
      title: 'Declaration',
      htmlContent: `
        <section class="policy-declaration-section">
          <h3>How to declare the use of generative tools:</h3>
          <ul>
            ${response.generativeAiToolDeclarations.reduce(
              (acc, text) => (acc += `<li>${text}</li>`),
              ''
            )}
            ${
              response.additionalGenerativeAiToolsDeclarations
                ? `<li>${response.additionalGenerativeAiToolsDeclarations}</li>`
                : ''
            }
          </ul>
        </section>
      `,
    });
  }

  generativeAiPolicySubSections.push({
    id: uuidv4(),
    title: 'Additional Notes',
    htmlContent: `
     <section class="policy-notes-section">
        <h3>Additional Notes</h3>
        ${
          response.additionalNotes
            ? `
        <ul>
          <li>${response.additionalNotes}</li>
        </ul>
        `
            : ''
        }
      </section>
    `,
  });

  // end of generativeAiPolicySubSections

  // additionalPoliciesSubSections
  additionalPoliciesSubSections.push({
    id: uuidv4(),
    title: 'Introduction',
    htmlContent: `
      <section class="additional-policies-introduction-section">
        <h2>2. Additional Policies</h2>
        <p>${response.additionalPolicyText}</p>
      </section>
    `,
  });

  if (response.overallPolicy !== 'No restrictions') {
    additionalPoliciesSubSections.push({
      id: uuidv4(),
      title: 'Policy Links',
      htmlContent: `
        <section class="additional-policies-policy-links-section">
            <ul>
              ${
                response.campusWidePolicy
                  ? `
                
                <li>
                ${
                  response.campusWidePolicy.length
                    ? `<p><a target="_blank" rel="noopener noreferrer nofollow" class="editor-links" href="${response.campusWidePolicy}">Campus-wide generative AI policy</a></p>`
                    : 'Campus-wide generative AI policy: N/A'
                }
                </li>
              `
                  : ''
              }
              ${
                response.departmentWidePolicy
                  ? `
                <li>
                ${
                  response.departmentWidePolicy.length
                    ? `<p><a target="_blank" rel="noopener noreferrer nofollow" class="editor-links" href="${response.departmentWidePolicy}">Department-wide generative AI policy</a></p>`
                    : 'Department-wide generative AI policy: N/A'
                }
                </li>
              `
                  : ''
              }
              ${
                response.academicIntegrityPolicy
                  ? `
                  
                  <li>
                  ${
                    response.academicIntegrityPolicy.length
                      ? `<p><a target="_blank" rel="noopener noreferrer nofollow" class="editor-links" href="${response.academicIntegrityPolicy}">Academic Integrity policy</a></p>`
                      : 'Academic Integrity policy: N/A'
                  }
                  </li>
              `
                  : ''
              }
              ${
                response.otherPolicies
                  ? `
                  <li>
                  ${
                    response.otherPolicies.length
                      ? `<p><a target="_blank" rel="noopener noreferrer nofollow" class="editor-links" href="${response.otherPolicies}">Other policies</a></p>`
                      : 'Other policies: N/A'
                  }
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

  return policyFormatter(
    [
      {
        // section
        id: uuidv4(),
        title: 'Course Description',
        children: courseDescriptionSubSections,
      },
      {
        id: uuidv4(),
        title: 'Generative AI Policy',
        children: generativeAiPolicySubSections,
      },
      {
        id: uuidv4(),
        title: 'Additional Policies',
        children: additionalPoliciesSubSections,
      },
    ],
    response
  );
};
