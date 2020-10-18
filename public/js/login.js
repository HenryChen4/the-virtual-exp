const sendData = (data)=>{
    localStorage.setItem('Users', JSON.stringify(data))
}

const getData = (query)=>{
    const dataJSON = localStorage.getItem(query)
    if(dataJSON !== null){
        return JSON.parse(dataJSON)
    } else {
        return []
    }
}

const sendError = (msg)=>{
    const errorEl = document.createElement('div')
    errorEl.classList.add('alert', 'alert-warning')
    errorEl.textContent = msg
    document.querySelector('#error-field').appendChild(errorEl)
}

document.querySelector('#login').addEventListener('submit', (e)=>{
    document.querySelector('#error-field').innerHTML = ''
    e.preventDefault()
    let users = getData('Users')
    let inputtedEmail = document.querySelector('#email').value
    let inputtedPassword = document.querySelector('#password').value
    let count = 0
    users.forEach((user)=>{
        if(user.email !== inputtedEmail){
            count++
        }
    })
    if(count === users.length){
        sendError(`Your email can't not found`)
    } else {
        let userConfirmation = users.find((user)=>{
            return user.password === inputtedPassword && user.email === inputtedEmail
        })
        if(userConfirmation === undefined){
            sendError(`Your password did not match your email input.`)
        } else {
            sessionStorage.setItem('currentEmail', userConfirmation.email)
            sessionStorage.setItem('currentGrade', userConfirmation.grade)
            sessionStorage.setItem('isLoggedIn', true)
            window.location.href = '/home'
        }
    }
})