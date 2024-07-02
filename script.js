document.addEventListener('DOMContentLoaded', () => {
    const titleContainer = document.getElementById('title');
    const storyContainer = document.getElementById('story');
    const choicesContainer = document.getElementById('choices');
    const illustration = document.getElementById('illustration');
    const gameContainer = document.getElementById('game-container');

    let currentStoryId = '1';
    let typingSpeed = 0; // 타이핑 속도 (밀리초)

    fetch('story.json')
        .then(response => response.json())
        .then(data => {
            const storyData = data;
            showStory(currentStoryId, storyData);
        });

    function showStory(storyId, storyData) {
        const story = storyData[storyId];
        titleContainer.innerHTML = story.title;
        storyContainer.innerHTML = '';
        illustration.style.display = 'none'; // 삽화 숨기기
        choicesContainer.innerHTML = '';

        // 텍스트 타이핑 시작 전에 스크롤을 상단으로 이동
        gameContainer.scrollTo(0, 0);

        typeText(story.text, 0, () => {
            // 텍스트 타이핑 완료 후 삽화 표시
            if (story.image) {
                illustration.src = `images/${story.image}`;
                illustration.style.display = 'block';
            }
            // 텍스트 타이핑 완료 후 선택지 표시
            story.choices.forEach(choice => {
                const button = document.createElement('button');
                button.textContent = choice.text;
                button.addEventListener('click', () => {
                    currentStoryId = choice.next;
                    showStory(currentStoryId, storyData);
                });
                choicesContainer.appendChild(button);
            });
        });
    }

    function typeText(text, index, callback) {
        if (index < text.length) {
            storyContainer.innerHTML += text.charAt(index) === '"' 
                ? '<span class="dialogue">"' 
                : text.charAt(index);
            if (text.charAt(index) === '"') {
                let endIndex = text.indexOf('"', index + 1);
                if (endIndex === -1) endIndex = text.length;
                storyContainer.innerHTML += text.substring(index + 1, endIndex + 1) + '</span>';
                index = endIndex;
            }
            index++;
            setTimeout(() => typeText(text, index, callback), typingSpeed);
        } else {
            callback();
        }
    }
});
