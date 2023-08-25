import middy from '@middy/core';
import { APIGatewayEvent } from 'aws-lambda';
import { SurveyResponsesRequestBody } from '../http/responses/schema';

// omit body

export type ExtendedApiGateWayEvent = Omit<
  APIGatewayEvent,
  'queryStringParameters'
> & {
  queryStringParameters: SurveyResponsesRequestBody;
};

export interface MiddlewareRequest
  extends middy.Request<ExtendedApiGateWayEvent> {}

export interface ResponseObject {
  labels: Labels;
  values: Values;
  responseId: string;
  displayedFields: string[];
  displayedValues: DisplayedValues;
}

export interface Labels {
  [index: string]: any;
  QID8: string;
  QID15: string;
  QID22: string;
  QID24: string;
  QID25: string[];
  QID26: string;
  QID28: string;
  status: string;
  QID16_1?: string;
  QID16_2?: string;
  QID16_3?: string;
  QID16_4?: string;
  QID16_5?: string;
  QID16_6?: string;
  QID16_7?: string;
  QID16_8?: string;
  QID16_9?: string;
  QID4_DO: string[];
  QID8_DO: string[];
  QID12_DO: string[];
  QID15_DO: string[];
  QID16_10?: string;
  QID16_DO?: string[];
  QID22_DO: string[];
  QID24_DO: string[];
  QID25_DO: string[];
  QID26_DO: string[];
  QID28_DO: string[];
  finished: string;
}

interface Values {
  [index: string]: any;
  QID8: number;
  QID15: number;
  QID22: number;
  QID24: number;
  QID25: string[];
  QID26: number;
  QID28: number;
  QID4_1: string;
  QID4_2: string;
  QID4_3: string;
  QID4_4: string;
  status: number;
  QID12_1: string;
  QID12_2: string;
  QID12_3: string;
  QID12_4: string;
  QID16_1?: number;
  QID16_2?: number;
  QID16_3?: number;
  QID16_4?: number;
  QID16_5?: number;
  QID16_6?: number;
  QID16_7?: number;
  QID16_8?: number;
  QID16_9?: number;
  QID4_DO: string[];
  QID8_DO: string[];
  endDate: string;
  QID12_DO: string[];
  QID15_DO: string[];
  QID16_10?: number;
  QID16_DO?: string[];
  QID22_DO: string[];
  QID24_DO: string[];
  QID25_DO: string[];
  QID26_DO: string[];
  QID28_DO: string[];
  duration: number;
  finished: number;
  progress: number;
  QID3_TEXT: string;
  ipAddress: string;
  startDate: string;
  QID13_TEXT: string;
  QID17_TEXT: string;
  QID19_TEXT?: string;
  QID20_TEXT?: string;
  QID25_6_TEXT?: string;
  QID30_TEXT: string;
  recordedDate: string;
  userLanguage: string;
  Q_RecaptchaScore: number;
  locationLatitude: string;
  locationLongitude: string;
  distributionChannel: string;
}

interface DisplayedValues {
  QID8: number[];
  QID15: number[];
  QID22: number[];
  QID24: number[];
  QID25: string[];
  QID26: number[];
  QID28: number[];
  QID16_1?: number[];
  QID16_2?: number[];
  QID16_3?: number[];
  QID16_4?: number[];
  QID16_5?: number[];
  QID16_6?: number[];
  QID16_7?: number[];
  QID16_8?: number[];
  QID16_9?: number[];
  QID16_10?: number[];
}

export interface GenerativeAiPolicy {
  courseNumber: string; // q4_3
  courseTitle: string; // q4_4
  instructor: string; // q4_1
  email: string; // q4_2
  courseDescription: string; // q3 text
  overallPolicy: string; // values.QID15,
  overallPolicyText: string; // none
  additionalPolicyText: string; // q12
  useCases?: UseCases; // q16
  ethicalGuidelines?: string[]; // q25
  additionalGuidelines?: string; // q26
  specificPoliciesForAssignments?: string; // q17 // specific generative ai policies
  additionalGenerativeAiToolsDeclarations?: string[]; // q26
  generativeAiToolDeclarations?: string[]; // q26
  campusWidePolicy?: string;
  departmentWidePolicy?: string;
  academicIntegrityPolicy?: string;
  otherPolicies?: string;
  additionalNotes: string;
  generatedAt: string;
}

export interface UseCases {
  reasonable: UseCaseEntry[];
  unreasonable: UseCaseEntry[];
}

interface UseCaseEntry {
  label: string;
  text: string;
}

interface PolicyMapper {
  [index: number]: string;
}

export const generativeAiPolicyMapper: PolicyMapper = {
  1: 'No restrictions',
  2: 'Allowed under conditions',
  3: 'Strictly prohibited',
} as const;

export interface Section {
  [key: string]: any;
  id: string;
  sectionTitle: string;
  subSections: SubSection[];
}

export interface SubSection {
  id: string;
  subSectionTitle: string;
  content: string;
  miscData?: Record<string, any>;
}

export type CourseAiPolicy = Section[];

export type CourseAiPolicyResponse = {
  header: string;
  content: CourseAiPolicy;
};
