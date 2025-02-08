const toolsContainer = document.getElementById('tools-container');

const getToolsData = async() => {
    const response = await fetch('assets/data/tools.json');
    const toolsData = await response.json();
    return toolsData.tools;
}



if (toolsContainer) {
   getToolsData().then(tools => {
        const toolsMarkupElements = [];

        tools.forEach(tool => {
            toolMarkup = `
                <div class="tool-item">
                    <h2>${tool.name}</h2>
                    <p>${tool.description}</p>
                    <a href="${tool.url}">View Tool</a>
                </div>
            `;

            toolsMarkupElements.push(toolMarkup);
        }); 

        toolsContainer.innerHTML = toolsMarkupElements.join('');
    });
} else {    
    const errorMessage = document.createElement('h2');
    errorMessage.classList.add('error-message');
    errorMessage.textContent = 'Failed to load tools. Please try again later.';
    document.body.appendChild(errorMessage);
}

