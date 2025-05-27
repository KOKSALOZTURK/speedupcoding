// Define challenges object
window.challenges = {
    javascript: {
        // Time-based challenges
        beginner: [
            {
                title: "Basic JavaScript Variables",
                description: "Practice declaring and using variables in JavaScript",
                code: "let name = 'John';\nconst age = 25;\nvar isStudent = true;\n\nconsole.log(name);\nconsole.log(age);\nconsole.log(isStudent);"
            },
            {
                title: "Simple Function",
                description: "Create a basic function that adds two numbers",
                code: "function add(a, b) {\nreturn a + b;\n}\n\nconst result = add(5, 3);\nconsole.log(result);"
            },
            {
                title: "Conditional Statements",
                description: "Practice using if-else statements in JavaScript",
                code: "const score = 85;\nlet grade;\n\nif (score >= 90) {\ngrade = 'A';\n} else if (score >= 80) {\ngrade = 'B';\n} else if (score >= 70) {\ngrade = 'C';\n} else {\ngrade = 'F';\n}\n\nconsole.log('Your grade is:', grade);"
            }
        ],
        intermediate: [
            {
                title: "Array Methods",
                description: "Practice using array methods in JavaScript",
                code: "const numbers = [1, 2, 3, 4, 5];\n\nconst doubled = numbers.map(num => num * 2);\nconst sum = numbers.reduce((acc, curr) => acc + curr, 0);\nconst evenNumbers = numbers.filter(num => num % 2 === 0);\n\nconsole.log(doubled);\nconsole.log(sum);\nconsole.log(evenNumbers);"
            },
            {
                title: "Object Destructuring",
                description: "Practice using object destructuring in JavaScript",
                code: "const person = {\nfirstName: 'John',\nlastName: 'Doe',\nage: 30,\naddress: {\ncity: 'New York',\ncountry: 'USA'\n}\n};\n\nconst { firstName, lastName, address: { city } } = person;\nconsole.log(`${firstName} ${lastName} lives in ${city}`);"
            },
            {
                title: "Higher Order Functions",
                description: "Practice using higher order functions in JavaScript",
                code: "function multiplyBy(factor) {\nreturn function(number) {\nreturn number * factor;\n};\n}\n\nconst double = multiplyBy(2);\nconst triple = multiplyBy(3);\n\nconsole.log(double(5));\nconsole.log(triple(5));"
            }
        ],
        advanced: [
            {
                title: "Async/Await",
                description: "Practice using async/await with promises",
                code: "async function fetchData() {\ntry {\nconst response = await fetch('https://api.example.com/data');\nconst data = await response.json();\nreturn data;\n} catch (error) {\nconsole.error('Error:', error);\n}\n}\n\nfetchData().then(data => console.log(data));"
            },
            {
                title: "Class Inheritance",
                description: "Practice using class inheritance in JavaScript",
                code: "class Animal {\nconstructor(name) {\nthis.name = name;\n}\n\nspeak() {\nconsole.log(`${this.name} makes a noise.`);\n}\n}\n\nclass Dog extends Animal {\nconstructor(name, breed) {\nsuper(name);\nthis.breed = breed;\n}\n\nspeak() {\nconsole.log(`${this.name} barks!`);\n}\n}\n\nconst dog = new Dog('Rex', 'German Shepherd');\ndog.speak();"
            },
            {
                title: "Generator Functions",
                description: "Practice using generator functions in JavaScript",
                code: "function* fibonacci() {\nlet a = 0, b = 1;\n\nwhile (true) {\nyield a;\n[a, b] = [b, a + b];\n}\n}\n\nconst fib = fibonacci();\nfor (let i = 0; i < 10; i++) {\nconsole.log(fib.next().value);\n}"
            }
        ]
    },
    // Word-based challenges organized by word count
    wordBased: {
        "25": [
            {
                title: "Add Two Numbers",
                description: "Create a function to add two numbers and display the result.",
                code: "function add(a, b) {\nconst result = a + b;\nreturn result;\n}\nconst sum = add(5, 10);\nconsole.log(\"Sum is:\", sum);"
            }
        ],
        "50": [
            {
                title: "Array Analysis",
                description: "Perform multiple array operations.",
                code: "const numbers = [1, 2, 3, 4, 5];\nconst squared = numbers.map(n => n * n);\nconst filtered = numbers.filter(n => n % 2 === 0);\nconst sum = numbers.reduce((acc, val) => acc + val, 0);\nconsole.log(\"Squared:\", squared);\nconsole.log(\"Even numbers:\", filtered);\nconsole.log(\"Sum:\", sum);"
            }
        ],
        "100": [
            {
                title: "Simple Comment System",
                description: "Manage a list of blog comments and display them.",
                code: "const comments = [];\nfunction addComment(username, message) {\nconst timestamp = new Date().toLocaleString();\nconst comment = {\nuser: username,\ntext: message,\ntime: timestamp\n};\ncomments.push(comment);\nconsole.log(\"Comment added by\", username);\n}\nfunction displayComments() {\nconsole.log(\"All Comments:\");\ncomments.forEach((c, i) => {\nconsole.log(`${i + 1}. [${c.time}] ${c.user}: ${c.text}`);\n});\n}\naddComment(\"Jess\", \"This is awesome!\");\naddComment(\"Alice\", \"Great explanation.\");\naddComment(\"Bob\", \"I learned a lot.\");\naddComment(\"Dawit\", \"Thanks for sharing!\");\ndisplayComments();"
            }
        ]
    }
};