import { liveTools } from '../data/tools.js';

let toolsContainer;
let toolsNotification;

let toolsData = [];
let filteredTools = [];


const filters = {
    searchQuery: '',
    selectedCategory: 'all',
    selectedPaymentType: 'all'
}

const populateError = () => {
    const errorMarkup = `<div class="error-message"><p> <span>⟳</span> Failed to load tools. Please reload the page.</p></div>`;
    toolsNotification.innerHTML = errorMarkup;
}

const populateEmptyTools = () => {
    toolsContainer.innerHTML = `<div class="empty-tools"><p>No tools found for the selected filters</p></div>`;
}

const renderTools = (data = filteredTools) => {
    if(data.length === 0){
        populateEmptyTools();
        return;
    }

    const toolsMarkupElements = [];

    data.forEach(tool => {
        const toolMarkup = `
            <a class="tool-item" href="${tool.url}">
                <span class="tool-meta-badge">${tool.source}</span>
                <h2>${tool.name}</h2>
                <p>${tool.description}</p>
                <span>Try it →</span>
                <div class="tool-item-footer">
                    <span class="tool-item-footer-item">${tool.category}</span>
                    <span class="tool-item-footer-item">${tool.type}</span>
                </div>
            </a>
        `;
        toolsMarkupElements.push(toolMarkup);
    });
    toolsNotification.innerHTML = '';
    toolsContainer.innerHTML = toolsMarkupElements.join('');
}

const setFilteredToolsData = (tools) => {
   filteredTools = tools && tools.length > 0 ? tools : toolsData;
}

const resetCategoryAndPaymentTypeUI = () => {
    const categoryFilters = document.getElementById('categoryFilters');
    const paymentFilters = document.getElementById('paymentFilters');
    categoryFilters.value = 'all';
    paymentFilters.value = 'all';
}

const populateTools = (data) => {
    try{
        renderTools(data);
    } catch(error){
        console.error('Error populating tools', error);
        populateError();
    }
}

const searchTools = (searchQuery) => {
   return !!searchQuery ? toolsData.filter(tool => tool.name.toLowerCase().includes(searchQuery.toLowerCase())) : toolsData;
}


const filterByCategory = (category, list = filteredTools) => {
    return category === 'all' ? list : list.filter(tool => tool.category === category);
}

const filterByPaymentType = (paymentType, list = filteredTools) => {
    return paymentType === 'all' ? list : list.filter(tool => tool.payment === paymentType);
}

const filtersProxy = new Proxy(filters, {
    set(target, prop, value){
        target[prop] = value;

        switch(prop){
            case 'searchQuery':
                resetCategoryAndPaymentTypeUI();
                const searchResults = searchTools(value);
                setFilteredToolsData(searchResults);
                populateTools();
                break;
            case 'selectedCategory':
                const categoryFilteredTools = filterByCategory(value);
                const paymentFilteredTools = filterByPaymentType(target.selectedPaymentType, categoryFilteredTools);
                populateTools(paymentFilteredTools);
                break;
            case 'selectedPaymentType':
                const paymentFilteredList = filterByPaymentType(value);
                const categoryFilteredList = filterByCategory(target.selectedCategory, paymentFilteredList);
                populateTools(categoryFilteredList);
                break;
        }
        return true;
    }
});

const populateYear = () => {    
    const year = document.getElementById('year');
    year.textContent = new Date().getFullYear();
}

const addMobileMenuListener = () => {
    const menuButton = document.querySelector('.menu-button');
    const navLinks = document.querySelector('.nav-links');

    menuButton.addEventListener('click', () => {
        menuButton.classList.toggle('active');
        navLinks.classList.toggle('active');
    });
}



const populateCategories = () => {
    const categories = toolsData.map(tool => tool.category);
    const uniqueCategories = [...new Set(categories)];
    const categoryFilters = document.getElementById('categoryFilters');
    const optionsMarkup = [
        `<option value="all">All</option>`
    ];
    uniqueCategories.forEach(category => {
        const optionMarkup = `
            <option value="${category}">${category}</option>
        `;
        optionsMarkup.push(optionMarkup);
    });
    categoryFilters.innerHTML = optionsMarkup.join('');
}

const populatePaymentTypes = () => {
    const paymentTypes = toolsData.map(tool => tool.payment);
    const uniquePaymentTypes = [...new Set(paymentTypes)];
    const paymentFilters = document.getElementById('paymentFilters');
    const optionsMarkup = [
        `<option value="all">All</option>`
    ];
    uniquePaymentTypes.forEach(paymentType => {
        const optionMarkup = `
            <option value="${paymentType}">${paymentType}</option>
        `;
        optionsMarkup.push(optionMarkup);
    });
    paymentFilters.innerHTML = optionsMarkup.join('');
}



const addSearchListener = () => {
    const searchInput = document.getElementById('searchTools');
    let searchThrottleTimerId;
    searchInput.addEventListener('input', (e) => {
        if(searchThrottleTimerId){
            clearTimeout(searchThrottleTimerId);

        }
        searchThrottleTimerId = setTimeout(() => {  
            filtersProxy.searchQuery = e.target.value;
        }, 500);
    });
}

const addCategoryListener = () => {
    const categoryFilters = document.getElementById('categoryFilters');
    categoryFilters.addEventListener('change', (e) => {
        filtersProxy.selectedCategory = e.target.value;
    });
}

const addPaymentListener = () => {
    const paymentFilters = document.getElementById('paymentFilters');
    paymentFilters.addEventListener('change', (e) => {
        filtersProxy.selectedPaymentType = e.target.value;
    }); 
}



const addListeners = () => {
    addMobileMenuListener();
    addSearchListener();
    addCategoryListener();
    addPaymentListener();
}


const init = () => {
    toolsContainer = document.getElementById('toolsGrid');
    toolsNotification = document.querySelector('.tools-notification');

    toolsData = liveTools;
    filteredTools = liveTools;
    populateYear();
    addListeners();
    populateTools();
    populateCategories();
    populatePaymentTypes();
};

init();
