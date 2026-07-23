// Load projects from the server

fetch("/api/projects")

    .then(response => response.json())

    .then(projects => {

        const projectList =
            document.getElementById("projectList");

        projectList.innerHTML = "";

        projects.forEach(project => {

            const listItem =
                document.createElement("li");

            listItem.textContent = project;

            projectList.appendChild(listItem);

        });

    })

    .catch(error => {

        console.log("Error loading projects:", error);

    });


// Load contact information from the server

fetch("/api/contact")

    .then(response => response.json())

    .then(contact => {

        document.getElementById("email").textContent =
            contact.email;


        const githubLink =
            document.getElementById("github");


        githubLink.textContent =
            contact.github;


        githubLink.href =
            contact.github;

    })

    .catch(error => {

        console.log("Error loading contact information:", error);

    });


// Handle contact form submission

document.getElementById("contactForm")

    .addEventListener("submit", function(event) {


        // Stop the page from refreshing

        event.preventDefault();


        // Get the values entered in the form

        const name =
            document.getElementById("name").value;


        const email =
            document.getElementById("messageEmail").value;


        const message =
            document.getElementById("message").value;


        // Send the data to the server

        fetch("/api/messages", {

            method: "POST",

            headers: {

                "Content-Type": "application/json"

            },

            body: JSON.stringify({

                name: name,

                email: email,

                message: message

            })

        })


        .then(response => response.json())


        .then(data => {


            document.getElementById("formMessage")

                .textContent = data.message;


            document.getElementById("contactForm")

                .reset();


        })


        .catch(error => {

            console.log("Error:", error);

        });

    });