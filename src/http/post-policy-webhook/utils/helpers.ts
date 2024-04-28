export const toTitleCase = (str: string) => {
  return str
    .toLowerCase()
    .trim()
    .split(/\s+/)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

export const surveyIdMapper = (institution: string) => {
  const { SURVEY_ID, HGSE_SURVEY_ID } = process.env;
  return institution === 'harvard' ? HGSE_SURVEY_ID : SURVEY_ID;
};
