// Disease Prediction System JavaScript

// Application data from JSON
const diseaseData = {
    "diseases": [
        {
            "name": "Diabetes",
            "risk_factors": {
                "age": {"weight": 0.15, "high_risk": ">45"},
                "bmi": {"weight": 0.25, "high_risk": ">30"},
                "glucose": {"weight": 0.30, "high_risk": ">100"},
                "bp_systolic": {"weight": 0.20, "high_risk": ">140"},
                "family_history": {"weight": 0.10, "high_risk": "yes"}
            },
            "symptoms": ["Excessive thirst", "Frequent urination", "Unexplained weight loss", "Fatigue", "Blurred vision", "Slow healing wounds"]
        },
        {
            "name": "Heart Disease",
            "risk_factors": {
                "age": {"weight": 0.20, "high_risk": ">50"},
                "cholesterol": {"weight": 0.25, "high_risk": ">240"},
                "bp_systolic": {"weight": 0.20, "high_risk": ">140"},
                "max_heart_rate": {"weight": 0.15, "high_risk": "<100"},
                "chest_pain": {"weight": 0.20, "high_risk": "typical"}
            },
            "symptoms": ["Chest pain", "Shortness of breath", "Irregular heartbeat", "Fatigue", "Swelling in legs", "Dizziness"]
        },
        {
            "name": "Hypertension",
            "risk_factors": {
                "age": {"weight": 0.20, "high_risk": ">40"},
                "bmi": {"weight": 0.25, "high_risk": ">25"},
                "salt_intake": {"weight": 0.20, "high_risk": "high"},
                "stress": {"weight": 0.15, "high_risk": "high"},
                "exercise": {"weight": 0.20, "high_risk": "low"}
            },
            "symptoms": ["Headaches", "Dizziness", "Chest pain", "Shortness of breath", "Nosebleeds", "Vision problems"]
        }
    ]
};

// Global variables
let currentChart = null;
let predictionHistory = [];

// Initialize application
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
    loadPredictionHistory();
    populateSymptoms();
});

function initializeApp() {
    // Tab navigation
    setupTabNavigation();
    
    // Form submissions
    setupFormSubmissions();
    
    // Real-time validation
    setupRealTimeValidation();
    
    // Smooth scrolling for navigation
    setupSmoothScrolling();
}

// Tab Navigation
function setupTabNavigation() {
    const tabButtons = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');
    
    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            const targetTab = button.getAttribute('data-tab');
            
            // Remove active class from all tabs and contents
            tabButtons.forEach(btn => btn.classList.remove('active'));
            tabContents.forEach(content => content.classList.remove('active'));
            
            // Add active class to clicked tab and corresponding content
            button.classList.add('active');
            document.getElementById(targetTab).classList.add('active');
            
            // Hide results when switching tabs
            document.getElementById('resultsSection').classList.add('hidden');
        });
    });
}

// Form Submissions
function setupFormSubmissions() {
    document.getElementById('diabetesForm').addEventListener('submit', (e) => {
        e.preventDefault();
        if (validateForm('diabetes')) {
            predictDisease('diabetes');
        }
    });
    
    document.getElementById('heartForm').addEventListener('submit', (e) => {
        e.preventDefault();
        if (validateForm('heart')) {
            predictDisease('heart');
        }
    });
    
    document.getElementById('hypertensionForm').addEventListener('submit', (e) => {
        e.preventDefault();
        if (validateForm('hypertension')) {
            predictDisease('hypertension');
        }
    });
}

// Real-time Validation
function setupRealTimeValidation() {
    const inputs = document.querySelectorAll('.form-control');
    inputs.forEach(input => {
        input.addEventListener('blur', () => validateField(input));
        input.addEventListener('input', () => clearError(input));
    });
}

