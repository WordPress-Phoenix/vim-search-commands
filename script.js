document.addEventListener("DOMContentLoaded", function () {
    const searchBox = document.getElementById("searchBox");
    const commandsTable = document.getElementById("commandsTable");

    fetch("commands.json")
        .then(response => response.json())
        .then(commands => {
            function displayCommands(filteredCommands) {
                commandsTable.innerHTML = "";
                filteredCommands.forEach(cmd => {
                    const row = `<tr>
                        <td>${cmd.command}</td>
                        <td>${cmd.description}</td>
                        <td>${cmd.keywords.join(", ")}</td>
                    </tr>`;
                    commandsTable.innerHTML += row;
                });
            }

            displayCommands(commands);

            searchBox.addEventListener("input", function () {
                const searchTerm = searchBox.value.toLowerCase();
                const filteredCommands = commands.filter(cmd =>
                    cmd.description.toLowerCase().includes(searchTerm) ||
                    cmd.keywords.some(keyword => keyword.toLowerCase().includes(searchTerm))
                );
                displayCommands(filteredCommands);
            });
        });
});
