// Define general questions
const questions = [
  {
    question: "What is your favorite hobby?",
    options: ["Reading", "Traveling", "Sports", "Music", "Cooking"]
  },
  {
    question: "How many hours do you spend on social media daily?",
    options: ["Less than 1 hour", "1-2 hours", "2-4 hours", "More than 4 hours"]
  },
  {
    question: "What type of movies do you prefer?",
    options: ["Action", "Drama", "Comedy", "Romance", "Horror"]
  },
  {
    question: "How often do you exercise?",
    options: ["Every day", "Few times a week", "Once a week", "Rarely", "Never"]
  },
  {
    question: "Which of these do you prefer to spend time with?",
    options: ["Family", "Friends", "Alone", "Pets"]
  },
  {
    question: "What is your preferred method of communication?",
    options: ["Phone", "Text", "Email", "Social Media"]
  }
];

// Function to generate survey questions dynamically
function generateSurveyQuestions() {
  const questionsContainer = document.getElementById('steps-container');
  const selectedQuestions = questions;

  selectedQuestions.forEach((q, idx) => {
    const step = document.createElement('section');
    step.classList.add('step');
    
    const questionHTML = `
      <h4 class="my-5">${q.question}</h4>
      ${q.options.map((option, optionIndex) => `
        <input type="radio" class="btn-check" id="btn-check${idx}${optionIndex}" name="response${idx}" autocomplete="off" />
        <label class="response" for="btn-check${idx}${optionIndex}">${option}</label>
      `).join('')}
    `;
    
    step.innerHTML = questionHTML;
    questionsContainer.appendChild(step);
  });

  // Make first question visible
  document.querySelectorAll('.step')[0].classList.add('d-block');
}

// Update the progress bar as the user navigates through the questions
function updateProgressBar() {
  const progressBar = document.getElementById('progress-bar');
  const progress = ((currentStep + 1) / steps.length) * 100;
  progressBar.style.width = `${progress}%`;
  progressBar.setAttribute('aria-valuenow', progress);
}

// Survey form navigation logic
let currentStep = 0;
const steps = document.getElementsByClassName('step');
const prevBtn = document.getElementById('prev-btn');
const nextBtn = document.getElementById('next-btn');
const submitBtn = document.getElementById('submit-btn');

// Show the next step
nextBtn.addEventListener('click', () => {
  if (currentStep < steps.length - 1) {
    steps[currentStep].classList.remove('d-block');
    steps[currentStep + 1].classList.add('d-block');
    currentStep++;
    prevBtn.disabled = false;
    if (currentStep === steps.length - 1) {
      nextBtn.style.display = 'none';
      submitBtn.style.display = 'inline-block';
    }
    updateProgressBar();
  }
});

// Show the previous step
prevBtn.addEventListener('click', () => {
  if (currentStep > 0) {
    steps[currentStep].classList.remove('d-block');
    steps[currentStep - 1].classList.add('d-block');
    currentStep--;
    nextBtn.style.display = 'inline-block';
    submitBtn.style.display = 'none';
    if (currentStep === 0) {
      prevBtn.disabled = true;
    }
    updateProgressBar();
  }
});

// Generate the survey on page load
document.addEventListener('DOMContentLoaded', generateSurveyQuestions);

// Handle submit button
submitBtn.addEventListener('click', () => {
  // Hide the survey and show the success modal
  document.getElementById('qbox-container').style.display = 'none';
  const successModal = new bootstrap.Modal(document.getElementById('success-modal'));
  successModal.show();
});

// Restart the survey
document.getElementById('restart-btn').addEventListener('click', () => {
  currentStep = 0;
  steps.forEach(step => step.classList.remove('d-block'));
  steps[0].classList.add('d-block');
  updateProgressBar();
  document.getElementById('qbox-container').style.display = 'block';
  document.getElementById('next-btn').style.display = 'inline-block';
  document.getElementById('submit-btn').style.display = 'none';
  const successModal = bootstrap.Modal.getInstance(document.getElementById('success-modal'));
  successModal.hide();
});

// Close the survey
document.getElementById('close-btn').addEventListener('click', () => {
  document.getElementById('qbox-container').style.display = 'none';
});