function validateField(field) {
    const value = field.value.trim();
    const fieldId = field.id;
    let isValid = true;
    let errorMessage = '';
    
    if (field.hasAttribute('required') && !value) {
        isValid = false;
        errorMessage = 'This field is required';
    } else if (field.type === 'number') {
        const numValue = parseFloat(value);
        const min = parseFloat(field.getAttribute('min'));
        const max = parseFloat(field.getAttribute('max'));
        
        if (isNaN(numValue)) {
            isValid = false;
            errorMessage = 'Please enter a valid number';
        } else if (min && numValue < min) {
            isValid = false;
            errorMessage = `Value must be at least ${min}`;
        } else if (max && numValue > max) {
            isValid = false;
            errorMessage = `Value must be at most ${max}`;
        }
    }
    
    // Display error or success
    const errorElement = document.getElementById(fieldId + 'Error');
    if (errorElement) {
        errorElement.textContent = errorMessage;
    }
    
    if (isValid) {
        field.classList.remove('error');
        field.classList.add('valid');
    } else {
        field.classList.remove('valid');
        field.classList.add('error');
    }
    
    return isValid;
}

function clearError(field) {
    field.classList.remove('error');
    const errorElement = document.getElementById(field.id + 'Error');
    if (errorElement) {
        errorElement.textContent = '';
    }
}

function validateForm(diseaseType) {
    const form = document.getElementById(diseaseType + 'Form');
    const inputs = form.querySelectorAll('.form-control');
    let isValid = true;
    
    inputs.forEach(input => {
        if (!validateField(input)) {
            isValid = false;
        }
    });
    
    return isValid;
}

// Disease Prediction Algorithm
function predictDisease(diseaseType) {
    showProgress();
    
    setTimeout(() => {
        const formData = getFormData(diseaseType);
        const riskScore = calculateRiskScore(diseaseType, formData);
        const riskLevel = getRiskLevel(riskScore);
        const recommendations = getRecommendations(diseaseType, riskLevel, formData);
        
        displayResults(diseaseType, riskScore, riskLevel, recommendations, formData);
        hideProgress();
    }, 2000);
}

function getFormData(diseaseType) {
    const data = {};
    
    if (diseaseType === 'diabetes') {
        data.age = parseInt(document.getElementById('diabetesAge').value);
        data.bmi = parseFloat(document.getElementById('diabetesBMI').value);
        data.glucose = parseInt(document.getElementById('diabetesGlucose').value);
        data.bp_systolic = parseInt(document.getElementById('diabetesBP').value);
        data.family_history = document.getElementById('diabetesFamily').value;
    } else if (diseaseType === 'heart') {
        data.age = parseInt(document.getElementById('heartAge').value);
        data.cholesterol = parseInt(document.getElementById('heartCholesterol').value);
        data.bp_systolic = parseInt(document.getElementById('heartBP').value);
        data.max_heart_rate = parseInt(document.getElementById('heartRate').value);
        data.chest_pain = document.getElementById('heartChestPain').value;
    } else if (diseaseType === 'hypertension') {
        data.age = parseInt(document.getElementById('hyperAge').value);
        data.weight = parseFloat(document.getElementById('hyperWeight').value);
        data.height = parseInt(document.getElementById('hyperHeight').value);
        data.salt_intake = document.getElementById('hyperSalt').value;
        data.stress = document.getElementById('hyperStress').value;
        data.exercise = document.getElementById('hyperExercise').value;
        
        // Calculate BMI for hypertension
        data.bmi = data.weight / Math.pow(data.height / 100, 2);
    }
    
    return data;
}

