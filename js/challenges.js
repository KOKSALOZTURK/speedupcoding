const challenges = {
    javascript: {
        beginner: [
            {
                title: "Basic JavaScript Variables",
                description: "Practice declaring and using variables in JavaScript",
                code: "let name = 'John';\nconst age = 25;\nvar isStudent = true;\nlet city = 'New York';\nlet hobbies = ['reading', 'coding'];\n\nlet country = 'USA';\nconst isEmployed = false;\nvar favoriteColor = 'blue';\nlet languages = ['English', 'Spanish'];\nconst graduationYear = 2022;\nlet hasDriversLicense = true;\n\nconsole.log(name);\nconsole.log(age);\nconsole.log(isStudent);\nconsole.log(city);\nconsole.log('Hobbies:', hobbies.join(', '));\nconsole.log('Country:', country);\nconsole.log('Employed:', isEmployed);\nconsole.log('Favorite Color:', favoriteColor);\nconsole.log('Languages:', languages.join(', '));\nconsole.log('Graduation Year:', graduationYear);\nconsole.log('Has Driver\\'s License:', hasDriversLicense);"

            },
            {
                title: "Simple Function",
                description: "Create a basic function that adds two numbers",
                code: "function add(a, b) {\n    return a + b;\n}\n\nconst result = add(5, 3);\nconsole.log(result);\n\nfunction subtract(a, b) {\n    return a - b;\n}\n\nconst diff = subtract(10, 4);\nconsole.log(diff);\n\nfunction multiply(a, b) {\n    return a * b;\n}\n\nconst product = multiply(6, 7);\nconsole.log(product);\n\nfunction divide(a, b) {\n    if (b === 0) {\n        console.log('Error: Division by zero');\n        return null;\n    }\n    return a / b;\n}\n\nconst quotient = divide(20, 5);\nconsole.log(quotient);"

            },
            {
                title: "Conditional Statements",
                description: "Practice using if-else statements in JavaScript",
                code: "const score = 85;\nlet grade;\n\nif (score >= 90) {\n    grade = 'A';\n} else if (score >= 80) {\n    grade = 'B';\n} else if (score >= 70) {\n    grade = 'C';\n} else if (score >= 60) {\n    grade = 'D';\n} else {\n    grade = 'F';\n}\n\nconsole.log('Your grade is:', grade);\n\nif (grade === 'F') {\n    console.log('You need to study harder.');\n} else if (grade === 'D') {\n    console.log('You passed but should improve.');\n} else {\n    console.log('Good job!');\n}\n\nlet remarks;\nswitch (grade) {\n    case 'A':\n        remarks = 'Excellent work!';\n        break;\n    case 'B':\n        remarks = 'Well done!';\n        break;\n    case 'C':\n        remarks = 'Good effort.';\n        break;\n    case 'D':\n        remarks = 'Needs improvement.';\n        break;\n    case 'F':\n        remarks = 'Failed, try again.';\n        break;\n    default:\n        remarks = 'No remarks.';\n}\nconsole.log('Remarks:', remarks);"

            }
        ],
        intermediate: [
            {
                title: "Array Methods",
                description: "Practice using array methods in JavaScript",
                code: "const numbers = [1, 2, 3, 4, 5];\n\nconst doubled = numbers.map(num => num * 2);\nconst tripled = numbers.map(num => num * 3);\n\nconst sum = numbers.reduce((acc, curr) => acc + curr, 0);\nconst product = numbers.reduce((acc, curr) => acc * curr, 1);\n\nconst evenNumbers = numbers.filter(num => num % 2 === 0);\nconst oddNumbers = numbers.filter(num => num % 2 !== 0);\n\nconst hasNegative = numbers.some(num => num < 0);\nconst allPositive = numbers.every(num => num > 0);\n\nconsole.log(doubled);\nconsole.log(tripled);\nconsole.log(sum);\nconsole.log(product);\nconsole.log(evenNumbers);\nconsole.log(oddNumbers);\nconsole.log('Contains negative numbers:', hasNegative);\nconsole.log('All positive numbers:', allPositive);"

            },
            {
                title: "Object Destructuring",
                description: "Practice using object destructuring in JavaScript",
                code: "const person = {\n    firstName: 'John',\n    lastName: 'Doe',\n    age: 30,\n    occupation: 'Engineer',\n    address: {\n        city: 'New York',\n        country: 'USA',\n        zip: '10001',\n        street: '5th Avenue',\n        apartment: '12B'\n    },\n    contact: {\n        phone: '123-456-7890',\n        email: 'john@example.com',\n        social: {\n            twitter: '@john_doe',\n            linkedIn: 'john-doe-profile'\n        }\n    },\n    hobbies: ['reading', 'coding', 'hiking']\n};\n\nconst {\n    firstName,\n    lastName,\n    age,\n    occupation,\n    address: { city, zip, street, apartment },\n    contact: { phone, email, social: { twitter } },\n    hobbies\n} = person;\n\nconsole.log(firstName, lastName);\nconsole.log('Age:', age);\nconsole.log('Occupation:', occupation);\nconsole.log('Lives in', city, 'ZIP:', zip, 'on', street, 'apartment', apartment);\nconsole.log('Phone:', phone);\nconsole.log('Email:', email);\nconsole.log('Twitter:', twitter);\nconsole.log('Hobbies:', hobbies.join(', '));"

            },
            {
                title: "Higher Order Functions",
                description: "Practice using higher order functions in JavaScript",
                code: "function multiplyBy(factor) {\n    return function(number) {\n        return number * factor;\n    };\n}\n\nconst double = multiplyBy(2);\nconst triple = multiplyBy(3);\nconst quadruple = multiplyBy(4);\n\nconsole.log(double(5));\nconsole.log(triple(5));\nconsole.log(quadruple(5));\n\nconst values = [1, 2, 3, 4, 5];\nconst doubledValues = values.map(double);\nconst tripledValues = values.map(triple);\nconst quadrupledValues = values.map(quadruple);\n\nconsole.log('Doubled:', doubledValues);\nconsole.log('Tripled:', tripledValues);\nconsole.log('Quadrupled:', quadrupledValues);\n\nconst filteredValues = values.filter(function(num) {\n    return num % 2 === 0;\n});\nconsole.log('Even numbers:', filteredValues);\n\nconst sum = values.reduce(function(acc, curr) {\n    return acc + curr;\n}, 0);\nconsole.log('Sum of values:', sum);"

            }
        ],
        advanced: [
            {
                title: "Async/Await",
                description: "Practice using async/await with promises",
                code: "async function fetchData() {\n    try {\n        const response = await fetch('https://api.example.com/data');\n        if (!response.ok) {\n            throw new Error('Network response was not ok');\n        }\n        const data = await response.json();\n        console.log('Fetched data:', data);\n        processData(data);\n        return data;\n    } catch (error) {\n        console.error('Error:', error);\n        handleError(error);\n    }\n}\n\nfunction processData(data) {\n    console.log('Processing data:', data);\n    // Imagine processing data here\n}\n\nfunction handleError(error) {\n    console.log('Handling error:', error.message);\n    // Handle error gracefully here\n}\n\nfetchData().then(data => {\n    if (data) {\n        console.log('Data received successfully');\n    } else {\n        console.log('No data received');\n    }\n});"

            },
            {
                title: "Class Inheritance",
                description: "Practice using class inheritance in JavaScript",
                code: "class Animal {\n    constructor(name) {\n        this.name = name;\n        this.age = 0;\n    }\n\n    speak() {\n        console.log(this.name + ' makes a noise.');\n    }\n\n    growOlder() {\n        this.age += 1;\n        console.log(this.name + ' is now ' + this.age + ' years old.');\n    }\n}\n\nclass Dog extends Animal {\n    constructor(name, breed) {\n        super(name);\n        this.breed = breed;\n        this.energy = 100;\n    }\n\n    speak() {\n        console.log(this.name + ' barks!');\n    }\n\n    fetch() {\n        console.log(this.name + ' is fetching.');\n        this.energy -= 10;\n    }\n\n    rest() {\n        this.energy += 20;\n        console.log(this.name + ' is resting and energy is now ' + this.energy + '.');\n    }\n}\n\nconst dog = new Dog('Rex', 'German Shepherd');\ndog.speak();\ndog.fetch();\ndog.growOlder();\ndog.rest();\ndog.growOlder();"

            },
            {
                title: "Generator Functions",
                description: "Practice using generator functions in JavaScript",
                code: "function* fibonacci() {\n    let a = 0, b = 1;\n    let count = 0;\n\n    while (true) {\n        yield a;\n        [a, b] = [b, a + b];\n        count++;\n        if (count % 5 === 0) {\n            console.log('Generated ' + count + ' Fibonacci numbers so far');\n        }\n    }\n}\n\nconst fib = fibonacci();\nfor (let i = 0; i < 20; i++) {\n    console.log(fib.next().value);\n}\n\nconsole.log('Fibonacci sequence completed');\n\nconst fib2 = fibonacci();\nconsole.log('First 5 numbers from second generator:');\nfor (let i = 0; i < 5; i++) {\n    console.log(fib2.next().value);\n}"
            }
        ]
    }
};

window.challenges = challenges;