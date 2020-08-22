const {fahrenheitToCelsius, celsiusToFahrenheit, add } = require('../src/math')

test('Should convert 32F to 0 C', () => {
    const celsius = fahrenheitToCelsius(32)
    expect(celsius).toBe(0)
})

test('Should convert 0 C to 32 F',() =>{
    const fahrenheit = celsiusToFahrenheit(0)
    expect(fahrenheit).toBe(32)
})

//Async test demo. Notice how done(can be called anything) is defined so that jest knows this is an async process
// test('Async test demo', (done) => {
//     setTimeout(() => {
//         expect(1).toBe(2)    
//         done()
//     }, 2000)
// })



//If done is not defined then the test will pass but that is wrong
// test('Async test demo', () => {
//     setTimeout(() => {
//         expect(1).toBe(2) 
//     }, 2000)
// })

test('Adding two numbers', (done) => {
    add(4,7).then((sum) => {
        expect(sum).toBe(11)
        done()
    })
})

test('Adding two numbers async/await', async () => {
    const sum = await add(10,2)
    expect(sum).toBe(12)
})