function calculateRiskScore(diseaseType, formData) {
    const disease = diseaseData.diseases.find(d => d.name.toLowerCase() === getDiseaseName(diseaseType).toLowerCase());
    let totalScore = 0;
    
    Object.entries(disease.risk_factors).forEach(([factor, config]) => {
        let factorScore = 0;
        const weight = config.weight;
        const highRisk = config.high_risk;
        
        if (factor === 'age') {
            const threshold = parseInt(highRisk.substring(1));
            factorScore = formData.age > threshold ? 1 : formData.age / threshold;
        } else if (factor === 'bmi') {
            const threshold = parseFloat(highRisk.substring(1));
            factorScore = formData.bmi > threshold ? 1 : formData.bmi / threshold;
        } else if (factor === 'glucose') {
            const threshold = parseInt(highRisk.substring(1));
            factorScore = formData.glucose > threshold ? 1 : formData.glucose / threshold;
        } else if (factor === 'bp_systolic') {
            const threshold = parseInt(highRisk.substring(1));
            factorScore = formData.bp_systolic > threshold ? 1 : formData.bp_systolic / threshold;
        } else if (factor === 'cholesterol') {
            const threshold = parseInt(highRisk.substring(1));
            factorScore = formData.cholesterol > threshold ? 1 : formData.cholesterol / threshold;
        } else if (factor === 'max_heart_rate') {
            const threshold = parseInt(highRisk.substring(1));
            factorScore = formData.max_heart_rate < threshold ? 1 : threshold / formData.max_heart_rate;
        } else if (factor === 'family_history') {
            factorScore = formData.family_history === 'yes' ? 1 : 0;
        } else if (factor === 'chest_pain') {
            factorScore = formData.chest_pain === 'typical' ? 1 : 0.5;
        } else if (factor === 'salt_intake') {
            factorScore = formData.salt_intake === 'high' ? 1 : formData.salt_intake === 'moderate' ? 0.5 : 0;
        } else if (factor === 'stress') {
            factorScore = formData.stress === 'high' ? 1 : formData.stress === 'moderate' ? 0.5 : 0;
        } else if (factor === 'exercise') {
            factorScore = formData.exercise === 'low' ? 1 : formData.exercise === 'moderate' ? 0.5 : 0;
        }
        
        totalScore += factorScore * weight;
    });
    
    return Math.min(Math.round(totalScore * 100), 100);
}

function getRiskLevel(score) {
    if (score < 30) return 'Low';
    if (score < 60) return 'Moderate';
    return 'High';
}

function getDiseaseName(diseaseType) {
    const names = {
        'diabetes': 'Diabetes',
        'heart': 'Heart Disease',
        'hypertension': 'Hypertension'
    };
    return names[diseaseType] || diseaseType;
}

function getRecommendations(diseaseType, riskLevel, formData) {
    const recommendations = [];
    
    if (diseaseType === 'diabetes') {
        if (formData.bmi > 30) recommendations.push('Focus on weight management through diet and exercise');
        if (formData.glucose > 100) recommendations.push('Monitor blood glucose levels regularly');
        if (formData.bp_systolic > 140) recommendations.push('Control blood pressure through lifestyle changes');
        recommendations.push('Follow a balanced diet with limited processed sugars');
        recommendations.push('Engage in regular physical activity (150 minutes per week)');
    } else if (diseaseType === 'heart') {
        if (formData.cholesterol > 240) recommendations.push('Work on lowering cholesterol through diet and medication if needed');
        if (formData.bp_systolic > 140) recommendations.push('Monitor and control blood pressure');
        if (formData.max_heart_rate < 100) recommendations.push('Consult a cardiologist about your heart rate');
        recommendations.push('Include omega-3 rich foods in your diet');
        recommendations.push('Quit smoking and limit alcohol consumption');
    } else if (diseaseType === 'hypertension') {
        if (formData.bmi > 25) recommendations.push('Maintain a healthy weight');
        if (formData.salt_intake === 'high') recommendations.push('Reduce sodium intake to less than 2g per day');
        if (formData.stress === 'high') recommendations.push('Practice stress management techniques');
        if (formData.exercise === 'low') recommendations.push('Increase physical activity to at least 150 minutes per week');
        recommendations.push('Monitor blood pressure regularly');
    }
    
    if (riskLevel === 'High') {
        recommendations.unshift('Consult with a healthcare professional immediately');
    } else if (riskLevel === 'Moderate') {
        recommendations.unshift('Schedule a health checkup within the next month');
    }
    
    return recommendations;
}

function displayResults(diseaseType, riskScore, riskLevel, recommendations, formData) {
    const resultsSection = document.getElementById('resultsSection');
    const riskLevelElement = document.getElementById('riskLevel');
    const riskPercentageElement = document.getElementById('riskPercentage');
    const recommendationsList = document.getElementById('recommendationsList');
    
    // Set risk level and percentage
    riskLevelElement.textContent = `${riskLevel} Risk`;
    riskPercentageElement.textContent = `${riskScore}%`;
    
    // Apply risk level styling
    const riskIndicator = document.querySelector('.risk-indicator');
    riskIndicator.className = 'risk-indicator risk-' + riskLevel.toLowerCase();
    
    // Populate recommendations
    recommendationsList.innerHTML = '';
    recommendations.forEach(rec => {
        const li = document.createElement('li');
        li.textContent = rec;
        recommendationsList.appendChild(li);
    });
    
    // Create risk breakdown chart
    createRiskChart(diseaseType, formData);
    
    // Show results
    resultsSection.classList.remove('hidden');
    resultsSection.scrollIntoView({ behavior: 'smooth' });
    
    // Save to history
    saveToHistory(diseaseType, riskScore, riskLevel, formData);
}

