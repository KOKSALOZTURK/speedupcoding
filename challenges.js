const challenges = {
    javascript: {
        beginner: [
            {
                title: "Basic JavaScript Variables",
                description: "Practice declaring and using variables in JavaScript",
                code: "let name = 'John';\n const age = 25;\n var isStudent = true;\n\nconsole.log(name);\nconsole.log(age);\nconsole.log(isStudent);"
            },
            {
                title: "Simple Function",
                description: "Create a basic function that adds two numbers",
                code: "function add(a, b) {\n    return a + b;\n}\n\nconst result = add(5, 3);\nconsole.log(result);"
            },
            {
                title: "Conditional Statements",
                description: "Practice using if-else statements in JavaScript",
                code: "const score = 85;\nlet grade;\n\nif (score >= 90) {\n    grade = 'A';\n} else if (score >= 80) {\n    grade = 'B';\n} else if (score >= 70) {\n    grade = 'C';\n} else {\n    grade = 'F';\n}\n\nconsole.log('Your grade is:', grade);"
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
                code: "const person = {\n    firstName: 'John',\n    lastName: 'Doe',\n    age: 30,\n    address: {\n        city: 'New York',\n        country: 'USA'\n    }\n};\n\nconst { firstName, lastName, address: { city } } = person;\nconsole.log(`${firstName} ${lastName} lives in ${city}`);"
            },
            {
                title: "Higher Order Functions",
                description: "Practice using higher order functions in JavaScript",
                code: "function multiplyBy(factor) {\n    return function(number) {\n        return number * factor;\n    };\n}\n\nconst double = multiplyBy(2);\nconst triple = multiplyBy(3);\n\nconsole.log(double(5));\nconsole.log(triple(5));"
            }
        ],
        advanced: [
            {
                title: "Async/Await",
                description: "Practice using async/await with promises",
                code: "async function fetchData() {\n    try {\n        const response = await fetch('https://api.example.com/data');\n        const data = await response.json();\n        return data;\n    } catch (error) {\n        console.error('Error:', error);\n    }\n}\n\nfetchData().then(data => console.log(data));"
            },
            {
                title: "Class Inheritance",
                description: "Practice using class inheritance in JavaScript",
                code: "class Animal {\n    constructor(name) {\n        this.name = name;\n    }\n    \n    speak() {\n        console.log(`${this.name} makes a noise.`);\n    }\n}\n\nclass Dog extends Animal {\n    constructor(name, breed) {\n        super(name);\n        this.breed = breed;\n    }\n    \n    speak() {\n        console.log(`${this.name} barks!`);\n    }\n}\n\nconst dog = new Dog('Rex', 'German Shepherd');\ndog.speak();"
            },
            {
                title: "Generator Functions",
                description: "Practice using generator functions in JavaScript",
                code: "function* fibonacci() {\n    let a = 0, b = 1;\n    \n    while (true) {\n        yield a;\n        [a, b] = [b, a + b];\n    }\n}\n\nconst fib = fibonacci();\nfor (let i = 0; i < 10; i++) {\n    console.log(fib.next().value);\n}"
            }
        ]
    },
  
    wordBased: {
        "15": [
            {
                title: "Basic Variable Declaration",
                description: "Practice declaring variables in JavaScript",
                code: "let count = 0;\nconst max = 100;\nvar isActive = true;\n\ncount = count + 1;\nconsole.log(count);"
            },
            {
                title: "Simple Math Operations",
                description: "Basic arithmetic operations in JavaScript",
                code: "let x = 10;\nlet y = 5;\n\nlet sum = x + y;\nlet diff = x - y;\nconsole.log(sum, diff);"
            },
            {
                title: "String Concatenation",
                description: "Practice string concatenation in JavaScript",
                code: "let first = 'Hello';\nlet second = 'World';\n\nlet greeting = first + ' ' + second;\nconsole.log(greeting);"
            }
        ],
        "25": [
            {
                title: "Function with Parameters",
                description: "Create a function that takes parameters",
                code: "function calculateArea(width, height) {\n    const area = width * height;\n    return area;\n}\n\nconst result = calculateArea(5, 10);\nconsole.log('Area:', result);"
            },
            {
                title: "Array Operations",
                description: "Basic array manipulation",
                code: "const fruits = ['apple', 'banana'];\nfruits.push('orange');\nfruits.pop();\n\nconsole.log(fruits);\nconsole.log(fruits.length);"
            },
            {
                title: "Object Properties",
                description: "Working with object properties",
                code: "const user = {\n    name: 'John',\n    age: 30,\n    isAdmin: false\n};\n\nuser.email = 'john@example.com';\ndelete user.isAdmin;\n\nconsole.log(user);"
            }
        ],
        "40": [
            {
                title: "Object Methods",
                description: "Working with object methods",
                code: "const calculator = {\n    add: function(a, b) {\n        return a + b;\n    },\n    subtract: function(a, b) {\n        return a - b;\n    },\n    multiply: function(a, b) {\n        return a * b;\n    },\n    divide: function(a, b) {\n        if (b === 0) return 'Cannot divide by zero';\n        return a / b;\n    }\n};\n\nconsole.log(calculator.add(5, 3));\nconsole.log(calculator.multiply(4, 2));"
            },
            {
                title: "String Manipulation",
                description: "String methods and operations",
                code: "const message = 'Hello, World!';\nconst upper = message.toUpperCase();\nconst lower = message.toLowerCase();\nconst length = message.length;\nconst substring = message.substring(0, 5);\nconst replaced = message.replace('World', 'JavaScript');\n\nconsole.log(upper, lower, length);\nconsole.log(substring, replaced);"
            },
            {
                title: "Array Iteration Methods",
                description: "Using array iteration methods",
                code: "const numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];\nconst doubled = numbers.map(n => n * 2);\nconst evens = numbers.filter(n => n % 2 === 0);\nconst sum = numbers.reduce((total, n) => total + n, 0);\nconst allEven = evens.every(n => n % 2 === 0);\n\nconsole.log(doubled, evens, sum, allEven);"
            }
        ],
        "60": [
            {
                title: "DOM Manipulation",
                description: "Basic DOM element manipulation",
                code: "function updateElement() {\n    const element = document.getElementById('demo');\n    element.innerHTML = 'Updated Content';\n    element.style.color = 'blue';\n    element.classList.add('active');\n    \n    const parent = element.parentElement;\n    const children = parent.children;\n    \n    for (let i = 0; i < children.length; i++) {\n        children[i].style.margin = '10px';\n        children[i].style.padding = '5px';\n    }\n    \n    return element;\n}\n\nupdateElement();"
            },
            {
                title: "Event Handling",
                description: "Basic event handling in JavaScript",
                code: "document.getElementById('button').addEventListener('click', function(event) {\n    const input = document.getElementById('input').value;\n    const output = document.getElementById('output');\n    output.textContent = input.toUpperCase();\n    \n    event.preventDefault();\n    event.stopPropagation();\n    \n    const timestamp = new Date().toLocaleTimeString();\n    console.log(`Button clicked at ${timestamp}`);\n    \n    this.classList.toggle('active');\n});"
            },
            {
                title: "Error Handling",
                description: "Using try-catch for error handling",
                code: "function divideNumbers(a, b) {\n    try {\n        if (typeof a !== 'number' || typeof b !== 'number') {\n            throw new TypeError('Both arguments must be numbers');\n        }\n        \n        if (b === 0) {\n            throw new Error('Cannot divide by zero');\n        }\n        \n        const result = a / b;\n        console.log(`Result: ${result}`);\n        return result;\n    } catch (error) {\n        console.error(`Error: ${error.message}`);\n        return null;\n    } finally {\n        console.log('Division operation attempted');\n    }\n}\n\ndivideNumbers(10, 2);\ndivideNumbers(8, 0);"
            }
        ],
        "100": [
            {
                title: "Complete Form Validation",
                description: "Form validation with multiple checks",
                code: "function validateForm() {\n    const name = document.getElementById('name').value;\n    const email = document.getElementById('email').value;\n    const password = document.getElementById('password').value;\n    const confirmPassword = document.getElementById('confirmPassword').value;\n    const errors = [];\n\n    if (name.length < 3) {\n        errors.push('Name must be at least 3 characters');\n    }\n\n    if (!email.includes('@') || !email.includes('.')) {\n        errors.push('Invalid email format');\n    }\n\n    if (password.length < 8) {\n        errors.push('Password must be at least 8 characters');\n    }\n    \n    if (!/[A-Z]/.test(password)) {\n        errors.push('Password must contain at least one uppercase letter');\n    }\n    \n    if (!/[0-9]/.test(password)) {\n        errors.push('Password must contain at least one number');\n    }\n    \n    if (password !== confirmPassword) {\n        errors.push('Passwords do not match');\n    }\n\n    if (errors.length > 0) {\n        const errorList = document.getElementById('error-list');\n        errorList.innerHTML = errors.map(error => `<li>${error}</li>`).join('');\n        return false;\n    }\n\n    return true;\n}\n\nconst isValid = validateForm();\nconsole.log('Form is valid:', isValid);"
            },
            {
                title: "Data Processing",
                description: "Complex data processing with arrays and objects",
                code: "const data = [\n    { id: 1, name: 'John', age: 30, department: 'Engineering', salary: 80000 },\n    { id: 2, name: 'Jane', age: 25, department: 'Marketing', salary: 65000 },\n    { id: 3, name: 'Bob', age: 35, department: 'Engineering', salary: 75000 },\n    { id: 4, name: 'Alice', age: 28, department: 'HR', salary: 60000 },\n    { id: 5, name: 'Charlie', age: 40, department: 'Marketing', salary: 90000 }\n];\n\n// Group employees by department\nconst byDepartment = data.reduce((acc, employee) => {\n    if (!acc[employee.department]) {\n        acc[employee.department] = [];\n    }\n    acc[employee.department].push(employee);\n    return acc;\n}, {});\n\n// Calculate average salary by department\nconst avgSalaryByDept = Object.entries(byDepartment).map(([dept, employees]) => {\n    const totalSalary = employees.reduce((sum, emp) => sum + emp.salary, 0);\n    const avgSalary = totalSalary / employees.length;\n    return { department: dept, averageSalary: avgSalary, employeeCount: employees.length };\n});\n\nconsole.log('Employees by department:', byDepartment);\nconsole.log('Average salary by department:', avgSalaryByDept);"
            },
            {
                title: "Advanced Class Implementation",
                description: "Creating a complex class with inheritance",
                code: "class Vehicle {\n    constructor(make, model, year) {\n        this.make = make;\n        this.model = model;\n        this.year = year;\n        this._mileage = 0;\n    }\n    \n    get mileage() {\n        return this._mileage;\n    }\n    \n    set mileage(value) {\n        if (value < 0) throw new Error('Mileage cannot be negative');\n        this._mileage = value;\n    }\n    \n    getAge() {\n        return new Date().getFullYear() - this.year;\n    }\n    \n    getInfo() {\n        return `${this.year} ${this.make} ${this.model} with ${this._mileage} miles`;\n    }\n}\n\nclass Car extends Vehicle {\n    constructor(make, model, year, doors) {\n        super(make, model, year);\n        this.doors = doors;\n        this.wheels = 4;\n        this.type = 'car';\n    }\n    \n    honk() {\n        return 'Beep beep!';\n    }\n}\n\nconst myCar = new Car('Toyota', 'Camry', 2020, 4);\nmyCar.mileage = 15000;\nconsole.log(myCar.getInfo());\nconsole.log(`Age: ${myCar.getAge()} years`);\nconsole.log(myCar.honk());"
            }
        ]
    }
};

window.challenges = challenges;
