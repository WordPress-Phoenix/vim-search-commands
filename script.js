document.addEventListener("DOMContentLoaded", function () {
    const searchBox = document.getElementById("searchBox");
    const categoryFilter = document.getElementById("categoryFilter");
    const commandsTable = document.getElementById("commandsTable");
    const themeToggle = document.getElementById("themeToggle");

    // Theme handling
    function getPreferredTheme() {
        const storedTheme = localStorage.getItem('theme');
        if (storedTheme) {
            return storedTheme;
        }
        return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }

    function setTheme(theme) {
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem('theme', theme);
    }

    // Set initial theme
    setTheme(getPreferredTheme());

    // Theme toggle handler
    themeToggle.addEventListener('click', () => {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        setTheme(newTheme);
    });

    // Listen for system theme changes
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
        if (!localStorage.getItem('theme')) {
            setTheme(e.matches ? 'dark' : 'light');
        }
    });

    // Fetch and populate commands
    let commands = [];
    fetch('commands.json')
        .then(response => response.json())
        .then(data => {
            commands = data;
            populateCategoryFilter(commands);
            displayCommands(commands);
        });

    function populateCategoryFilter(data) {
        const categories = new Set();
        data.forEach(category => {
            categories.add(category.category);
        });
        
        categories.forEach(category => {
            const option = document.createElement('option');
            option.value = category;
            option.textContent = category;
            categoryFilter.appendChild(option);
        });
    }

    function displayCommands(data) {
        const searchTerm = searchBox.value.toLowerCase();
        const selectedCategory = categoryFilter.value;

        commandsTable.innerHTML = '';
        
        data.forEach(category => {
            if (selectedCategory === 'all' || category.category === selectedCategory) {
                category.commands.forEach(cmd => {
                    if (searchTerm === '' || 
                        cmd.command.toLowerCase().includes(searchTerm) || 
                        cmd.description.toLowerCase().includes(searchTerm) ||
                        cmd.keywords.some(keyword => keyword.toLowerCase().includes(searchTerm))) {
                        
                    const row = document.createElement('tr');
                    row.innerHTML = `
                        <td>${cmd.command}</td>
                        <td>${cmd.description}</td>
                        <td>${cmd.keywords.join(', ')}</td>
                        <td>${category.category}</td>
                    `;
                    commandsTable.appendChild(row);
                }
            });
        }
    });
}

    // Event listeners for search and filter
    searchBox.addEventListener('input', () => displayCommands(commands));
    categoryFilter.addEventListener('change', () => displayCommands(commands));
});