function createRiskChart(diseaseType, formData) {
    const ctx = document.getElementById('riskChart').getContext('2d');
    
    // Destroy existing chart
    if (currentChart) {
        currentChart.destroy();
    }
    
    const disease = diseaseData.diseases.find(d => d.name.toLowerCase() === getDiseaseName(diseaseType).toLowerCase());
    const labels = [];
    const data = [];
    const colors = ['#1FB8CD', '#FFC185', '#B4413C', '#ECEBD5', '#5D878F'];
    
    Object.entries(disease.risk_factors).forEach(([factor, config], index) => {
        let value = 0;
        let label = factor.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase());
        
        if (factor === 'age') {
            value = formData.age;
        } else if (factor === 'bmi') {
            value = formData.bmi;
        } else if (factor === 'glucose') {
            value = formData.glucose;
        } else if (factor === 'bp_systolic') {
            value = formData.bp_systolic;
        } else if (factor === 'cholesterol') {
            value = formData.cholesterol;
        } else if (factor === 'max_heart_rate') {
            value = formData.max_heart_rate;
        } else if (factor === 'family_history') {
            value = formData.family_history === 'yes' ? 100 : 0;
            label = 'Family History';
        } else if (factor === 'chest_pain') {
            value = formData.chest_pain === 'typical' ? 100 : 50;
            label = 'Chest Pain';
        } else if (factor === 'salt_intake') {
            value = formData.salt_intake === 'high' ? 100 : formData.salt_intake === 'moderate' ? 50 : 0;
            label = 'Salt Intake';
        } else if (factor === 'stress') {
            value = formData.stress === 'high' ? 100 : formData.stress === 'moderate' ? 50 : 0;
        } else if (factor === 'exercise') {
            value = formData.exercise === 'low' ? 100 : formData.exercise === 'moderate' ? 50 : 0;
        }
        
        labels.push(label);
        data.push(Math.round(value * config.weight * 100) / 100);
    });
    
    currentChart = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: labels,
            datasets: [{
                data: data,
                backgroundColor: colors.slice(0, data.length),
                borderWidth: 2,
                borderColor: '#fff'
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            plugins: {
                legend: {
                    position: 'bottom',
                    labels: {
                        padding: 20,
                        usePointStyle: true
                    }
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            return context.label + ': ' + context.parsed + ' (weighted)';
                        }
                    }
                }
            }
        }
    });
}

// Progress Bar Functions
function showProgress() {
    const progressContainer = document.getElementById('progressContainer');
    const progressFill = document.getElementById('progressFill');
    const progressText = document.getElementById('progressText');
    
    progressContainer.classList.remove('hidden');
    
    let progress = 0;
    const interval = setInterval(() => {
        progress += 10;
        progressFill.style.width = progress + '%';
        
        if (progress === 50) {
            progressText.textContent = 'Analyzing risk factors...';
        } else if (progress === 80) {
            progressText.textContent = 'Generating recommendations...';
        } else if (progress >= 100) {
            clearInterval(interval);
        }
    }, 200);
}

function hideProgress() {
    const progressContainer = document.getElementById('progressContainer');
    progressContainer.classList.add('hidden');
}

// Symptom Checker
function populateSymptoms() {
    const symptomGrid = document.getElementById('symptomGrid');
    const allSymptoms = new Set();
    
    diseaseData.diseases.forEach(disease => {
        disease.symptoms.forEach(symptom => allSymptoms.add(symptom));
    });
    
    allSymptoms.forEach(symptom => {
        const div = document.createElement('div');
        div.className = 'symptom-item';
        div.innerHTML = `
            <input type="checkbox" id="symptom-${symptom.replace(/\s+/g, '-')}" value="${symptom}">
            <label for="symptom-${symptom.replace(/\s+/g, '-')}">${symptom}</label>
        `;
        symptomGrid.appendChild(div);
    });
}

