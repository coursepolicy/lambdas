import { v4 as uuidv4 } from 'uuid';
import { CourseAiPolicy, GenerativeAiPolicy, SubSection } from '../../shared';

export const createPolicyOutline = (
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
      content: [
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
      subSectionTitle: 'Declaration',
      content: `
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
    subSectionTitle: 'Additional Notes',
    content: `
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
