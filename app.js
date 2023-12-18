document.addEventListener("DOMContentLoaded", function () {
    // Fetch available languages and populate language selection dropdown
    fetch('/api/languages')
        .then(response => response.json())
        .then(languages => {
            const languageSelect = document.getElementById('language-select');

            languages.forEach(language => {
                const option = document.createElement('option');
                option.value = language.code;
                option.textContent = language.name;
                languageSelect.appendChild(option);
            });
        })
        .catch(error => console.error('Error fetching languages:', error));

    // Event listener for language selection change
    document.getElementById('language-select').addEventListener('change', function () {
        const selectedLanguage = this.value;
        fetchExercises(selectedLanguage);
    });

    // Fetch and display initial set of exercises
    function fetchExercises(language) {
        fetch(`/api/exercises/${language}`)
            .then(response => response.json())
            .then(exercises => {
                displayExercises(exercises);
            })
            .catch(error => console.error('Error fetching exercises:', error));
    }

    // Display exercises in the UI
    function displayExercises(exercises) {
        const quizContainer = document.getElementById('quiz-container');
        quizContainer.innerHTML = '';

        exercises.forEach(exercise => {
            const questionElement = document.createElement('div');
            questionElement.textContent = exercise.question;
            
            // Create answer options (assuming multiple-choice)
            exercise.options.forEach(option => {
                const optionElement = document.createElement('div');
                optionElement.textContent = option;
                optionElement.addEventListener('click', function () {
                    submitAnswer(exercise.id, option);
                });
                questionElement.appendChild(optionElement);
            });

            quizContainer.appendChild(questionElement);
        });
    }

    // Submit user's answer for evaluation
    function submitAnswer(exerciseId, selectedOption) {
        const data = {
            exerciseId: exerciseId,
            selectedOption: selectedOption,
        };

        fetch('/api/submit-answer', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        })
        .then(response => response.json())
        .then(result => {
            // Display feedback to the user based on the evaluation result
            console.log(result);
        })
        .catch(error => console.error('Error submitting answer:', error));
    }
});