function analyzeSymptoms() {
    const checkedSymptoms = [];
    const checkboxes = document.querySelectorAll('#symptomGrid input[type="checkbox"]:checked');
    
    checkboxes.forEach(checkbox => {
        checkedSymptoms.push(checkbox.value);
    });
    
    if (checkedSymptoms.length === 0) {
        alert('Please select at least one symptom.');
        return;
    }
    
    const analysis = {};
    
    diseaseData.diseases.forEach(disease => {
        const matchingSymptoms = disease.symptoms.filter(symptom => 
            checkedSymptoms.includes(symptom)
        );
        
        if (matchingSymptoms.length > 0) {
            analysis[disease.name] = {
                matches: matchingSymptoms.length,
                percentage: Math.round((matchingSymptoms.length / disease.symptoms.length) * 100)
            };
        }
    });
    
    displaySymptomAnalysis(analysis);
}

function displaySymptomAnalysis(analysis) {
    const resultsDiv = document.getElementById('symptomResults');
    const analysisDiv = document.getElementById('symptomAnalysis');
    
    if (Object.keys(analysis).length === 0) {
        analysisDiv.innerHTML = '<p>No specific conditions match your symptoms. Consider consulting a healthcare professional.</p>';
    } else {
        let html = '';
        Object.entries(analysis).forEach(([disease, data]) => {
            html += `
                <div class="symptom-match">
                    <strong>${disease}:</strong> ${data.matches} matching symptoms (${data.percentage}% match)
                </div>
            `;
        });
        analysisDiv.innerHTML = html;
    }
    
    resultsDiv.classList.remove('hidden');
}

// BMI Calculator
function calculateBMI() {
    const height = parseFloat(document.getElementById('bmiHeight').value);
    const weight = parseFloat(document.getElementById('bmiWeight').value);
    
    if (!height || !weight) {
        alert('Please enter both height and weight.');
        return;
    }
    
    const bmi = weight / Math.pow(height / 100, 2);
    const category = getBMICategory(bmi);
    
    const resultDiv = document.getElementById('bmiResult');
    const valueDiv = document.getElementById('bmiValue');
    const categoryDiv = document.getElementById('bmiCategory');
    
    valueDiv.textContent = bmi.toFixed(1);
    categoryDiv.textContent = category;
    
    resultDiv.className = 'bmi-result bmi-' + category.toLowerCase().replace(' ', '');
    resultDiv.classList.remove('hidden');
}

function getBMICategory(bmi) {
    if (bmi < 18.5) return 'Underweight';
    if (bmi < 25) return 'Normal';
    if (bmi < 30) return 'Overweight';
    return 'Obese';
}

// Local Storage Functions
function saveToHistory(diseaseType, riskScore, riskLevel, formData) {
    const result = {
        id: Date.now(),
        disease: getDiseaseName(diseaseType),
        riskScore: riskScore,
        riskLevel: riskLevel,
        formData: formData,
        timestamp: new Date().toISOString()
    };
    
    predictionHistory.push(result);
    localStorage.setItem('predictionHistory', JSON.stringify(predictionHistory));
}

function loadPredictionHistory() {
    const stored = localStorage.getItem('predictionHistory');
    if (stored) {
        predictionHistory = JSON.parse(stored);
    }
}

function saveResult() {
    alert('Result saved to your prediction history!');
}

// Utility Functions
function resetForm() {
    const activeTab = document.querySelector('.tab-content.active');
    const form = activeTab.querySelector('form');
    
    form.reset();
    
    // Clear validation states
    const inputs = form.querySelectorAll('.form-control');
    inputs.forEach(input => {
        input.classList.remove('error', 'valid');
    });
    
    const errorMessages = form.querySelectorAll('.error-message');
    errorMessages.forEach(msg => msg.textContent = '');
    
    // Hide results
    document.getElementById('resultsSection').classList.add('hidden');
}

function scrollToSection(sectionId) {
    const section = document.getElementById(sectionId);
    section.scrollIntoView({ behavior: 'smooth' });
}

// Smooth Scrolling Setup
function setupSmoothScrolling() {
    const navLinks = document.querySelectorAll('.nav-link');
    
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href').substring(1);
            scrollToSection(targetId);
        });
    });
}