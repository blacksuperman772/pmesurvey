// Single source of truth for the survey. Shared by survey.html and admin.html.
// Cleaned version of the original PMEPQ (duplicates removed, scale unified to UD).
const SURVEY = {
  title: "Performance Management System & Employee Productivity Questionnaire (PMEPQ)",
  subtitle: "Oyo State Ministry of Education, State Secretariat, Agodi, Ibadan",
  intro:
    "I am conducting a research on \"Performance Management System and Employee Productivity in the Oyo State Ministry of Education.\" Your responses will be treated with strict confidentiality and used solely for academic purposes. Kindly answer all questions honestly. Participation is voluntary.",
  scale: [
    { value: 5, label: "Strongly Agree (SA)" },
    { value: 4, label: "Agree (A)" },
    { value: 3, label: "Undecided (UD)" },
    { value: 2, label: "Disagree (D)" },
    { value: 1, label: "Strongly Disagree (SD)" },
  ],
  biodata: [
    { id: "gender", label: "1. Gender", type: "radio", options: ["Male", "Female"] },
    {
      id: "age",
      label: "2. Age",
      type: "radio",
      options: ["20–29 years", "30–39 years", "40–49 years", "50 and above"],
    },
    {
      id: "education",
      label: "3. Educational Qualification",
      type: "radio",
      options: ["Bachelor's Degree", "Master's Degree", "Ph.D.", "Others"],
    },
    {
      id: "service",
      label: "4. Years of Service",
      type: "radio",
      options: ["Less than 5 years", "5–10 years", "11–15 years", "16–20 years", "Above 20 years"],
    },
    {
      id: "grade",
      label: "5. Grade Level",
      type: "radio",
      options: ["GL 01–06", "GL 07–13", "GL 14–17"],
    },
  ],
  clusters: [
    {
      name: "Cluster A – Performance Appraisal and Employee Productivity",
      questions: [
        { n: 1, text: "The performance appraisal system in the Ministry is conducted regularly." },
        { n: 2, text: "Performance appraisal in the Ministry is fair and objective." },
        { n: 3, text: "Performance appraisal outcomes are used for employee development." },
        { n: 4, text: "Performance appraisal motivates me to improve my work performance." },
      ],
    },
    {
      name: "Cluster B – Performance Feedback and Employee Motivation",
      questions: [
        { n: 5, text: "My supervisor provides regular feedback on my performance." },
        { n: 6, text: "Performance feedback helps me improve my job performance." },
        { n: 7, text: "Constructive feedback increases my motivation to work." },
        { n: 8, text: "Regular feedback contributes to better service delivery in the Ministry." },
      ],
    },
    {
      name: "Cluster C – Reward System and Employee Productivity",
      questions: [
        { n: 9, text: "Outstanding performance is recognized in the Ministry." },
        { n: 10, text: "Promotion is based on employees' performance." },
        { n: 11, text: "Employees who perform well receive adequate recognition." },
        { n: 12, text: "The reward system has improved employee productivity." },
      ],
    },
    {
      name: "Cluster D – Employee Productivity",
      questions: [
        { n: 13, text: "Employees in the Ministry perform their duties efficiently." },
        { n: 14, text: "Work is completed within the required time." },
        { n: 15, text: "Employees are committed to achieving organizational goals." },
        { n: 16, text: "The Ministry provides quality services to the public." },
        { n: 17, text: "The existing Performance Management System has improved overall employee productivity." },
      ],
    },
  ],
};
